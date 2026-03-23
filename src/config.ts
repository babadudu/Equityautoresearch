/** Model constants and cost tracking for Anthropic SDK */

export const MODELS = {
  RESEARCH: 'claude-opus-4-6-20250219',
  SCORING: 'claude-sonnet-4-6-20250514',
} as const;

/** Cost per 1M tokens (USD) — for budget tracking */
export const COST_PER_1M: Record<string, { input: number; output: number }> = {
  [MODELS.RESEARCH]: { input: 15, output: 75 },
  [MODELS.SCORING]: { input: 3, output: 15 },
};

export const DEFAULT_MAX_COST_USD = 200;

export function estimateCostUsd(model: string, inputTokens: number, outputTokens: number): number {
  const rates = COST_PER_1M[model] ?? { input: 3, output: 15 };
  return (inputTokens * rates.input + outputTokens * rates.output) / 1_000_000;
}
