/**
 * Run Trace — append-only JSONL logger for token observability.
 * Every research operation (gap-fill, scoring, polish) appends one line.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRACE_PATH = path.join(__dirname, '..', 'data', 'run-trace.jsonl');

export interface TraceEntry {
  ts: string;
  ticker: string;
  phase: string;
  round: number;
  model: string;
  durationSec: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  filesWritten: number;
  scoreChange: string;
  agentExitCode: number;
}

export function appendTrace(entry: TraceEntry): void {
  fs.appendFileSync(TRACE_PATH, JSON.stringify(entry) + '\n');
}
