#!/usr/bin/env node
/**
 * Research Queue Runner
 *
 * Picks the next pending ticker from the research queue and runs Initial MAX.
 * Single-shot: runs ONE ticker per invocation.
 *
 * Usage:
 *   npx tsx src/research-queue-runner.ts              # run next pending
 *   npx tsx src/research-queue-runner.ts --dry-run    # show what would run
 *   npx tsx src/research-queue-runner.ts --ticker GOOG # force specific ticker
 *   npx tsx src/research-queue-runner.ts --max-cost 20 # override cost limit
 */
import fs, { writeFileSync, readFileSync, unlinkSync } from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { SCHEDULE_WINDOW, CAPACITY_GATE_PCT } from './config.js';
import { appendTrace, type TraceEntry } from './run-trace.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
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

interface QueueItem {
  ticker: string;
  priority: number;
  reason: string;
  portfolio_weight_pct: number | null;
  signal: string | null;
  signal_date: string | null;
  last_report_date: string | null;
  status: string;
  why: string;
  max_cost: number;
  score: number;
  completed_date?: string;
  error?: string;
}

interface QueueData {
  last_updated: string;
  total_items: number;
  pending: number;
  completed: number;
  queue: QueueItem[];
}

function isWithinScheduleWindow(): boolean {
  const hour = new Date().getHours();
  return hour >= SCHEDULE_WINDOW.startHour && hour < SCHEDULE_WINDOW.endHour;
}

function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const val = process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[++i] : 'true';
      args[key] = val;
    }
  }
  return args;
}

function loadQueue(): QueueData {
  if (!fs.existsSync(QUEUE_PATH)) {
    console.error(`Queue not found: ${QUEUE_PATH}`);
    console.error('Run "npm run queue-gen" first.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf-8'));
}

function saveQueue(data: QueueData): void {
  data.pending = data.queue.filter(q => q.status === 'pending').length;
  data.completed = data.queue.filter(q => q.status === 'completed').length;
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(data, null, 2) + '\n');
}

function findTarget(queue: QueueData, forceTicker?: string): QueueItem | null {
  if (forceTicker) {
    return queue.queue.find(q => q.ticker === forceTicker.toUpperCase()) ?? null;
  }
  return queue.queue.find(q => q.status === 'pending') ?? null;
}

async function runInitialMax(item: QueueItem, maxCostOverride?: number): Promise<{ success: boolean; error?: string }> {
  const args = [
    'src/initial-max-runner.ts',
    '--ticker', item.ticker,
    '--max-cost', String(maxCostOverride ?? item.max_cost),
  ];
  if (item.why) {
    args.push('--why', item.why);
  }

  console.log(`\nExecuting: npx tsx ${args.join(' ')}`);

  return new Promise((resolve) => {
    const child = spawn('npx', ['tsx', ...args], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      env: { ...process.env },
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true });
      } else {
        resolve({ success: false, error: `Process exited with code ${code}` });
      }
    });

    child.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });
  });
}

function verifyResearchOutput(ticker: string): boolean {
  const mainFile = path.join(PROJECT_ROOT, 'data', 'companies', ticker, `${ticker}_Initial_MAX.md`);
  return fs.existsSync(mainFile) && fs.statSync(mainFile).size > 1000;
}

async function main() {
  const args = parseArgs();
  const dryRun = args['dry-run'] === 'true';
  const forceTicker = args.ticker;
  const maxCost = args['max-cost'] ? parseFloat(args['max-cost']) : undefined;
  const force = args['force'] === 'true';
  const capacity = args.capacity ? parseFloat(args.capacity) : undefined;

  // Capacity gate: refuse to run if below threshold
  if (capacity !== undefined && capacity < CAPACITY_GATE_PCT) {
    console.log(`⛔ Capacity ${capacity}% < ${CAPACITY_GATE_PCT}% gate. Skipping run.`);
    return;
  }
  if (capacity === undefined) {
    console.log(`⚠ No --capacity flag provided. Proceeding without capacity check.`);
  }

  if (!force && !isWithinScheduleWindow()) {
    const { startHour, endHour } = SCHEDULE_WINDOW;
    console.log(`Outside schedule window (${startHour}:00–${endHour}:00). Use --force to override.`);
    return;
  }

  if (!acquireLock()) {
    process.exit(1);
  }

  let queue: QueueData;
  try {
    queue = loadQueue();
  } catch (err) {
    releaseLock();
    throw err;
  }

  console.log('╔══════════════════════════════════════╗');
  console.log('║     Research Queue Runner             ║');
  console.log('╚══════════════════════════════════════╝');
  console.log(`Queue: ${queue.pending} pending / ${queue.total_items} total`);
  if (capacity !== undefined) console.log(`Capacity: ${capacity}%`);

  const target = findTarget(queue, forceTicker);
  if (!target) {
    releaseLock();
    console.log('\nNo pending items in queue. Run "npm run queue-gen" to refresh.');
    return;
  }

  console.log(`\nNext target:`);
  console.log(`  Ticker:   ${target.ticker} (#${target.priority})`);
  console.log(`  Score:    ${target.score}`);
  console.log(`  Reason:   ${target.reason}`);
  console.log(`  Why:      ${target.why}`);
  console.log(`  Max cost: $${maxCost ?? target.max_cost}`);

  if (dryRun) {
    releaseLock();
    console.log('\n[DRY RUN] Would execute Initial MAX for', target.ticker);
    return;
  }

  try {
    // Mark as running
    target.status = 'running';
    saveQueue(queue);

    const startTime = Date.now();
    const result = await runInitialMax(target, maxCost);
    const durationSec = Math.round((Date.now() - startTime) / 1000);

    if (result.success) {
      // Verify actual output was produced
      if (!verifyResearchOutput(target.ticker)) {
        target.status = 'failed';
        target.error = 'No research output produced';
        console.error(`\n✗ ${target.ticker} exited OK but produced no research files`);
      } else {
        target.status = 'completed';
        target.completed_date = new Date().toISOString().slice(0, 10);
        delete target.error;
        console.log(`\n✓ ${target.ticker} completed successfully`);
      }
    } else {
      target.status = 'failed';
      target.error = result.error;
      console.error(`\n✗ ${target.ticker} failed: ${result.error}`);
    }

    // Write trace entry
    appendTrace({
      ts: new Date().toISOString(),
      ticker: target.ticker,
      phase: 'queue-run',
      round: 0,
      model: 'mixed',
      durationSec,
      inputTokens: 0,
      outputTokens: 0,
      costUsd: 0,
      filesWritten: 0,
      scoreChange: target.status === 'completed' ? 'done' : 'failed',
      agentExitCode: result.success ? 0 : 1,
    });

    saveQueue(queue);
    console.log(`\nQueue updated: ${queue.pending} pending remaining`);
  } finally {
    releaseLock();
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
