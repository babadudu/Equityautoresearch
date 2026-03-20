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
import { estimateCostUsd, MODELS } from './config.js';

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
const USE_OPENROUTER = !ANTHROPIC_KEY && !!OPENROUTER_KEY;

if (!ANTHROPIC_KEY && !OPENROUTER_KEY) {
  console.error('Neither ANTHROPIC_API_KEY nor OPENROUTER_API_KEY found. Set one in .env at project root.');
  process.exit(1);
}

if (USE_OPENROUTER) {
  console.log('[llm] Using OpenRouter backend (set ANTHROPIC_API_KEY to use Anthropic directly)');
} else {
  console.log('[llm] Using Anthropic SDK');
}

const client = ANTHROPIC_KEY ? new Anthropic({ apiKey: ANTHROPIC_KEY }) : null;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

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
}

// ── Retry logic ──

async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const status = err?.status ?? err?.statusCode;
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

// ── Main chat function ──

export async function chat(
  system: string,
  messages: Anthropic.MessageParam[],
  options?: {
    model?: string;
    tools?: AnthropicTool[];
    toolChoice?: { type: 'auto' | 'any' | 'none' };
    maxTokens?: number;
  },
): Promise<ChatResult> {
  const model = options?.model ?? MODELS.SCORING;

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
    usage: {
      inputTokens,
      outputTokens,
      costUsd: estimateCostUsd(model, inputTokens, outputTokens),
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
    [MODELS.RESEARCH]: 'anthropic/claude-opus-4-6',
    [MODELS.SCORING]: 'anthropic/claude-sonnet-4-6',
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
