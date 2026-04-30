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
