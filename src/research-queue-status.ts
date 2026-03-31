#!/usr/bin/env node
/**
 * Research Queue Status
 *
 * Visual progress dashboard for the research queue.
 *
 * Usage:
 *   npx tsx src/research-queue-status.ts           # snapshot
 *   npx tsx src/research-queue-status.ts --watch    # live-updating (Ctrl+C to exit)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const QUEUE_PATH = path.join(PROJECT_ROOT, 'data/research_queue.json');
const RESULTS_DIR = path.join(PROJECT_ROOT, 'results');
const COMPANIES_DIR = path.join(PROJECT_ROOT, 'data/companies');

interface QueueItem {
  ticker: string;
  priority: number;
  portfolio_weight_pct: number | null;
  signal: string | null;
  status: string;
  score: number;
  max_cost: number;
  completed_date?: string;
  error?: string;
}

interface RunningInfo {
  ticker: string;
  round: number;
  maxRounds: number;
  score: number;
  prevScore: number;
  stage: string;
  elapsed: string;
  sizeKB: number;
  rounds: { round: string; score: number }[];
}

function getReportScore(ticker: string): number | null {
  try {
    const files = fs.readdirSync(RESULTS_DIR).filter(f => f.startsWith(`initial-max-${ticker.toLowerCase()}-`) && f.endsWith('.tsv'));
    if (files.length === 0) return null;
    const latest = files.sort().pop()!;
    const content = fs.readFileSync(path.join(RESULTS_DIR, latest), 'utf-8');
    const lines = content.trim().split('\n');
    const lastLine = lines[lines.length - 1];
    const cols = lastLine.split('\t');
    const score = parseFloat(cols[1]);
    return isNaN(score) ? null : score;
  } catch { return null; }
}

function getReportSize(ticker: string): number | null {
  const reportPath = path.join(COMPANIES_DIR, ticker, `${ticker}_Initial_MAX.md`);
  try { return fs.statSync(reportPath).size; } catch { return null; }
}

function getRunningInfo(ticker: string): RunningInfo {
  const info: RunningInfo = {
    ticker,
    round: 0,
    maxRounds: 15,
    score: 0,
    prevScore: 0,
    stage: 'starting',
    elapsed: '-',
    sizeKB: 0,
    rounds: [],
  };

  // Get report size
  const size = getReportSize(ticker);
  if (size) info.sizeKB = Math.round(size / 1024);

  // Get elapsed time from report mtime
  const reportPath = path.join(COMPANIES_DIR, ticker, `${ticker}_Initial_MAX.md`);
  try {
    const stat = fs.statSync(reportPath);
    const startTime = stat.birthtime.getTime();
    const elapsed = Date.now() - startTime;
    const mins = Math.floor(elapsed / 60000);
    const secs = Math.floor((elapsed % 60000) / 1000);
    info.elapsed = `${mins}m${secs.toString().padStart(2, '0')}s`;
  } catch {}

  // Parse TSV for round-by-round history
  try {
    const files = fs.readdirSync(RESULTS_DIR).filter(f => f.startsWith(`initial-max-${ticker.toLowerCase()}-`) && f.endsWith('.tsv'));
    if (files.length === 0) return info;
    const latest = files.sort().pop()!;
    const content = fs.readFileSync(path.join(RESULTS_DIR, latest), 'utf-8');
    const lines = content.trim().split('\n');

    for (const line of lines) {
      if (line.startsWith('round')) continue; // header
      const cols = line.split('\t');
      const roundStr = cols[0] ?? '';
      const score = parseFloat(cols[1]);
      if (!isNaN(score)) {
        info.rounds.push({ round: roundStr, score });
      }
    }

    if (info.rounds.length > 0) {
      const last = info.rounds[info.rounds.length - 1];
      info.score = last.score;
      info.round = info.rounds.length;
      if (info.rounds.length > 1) {
        info.prevScore = info.rounds[info.rounds.length - 2].score;
      }

      // Determine stage
      if (last.round.includes('polish')) info.stage = 'polishing';
      else if (last.round.includes('extended')) info.stage = 'extended';
      else if (last.round.includes('contrarian')) info.stage = 'contrarian';
      else info.stage = 'researching';
    }
  } catch {}

  return info;
}

function scoreBar(score: number, width: number = 10): string {
  const filled = Math.round((score / 100) * width);
  const tier = score >= 85 ? '🟢' : score >= 50 ? '🟡' : '🔴';
  return `${tier} ${'▓'.repeat(filled)}${'░'.repeat(width - filled)} ${score}`;
}

function sparkline(rounds: { round: string; score: number }[]): string {
  if (rounds.length === 0) return '';
  const chars = '▁▂▃▄▅▆▇█';
  const scores = rounds.map(r => r.score);
  const max = Math.max(...scores, 100);
  return scores.map(s => {
    const idx = Math.min(Math.round((s / max) * (chars.length - 1)), chars.length - 1);
    return chars[idx];
  }).join('');
}

function render(): string {
  if (!fs.existsSync(QUEUE_PATH)) return 'Queue not found. Run "npm run queue-gen" first.';

  const data = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf-8'));
  const queue: QueueItem[] = data.queue;

  const completed = queue.filter(q => q.status === 'completed');
  const running = queue.filter(q => q.status === 'running');
  const failed = queue.filter(q => q.status === 'failed');
  const pending = queue.filter(q => q.status === 'pending');

  const lines: string[] = [];
  const now = new Date().toLocaleTimeString('en-US', { hour12: false });

  lines.push('');
  lines.push('  ╔══════════════════════════════════════════════════════╗');
  lines.push('  ║           Research Queue Dashboard                   ║');
  lines.push(`  ╚══════════════════════════════════════════════════════╝  ${now}`);
  lines.push('');

  // Overall progress
  const total = queue.length;
  const barWidth = 50;
  const completedW = Math.round((completed.length / total) * barWidth);
  const runningW = Math.max(running.length > 0 ? 1 : 0, Math.round((running.length / total) * barWidth));
  const failedW = Math.max(failed.length > 0 ? 1 : 0, Math.round((failed.length / total) * barWidth));
  const pendingW = Math.max(0, barWidth - completedW - runningW - failedW);
  const pct = Math.round((completed.length / total) * 100);

  lines.push(`  ${'█'.repeat(completedW)}${'▶'.repeat(runningW)}${'✗'.repeat(failedW)}${'░'.repeat(pendingW)}  ${pct}%`);
  lines.push(`  ✓ ${completed.length} done   ⟳ ${running.length} running   ✗ ${failed.length} failed   · ${pending.length} pending`);
  lines.push('');

  // Running — detailed live view
  if (running.length > 0) {
    lines.push('  ⟳ NOW RUNNING');
    lines.push('  ' + '─'.repeat(56));
    for (const item of running) {
      const info = getRunningInfo(item.ticker);
      const scoreDisplay = scoreBar(info.score, 15);
      const spark = sparkline(info.rounds);
      const delta = info.score - info.prevScore;
      const deltaStr = info.rounds.length > 1 ? (delta >= 0 ? `+${delta}` : `${delta}`) : '';

      lines.push(`    ${item.ticker}  ${info.stage}  round ${info.round}  ${info.elapsed}  ${info.sizeKB}KB`);
      lines.push(`    ${scoreDisplay}  ${deltaStr}`);
      if (spark) lines.push(`    ${spark}  (${info.rounds.length} rounds)`);
    }
    lines.push('');
  }

  // Completed
  if (completed.length > 0) {
    lines.push('  ✓ COMPLETED');
    lines.push('  ' + '─'.repeat(56));
    for (const item of completed) {
      const score = getReportScore(item.ticker);
      const size = getReportSize(item.ticker);
      const sizeStr = size ? `${(size / 1024).toFixed(0)}KB` : '-';
      const bar = score != null ? scoreBar(score) : '  -';
      const wt = item.portfolio_weight_pct != null ? `${item.portfolio_weight_pct.toFixed(1)}%` : '';
      lines.push(`    ${item.ticker.padEnd(6)}  ${bar.padEnd(22)}  ${sizeStr.padStart(5)}  ${wt.padStart(5)}  ${item.completed_date ?? ''}`);
    }
    lines.push('');
  }

  // Failed
  if (failed.length > 0) {
    lines.push('  ✗ FAILED');
    lines.push('  ' + '─'.repeat(56));
    for (const item of failed) {
      lines.push(`    ${item.ticker.padEnd(6)}  ${(item.error ?? 'unknown').slice(0, 45)}`);
    }
    lines.push('');
  }

  // Pending — compact
  if (pending.length > 0) {
    lines.push(`  · PENDING (${pending.length} remaining)`);
    lines.push('  ' + '─'.repeat(56));
    for (let i = 0; i < pending.length; i += 8) {
      const row = pending.slice(i, i + 8).map(item => {
        const tag = item.signal ? `*` : '';
        const wt = item.portfolio_weight_pct != null ? `${item.portfolio_weight_pct.toFixed(0)}%` : '';
        return `${item.ticker}${tag}`.padEnd(7) + wt.padStart(3);
      });
      lines.push(`    ${row.join('  ')}`);
    }
    lines.push('');
    lines.push('  * = has buy signal');
  }

  lines.push('');
  return lines.join('\n');
}

function main() {
  const watch = process.argv.includes('--watch') || process.argv.includes('-w');

  if (!watch) {
    process.stdout.write(render());
    return;
  }

  // Live mode — clear screen and re-render every 5 seconds
  const INTERVAL = 5000;
  const redraw = () => {
    process.stdout.write('\x1b[2J\x1b[H'); // clear screen, cursor to top
    process.stdout.write(render());
  };

  redraw();
  const timer = setInterval(redraw, INTERVAL);

  // Clean exit on Ctrl+C
  process.on('SIGINT', () => {
    clearInterval(timer);
    process.stdout.write('\x1b[?25h\n'); // show cursor
    process.exit(0);
  });
}

main();
