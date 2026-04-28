# equityautoresearch

Equity research automation pipeline — scoring, gap-tracking, and knowledge extraction for investment reports.

## Cross-Project Dependencies

- **`automation/supervisor-config.json`** — read at startup by `src/config.ts` (`_loadSupervisorConfig()`). Provides `LOCAL_BASE_URL`, `LOCAL_MODEL` for the MLX inference backend. Falls back to hardcoded defaults (`http://127.0.0.1:8080/v1`, Qwen3.6-35B MLX) if the file is not found. The automation volume must be mounted for the supervisor config to resolve.

## Stack

TypeScript/Node.js, Anthropic SDK, Gemini CLI, MLX (local inference via supervisor).

## Key files

- `src/config.ts` — model constants, supervisor config loader, cost tracking
- `src/llm.ts` — chat/agent backends (Claude SDK, Claude CLI, MLX local, Gemini CLI, OpenRouter)
- `src/initial-max-scorer.ts` — iterative rubric scoring pipeline
- `src/knowledge-extractor.ts` — atomic knowledge extraction from research reports
