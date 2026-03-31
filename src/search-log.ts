/**
 * Search Dedup Log — prevents redundant web searches across rounds.
 * Before issuing web_search: check if same ticker + similar query already tried.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SEARCH_LOG_PATH = path.join(PROJECT_ROOT, 'data', 'scoring', 'search_log.jsonl');

export interface SearchEntry {
  ticker: string;
  query: string;
  timestamp: string;
  resultCount: number;
  topResults: Array<{ title: string; url: string }>;
}

function ensureDir(): void {
  const dir = path.dirname(SEARCH_LOG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function appendSearchEntry(entry: SearchEntry): void {
  ensureDir();
  fs.appendFileSync(SEARCH_LOG_PATH, JSON.stringify(entry) + '\n');
}

export function readSearchLog(ticker?: string): SearchEntry[] {
  if (!fs.existsSync(SEARCH_LOG_PATH)) return [];
  const lines = fs.readFileSync(SEARCH_LOG_PATH, 'utf-8').split('\n').filter(l => l.trim());
  const entries: SearchEntry[] = [];
  for (const line of lines) {
    try {
      const e = JSON.parse(line) as SearchEntry;
      if (!ticker || e.ticker === ticker) entries.push(e);
    } catch {}
  }
  return entries;
}

/** Normalize query for similarity comparison */
function normalizeQuery(q: string): string {
  return q.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff\s]/g, '').replace(/\s+/g, ' ').trim();
}

/** Calculate Jaccard similarity between two query strings */
function querySimilarity(a: string, b: string): number {
  const wordsA = new Set(normalizeQuery(a).split(' '));
  const wordsB = new Set(normalizeQuery(b).split(' '));
  const intersection = new Set([...wordsA].filter(w => wordsB.has(w)));
  const union = new Set([...wordsA, ...wordsB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Find a previous search result for a similar query.
 * Returns the cached entry if similarity ≥ 0.7, null otherwise.
 */
export function findSimilarSearch(ticker: string, query: string): SearchEntry | null {
  const log = readSearchLog(ticker);
  let bestMatch: SearchEntry | null = null;
  let bestSim = 0;

  for (const entry of log) {
    const sim = querySimilarity(query, entry.query);
    if (sim > bestSim) {
      bestSim = sim;
      bestMatch = entry;
    }
  }

  return bestSim >= 0.7 ? bestMatch : null;
}
