#!/usr/bin/env node
/**
 * Completion validator for initial-max research runs.
 *
 * Run before `vault done` to verify the artifact actually meets pass thresholds —
 * not just that the runner exited with code 0. Prevents the GLW-style false-done
 * incident (4 KB stub report marked complete in 2026-05-08 overnight loop).
 *
 * Exit codes:
 *   0  — complete; safe to call vault done
 *   10 — main file missing or under MIN_SIZE
 *   11 — required sections (1.1–4.2) not all present
 *   12 — structural score < STRUCTURAL_PASS_MIN
 *   13 — quality score < QUALITY_PASS_MIN
 *   14 — total score < PASS_THRESHOLD
 *   20 — usage error
 *
 * Usage:
 *   npx tsx src/validate-completion.ts --ticker GLW
 *   npx tsx src/validate-completion.ts --ticker GLW --no-rescore  # skip the sanity rescore
 *   npx tsx src/validate-completion.ts --ticker GLW --json         # machine-readable result
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { REQUIRED_SECTIONS } from './initial-max-scorer.js';
import { STRUCTURAL_PASS_MIN, QUALITY_PASS_MIN, PASS_THRESHOLD } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const MIN_SIZE = 8192;             // 8 KB minimum — stubs come in around 4 KB
const RESCORE_TOLERANCE = 5;       // points; a fresh rescore should be within this of history

interface ValidationResult {
  ok: boolean;
  exit: number;
  reason: string;
  ticker: string;
  mainPath: string;
  size: number;
  missingSections: string[];
  history?: { structural: number; quality: number; total: number; round: number };
  rescore?: { structural: number; quality: number; total: number };
}

function parseArgs(argv: string[]): { ticker: string; rescore: boolean; json: boolean } {
  const args: any = { rescore: true, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--ticker') args.ticker = argv[++i];
    else if (a === '--no-rescore') args.rescore = false;
    else if (a === '--json') args.json = true;
    else if (a === '-h' || a === '--help') {
      console.log('Usage: validate-completion.ts --ticker <T> [--no-rescore] [--json]');
      process.exit(20);
    }
  }
  if (!args.ticker) {
    console.error('error: --ticker required');
    process.exit(20);
  }
  return args;
}

function findLatestHistoryRow(ticker: string): { structural: number; quality: number; total: number; round: number } | null {
  const histPath = path.join(PROJECT_ROOT, 'data', 'scoring', 'history.jsonl');
  if (!fs.existsSync(histPath)) return null;
  const lines = fs.readFileSync(histPath, 'utf-8').split('\n').filter(Boolean);
  // Walk backwards to find the latest row for this ticker
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const row = JSON.parse(lines[i]!);
      if (row.ticker !== ticker) continue;
      const fs_ = row.finalScore ?? row.score ?? row;
      const structural = fs_.structural ?? 0;
      const quality = fs_.quality ?? 0;
      const total = fs_.total ?? 0;
      const round = fs_.round ?? row.round ?? 0;
      return { structural, quality, total, round };
    } catch {}
  }
  return null;
}

function findMissingSections(content: string): string[] {
  const missing: string[] = [];
  for (const sec of REQUIRED_SECTIONS) {
    // Match "### 1.1 ..." or "### 1.1\n" or "## 1.1" — any heading-level numbered marker
    const re = new RegExp(`^#{2,4}\\s+${sec.replace('.', '\\.')}(\\s|$)`, 'm');
    if (!re.test(content)) missing.push(sec);
  }
  return missing;
}

async function maybeRescore(ticker: string): Promise<{ structural: number; quality: number; total: number } | null> {
  // Lazy import to avoid pulling the scorer (and llm.ts → MLX setup) when --no-rescore.
  const { scoreCompanyResearch } = await import('./initial-max-scorer.js');
  const { score } = await scoreCompanyResearch(ticker, /*round*/ 999, /*scoringModel*/ undefined);
  return { structural: score.structural, quality: score.quality, total: score.total };
}

async function validate(ticker: string, rescore: boolean): Promise<ValidationResult> {
  const mainPath = path.join(PROJECT_ROOT, 'data', 'companies', ticker, `${ticker}_Initial_MAX.md`);
  const result: ValidationResult = {
    ok: false, exit: 0, reason: '', ticker, mainPath,
    size: 0, missingSections: [],
  };

  // Gate 1: file exists and is not a stub
  if (!fs.existsSync(mainPath)) {
    result.exit = 10;
    result.reason = `main file does not exist: ${path.relative(PROJECT_ROOT, mainPath)}`;
    return result;
  }
  result.size = fs.statSync(mainPath).size;
  if (result.size < MIN_SIZE) {
    result.exit = 10;
    result.reason = `main file size ${result.size} < ${MIN_SIZE} (stub)`;
    return result;
  }

  // Gate 2: required headings
  const content = fs.readFileSync(mainPath, 'utf-8');
  result.missingSections = findMissingSections(content);
  if (result.missingSections.length > 0) {
    result.exit = 11;
    result.reason = `required sections missing: ${result.missingSections.join(', ')}`;
    return result;
  }

  // Gate 3-5: scores from history
  const hist = findLatestHistoryRow(ticker);
  if (!hist) {
    result.exit = 14;
    result.reason = `no history.jsonl row for ticker ${ticker}`;
    return result;
  }
  result.history = hist;

  if (hist.structural < STRUCTURAL_PASS_MIN) {
    result.exit = 12;
    result.reason = `structural ${hist.structural} < ${STRUCTURAL_PASS_MIN}`;
    return result;
  }
  if (hist.quality < QUALITY_PASS_MIN) {
    result.exit = 13;
    result.reason = `quality ${hist.quality} < ${QUALITY_PASS_MIN}`;
    return result;
  }
  if (hist.total < PASS_THRESHOLD) {
    result.exit = 14;
    result.reason = `total ${hist.total} < ${PASS_THRESHOLD}`;
    return result;
  }

  // Gate 6: stale-history sanity rescore
  if (rescore) {
    try {
      const rs = await maybeRescore(ticker);
      if (rs) {
        result.rescore = rs;
        if (Math.abs(rs.total - hist.total) > RESCORE_TOLERANCE) {
          result.exit = 14;
          result.reason = `rescore drift: history.total=${hist.total} vs current=${rs.total} (tolerance ${RESCORE_TOLERANCE})`;
          return result;
        }
      }
    } catch (err: any) {
      console.warn(`[validate-completion] rescore skipped: ${err?.message ?? err}`);
    }
  }

  result.ok = true;
  result.reason = 'all gates passed';
  return result;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const result = await validate(args.ticker, args.rescore);
  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    if (result.ok) {
      console.log(`[validate-completion] PASS ${args.ticker}: ${result.reason} (size=${result.size}, total=${result.history?.total})`);
    } else {
      console.error(`[validate-completion] FAIL ${args.ticker} (exit ${result.exit}): ${result.reason}`);
    }
  }
  process.exit(result.exit);
}

main().catch((err) => {
  console.error(`[validate-completion] error: ${err?.message ?? err}`);
  process.exit(20);
});
