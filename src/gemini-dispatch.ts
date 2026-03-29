/**
 * Gemini CLI Dispatch — synchronous LLM calls via `gemini -p` with Sonnet fallback.
 *
 * Parallel utility to the existing `claude -p` pattern in llm.ts.
 * Uses temp files for prompt delivery to avoid shell string limits on large reports.
 * Falls back to `claude -p --model sonnet` if Gemini fails.
 *
 * Usage:
 *   import { dispatchToGemini } from './gemini-dispatch.js';
 *   const result = dispatchToGemini('Summarize this report...', { timeoutSec: 180 });
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import { MODELS } from './config.js';

const GEMINI_BIN = '/opt/homebrew/bin/gemini';
const CLAUDE_BIN = 'claude';
const DEFAULT_TIMEOUT_SEC = 120;
const MAX_BUFFER_BYTES = 10 * 1024 * 1024; // 10MB for large responses

export interface GeminiDispatchOptions {
  /** Model to use (e.g., gemini-3.1-pro-preview). Default from config.ts. */
  model?: string;
  /** Path to a file whose contents are prepended to the prompt (for large reports). */
  inputFile?: string;
  /** Timeout in seconds. Default: 120. */
  timeoutSec?: number;
  /** Expected output format. 'json' wraps prompt with JSON instruction. */
  outputFormat?: 'json' | 'text';
}

export interface GeminiDispatchResult {
  /** The raw text output from the model. */
  output: string;
  /** Which model actually produced the response. */
  model: string;
  /** Wall-clock duration in milliseconds. */
  durationMs: number;
  /** Whether the primary model (Gemini) failed and fallback was used. */
  usedFallback: boolean;
}

/**
 * Dispatch a prompt to Gemini CLI, falling back to Claude Sonnet on failure.
 *
 * Writes the prompt to a temp file to avoid shell argument length limits
 * (critical for 300K+ char research reports). Cleans up temp files on all paths.
 *
 * @param prompt - The full prompt text to send.
 * @param options - Timeout, input file, output format, model.
 * @returns Result with output text, model used, and timing.
 * @throws If both Gemini and Sonnet fallback fail.
 */
export function dispatchToGemini(
  prompt: string,
  options?: GeminiDispatchOptions,
): GeminiDispatchResult {
  const timeoutSec = options?.timeoutSec ?? DEFAULT_TIMEOUT_SEC;
  const outputFormat = options?.outputFormat ?? 'text';
  const model = options?.model ?? MODELS.GEMINI;

  // Build the full prompt: optional input file content + user prompt
  let fullPrompt = '';
  if (options?.inputFile) {
    if (!fs.existsSync(options.inputFile)) {
      throw new Error(`Input file not found: ${options.inputFile}`);
    }
    fullPrompt += fs.readFileSync(options.inputFile, 'utf-8') + '\n\n---\n\n';
  }

  if (outputFormat === 'json') {
    fullPrompt += 'You MUST respond with valid JSON only. No markdown code fences, no explanation.\n\n';
  }
  fullPrompt += prompt;

  // Write prompt to temp file (avoids shell string limits for 366K reports)
  const tmpDir = os.tmpdir();
  const tmpFile = path.join(tmpDir, `gemini-dispatch-${process.pid}-${Date.now()}.txt`);
  fs.writeFileSync(tmpFile, fullPrompt, 'utf-8');

  const startMs = Date.now();

  try {
    // Attempt Gemini first
    const geminiOutput = execGemini(tmpFile, timeoutSec, model);
    const durationMs = Date.now() - startMs;
    console.log(`[gemini-dispatch] Gemini success (${(durationMs / 1000).toFixed(1)}s, ${geminiOutput.length} chars, model: ${model})`);
    return { output: geminiOutput, model, durationMs, usedFallback: false };
  } catch (geminiErr: any) {
    const geminiDuration = Date.now() - startMs;
    console.log(`[gemini-dispatch] Gemini failed after ${(geminiDuration / 1000).toFixed(1)}s: ${geminiErr.message?.slice(0, 200)}`);

    // Fallback to Claude Sonnet
    try {
      const fallbackStart = Date.now();
      const sonnetOutput = execClaudeSonnet(tmpFile, timeoutSec);
      const totalMs = Date.now() - startMs;
      console.log(`[gemini-dispatch] Sonnet fallback success (${((Date.now() - fallbackStart) / 1000).toFixed(1)}s, ${sonnetOutput.length} chars)`);
      return { output: sonnetOutput, model: 'sonnet', durationMs: totalMs, usedFallback: true };
    } catch (sonnetErr: any) {
      const totalMs = Date.now() - startMs;
      console.log(`[gemini-dispatch] Sonnet fallback also failed after ${(totalMs / 1000).toFixed(1)}s: ${sonnetErr.message?.slice(0, 200)}`);
      throw new Error(
        `Both Gemini and Sonnet failed.\n` +
        `Gemini: ${geminiErr.message?.slice(0, 300)}\n` +
        `Sonnet: ${sonnetErr.message?.slice(0, 300)}`,
      );
    }
  } finally {
    // Always clean up temp file
    try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
  }
}

/**
 * Execute Gemini CLI with prompt from a temp file.
 * Uses `cat tmpFile | gemini -p` to pipe large prompts via stdin.
 */
function execGemini(promptFile: string, timeoutSec: number, model: string): string {
  // Verify gemini binary exists
  if (!fs.existsSync(GEMINI_BIN)) {
    throw new Error(`Gemini CLI not found at ${GEMINI_BIN}`);
  }

  // -p requires a string arg; pass empty string so stdin is used as the prompt
  // -m specifies the model
  const cmd = `cat "${promptFile}" | "${GEMINI_BIN}" -m "${model}" -p ""`;
  const stdout = execSync(cmd, {
    timeout: timeoutSec * 1000,
    maxBuffer: MAX_BUFFER_BYTES,
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  const trimmed = stdout.trim();
  if (!trimmed) {
    throw new Error('Gemini returned empty output');
  }
  return trimmed;
}

/**
 * Execute Claude Sonnet as fallback via `claude -p --model sonnet`.
 * Uses stdin pipe from temp file, same pattern as gemini.
 */
function execClaudeSonnet(promptFile: string, timeoutSec: number): string {
  const cmd = `cat "${promptFile}" | "${CLAUDE_BIN}" -p --model sonnet`;
  const stdout = execSync(cmd, {
    timeout: timeoutSec * 1000,
    maxBuffer: MAX_BUFFER_BYTES,
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  const trimmed = stdout.trim();
  if (!trimmed) {
    throw new Error('Claude Sonnet returned empty output');
  }
  return trimmed;
}
