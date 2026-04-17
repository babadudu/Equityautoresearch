# EquityAutoResearch — Code Review Fix Plan

> 17 findings grouped into 5 parallel batches. Each batch is independent and can be assigned to a different agent.
> Estimated total: ~3-4 hours across agents working in parallel.

---

## Batch 1: Security — Shell Injection (Findings 1, 2)

**Agent**: Codex (precise surgical fixes, security patches)
**Files**: `initial-max-runner.ts`, `gemini-dispatch.ts`
**Risk to existing data**: None — changes execution method, not output format.
**Estimated complexity**: Low (mechanical replacement)

### Finding 1 — Command injection in git commit (CRITICAL)

**Location**: `initial-max-runner.ts:164-171` — `gitCommit()`
**Problem**: Agent-generated text interpolated into shell string via `execSync()`. The `.replace(/"/g, "'")` sanitization is trivially bypassable with `$(...)` or backtick subshells.
**Fix**:
```typescript
import { spawnSync } from 'child_process';

function gitCommit(message: string): string {
  try {
    spawnSync('git', ['add', '-A', 'data/companies/'], { cwd: PROJECT_ROOT });
    spawnSync('git', ['commit', '-m', message], { cwd: PROJECT_ROOT });
    return gitShortHash();
  } catch {
    return gitShortHash();
  }
}
```
Also audit `exec()` helper (line ~148) — if it wraps `execSync(cmd)` with string interpolation, consider whether other callers pass untrusted input. The `gitShortHash()` call is safe (hardcoded command).

### Finding 2 — Shell injection in gemini-dispatch (HIGH)

**Location**: `gemini-dispatch.ts:129` and `149`
**Problem**: `execGemini()` builds shell string: `cat "${promptFile}" | "${GEMINI_BIN}" -m "${model}" -p ""`. The `model` parameter flows from user/config input. `execClaudeSonnet()` has the same pattern.
**Fix**: Replace `execSync(cmd)` with `spawnSync` + stdin pipe:
```typescript
function execGemini(promptFile: string, timeoutSec: number, model: string): string {
  if (!fs.existsSync(GEMINI_BIN)) {
    throw new Error(`Gemini CLI not found at ${GEMINI_BIN}`);
  }
  const input = fs.readFileSync(promptFile, 'utf-8');
  const result = spawnSync(GEMINI_BIN, ['-m', model, '-p', ''], {
    input,
    timeout: timeoutSec * 1000,
    maxBuffer: MAX_BUFFER_BYTES,
    encoding: 'utf-8',
  });
  if (result.error) throw result.error;
  const trimmed = (result.stdout ?? '').trim();
  if (!trimmed) throw new Error('Gemini returned empty output');
  return trimmed;
}
```
Same pattern for `execClaudeSonnet()` — replace `cat | claude` with `spawnSync('claude', ['-p', '--model', 'sonnet'], { input })`.

### Verification
- Run a ticker with a crafted commit message containing `$(echo pwned)` — confirm it appears literally in git log, not executed.
- Run `dispatchToGemini()` with a model string containing shell metacharacters — confirm it either works or throws, never executes.
- Existing tests (if any) should still pass since behavior is identical for clean inputs.

---

## Batch 2: Scoring Integrity (Findings 5, 6, 7, 8)

**Agent**: Claude (complex logic, scoring system understanding required)
**Files**: `initial-max-scorer.ts`, `initial-max-runner.ts`
**Risk to existing data**: HIGH — scoring changes will produce different scores for the same reports. All existing score history was captured with the buggy scorer.
**Estimated complexity**: Medium-High

### Finding 5 — Scorer cost never counted (HIGH)

**Location**: `initial-max-runner.ts:545,648` — `scoreCompanyResearch()` calls excluded from `costTracker`. Also `initial-max-scorer.ts:1060` — `costUsd: 0` hardcoded in scoring event.
**Problem**: Every scoring round makes 5 dimensions x 3 calls = 15 LLM calls (plus pairwise calibration) that are invisible to the budget. A run can silently exceed its cost limit.
**Fix strategy**:
1. `scoreCompanyResearch()` already returns via `chat()` which tracks usage internally. The issue is that the scorer's `chat()` results aren't aggregated back to the caller.
2. Modify `scoreCompanyResearch()` to accept and populate a cost accumulator, or return `totalCostUsd` alongside `score` and `gaps`.
3. In `initial-max-runner.ts`, add scorer cost to `costTracker.totalCostUsd` after each scoring call.
4. In the scoring event (line 1060), compute actual cost from the `chat()` calls made during scoring.

**Implementation sketch**:
- Add a module-level accumulator in `initial-max-scorer.ts` that sums `response.usage.costUsd` from every `chat()` call within `scoreCompanyResearch()`.
- Return it as `score.scoringCostUsd` in the result.
- In `initial-max-runner.ts` lines 545 and 648, add the returned cost to `costTracker`.

### Finding 6 — Rubric key mismatch (HIGH)

**Location**: `initial-max-scorer.ts:465-558`
**Problem**: The `組織` rubric prompt asks the LLM to return keys `{"地理分部", "組織文化", "運營效率"}` but `CANONICAL_CRITERIA_KEYS` maps `組織` to `['組織執行力', '地理分部', '運營效率']`. The `findCanonicalKey()` function tries prefix/substring matching — `組織文化` does NOT match `組織執行力` (no prefix or substring overlap), so the `組織文化` criterion (0-4 points) is silently dropped, losing up to 4 quality points.
**Fix**: Align `CANONICAL_CRITERIA_KEYS` to match the actual rubric prompt output keys:
```typescript
組織: ['地理分部', '組織文化', '運營效率'],
```
**Impact**: After this fix, `組織` scores will increase for reports that have organizational culture content. This is a correctness fix — the current behavior is silently dropping valid data.

### Finding 7 — Single-call score accepted (HIGH)

**Location**: `initial-max-scorer.ts:698-706`
**Problem**: When only 1 of 3 LLM calls succeeds, the code sets `scorerPartialFailure = true` but continues with the single result. "Median of 1" is just that value — no variance reduction. The `scorerPartialFailure` flag is checked in rollback logic but not during normal scoring, so a single lucky/unlucky call can swing the total score by 5+ points.
**Fix options** (choose one):
- **Option A (recommended)**: Require minimum 2 valid calls per dimension. If only 1 succeeds, retry that dimension once more (up to 2 additional attempts). If still < 2, use the single result but apply a confidence penalty (e.g., 0.85x multiplier) and flag it.
- **Option B**: Accept the current behavior but gate on it in the runner — if `scorerPartialFailure`, re-score before making any keep/discard decision.

### Finding 8 — Rolled-back rounds record gap attempts with wrong scores (HIGH)

**Location**: `initial-max-runner.ts:679-690`
**Problem**: After a rollback (lines 662-672), the code restores the backup file but continues to the gap-attempt recording block (lines 679-690) using `newScore.total` as `scoreAfter`. But `newScore` is the regressed score from the rolled-back state — the actual file on disk has been restored to the previous state with `bestScore`.
**Fix**: After a rollback, set `newScore.total = bestScore` (or `prevScore`) before recording gap attempts. Alternatively, skip gap-attempt recording entirely on rollback rounds (since the agent's work was discarded, the attempt shouldn't count as a valid signal):
```typescript
// After rollback, do NOT record gap attempts — the work was discarded
if (description.startsWith('[rollback]')) {
  // Skip gap-attempt recording
} else {
  // existing gap-attempt recording logic
}
```

### Verification
- **Finding 5**: Run `--score-only` on a ticker, check that the trace entry has non-zero `costUsd`.
- **Finding 6**: Score a report with strong organizational culture content (e.g., FUTU), verify `組織文化` appears in the criteria breakdown.
- **Finding 7**: Simulate by mocking 2 of 3 scorer calls to fail — verify the retry logic kicks in.
- **Finding 8**: Run a full session, check `gap_difficulty.jsonl` — no entries should have `scoreAfter` < `scoreBefore` for non-rollback rounds. For rollback rounds, verify entries are skipped.

### Migration note
Existing scores in `data/scoring/` and `gap_difficulty.jsonl` were captured with these bugs. Consider:
1. Adding a `scorer_version` field to scoring events going forward.
2. NOT retroactively rescoring — the old scores are consistent within their own frame.

---

## Batch 3: CLI Exit Handling + Queue Runner (Findings 3, 4, 9)

**Agent**: Claude or Codex (medium complexity, needs careful logic)
**Files**: `llm.ts`, `research-queue-runner.ts`
**Risk to existing data**: Low — changes error handling, not output format.
**Estimated complexity**: Medium

### Finding 3 — Non-zero CLI exit treated as success (HIGH)

**Location**: `llm.ts:399-407` (`runClaudeAgent`) and `llm.ts:521-526` (`runGeminiAgent`)
**Problem**: Both functions accept output from a non-zero exit code if stdout is non-empty. This means partial output from a crash (e.g., Claude dumps a stack trace to stdout) gets treated as a valid result. The consumer may then parse garbage as the agent's work product.
**Fix**: Tighten the acceptance criteria:
```typescript
// In runClaudeAgent close handler:
if (code !== 0) {
  // Only accept non-zero exit if stdout parses as valid JSON with expected shape
  try {
    const parsed = JSON.parse(stdout);
    if (parsed.result || parsed.content) {
      // Structured output from a soft failure — accept with warning
      console.log(`  [claude-agent] Warning: exit code ${code} but got structured output`);
    } else {
      reject(new Error(`Claude agent exited with code ${code}: ${stdout.slice(0, 200)}`));
      return;
    }
  } catch {
    reject(new Error(`Claude agent exited with code ${code}: ${stdout.slice(0, 200)}`));
    return;
  }
}
```
For `runGeminiAgent` (line 521): same pattern — only fall through to result handling if stdout contains substantive content (not just error messages). The Gemini output isn't JSON-structured, so check for minimum length + absence of error markers.

### Finding 4 — Queue runner checks wrong artifacts (HIGH)

**Location**: `research-queue-runner.ts:122-133` — `verifyResearchOutput()`
**Problem**: Success verification looks for knowledge atoms (`data/knowledge/atoms/`), but the queue runner invokes `initial-max-runner.ts` without `--extract-knowledge`. Normal runs produce `data/companies/{TICKER}/{TICKER}_Initial_MAX.md` — that's the actual artifact.
**Fix**: Change verification to check for the main report file:
```typescript
function verifyResearchOutput(ticker: string): boolean {
  const mainFile = path.join(PROJECT_ROOT, 'data', 'companies', ticker, `${ticker}_Initial_MAX.md`);
  return fs.existsSync(mainFile) && fs.statSync(mainFile).size > 1000;
}
```
This is the correct artifact — a successful run always produces the main markdown file.

### Finding 9 — Queue file no locking (HIGH)

**Location**: `research-queue-runner.ts:67-80` — `loadQueue()` / `saveQueue()`
**Problem**: Read-modify-write of `research_queue.json` with no file lock. If two queue runners start concurrently (e.g., cron overlap), both read the same queue, pick the same ticker, and race.
**Fix**: Use a lockfile (simplest for single-machine):
```typescript
import { existsSync, writeFileSync, unlinkSync } from 'fs';

const LOCK_PATH = QUEUE_PATH + '.lock';

function acquireLock(): boolean {
  if (existsSync(LOCK_PATH)) {
    // Check if lock is stale (> 4 hours old)
    const stat = fs.statSync(LOCK_PATH);
    if (Date.now() - stat.mtimeMs < 4 * 3600 * 1000) return false;
    console.log('[lock] Removing stale lock');
  }
  writeFileSync(LOCK_PATH, String(process.pid));
  return true;
}

function releaseLock(): void {
  try { unlinkSync(LOCK_PATH); } catch {}
}
```
Call `acquireLock()` before `loadQueue()`, `releaseLock()` in a `finally` block.

### Verification
- **Finding 3**: Kill a Claude agent mid-response (SIGTERM) — verify the runner treats it as a failure, not partial success.
- **Finding 4**: Run queue runner on a ticker that has a main report but no knowledge atoms — should report success.
- **Finding 9**: Start two queue runners simultaneously — second one should exit with "lock held" message.

---

## Batch 4: API Robustness + Trace Accuracy (Findings 10, 11, 12, 15)

**Agent**: Gemini (bulk analysis, pattern-matching across files, mechanical fixes)
**Files**: `api-tools.ts`, `llm.ts`, `initial-max-runner.ts`, `gemini-dispatch.ts`
**Risk to existing data**: None — additive improvements.
**Estimated complexity**: Low-Medium

### Finding 10 — No fetch timeout/retry on API calls (MEDIUM)

**Location**: `api-tools.ts:22-94` — `webSearch()` and `fetchUrl()`
**Problem**: `fetch()` calls have no timeout. A hung server blocks the entire research round indefinitely. No retry on transient failures (502, 503, 429).
**Fix**: Add `AbortSignal.timeout()` and simple retry:
```typescript
async function fetchWithRetry(url: string, options: RequestInit, timeoutMs = 15000, retries = 2): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { ...options, signal: AbortSignal.timeout(timeoutMs) });
      if (res.status === 429 || res.status >= 500) {
        if (attempt < retries) { await sleep(1000 * (attempt + 1)); continue; }
      }
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(1000 * (attempt + 1));
    }
  }
  throw new Error('fetchWithRetry exhausted');
}
```
Apply to: `webSearch()` (Brave + DDG), `fetchUrl()`, `callNinjaApi()`.

### Finding 11 — Token/cost hardcoded to zero in traces (MEDIUM)

**Location**: `llm.ts:407,413` — `runClaudeAgent()` returns `costUsd: 0` when stdout isn't structured JSON. Also `llm.ts:539` — Gemini agent estimates tokens but the queue runner trace (line 218-224) hardcodes everything to 0.
**Fix**:
1. In `runClaudeAgent()`: parse `claude -p` JSON output for `total_cost_usd` field (already done at line 413 but only when JSON parses). For non-JSON output, estimate using char count (same as Gemini agent).
2. In `research-queue-runner.ts`: the trace entry at line 218 is for the queue runner wrapper, not the inner run. This is acceptable if the inner run already writes its own trace. Verify this and document the trace layering.

### Finding 12 — Gap retirement keys use raw LLM text (MEDIUM)

**Location**: `initial-max-runner.ts:595-596` — `const key = \`${g.dimension}|${g.item}\``
**Problem**: `g.item` comes from LLM-generated gap descriptions (e.g., "DCF 缺少敏感度分析" vs "DCF缺少敏感度分析" vs "DCF 敏感度分析不足"). The same semantic gap gets different keys across rounds, breaking retirement tracking.
**Fix**: Normalize gap keys before use:
```typescript
function normalizeGapKey(dimension: string, item: string): string {
  // Strip whitespace variations, normalize CJK punctuation
  const cleaned = item.trim()
    .replace(/\s+/g, '')           // collapse whitespace
    .replace(/[，。、；：]/g, '')    // strip CJK punctuation
    .slice(0, 40);                  // cap length for stability
  return `${dimension}|${cleaned}`;
}
```
Apply everywhere gap keys are constructed: lines 596, 680-681 in `initial-max-runner.ts`.

### Finding 15 — Temp file collision possible (MEDIUM)

**Location**: `gemini-dispatch.ts:80` — `gemini-dispatch-${process.pid}-${Date.now()}.txt`
**Problem**: If two calls happen in the same millisecond within the same process (unlikely but possible with parallel dispatch), temp files collide.
**Fix**: Add a counter or random suffix:
```typescript
let tmpCounter = 0;
const tmpFile = path.join(tmpDir, `gemini-dispatch-${process.pid}-${Date.now()}-${tmpCounter++}.txt`);
```
Or use `crypto.randomUUID()` for guaranteed uniqueness.

### Verification
- **Finding 10**: Temporarily point Brave API to a non-routable IP — verify timeout fires within 15s and returns empty results gracefully.
- **Finding 11**: Run a scorer call and check the trace file for non-zero token counts.
- **Finding 12**: Run two rounds where the same gap appears with different wording — verify they map to the same key in `gap_difficulty.jsonl`.
- **Finding 15**: Call `dispatchToGemini` twice in rapid succession — verify no file collision.

---

## Batch 5: Knowledge Pipeline + Structural (Findings 13, 14, 16, 17)

**Agent**: Gemini (large-file refactoring) or Codex (for 13-15 which are surgical)
**Files**: `knowledge-extractor.ts`, `knowledge-index.ts`, `initial-max-scorer.ts`, `initial-max-runner.ts`
**Risk to existing data**: Finding 14 affects index integrity. Finding 17 is refactoring (high risk if done wrong).
**Estimated complexity**: Low (13, 14, 16), High (17)

### Finding 13 — Hardcoded tsm-leadership-quotes.md filename (MEDIUM)

**Location**: `knowledge-extractor.ts:451-455`
**Problem**: Stale file cleanup hardcodes `tsm-leadership-quotes.md` — only works for TSM ticker.
**Fix**: Parameterize with ticker:
```typescript
const staleQuotesPath = path.join(ATOMS_DIR, 'quotes', `${ticker.toLowerCase()}-leadership-quotes.md`);
```

### Finding 14 — Conflict atoms indexed as normal (MEDIUM)

**Location**: `knowledge-extractor.ts:279` writes `_conflict_YYYYMMDD.md` files. `knowledge-index.ts:80-92` collects all `.md` files.
**Problem**: Conflict variants are indexed alongside originals, polluting inverted indexes with duplicate/contradictory content. Dedup in knowledge-retrieval may surface conflicts as authoritative.
**Fix**: Skip conflict files during indexing:
```typescript
// In collectAtomFiles() or rebuildIndex()
} else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.includes('_conflict_')) {
  results.push(full);
}
```
Also consider: add a `conflicts` section to the index for manual review.

### Finding 16 — Geographic-revenue consistency check parses numbers naively (LOW)

**Location**: `initial-max-scorer.ts:364-378`
**Problem**: The regex `[\d,]+\.?\d*` matches ALL numbers in the geo-revenue table section (including years like 2024, percentages like 60%, and non-revenue figures). The "sum vs total" check then compares apples to oranges.
**Fix**: This is a structural heuristic that's inherently fragile on free-form markdown. Options:
- **Option A**: Restrict regex to look for currency-formatted numbers (preceded by `$` or `NT$` or followed by `B`/`M`).
- **Option B**: Downgrade to a presence check only (does the section exist with substantial content?) and remove the arithmetic validation.
- **Recommendation**: Option B — the heuristic produces more false positives than real catches.

### Finding 17 — 1,077-LOC runner mixes too many concerns (LOW)

**Location**: `initial-max-runner.ts` entire file
**Problem**: Single file handles CLI parsing, git operations, tool dispatch, agent orchestration, round management, rollback logic, gap tracking, cost tracking, tracing, and polish phase.
**Fix**: This is a refactoring task, not a bug fix. Defer to a separate PR after all correctness fixes land.

**Suggested decomposition** (for future reference):
| Module | Responsibility | Est. LOC |
|--------|---------------|----------|
| `runner-cli.ts` | Argument parsing, entry point | ~80 |
| `runner-git.ts` | Git commit, hash, cleanup | ~40 |
| `runner-orchestrator.ts` | Round loop, keep/discard, rollback | ~350 |
| `runner-agent.ts` | Gap-fill agent dispatch + tool handling | ~250 |
| `runner-polish.ts` | Polish + extended phase | ~200 |
| `runner-trace.ts` | TSV + trace + cost tracking | ~80 |

**Recommendation**: Do NOT attempt this in the same PR as the correctness fixes. Extract one module at a time with tests.

### Verification
- **Finding 13**: Run extraction for a non-TSM ticker — verify no crash on missing quotes file.
- **Finding 14**: Run `--rebuild` on knowledge index — verify no `_conflict_` files in atom list.
- **Finding 16**: Score a report with a complex geo-revenue table — verify no false positive consistency warning.

---

## Dependency Graph

```
Batch 1 (Security)        ──→ can start immediately, no dependencies
Batch 2 (Scoring)         ──→ can start immediately, no dependencies
Batch 3 (CLI + Queue)     ──→ can start immediately, no dependencies
Batch 4 (API + Traces)    ──→ can start immediately, no dependencies
Batch 5 (Knowledge + Structural) ──→ can start immediately; Finding 17 deferred

Batch 2 Finding 5 (cost tracking) should land BEFORE Batch 4 Finding 11 (trace accuracy)
  — otherwise trace cost fix has no upstream cost data to surface.
```

All 5 batches are parallelizable. The only soft dependency is Batch 2 (Finding 5) informing Batch 4 (Finding 11), but they touch different files and can merge independently.

---

## Agent Assignment Summary

| Batch | Agent | Findings | Files | Priority |
|-------|-------|----------|-------|----------|
| 1 | Codex | 1, 2 | runner, gemini-dispatch | P0 (security) |
| 2 | Claude | 5, 6, 7, 8 | scorer, runner | P0 (correctness) |
| 3 | Claude/Codex | 3, 4, 9 | llm, queue-runner | P1 |
| 4 | Gemini | 10, 11, 12, 15 | api-tools, llm, runner, gemini-dispatch | P2 |
| 5 | Gemini/Codex | 13, 14, 16, 17 | knowledge-*, scorer, runner | P2 (17 deferred) |

---

## Breaking Change Checklist

- [ ] **Finding 6** (rubric key fix): Scores will increase for reports with org culture content. All future scores are incomparable to historical scores. Add `scorer_version: 2` to scoring events.
- [ ] **Finding 5** (cost tracking): Budget exhaustion will happen sooner since scorer costs are now visible. May need to increase `DEFAULT_MAX_COST_USD` or accept fewer rounds per run.
- [ ] **Finding 7** (single-call penalty): If confidence penalty is applied, some dimension scores will decrease slightly. Accept this as more accurate.
- [ ] **Finding 4** (verification fix): Previously "failed" queue items may now show as "completed" on re-run. This is correct behavior.

---

*Generated: 2026-04-04*
*Reviewed by: software-architect agent*
