/** Model constants and cost tracking for Anthropic SDK */

export const MODELS = {
  RESEARCH: 'claude-opus-4-6-20250219',
  SCORING: 'claude-sonnet-4-6-20250514',
  GEMINI: 'gemini-3.1-pro-preview',
} as const;

/** Nadirclaw local LLM proxy (LiteLLM → Ollama) */
export const NADIRCLAW_URL = 'http://localhost:4100/v1/chat/completions';
export const NADIRCLAW_HEALTH_URL = 'http://localhost:4100/health';
export const NADIRCLAW_MODELS = {
  PREMIUM: 'premium',   // qwen3.5:35b-a3b
  ECO: 'eco',           // qwen3.5:9b
  AUTO: 'auto',         // smart routing
} as const;

/** Schedule window for automated pipeline runs (0 = midnight, 15 = 3pm) */
export const SCHEDULE_WINDOW = { startHour: 0, endHour: 15 };

/** Minimum capacity (%) required before starting a research run */
export const CAPACITY_GATE_PCT = 20;

/** Cost per 1M tokens (USD) — for budget tracking */
export const COST_PER_1M: Record<string, { input: number; output: number }> = {
  [MODELS.RESEARCH]: { input: 15, output: 75 },
  [MODELS.SCORING]: { input: 3, output: 15 },
  [MODELS.GEMINI]: { input: 2, output: 12 },
  'nadirclaw-local': { input: 0, output: 0 },
};

export const DEFAULT_MAX_COST_USD = 200;

// Scorer configuration
export const SCORER_NUM_CALLS = 3;           // calls per dimension for median
export const STRUCTURAL_MAX = 37;            // max structural (heuristic) score (8+6+6+6+4+4+3)
export const QUALITY_MAX = 60;               // max quality (LLM) score
export const PASS_THRESHOLD = 85;            // combined pass threshold
export const STRUCTURAL_PASS_MIN = 31;       // structural minimum for pass (84% of 37)
export const QUALITY_PASS_MIN = 54;          // quality minimum for pass (90% of 60)
export const SCORER_THINKING_BUDGET = 8000;  // thinking tokens for scorer calls
export const SCORER_MAX_RETRIES = 2;          // retries per scoreDimension call on failure

// Plateau detection
export const PLATEAU_ROUNDS = 3;              // consecutive flat rounds before stopping

// Global gap retirement (cross-ticker)
export const GLOBAL_RETIRE_MIN_ATTEMPTS = 4;  // min total attempts across all tickers
export const GLOBAL_RETIRE_MIN_TICKERS = 2;   // min distinct tickers that failed

// Micro-round mode (surgical single-gap focus after Round 2)
export const MICRO_ROUND_THRESHOLD = 3;       // enter micro-rounds if cumulative improvement < this after R2
export const MICRO_ROUND_GAP_COUNT = 1;       // target only top N gaps in micro-round

export function estimateCostUsd(model: string, inputTokens: number, outputTokens: number): number {
  const rates = COST_PER_1M[model] ?? { input: 3, output: 15 };
  return (inputTokens * rates.input + outputTokens * rates.output) / 1_000_000;
}
