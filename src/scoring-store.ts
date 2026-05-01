/**
 * Scoring History Store — append-only JSONL for scoring events.
 * Tracks every scoring call for variance analysis and rubric version comparison.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readGapAttempts as readGapAttemptsForTicker } from './gap-tracker.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const HISTORY_PATH = path.join(PROJECT_ROOT, 'data', 'scoring', 'history.jsonl');

export interface ScoringEvent {
  ticker: string;
  round: number;
  timestamp: string;
  rubricVersion: string;
  /** Requested scorer model. Historical events used `model` for this field. */
  model: string;
  backendByDimension?: Record<string, string>;
  modelByDimension?: Record<string, string>;
  rawCalls: Array<{
    dimension: string;
    callIndex: number;
    backend?: string;
    model?: string;
    subCriteria: Record<string, number>;
    total: number;
  }>;
  finalScore: {
    環境: number;
    生意: number;
    組織: number;
    人: number;
    論點: number;
    structural: number;
    quality: number;
    total: number;
  };
  pairwiseAdjustments?: Record<string, number>;
  variance: {
    perDimension: Record<string, number>;
    total: number;
  };
  consistencyChecks: {
    passed: number;
    failed: number;
    details: string[];
  };
  costUsd: number;
  reportLengthChars: number;
  scorerVersion?: number;
}

function ensureDir(): void {
  const dir = path.dirname(HISTORY_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function appendScoringEvent(event: ScoringEvent): void {
  ensureDir();
  fs.appendFileSync(HISTORY_PATH, JSON.stringify(event) + '\n');
}

export function readScoringHistory(ticker?: string): ScoringEvent[] {
  if (!fs.existsSync(HISTORY_PATH)) return [];
  const lines = fs.readFileSync(HISTORY_PATH, 'utf-8').split('\n').filter(l => l.trim());
  const events: ScoringEvent[] = [];
  for (const line of lines) {
    try {
      const ev = JSON.parse(line) as ScoringEvent;
      if (!ticker || ev.ticker === ticker) events.push(ev);
    } catch {}
  }
  return events;
}

/** Get best score and persistent gaps for a ticker (for TSV read-back injection) */
export function getScoringReadback(ticker: string): {
  bestScore: number;
  resolvedGaps: string[];
  persistentGaps: Array<{ gap: string; resolutionRate: number }>;
} | null {
  const events = readScoringHistory(ticker);
  if (events.length === 0) return null;

  const bestScore = Math.max(...events.map(e => e.finalScore.total));

  // Read gap resolution data from gap_difficulty.jsonl (where resolution is actually tracked)
  const gapAttempts = readGapAttemptsForTicker(ticker);
  if (gapAttempts.length === 0) return { bestScore, resolvedGaps: [], persistentGaps: [] };

  // Aggregate by gapKey
  const gapCounts = new Map<string, { total: number; resolved: number }>();
  for (const attempt of gapAttempts) {
    const entry = gapCounts.get(attempt.gapKey) ?? { total: 0, resolved: 0 };
    entry.total++;
    if (attempt.resolved) entry.resolved++;
    gapCounts.set(attempt.gapKey, entry);
  }

  const resolvedGaps: string[] = [];
  const persistentGaps: Array<{ gap: string; resolutionRate: number }> = [];

  for (const [gap, counts] of gapCounts) {
    const rate = counts.resolved / counts.total;
    if (rate >= 0.8) resolvedGaps.push(gap);
    else if (counts.total >= 2) persistentGaps.push({ gap, resolutionRate: rate });
  }

  return { bestScore, resolvedGaps, persistentGaps };
}
