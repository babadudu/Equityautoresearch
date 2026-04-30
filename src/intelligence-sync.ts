#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PROJECTS_ROOT = path.resolve(PROJECT_ROOT, '..');
const MCP_ROOT = path.join(PROJECTS_ROOT, 'mcp');
const DEFAULT_PYTHON = path.join(MCP_ROOT, '.venv', 'bin', 'python');
const DEFAULT_INDEXER = path.join(MCP_ROOT, 'intelligence', 'indexer.py');

export function syncIntelligencePaths(paths: string[]): boolean {
  if (process.env.INTELLIGENCE_SYNC === '0') {
    return false;
  }

  const normalizedPaths = Array.from(
    new Set(
      paths
        .filter((value): value is string => Boolean(value))
        .map((value) => path.resolve(value)),
    ),
  );

  if (!normalizedPaths.length) {
    return false;
  }

  const pythonBin = process.env.INTELLIGENCE_SYNC_PYTHON ?? DEFAULT_PYTHON;
  const indexerPath = process.env.INTELLIGENCE_SYNC_INDEXER ?? DEFAULT_INDEXER;
  if (!fs.existsSync(pythonBin) || !fs.existsSync(indexerPath)) {
    console.warn(
      `[intelligence-sync] skipping; missing runtime (${pythonBin}) or indexer (${indexerPath})`,
    );
    return false;
  }

  const args = [indexerPath, 'sync-paths'];
  for (const targetPath of normalizedPaths) {
    args.push('--path', targetPath);
  }

  const timeoutMs = Number(process.env.INTELLIGENCE_SYNC_TIMEOUT_MS ?? '90000');
  const result = spawnSync(pythonBin, args, {
    cwd: PROJECT_ROOT,
    encoding: 'utf-8',
    env: process.env,
    timeout: timeoutMs,
  });

  if (result.status === 0) {
    return true;
  }

  const details =
    result.stderr?.trim() ||
    result.stdout?.trim() ||
    (result.signal ? `signal ${result.signal}` : `exit ${result.status ?? 1}`);
  console.warn(`[intelligence-sync] failed for ${normalizedPaths.join(', ')}: ${details}`);
  return false;
}
