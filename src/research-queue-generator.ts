#!/usr/bin/env node
/**
 * Research Queue Generator
 *
 * Reads holdings + signal snapshots, checks existing reports,
 * and outputs a prioritized research queue to data/research_queue.json.
 *
 * Usage:
 *   npx tsx src/research-queue-generator.ts
 */
import fs, { writeFileSync, readFileSync, unlinkSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const INVESTMENT_INTEL = path.resolve(PROJECT_ROOT, '../investment-intelligence');

const HOLDINGS_PATH = path.join(INVESTMENT_INTEL, 'data/holdings.json');
const SIGNALS_PATH = path.join(INVESTMENT_INTEL, 'data/signal_snapshots.json');
const COMPANIES_DIR = path.join(PROJECT_ROOT, 'data/companies');
const QUEUE_PATH = path.join(PROJECT_ROOT, 'data/research_queue.json');
const LOCK_PATH = `${QUEUE_PATH}.lock`;
function isLockStale(): boolean {
  try {
    const lock = JSON.parse(readFileSync(LOCK_PATH, 'utf-8'));
    // Check if the owning process is still alive
    try { process.kill(lock.pid, 0); return false; } catch { /* process dead */ }
    return true;
  } catch { return true; }
}

function acquireLock(): boolean {
  try {
    writeFileSync(LOCK_PATH, JSON.stringify({ pid: process.pid, ts: Date.now() }), { flag: 'wx' });
    return true;
  } catch (err: any) {
    if (err.code === 'EEXIST') {
      if (isLockStale()) {
        // Dead process — safe to remove and retry once
        try { unlinkSync(LOCK_PATH); } catch { /* someone else cleaned it */ }
        try {
          writeFileSync(LOCK_PATH, JSON.stringify({ pid: process.pid, ts: Date.now() }), { flag: 'wx' });
          return true;
        } catch { /* another process won the race — fall through */ }
      }
      console.error(`Queue lock held by another process (${LOCK_PATH}). Exiting.`);
      return false;
    }
    throw err;
  }
}

function releaseLock(): void {
  try {
    const lock = JSON.parse(readFileSync(LOCK_PATH, 'utf-8'));
    if (lock.pid === process.pid) unlinkSync(LOCK_PATH);
  } catch { /* already released or not our lock */ }
}

/** Classifications to skip (ETFs, bonds, index funds) */
const SKIP_CLASSIFICATIONS = ['Government Bond', 'Bond ETF', 'Tech ETF', 'Consumer ETF', 'Index'];

/** Signal strength multiplier */
const SIGNAL_WEIGHT: Record<string, number> = {
  STRONG_BUY: 10,
  BUY: 5,
};

const STALE_DAYS = 365;

interface Position {
  ticker: string;
  market_value: number;
  classification: string;
  shares: number;
  avg_price: number;
  current_price: number;
  unrealized_gain_pct: number;
  source: string;
  thesis: string | null;
}

interface SignalSnapshot {
  ticker: string;
  signal: string;
  date: string;
  price_at_signal: number;
}

interface QueueItem {
  ticker: string;
  priority: number;
  reason: string;
  portfolio_weight_pct: number | null;
  signal: string | null;
  signal_date: string | null;
  last_report_date: string | null;
  status: 'pending' | 'running' | 'completed' | 'failed';
  why: string;
  max_cost: number;
  score: number;
  completed_date?: string;
  error?: string;
}

function getReportInfo(ticker: string): { exists: boolean; date: string | null; stale: boolean } {
  const reportPath = path.join(COMPANIES_DIR, ticker, `${ticker}_Initial_MAX.md`);
  if (!fs.existsSync(reportPath)) return { exists: false, date: null, stale: false };

  const stat = fs.statSync(reportPath);
  const mtime = stat.mtime;
  const ageMs = Date.now() - mtime.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  const dateStr = mtime.toISOString().slice(0, 10);
  return { exists: true, date: dateStr, stale: ageDays > STALE_DAYS };
}

function buildWhy(ticker: string, pos: Position | null, signal: SignalSnapshot | null): string {
  const parts: string[] = [];
  if (pos) {
    const cls = pos.classification;
    if (cls === 'CONCENTRATED') {
      parts.push(`ESPP concentrated position (${((pos.market_value / totalValue) * 100).toFixed(1)}% of portfolio)`);
    } else {
      parts.push(`${cls} holding (${((pos.market_value / totalValue) * 100).toFixed(1)}% of portfolio)`);
    }
    if (pos.unrealized_gain_pct > 100) parts.push(`+${pos.unrealized_gain_pct.toFixed(0)}% unrealized gain`);
    if (!pos.thesis) parts.push('no documented thesis');
  }
  if (signal) {
    parts.push(`${signal.signal} signal on ${signal.date} at $${signal.price_at_signal}`);
  }
  return parts.join('. ') + '.';
}

let totalValue = 0;

function main() {
  // Load holdings
  if (!fs.existsSync(HOLDINGS_PATH)) {
    console.error(`Holdings not found: ${HOLDINGS_PATH}`);
    process.exit(1);
  }
  const holdingsData = JSON.parse(fs.readFileSync(HOLDINGS_PATH, 'utf-8'));
  totalValue = holdingsData.total_value;
  const positions: Position[] = holdingsData.positions;

  // Load signals
  let signals: SignalSnapshot[] = [];
  if (fs.existsSync(SIGNALS_PATH)) {
    const signalData = JSON.parse(fs.readFileSync(SIGNALS_PATH, 'utf-8'));
    signals = signalData.snapshots.filter(
      (s: SignalSnapshot) => s.signal === 'BUY' || s.signal === 'STRONG_BUY'
    );
  }

  // Build candidate map: ticker → { pos, signal, report }
  const candidates = new Map<string, { pos: Position | null; signal: SignalSnapshot | null }>();

  // Add holdings (skip ETFs/bonds)
  for (const pos of positions) {
    if (SKIP_CLASSIFICATIONS.includes(pos.classification)) continue;
    candidates.set(pos.ticker, { pos, signal: null });
  }

  // Add signal tickers (may or may not be in portfolio)
  for (const sig of signals) {
    const existing = candidates.get(sig.ticker);
    if (existing) {
      existing.signal = sig;
    } else {
      candidates.set(sig.ticker, { pos: null, signal: sig });
    }
  }

  // Load existing queue to preserve completed/failed statuses
  let existingStatuses = new Map<string, QueueItem>();
  if (fs.existsSync(QUEUE_PATH)) {
    const existing = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf-8'));
    for (const item of existing.queue ?? []) {
      existingStatuses.set(item.ticker, item);
    }
  }

  // Score and build queue
  const queue: QueueItem[] = [];

  for (const [ticker, { pos, signal }] of candidates) {
    const report = getReportInfo(ticker);

    // Skip completed reports that aren't stale
    if (report.exists && !report.stale) {
      // Preserve completed status in output
      const prev = existingStatuses.get(ticker);
      if (prev && prev.status === 'completed') {
        queue.push(prev);
        continue;
      }
      // Has report, not stale, not in queue — skip
      continue;
    }

    const weightPct = pos ? (pos.market_value / totalValue) * 100 : null;
    const signalStrength = signal ? (SIGNAL_WEIGHT[signal.signal] ?? 0) : 0;
    const stalenessBonus = report.stale ? 3 : 0;

    // Score: portfolio weight * 10 + signal strength + staleness bonus
    const score = (weightPct ?? 0) * 10 + signalStrength + stalenessBonus;

    const reason = !report.exists
      ? pos ? `Holding with no report (${weightPct?.toFixed(1)}% of portfolio)` : `${signal!.signal} signal, not in portfolio`
      : `Stale report (${report.date})`;

    // Preserve previous status if running/completed/failed
    const prev = existingStatuses.get(ticker);
    const status = prev && prev.status !== 'pending' ? prev.status : 'pending';

    queue.push({
      ticker,
      priority: 0, // Computed after sorting
      reason,
      portfolio_weight_pct: weightPct ? parseFloat(weightPct.toFixed(1)) : null,
      signal: signal?.signal ?? null,
      signal_date: signal?.date ?? null,
      last_report_date: report.date,
      status,
      why: buildWhy(ticker, pos, signal),
      max_cost: 200,
      score: parseFloat(score.toFixed(1)),
      ...(prev?.completed_date ? { completed_date: prev.completed_date } : {}),
      ...(prev?.error ? { error: prev.error } : {}),
    });
  }

  // Sort by score descending
  queue.sort((a, b) => b.score - a.score);

  // Assign priority numbers
  queue.forEach((item, i) => { item.priority = i + 1; });

  const output = {
    last_updated: new Date().toISOString().slice(0, 10),
    total_items: queue.length,
    pending: queue.filter(q => q.status === 'pending').length,
    completed: queue.filter(q => q.status === 'completed').length,
    queue,
  };

  if (!acquireLock()) {
    process.exit(1);
  }
  try {
    fs.writeFileSync(QUEUE_PATH, JSON.stringify(output, null, 2) + '\n');
  } finally {
    releaseLock();
  }
  console.log(`Research queue generated: ${QUEUE_PATH}`);
  console.log(`  Total: ${output.total_items} | Pending: ${output.pending} | Completed: ${output.completed}`);
  console.log('\nTop 5:');
  for (const item of queue.slice(0, 5)) {
    console.log(`  ${item.priority}. ${item.ticker} (score: ${item.score}, ${item.status}) — ${item.reason}`);
  }
}

main();
