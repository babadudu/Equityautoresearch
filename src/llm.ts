/**
 * LLM integration — Anthropic SDK (native format)
 *
 * Exports chat() with native Anthropic message types.
 * Includes retry with exponential backoff and cost tracking.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import { estimateCostUsd, MODELS, LOCAL_COMPLETIONS_URL, LOCAL_HEALTH_URL, LOCAL_MODEL } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv(): void {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY ?? '';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY ?? '';
const USE_CLAUDE_CLI = process.env.USE_CLAUDE_CLI === '1' || (!ANTHROPIC_KEY && !OPENROUTER_KEY);
const USE_OPENROUTER = !USE_CLAUDE_CLI && !ANTHROPIC_KEY && !!OPENROUTER_KEY;

if (!ANTHROPIC_KEY && !OPENROUTER_KEY && !USE_CLAUDE_CLI) {
  // Check if claude CLI is available as fallback
  try {
    const { execSync } = await import('child_process');
    execSync('which claude', { encoding: 'utf-8' });
  } catch {
    console.error('No LLM backend available. Set ANTHROPIC_API_KEY, OPENROUTER_API_KEY, or USE_CLAUDE_CLI=1 in .env.');
    process.exit(1);
  }
}

if (USE_CLAUDE_CLI) {
  console.log('[llm] Using Claude CLI (claude -p) backend with OAuth');
} else if (USE_OPENROUTER) {
  console.log('[llm] Using OpenRouter backend');
} else {
  console.log('[llm] Using Anthropic SDK');
}

const client = ANTHROPIC_KEY ? new Anthropic({ apiKey: ANTHROPIC_KEY }) : null;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// ── MLX health check (awaited before first chat call) ──

let mlxAvailable = false;
const mlxReady: Promise<void> = (async () => {
  try {
    const res = await fetch(LOCAL_HEALTH_URL, { signal: AbortSignal.timeout(10000) });
    mlxAvailable = res.ok;
    if (mlxAvailable) console.log(`[llm] MLX available at ${LOCAL_HEALTH_URL}`);
  } catch {
    console.log('[llm] MLX not available — will use Claude backend for all calls');
  }
})();

// ── Exported types ──

export interface ToolUse {
  id: string;
  name: string;
  input: Record<string, any>;
}

export interface AnthropicTool {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export interface ChatResult {
  content: string | null;
  toolUses: ToolUse[];
  usage: { inputTokens: number; outputTokens: number; costUsd: number };
  backend?: 'mlx' | 'claude-cli' | 'anthropic' | 'openrouter';
  model?: string;
}

// ── Retry logic ──

async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const status = err?.status ?? err?.statusCode;
      // Don't retry on billing/auth errors (400, 401, 403)
      if (status === 400 || status === 401 || status === 403) throw err;
      const retryable = status === 429 || status === 529 || status === 503;
      if (!retryable || attempt === maxRetries) throw err;
      const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
      const retryAfter = err?.headers?.['retry-after'];
      const waitMs = retryAfter ? Math.min(parseInt(retryAfter, 10) * 1000, 60000) : delay;
      console.log(`  [llm] Retrying in ${(waitMs / 1000).toFixed(1)}s (${status}, attempt ${attempt + 1}/${maxRetries})...`);
      await new Promise(r => setTimeout(r, waitMs));
    }
  }
  throw new Error('Unreachable');
}

// ── Atomic counter for temp file naming (avoids collisions under parallel calls) ──
let _geminiTmpCounter = 0;
function nextGeminiTmpId(): string {
  return `${process.pid}-${Date.now()}-${++_geminiTmpCounter}`;
}

// ── Main chat function ──

export async function chat(
  system: string,
  messages: Anthropic.MessageParam[],
  options?: {
    model?: string;
    backend?: 'mlx' | 'claude' | 'auto';
    tools?: AnthropicTool[];
    toolChoice?: { type: 'auto' | 'any' | 'none' };
    maxTokens?: number;
    thinkingBudget?: number;
  },
): Promise<ChatResult> {
  const model = options?.model ?? MODELS.CLAUDE;

  // Ensure health check has completed before routing
  await mlxReady;

  // Route to MLX when explicitly requested and available (tool-calling supported)
  if (options?.backend === 'mlx') {
    if (mlxAvailable) {
      try {
        return await chatViaMlx(system, messages, model, options);
      } catch (err: any) {
        console.log(`  [llm] MLX failed (${err.message}), falling back to Claude`);
      }
    } else {
      console.log('  [llm] MLX not available, falling back to Claude');
    }
  }

  if (USE_CLAUDE_CLI) {
    return chatViaClaude(system, messages, model, options);
  }
  if (USE_OPENROUTER) {
    return chatViaOpenRouter(system, messages, model, options);
  }

  const params: Anthropic.MessageCreateParams = {
    model,
    system,
    messages,
    max_tokens: options?.maxTokens ?? 16384,
  };

  if (options?.tools?.length) {
    params.tools = options.tools.map(t => ({
      name: t.name,
      description: t.description,
      input_schema: t.input_schema as Anthropic.Tool.InputSchema,
    }));
    if (options.toolChoice) {
      params.tool_choice = options.toolChoice;
    }
  }

  const response = await retryWithBackoff(() => client!.messages.create(params));

  // Extract text and tool_use blocks
  let textContent: string | null = null;
  const toolUses: ToolUse[] = [];

  for (const block of response.content) {
    if (block.type === 'text') {
      textContent = (textContent ?? '') + block.text;
    } else if (block.type === 'tool_use') {
      toolUses.push({
        id: block.id,
        name: block.name,
        input: block.input as Record<string, any>,
      });
    }
  }

  const inputTokens = response.usage?.input_tokens ?? 0;
  const outputTokens = response.usage?.output_tokens ?? 0;

  return {
    content: textContent,
    toolUses,
    backend: 'anthropic',
    model,
    usage: {
      inputTokens,
      outputTokens,
      costUsd: estimateCostUsd(model, inputTokens, outputTokens),
    },
  };
}

/** Claude CLI backend — uses `claude -p` with OAuth via spawn + stdin pipe.
 *  No tool calling in chat(); for tool-based research, use runClaudeAgent() directly. */
async function chatViaClaude(
  system: string,
  messages: Anthropic.MessageParam[],
  model: string,
  _options?: { tools?: AnthropicTool[]; maxTokens?: number; thinkingBudget?: number },
): Promise<ChatResult> {
  const { spawn } = await import('child_process');

  // Build a single prompt from system + messages
  let prompt = '';
  for (const msg of messages) {
    if (msg.role === 'user') {
      if (typeof msg.content === 'string') {
        prompt += msg.content + '\n\n';
      } else if (Array.isArray(msg.content)) {
        const text = (msg.content as any[]).map((b: any) => typeof b === 'string' ? b : b.text ?? '').join('');
        prompt += text + '\n\n';
      }
    }
  }

  const modelAlias = model.includes('opus') ? 'opus' : 'sonnet';
  const fullInput = `${system}\n\n---\n\n${prompt}`;

  const CHAT_TIMEOUT_MS = 10 * 60 * 1000;  // 10 minutes
  const KILL_GRACE_MS = 10 * 1000;

  const cliArgs = ['-p', '--output-format', 'json', '--model', modelAlias, '--no-session-persistence'];
  if (_options?.thinkingBudget && _options.thinkingBudget > 0) {
    // Use --effort for extended thinking (thinkingBudget is a hint: >4000 → high, >8000 → max)
    const effort = _options.thinkingBudget >= 8000 ? 'max' : _options.thinkingBudget >= 4000 ? 'high' : 'medium';
    cliArgs.push('--effort', effort);
  }

  return new Promise<ChatResult>((resolve, reject) => {
    const child = spawn(
      'claude',
      cliArgs,
      { stdio: ['pipe', 'pipe', 'pipe'], cwd: process.cwd() },
    );

    child.stdin.write(fullInput);
    child.stdin.end();

    const stdoutChunks: Buffer[] = [];
    child.stdout.on('data', (chunk: Buffer) => stdoutChunks.push(chunk));

    // Buffer stderr by line (same pattern as runClaudeAgent)
    let stderrRemainder = '';
    child.stderr.on('data', (chunk: Buffer) => {
      stderrRemainder += chunk.toString('utf-8');
      const lines = stderrRemainder.split('\n');
      stderrRemainder = lines.pop()!;
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed) console.log(`  [claude-chat] ${trimmed}`);
      }
    });

    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      console.log(`  [claude-chat] Timeout (${CHAT_TIMEOUT_MS / 60000}min) — sending SIGTERM`);
      child.kill('SIGTERM');
      setTimeout(() => { if (!child.killed) child.kill('SIGKILL'); }, KILL_GRACE_MS);
    }, CHAT_TIMEOUT_MS);

    child.on('close', () => {
      clearTimeout(timer);
      // Flush any remaining stderr
      if (stderrRemainder.trim()) console.log(`  [claude-chat] ${stderrRemainder.trim()}`);
      const stdout = Buffer.concat(stdoutChunks).toString('utf-8');

      if (timedOut && !stdout.trim()) {
        reject(new Error('Claude CLI chat timed out with no output'));
        return;
      }

      let parsed: any;
      try { parsed = JSON.parse(stdout); } catch {
        resolve({ content: stdout.trim(), toolUses: [], backend: 'claude-cli', model: modelAlias, usage: { inputTokens: 0, outputTokens: 0, costUsd: 0 } });
        return;
      }

      const responseText = parsed.result ?? parsed.content ?? stdout.trim();
      const costUsd = parsed.total_cost_usd ?? 0;
      const usage = parsed.usage ?? {};

      resolve({
        content: responseText,
        toolUses: [],
        backend: 'claude-cli',
        model: modelAlias,
        usage: {
          inputTokens: usage.input_tokens ?? 0,
          outputTokens: usage.output_tokens ?? 0,
          costUsd,
        },
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      reject(new Error(`Claude CLI error: ${err.message}`));
    });
  });
}

/**
 * Run Claude Code as an autonomous agent for research.
 * Uses claude -p with full tool access (WebSearch, Read, Write, Bash).
 * Spawns async process with stdin piping to avoid ETIMEDOUT on long runs.
 * Budget flag is the primary completion mechanism; soft timeout at 25min as safety net.
 */
export async function runClaudeAgent(
  systemPrompt: string,
  taskPrompt: string,
  options?: { model?: string; allowedTools?: string[]; maxBudgetUsd?: number; softTimeoutMs?: number },
): Promise<{ result: string; costUsd: number; inputTokens: number; outputTokens: number; durationSec: number }> {
  const { spawn } = await import('child_process');

  const modelAlias = (options?.model ?? '').includes('opus') ? 'opus' : 'sonnet';
  const tools = options?.allowedTools ?? ['WebSearch', 'WebFetch', 'Read', 'Write', 'Bash', 'Glob', 'Grep'];
  const cliArgs = [
    '-p',
    '--output-format', 'json',
    '--model', modelAlias,
    '--no-session-persistence',
    '--permission-mode', 'bypassPermissions',
    '--allowedTools', tools.join(','),
  ];

  const fullPrompt = `${systemPrompt}\n\n---\n\n${taskPrompt}`;

  const SOFT_TIMEOUT_MS = options?.softTimeoutMs ?? 25 * 60 * 1000;  // default 25 minutes
  const KILL_GRACE_MS = 10 * 1000;          // 10 seconds after SIGTERM
  const startTime = Date.now();

  return new Promise<{ result: string; costUsd: number; inputTokens: number; outputTokens: number; durationSec: number }>((resolve, reject) => {
    const child = spawn('claude', cliArgs, {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd(),
    });

    // Pipe prompt to stdin, then close
    child.stdin.write(fullPrompt);
    child.stdin.end();

    // Accumulate stdout
    const stdoutChunks: Buffer[] = [];
    child.stdout.on('data', (chunk: Buffer) => {
      stdoutChunks.push(chunk);
    });

    // Log stderr lines in real-time as progress
    let stderrRemainder = '';
    child.stderr.on('data', (chunk: Buffer) => {
      const text = stderrRemainder + chunk.toString('utf-8');
      const lines = text.split('\n');
      stderrRemainder = lines.pop() ?? '';
      for (const line of lines) {
        if (line.trim()) console.log(`  [claude-agent] ${line}`);
      }
    });

    // Soft timeout: SIGTERM then SIGKILL
    let timedOut = false;
    const softTimer = setTimeout(() => {
      timedOut = true;
      console.log(`  [claude-agent] Soft timeout (${SOFT_TIMEOUT_MS / 60000}min) reached — sending SIGTERM`);
      child.kill('SIGTERM');
      setTimeout(() => {
        if (!child.killed) {
          console.log('  [claude-agent] Grace period expired — sending SIGKILL');
          child.kill('SIGKILL');
        }
      }, KILL_GRACE_MS);
    }, SOFT_TIMEOUT_MS);

    child.on('close', (code) => {
      clearTimeout(softTimer);

      // Flush any remaining stderr
      if (stderrRemainder.trim()) {
        console.log(`  [claude-agent] ${stderrRemainder}`);
      }

      const stdout = Buffer.concat(stdoutChunks).toString('utf-8');

      if (timedOut && !stdout.trim()) {
        reject(new Error('Claude agent timed out with no output'));
        return;
      }

      if (code !== 0) {
        // Only accept partial output if it parses as valid JSON with expected shape
        const trimmed = stdout.trim();
        if (trimmed) {
          try {
            const parsed = JSON.parse(trimmed);
            const resultStr = typeof parsed.result === 'string' && parsed.result.length > 0 ? parsed.result : null;
            const contentStr = typeof parsed.content === 'string' && parsed.content.length > 0 ? parsed.content : null;
            const contentBlocks = Array.isArray(parsed.content) && parsed.content.length > 0 ? parsed.content : null;
            if (resultStr !== null || contentStr !== null || contentBlocks !== null) {
              const durationSec = Math.round((Date.now() - startTime) / 1000);
              resolve({
                result: resultStr ?? contentStr ?? JSON.stringify(contentBlocks),
                costUsd: parsed.total_cost_usd ?? 0,
                inputTokens: parsed.input_tokens ?? parsed.usage?.input_tokens ?? 0,
                outputTokens: parsed.output_tokens ?? parsed.usage?.output_tokens ?? 0,
                durationSec,
              });
              return;
            }
          } catch { /* not valid JSON, fall through to reject */ }
        }
        reject(new Error(`Claude agent exited with code ${code}`));
        return;
      }

      const durationSec = Math.round((Date.now() - startTime) / 1000);
      let parsed: any;
      try { parsed = JSON.parse(stdout); } catch {
        // Non-JSON output: estimate cost from character count (4 chars ≈ 1 token)
        const estInputTokens = Math.ceil(fullPrompt.length / 4);
        const estOutputTokens = Math.ceil(stdout.length / 4);
        const estCostUsd = estimateCostUsd(options?.model ?? MODELS.CLAUDE, estInputTokens, estOutputTokens);
        resolve({ result: stdout.trim(), costUsd: estCostUsd, inputTokens: estInputTokens, outputTokens: estOutputTokens, durationSec });
        return;
      }

      resolve({
        result: parsed.result ?? parsed.content ?? stdout.trim(),
        costUsd: parsed.total_cost_usd ?? 0,
        inputTokens: parsed.input_tokens ?? parsed.usage?.input_tokens ?? 0,
        outputTokens: parsed.output_tokens ?? parsed.usage?.output_tokens ?? 0,
        durationSec,
      });
    });

    child.on('error', (err) => {
      clearTimeout(softTimer);
      reject(new Error(`Claude agent spawn error: ${err.message}`));
    });
  });
}

/**
 * Gemini CLI agent — async spawn of `gemini -p` with tool access.
 * Parallel to runClaudeAgent but uses Gemini for grounded web search.
 * Falls back to runClaudeAgent on failure.
 */
export async function runGeminiAgent(
  systemPrompt: string,
  taskPrompt: string,
  options?: { model?: string; softTimeoutMs?: number },
): Promise<{ result: string; costUsd: number; inputTokens: number; outputTokens: number; durationSec: number; usedFallback: boolean }> {
  const { spawn } = await import('child_process');
  const fs = await import('fs');
  const os = await import('os');
  const path = await import('path');

  const GEMINI_BIN = '/opt/homebrew/bin/gemini';
  const model = options?.model ?? MODELS.GEMINI;

  // Check gemini binary exists
  if (!fs.existsSync(GEMINI_BIN)) {
    console.log('  [gemini-agent] Gemini CLI not found, falling back to Claude');
    const fb = await runClaudeAgent(systemPrompt, taskPrompt, { model: 'sonnet', softTimeoutMs: options?.softTimeoutMs });
    return { ...fb, usedFallback: true };
  }

  const fullPrompt = `${systemPrompt}\n\n---\n\n${taskPrompt}`;

  // Write prompt to temp file (avoids stdin pipe limits for large prompts)
  const tmpFile = path.join(os.tmpdir(), `gemini-agent-${nextGeminiTmpId()}.txt`);
  fs.writeFileSync(tmpFile, fullPrompt, 'utf-8');

  const cliArgs = [
    '-m', model,
    '-p', '',
    '--approval-mode', 'yolo',
  ];

  const SOFT_TIMEOUT_MS = options?.softTimeoutMs ?? 25 * 60 * 1000;
  const KILL_GRACE_MS = 10 * 1000;
  const startTime = Date.now();

  return new Promise<{ result: string; costUsd: number; inputTokens: number; outputTokens: number; durationSec: number; usedFallback: boolean }>((resolve, reject) => {
    // Pipe prompt file via stdin: cat tmpFile | gemini ...
    const child = spawn(GEMINI_BIN, cliArgs, {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd(),
    });

    // Pipe the prompt and close stdin
    const promptStream = fs.createReadStream(tmpFile);
    promptStream.pipe(child.stdin);
    promptStream.on('end', () => child.stdin.end());

    const stdoutChunks: Buffer[] = [];
    child.stdout.on('data', (chunk: Buffer) => {
      stdoutChunks.push(chunk);
    });

    let stderrRemainder = '';
    child.stderr.on('data', (chunk: Buffer) => {
      const text = stderrRemainder + chunk.toString('utf-8');
      const lines = text.split('\n');
      stderrRemainder = lines.pop() ?? '';
      for (const line of lines) {
        if (line.trim()) console.log(`  [gemini-agent] ${line}`);
      }
    });

    let timedOut = false;
    const softTimer = setTimeout(() => {
      timedOut = true;
      console.log(`  [gemini-agent] Soft timeout (${SOFT_TIMEOUT_MS / 60000}min) reached — sending SIGTERM`);
      child.kill('SIGTERM');
      setTimeout(() => {
        if (!child.killed) {
          console.log('  [gemini-agent] Grace period expired — sending SIGKILL');
          child.kill('SIGKILL');
        }
      }, KILL_GRACE_MS);
    }, SOFT_TIMEOUT_MS);

    child.on('close', (code) => {
      clearTimeout(softTimer);
      // Clean up temp file
      try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }

      if (stderrRemainder.trim()) {
        console.log(`  [gemini-agent] ${stderrRemainder}`);
      }

      const durationSec = Math.round((Date.now() - startTime) / 1000);
      const stdout = Buffer.concat(stdoutChunks).toString('utf-8');

      // Fallback to Claude on failure
      if (code !== 0 || (timedOut && !stdout.trim())) {
        // Only accept partial output on non-zero exit if it parses as valid JSON with expected shape
        if (code !== 0 && stdout.trim()) {
          try {
            const parsed = JSON.parse(stdout.trim());
            const resultStr = typeof parsed.result === 'string' && parsed.result.length > 0 ? parsed.result : null;
            const contentStr = typeof parsed.content === 'string' && parsed.content.length > 0 ? parsed.content : null;
            const contentBlocks = Array.isArray(parsed.content) && parsed.content.length > 0 ? parsed.content : null;
            if (resultStr !== null || contentStr !== null || contentBlocks !== null) {
              const outputChars = stdout.length;
              const estOutputTokens = Math.round(outputChars / 2);
              const estInputTokens = Math.round(fullPrompt.length / 2);
              const estCost = estimateCostUsd(model, estInputTokens, estOutputTokens);
              resolve({
                result: resultStr ?? contentStr ?? JSON.stringify(contentBlocks),
                costUsd: estCost,
                inputTokens: estInputTokens,
                outputTokens: estOutputTokens,
                durationSec,
                usedFallback: false,
              });
              return;
            }
          } catch { /* not valid JSON, fall through to fallback */ }
        }
        console.log(`  [gemini-agent] Failed (code=${code}, timeout=${timedOut}), falling back to Claude`);
        runClaudeAgent(systemPrompt, taskPrompt, { model: 'sonnet', softTimeoutMs: options?.softTimeoutMs })
          .then(r => resolve({ ...r, usedFallback: true })).catch(reject);
        return;
      }

      // Gemini CLI doesn't return structured JSON with token counts.
      // Estimate using chars/2 (mixed CJK/English content averages ~2 chars/token).
      const outputChars = stdout.length;
      const estOutputTokens = Math.round(outputChars / 2);
      const estInputTokens = Math.round(fullPrompt.length / 2);
      const estCost = estimateCostUsd(model, estInputTokens, estOutputTokens);

      console.log(`  [gemini-agent] Done (${durationSec}s, ~${estOutputTokens} tokens, ~$${estCost.toFixed(2)})`);

      resolve({
        result: stdout.trim(),
        costUsd: estCost,
        inputTokens: estInputTokens,
        outputTokens: estOutputTokens,
        durationSec,
        usedFallback: false,
      });
    });

    child.on('error', (err) => {
      clearTimeout(softTimer);
      try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
      console.log(`  [gemini-agent] Spawn error: ${err.message}, falling back to Claude`);
      runClaudeAgent(systemPrompt, taskPrompt, { model: 'sonnet', softTimeoutMs: options?.softTimeoutMs })
        .then(r => resolve({ ...r, usedFallback: true })).catch(reject);
    });
  });
}

/** MLX local proxy — OpenAI-compatible format, supervisor-managed model */
async function chatViaMlx(
  system: string,
  messages: Anthropic.MessageParam[],
  _model: string,
  options?: { model?: string; maxTokens?: number; tools?: AnthropicTool[]; toolChoice?: { type: 'auto' | 'any' | 'none' } },
): Promise<ChatResult> {
  const mlxModel = options?.model ?? LOCAL_MODEL;

  // Convert Anthropic messages to OpenAI format
  const oaiMessages: any[] = [{ role: 'system', content: system }];
  for (const msg of messages) {
    if (typeof msg.content === 'string') {
      oaiMessages.push({ role: msg.role, content: msg.content });
    } else if (Array.isArray(msg.content)) {
      const text = (msg.content as any[]).map((b: any) => typeof b === 'string' ? b : b.text ?? '').join('');
      oaiMessages.push({ role: msg.role, content: text });
    }
  }

  // Convert Anthropic tools → OpenAI format
  const oaiTools = (options?.tools ?? []).map(t => ({
    type: 'function',
    function: { name: t.name, description: t.description, parameters: t.input_schema },
  }));

  // Request JSON output when system prompt mentions JSON (only when no tools — mutually exclusive)
  const wantsJson = oaiTools.length === 0 && /json/i.test(system);

  const body: Record<string, unknown> = {
    model: mlxModel,
    messages: oaiMessages,
    max_tokens: options?.maxTokens ?? 16384,
    stream: false,
    chat_template_kwargs: { enable_thinking: false },
    ...(wantsJson ? { response_format: { type: 'json_object' } } : {}),
    ...(oaiTools.length ? { tools: oaiTools, tool_choice: options?.toolChoice?.type ?? 'auto' } : {}),
  };

  const doFetch = async () => {
    const res = await fetch(LOCAL_COMPLETIONS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5 * 60 * 1000), // 5 min timeout for local inference
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      const err = new Error(`MLX ${res.status}: ${errText.slice(0, 500)}`);
      (err as any).status = res.status;
      throw err;
    }
    return res.json() as Promise<any>;
  };

  const data = await retryWithBackoff(doFetch);
  const choice = data.choices?.[0];

  // Parse tool_calls (MLX may return empty id — use synthetic fallback)
  const oaiToolCalls: any[] = choice?.message?.tool_calls ?? [];
  const toolUses: ToolUse[] = oaiToolCalls.map((tc: any, i: number) => ({
    id: tc.id || `call_${i}`,
    name: tc.function.name,
    input: typeof tc.function.arguments === 'string'
      ? JSON.parse(tc.function.arguments)
      : tc.function.arguments,
  }));

  return {
    content: choice?.message?.content ?? null,
    toolUses,
    backend: 'mlx',
    model: mlxModel,
    usage: {
      inputTokens: data.usage?.prompt_tokens ?? 0,
      outputTokens: data.usage?.completion_tokens ?? 0,
      costUsd: 0,
    },
  };
}

/** OpenRouter fallback — translates native Anthropic format to OpenAI format for OpenRouter */
async function chatViaOpenRouter(
  system: string,
  messages: Anthropic.MessageParam[],
  model: string,
  options?: { tools?: AnthropicTool[]; maxTokens?: number },
): Promise<ChatResult> {
  // Map model names to OpenRouter model IDs
  const modelMap: Record<string, string> = {
    [MODELS.CLAUDE]: 'anthropic/claude-opus-4-6',
  };
  const orModel = modelMap[model] ?? model;

  // Convert Anthropic messages to OpenAI format
  const oaiMessages: any[] = [{ role: 'system', content: system }];
  for (const msg of messages) {
    if (msg.role === 'assistant' && Array.isArray(msg.content)) {
      // Convert content blocks to OpenAI format
      let text = '';
      const toolCalls: any[] = [];
      for (const block of msg.content) {
        if (typeof block === 'object' && 'type' in block) {
          if (block.type === 'text') text += block.text;
          else if (block.type === 'tool_use') {
            toolCalls.push({
              id: block.id,
              type: 'function',
              function: { name: block.name, arguments: JSON.stringify(block.input) },
            });
          }
        }
      }
      oaiMessages.push({ role: 'assistant', content: text || null, ...(toolCalls.length ? { tool_calls: toolCalls } : {}) });
    } else if (msg.role === 'user' && Array.isArray(msg.content)) {
      // Check if it's tool results
      const toolResults = (msg.content as any[]).filter((b: any) => b.type === 'tool_result');
      if (toolResults.length > 0) {
        for (const tr of toolResults) {
          oaiMessages.push({ role: 'tool', content: typeof tr.content === 'string' ? tr.content : JSON.stringify(tr.content), tool_call_id: tr.tool_use_id });
        }
      } else {
        const text = (msg.content as any[]).map((b: any) => typeof b === 'string' ? b : b.text ?? '').join('');
        oaiMessages.push({ role: 'user', content: text });
      }
    } else {
      oaiMessages.push({ role: msg.role, content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content) });
    }
  }

  // Convert tools to OpenAI format
  const oaiTools = options?.tools?.map(t => ({
    type: 'function' as const,
    function: { name: t.name, description: t.description, parameters: t.input_schema },
  }));

  const body: Record<string, unknown> = {
    model: orModel,
    messages: oaiMessages,
    max_tokens: options?.maxTokens ?? 16384,
    stream: false,
  };
  if (oaiTools?.length) {
    body.tools = oaiTools;
    body.tool_choice = 'auto';
  }

  const doFetch = async () => {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://investment-ai.local',
        'X-Title': 'AutoResearch',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      const err = new Error(`OpenRouter ${res.status}: ${errText.slice(0, 500)}`);
      (err as any).status = res.status;
      throw err;
    }
    return res.json() as Promise<any>;
  };

  const data = await retryWithBackoff(doFetch);
  const choice = data.choices?.[0];
  const toolCalls = choice?.message?.tool_calls ?? [];

  return {
    content: choice?.message?.content ?? null,
    toolUses: toolCalls.map((tc: any) => ({
      id: tc.id,
      name: tc.function.name,
      input: JSON.parse(tc.function.arguments || '{}'),
    })),
    backend: 'openrouter',
    model: orModel,
    usage: {
      inputTokens: data.usage?.prompt_tokens ?? 0,
      outputTokens: data.usage?.completion_tokens ?? 0,
      costUsd: estimateCostUsd(model, data.usage?.prompt_tokens ?? 0, data.usage?.completion_tokens ?? 0),
    },
  };
}

export function getEnv(key: string): string {
  return process.env[key] ?? '';
}
