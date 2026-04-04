/**
 * Gap Difficulty Tracker — persistent JSONL tracking gap resolution across runs.
 * Replaces in-memory gapAttempts Map with cross-company learning.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GLOBAL_RETIRE_MIN_ATTEMPTS, GLOBAL_RETIRE_MIN_TICKERS } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const GAP_DIFFICULTY_PATH = path.join(PROJECT_ROOT, 'data', 'scoring', 'gap_difficulty.jsonl');

/**
 * Normalize each segment of a combined gap key (dimension|item) for comparison.
 * Mirrors the per-segment normalization in normalizeGapKey() in initial-max-runner.ts
 * so that historical keys stored before normalization was applied still match new ones.
 */
function normalizeStoredGapKey(key: string): string {
  const normalizeSegment = (s: string) =>
    s.trim()
      .replace(/[\u3000\u3001\u3002\uff0c\uff0e\uff1a\uff1b\uff01\uff1f\u300a\u300b\u300c\u300d\u300e\u300f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 40);
  // Keys are stored as "dimension|item"; normalize each segment independently.
  const parts = key.split('|');
  return parts.map(normalizeSegment).join('|');
}

export interface GapAttempt {
  ticker: string;
  round: number;
  timestamp: string;
  gapKey: string;
  scoreBefore: number;
  scoreAfter: number;
  resolved: boolean;
  costUsd: number;
  remedy: string;
}

function ensureDir(): void {
  const dir = path.dirname(GAP_DIFFICULTY_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function appendGapAttempt(attempt: GapAttempt): void {
  ensureDir();
  fs.appendFileSync(GAP_DIFFICULTY_PATH, JSON.stringify(attempt) + '\n');
}

export function readGapAttempts(ticker?: string): GapAttempt[] {
  if (!fs.existsSync(GAP_DIFFICULTY_PATH)) return [];
  const lines = fs.readFileSync(GAP_DIFFICULTY_PATH, 'utf-8').split('\n').filter(l => l.trim());
  const attempts: GapAttempt[] = [];
  for (const line of lines) {
    try {
      const a = JSON.parse(line) as GapAttempt;
      if (!ticker || a.ticker === ticker) attempts.push(a);
    } catch {}
  }
  return attempts;
}

/** Resolution rate for a specific gap key across all companies */
export function gapResolutionRate(gapKey: string): number {
  const normalizedKey = normalizeStoredGapKey(gapKey);
  const all = readGapAttempts();
  const matching = all.filter(a => normalizeStoredGapKey(a.gapKey) === normalizedKey);
  if (matching.length === 0) return 0.5; // unknown = assume 50%
  return matching.filter(a => a.resolved).length / matching.length;
}

/**
 * Adaptive retirement threshold: gaps with low resolution rate retire faster.
 * - resolution rate < 20% → retire after 2 attempts
 * - resolution rate 20-60% → retire after 3 attempts
 * - resolution rate > 60% → allow 4 attempts
 */
export function getMaxAttemptsForGap(gapKey: string): number {
  const rate = gapResolutionRate(gapKey);
  if (rate < 0.2) return 2;
  if (rate <= 0.6) return 3;
  return 4;
}

/** Count attempts for a specific ticker + gap key combination */
export function countAttempts(ticker: string, gapKey: string): number {
  const normalizedKey = normalizeStoredGapKey(gapKey);
  const attempts = readGapAttempts(ticker);
  return attempts.filter(a => normalizeStoredGapKey(a.gapKey) === normalizedKey).length;
}

/** Pre-loaded gap data for batch operations (avoids re-reading JSONL N times) */
export interface LoadedGapData {
  all: GapAttempt[];
  byTicker: GapAttempt[];
}

/** Load all gap attempts once for batch filtering operations */
export function loadGapAttempts(ticker: string): LoadedGapData {
  const all = readGapAttempts();
  const byTicker = all.filter(a => a.ticker === ticker);
  return { all, byTicker };
}

/** Count attempts using pre-loaded data */
export function countAttemptsFromLoaded(data: LoadedGapData, gapKey: string): number {
  const normalizedKey = normalizeStoredGapKey(gapKey);
  return data.byTicker.filter(a => normalizeStoredGapKey(a.gapKey) === normalizedKey).length;
}

/** Resolution rate using pre-loaded data */
export function gapResolutionRateFromLoaded(data: LoadedGapData, gapKey: string): number {
  const normalizedKey = normalizeStoredGapKey(gapKey);
  const matching = data.all.filter(a => normalizeStoredGapKey(a.gapKey) === normalizedKey);
  if (matching.length === 0) return 0.5;
  return matching.filter(a => a.resolved).length / matching.length;
}

/** Max attempts using pre-loaded data */
export function getMaxAttemptsFromLoaded(data: LoadedGapData, gapKey: string): number {
  const rate = gapResolutionRateFromLoaded(data, gapKey);
  if (rate < 0.2) return 2;
  if (rate <= 0.6) return 3;
  return 4;
}

/** Global retirement: gap has ≥N attempts across ≥M tickers with 0% resolution */
export function isGloballyRetired(data: LoadedGapData, gapKey: string): boolean {
  const normalizedKey = normalizeStoredGapKey(gapKey);
  const matching = data.all.filter(a => normalizeStoredGapKey(a.gapKey) === normalizedKey);
  if (matching.length < GLOBAL_RETIRE_MIN_ATTEMPTS) return false;
  const distinctTickers = new Set(matching.map(a => a.ticker));
  if (distinctTickers.size < GLOBAL_RETIRE_MIN_TICKERS) return false;
  const resolved = matching.filter(a => a.resolved).length;
  return resolved === 0;  // 0% resolution rate across all tickers
}
