# equityautoresearch

Equity research automation pipeline — scoring, gap-tracking, and knowledge extraction for investment reports.

## Cross-Project Dependencies

- **`automation/supervisor-config.json`** — read at startup by `src/config.ts` (`_loadSupervisorConfig()`). Provides `LOCAL_BASE_URL`, `LOCAL_MODEL` for the MLX inference backend. Falls back to hardcoded defaults (`http://127.0.0.1:8080/v1`, Qwen3.6-35B MLX) if the file is not found. The automation volume must be mounted for the supervisor config to resolve.

## Shared Intelligence

Cross-project research recall is exposed via the `intelligence` MCP server.

- `intelligence_search` — use first for discovery across vault wiki, equity atoms, and investment outputs
- `intelligence_read` — load the full normalized document after search
- `intelligence_documents_by_ticker` — start here for ticker-centric recall sets

The shared index is read-only and lazy auto-syncs on first query after source files change.

## Stack

TypeScript/Node.js, Anthropic SDK, Gemini CLI, MLX (local inference via supervisor).

## Key files

- `src/config.ts` — model constants, supervisor config loader, cost tracking
- `src/llm.ts` — chat/agent backends (Claude SDK, Claude CLI, MLX local, Gemini CLI, OpenRouter)
- `src/initial-max-scorer.ts` — iterative rubric scoring pipeline
- `src/knowledge-extractor.ts` — atomic knowledge extraction from research reports

## Operational Gotchas

- **MLX: single-shot JSON for multi-item rubrics.** For "score N items, aggregate to report" tasks, route MLX via direct POST `/v1/chat/completions` with `response_format: json_object` per item. Do NOT use agentic loops for this task class; the MLX-served model reliably exits at "natural pauses". Pattern: `src/llm.ts:612-689`.

- **qwen3.6:35b-a3b performance.** This model passes a relaxed 90/1.5/0.4 gate (tier_close / RMSE / jaccard) where older 3.5 variants fail. Default to it for closed-vocab classification over 50+ calls.

- **Gap-fill routes to MLX by default (`DEFAULT_MODEL = LOCAL_MODEL`).** Polish hardcodes `MODELS.CLAUDE` at its call site (`initial-max-runner.ts:843`). Override with `--model claude-opus-4-6-20250219` to force Claude for gap-fill. MLX bypasses the `USE_CLAUDE_CLI` gate — it falls through to the API tool loop in `runGapFillAgent`.

- **`chatViaMlx` handles multi-turn tool-calling.** Tool-use/tool-result blocks in Anthropic message history are converted to OpenAI `tool_calls` / `role: 'tool'` format. The conversion lives at `src/llm.ts:627-670`.

- **Research pipeline monitoring.** Background `npm run initial-max` output files are often 0 bytes under the RTK proxy. Reliable monitoring: (1) `ps aux | grep tsx` — process alive; (2) `ls -la data/companies/TICKER/` — file size growth; (3) watch for `initial_max_score_N.json` files appearing to track completed rounds; (4) `ps aux | grep "claude -p"` — shows the active gap-fill/polish subprocess.

- **Polish round is "round 16" in history.jsonl.** When a gap-fill round scores ≥85 (`passThreshold: true`), the runner enters a polish step internally labeled round 16 in `data/scoring/history.jsonl`. Polish typically gains +2–3 points (CDNS: 88→90). Final score = polish round score, not the pass-threshold round.

- **Rubric scorer rejects "Monitor/Accumulate" as a rating.** The 論點 dimension requires an explicit `BUY`, `SELL`, or `HOLD` text. Hybrid/conditional recommendations ("Monitor/Accumulate on Weakness") score 0 on the actionability sub-criterion. Always close this gap with: explicit rating + probability-weighted Bull/Base/Bear scenario table (with an Expected row) + quantified upgrade/downgrade triggers.
