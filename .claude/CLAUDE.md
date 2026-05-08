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

- **Gap-fill routes to MLX by default (`DEFAULT_MODEL = LOCAL_MODEL || MODELS.CLAUDE`).** Polish hardcodes `MODELS.CLAUDE` at its call site. When `model === LOCAL_MODEL`, the `USE_CLAUDE_CLI` gate at `initial-max-runner.ts:354` is bypassed and gap-fill falls through to the API tool loop with `backend: 'mlx'`. Override with `--model claude-opus-4-6-20250219` to force Claude for gap-fill. If MLX server is down, `chatViaMlx` detects unavailability and falls back through the chat() routing chain.

- **`chatViaMlx` handles multi-turn tool-calling.** Tool-use/tool-result blocks in Anthropic message history are converted to OpenAI `tool_calls` / `role: 'tool'` format. The conversion lives at `src/llm.ts:627-670`.

- **Research pipeline monitoring.** Background `npm run initial-max` output files are often 0 bytes under the RTK proxy. Reliable monitoring: (1) `ps aux | grep tsx` — process alive; (2) `ls -la data/companies/TICKER/` — file size growth; (3) watch for `initial_max_score_N.json` files appearing to track completed rounds; (4) `ps aux | grep "claude -p"` — shows the active gap-fill/polish subprocess.

- **Polish round is "round 16" in history.jsonl.** When a gap-fill round scores ≥85 (`passThreshold: true`), the runner enters a polish step internally labeled round 16 in `data/scoring/history.jsonl`. Polish typically gains +2–3 points (CDNS: 88→90). Final score = polish round score, not the pass-threshold round.

- **Rubric scorer rejects "Monitor/Accumulate" as a rating.** The 論點 dimension requires an explicit `BUY`, `SELL`, or `HOLD` text. Hybrid/conditional recommendations ("Monitor/Accumulate on Weakness") score 0 on the actionability sub-criterion. Always close this gap with: explicit rating + probability-weighted Bull/Base/Bear scenario table (with an Expected row) + quantified upgrade/downgrade triggers.

- **Skeleton-first: never enter the gap-fill loop without REQUIRED_SECTIONS headings present.** `src/initial-max-runner.ts:writeSkeletonReport` writes a placeholder report with all 1.1–4.2 numbered subsections before baseline scoring. Without this, baseline structural is 0 and the loop wastes rounds with `[scorer] No main file found`. The REQUIRED_SECTIONS list is exported from `src/initial-max-scorer.ts:30` — both the skeleton writer and `src/validate-completion.ts` consume it; never duplicate the list. Incident: V on 2026-05-08 ran 11 rounds at 0/100 because no main file was ever written.

- **MLX hangs do NOT show up on `/v1/models`.** The 2026-05-08 incident: MLX server's health endpoint answered fast while `/v1/chat/completions` hung indefinitely (CPU 50%+, no replies). Always preflight with a real inference probe — `scripts/mlx-preflight.sh` posts a 5-token prompt with an 8s timeout, kills + launchctl-kickstarts on hang, retries up to 90s. `research-loop.sh` runs preflight before every tick.

- **`vault done` requires completion validation, not just runner exit 0.** GLW on 2026-05-08 was marked done with a 4 KB stub (only Executive Summary heading) because the runner exited cleanly even though polish had degraded the artifact. `scripts/validate-completion.sh` (TS-backed `src/validate-completion.ts`) gates `vault done` on: file ≥ 8 KB; all REQUIRED_SECTIONS present; structural ≥ 31 (`STRUCTURAL_PASS_MIN`); quality ≥ 54 (`QUALITY_PASS_MIN`); total ≥ 85 (`PASS_THRESHOLD`). On failure → `vault update --status backlog --last-error <reason>`. New runner exit codes: `2` = no-main-file abort (after 2 rounds), `3` = same-class crash streak abort (3 consecutive `claude-cli-timeout` or `mlx-fetch-failed` crashes — streak resets on score gain or main-file growth ≥1 KB).

- **Polish audit log: `data/audit/polish-log.jsonl`.** Every polish pass writes pre/post snapshots to `data/audit/<TICKER>/<ts>.{pre,post}.md` and appends a JSONL row with structural/quality/total deltas, file sizes, diff line counts. Multi-gate rollback: `delta_total < 0` OR `delta_structural < -5` OR `delta_quality < -5` OR `post_size < 0.7 * pre_size`. The directory snapshots are gitignored; the JSONL is committable. Tail-able audit log to spot polish regressions like GLW (structural 32→9 silently). Snapshots live under `data/audit/`, NOT under `data/companies/` (which is fully gitignored).
