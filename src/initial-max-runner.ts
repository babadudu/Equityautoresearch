#!/usr/bin/env node
/**
 * Initial MAX Runner
 *
 * Scores a company research report against the four-dimension framework
 * (Environment→Business→Organization→People) and iteratively fills gaps
 * until quality passes (≥85/100), plateaus (3 rounds same score), or maxRounds is reached.
 *
 * Key differences vs skill-optimizer.ts:
 *  - Research is additive — no git reset on discard
 *  - Each round gap-fill agent writes files directly (web_search + fetch_url + write_research_section)
 *  - Uses google/gemini-3.1-pro-preview model for gap-fill
 *
 * Usage:
 *   npx tsx src/initial-max-runner.ts --ticker NVDA
 *   npx tsx src/initial-max-runner.ts --ticker FUTU --score-only
 *   npx tsx src/initial-max-runner.ts --ticker GOOG --max-rounds 5 --tag test
 *   npx tsx src/initial-max-runner.ts --ticker MU --model minimax/minimax-m2.7
 *   npx tsx src/initial-max-runner.ts --ticker NVDA --skip-polish   # skip final polish round
 */
import fs from 'fs';
import path from 'path';
import { execSync, spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import { chat, runClaudeAgent, runGeminiAgent, type ToolUse, type AnthropicTool, type ChatResult } from './llm.js';
import {
  MODELS, LOCAL_MODEL, DEFAULT_MAX_COST_USD, estimateCostUsd, PASS_THRESHOLD as SCORER_PASS_THRESHOLD,
  PLATEAU_ROUNDS, MICRO_ROUND_THRESHOLD, MICRO_ROUND_GAP_COUNT,
} from './config.js';
import { scoreCompanyResearch, scoreExtendedResearch, type InitialMaxScore, type InitialMaxGaps, type ExtendedScore } from './initial-max-scorer.js';
import { webSearch, fetchUrl, callNinjaApi, queryCompaniesDb, searchDataForCompany, readProjectFile } from './api-tools.js';
import { queryKnowledgeBaseJson } from './knowledge-retrieval.js';
import { extractKnowledge } from './knowledge-extractor.js';
import {
  writeResearchSection, buildMainFileFullAttachment, readResearchFile, listCompanyFiles,
  findSectionRange, replaceSection,
  INITIAL_MAX_MAIN_IN_USER_CHARS, READ_RESEARCH_FILE_MAX_CHARS,
} from './markdown-utils.js';
import { GAP_FILL_TOOLS, POLISH_TOOLS } from './tool-schemas.js';
import { appendGapAttempt, countAttempts, getMaxAttemptsForGap, loadGapAttempts, countAttemptsFromLoaded, getMaxAttemptsFromLoaded, isGloballyRetired } from './gap-tracker.js';
import { findSimilarSearch, appendSearchEntry } from './search-log.js';
import { getScoringReadback } from './scoring-store.js';
import { appendTrace } from './run-trace.js';
import { syncIntelligencePaths } from './intelligence-sync.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_MODEL = MODELS.CLAUDE;  // Gap-fill routes to Gemini CLI; polish hardcodes MODELS.CLAUDE. MLX handles scoring only.
const DEFAULT_MAX_ROUNDS = 15;
const PASS_THRESHOLD = SCORER_PASS_THRESHOLD;  // 85, from config

/**
 * Normalize a gap key so the same conceptual gap maps to the same string
 * across rounds, regardless of minor LLM text variation.
 * Strips leading/trailing whitespace, removes CJK punctuation, and caps at 40 chars.
 */
function normalizeGapKey(dimension: string, item: string): string {
  const normalize = (s: string) =>
    s.trim()
      // Strip common CJK punctuation that LLMs sometimes add/omit
      .replace(/[\u3000\u3001\u3002\uff0c\uff0e\uff1a\uff1b\uff01\uff1f\u300a\u300b\u300c\u300d\u300e\u300f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 40);
  return `${normalize(dimension)}|${normalize(item)}`;
}

const POLISH_PHASE_SYSTEM = `# Initial MAX Polish Round

You are an **editor** of the investment research Markdown report (not a researcher). You have **only two tools**: read the report, write the report.

**Strictly prohibited**: any new research — no web search, no fetch URL, no Ninja API, no search_data_for_company, no read_project_file. Work only from the full report text attached in the user message, and if needed use \`read_research_file\` to fill in truncated sections. Do **editing and reorganization** only.

**Goals**: (1) **Prose flow**: narrative coherence, natural paragraph transitions; (2) **Formatting**: consistent # / ## / ### heading levels, valid readable tables, uniform lists; (3) **Deduplication**: remove repeated paragraphs, duplicate tables, or repeated arguments; (4) **Preserve facts**: numbers, sources, management quotes, and **existing hyperlinks** must be preserved; fix typos, punctuation, obvious grammar errors — **do not fabricate new facts or numbers**. **Links**: do not delete source URLs from the body; if a location only has text like "Source: Annual Report" but a nearby URL exists, reformat as a Markdown link (do not add new URLs).

**Write strategy**: prefer \`replace_section\` for each subsection — output the **full polished section** (**including the section heading line**), equivalent to a full section rewrite/edit, not just appending to the end. Use \`insert_into_section\` only when strictly necessary. **Append is prohibited**. For leading sections (e.g., IRR, Executive Summary) that cannot be replaced by numeric anchor, use \`overwrite\` cautiously only when you have the complete file content with zero omissions.

**Polish round mandatory checklist** (from expert review):
1. **Zero duplicate quotes**: scan the full report — if the same CEO/management quote appears ≥2 times, consolidate to the best location and delete the rest. Goal: zero duplicate quotes.
2. **Remove self-scoring tables**: if the report contains a "scorecard" or self-evaluation section, **delete the entire block** (external system handles scoring).
3. **IRR vs risk probability consistency**: if the report recommends IRR > 15% but cites high conflict probability, explicitly reconcile this contradiction in the conclusion or section 8.3.
4. **Executive Summary check**: does the report begin with a standalone Executive Summary (1 page, containing investment thesis, valuation, top 3 risks)? If not, create one.
5. **Current price vs fair value**: confirm the report explicitly states "Current price X, fair value Y, margin of safety Z%".`;

const EXTENDED_PHASE_SYSTEM = `# Initial MAX Extended Analysis: Geopolitical / ESG / Bull vs Bear

You are a top cross-disciplinary analyst with expertise spanning geopolitics, environmental science, and investment analysis. Your task is to conduct **extended analysis** on a company, supplementing the core investment research report.

## Your Role

- You are **NOT** doing traditional financial analysis (that is already done) — you are supplementing with **geopolitical, environmental, and contrarian debate** dimensions
- You will receive the full current report (with four-dimension framework research) and the extended dimension gap list
- Your output must be **objective, unbiased, and data-supported** — if both sides are dissatisfied, you have succeeded

## Impartiality Methodology (CRITICAL)

1. **Academic style**: format each argument as "According to [source], X. However, [source] argues Y"
2. **Data-paired claims**: every assertion must include verifiable data + source URL
3. **No conclusions**: report facts and all sides' positions — do not make "we believe" judgments
4. **Recency**: prioritize 2024–2026 data; historical data for trend analysis only
5. **Diverse sources**: each argument must cite ≥2 sources from different perspectives

## Extended Dimension Structure

### VI. Geopolitical Analysis
- 6.1 Geopolitical position & influence: company's strategic importance to its country/region (e.g., silicon shield theory)
  - **Silicon shield claims bear burden of proof**: economic interdependence has historically failed to prevent wars (e.g., WWI) — do not assume effectiveness
  - **Military capability gap**: PLA amphibious capacity assessment, Taiwan's own defense investment (hedgehog strategy, anti-ship missiles, conscription extension)
  - **"Scorched earth" deterrence**: reports that fabs could be disabled during an invasion must be included
  - **Taiwan's democratic governance** as part of the moat must be analyzed
- 6.2 International relations & supply chain risk: alliance relationships, supply chain concentration, decoupling risk
  - **Japan's 2022 National Security Strategy revision** must be a primary source (defense budget doubling)
- 6.3 Policy/sanctions/trade risk: specific policies (CHIPS Act, export controls, tariffs, etc.)
  - **CHIPS Act duality**: both opportunity (subsidies) and systematic erosion of the moat — must explicitly model both sides
  - **Competitor success scenario**: model Intel 18A success (90%→70-75% advanced node share shift)
  - **Conflict probability requires named sources**: do not cite anonymous "consulting firm"; CFR Tier I refers to crisis escalation not military action — distinguish clearly

### VII. ESG & Sustainability Analysis
- 7.1 Energy & resource consumption: electricity, water, land usage (specific numbers + % of national/regional total + sources)
  - **"Net positive" energy claims** must be flagged as company self-reported, unverified by third-party lifecycle analysis
  - **Compound risk loop**: company growth → energy vulnerability increases → blockade scenario worsens → geopolitical risk rises — describe this feedback loop explicitly
- 7.2 Environmental controversy & ESG: controversy events, environmental group positions, ESG rating comparisons
  - **Water resources** must include specific drought case details (farmer impacts, S&P credit risk link)
- 7.3 Climate risk & transition: carbon pathway, RE100 commitment, transition cost estimates

### VIII. Bull vs Bear
- 8.1 Bull Case: strongest long arguments (≥5, each with data support)
- 8.2 Bear Case: strongest short arguments (≥5, each with data support)
  - **Bull/Bear length parity**: Bull argument word count must not exceed Bear argument by more than 1.5×
- 8.3 Key disputes & data comparison: side-by-side table of both sides' core disagreements
  - **IRR vs risk probability contradiction must be reconciled**: if IRR > 15% but conflict probability is high, quantify and discuss this contradiction
  - **Probability-weighted expected return**: include Bull/Base/Bear probability-weighted IRR (e.g., 25%/50%/25%)
- 8.4 Thesis invalidation conditions (What Would Change Our Mind?)
  - Write to \`## 8.4 Thesis Invalidation Conditions (What Would Change Our Mind?)\`
  - ≥5 trigger conditions covering five domains: **Competition**, **Demand**, **Geopolitics**, **Financials**, **Technology**
  - Each trigger format: "If [metric] crosses [threshold] within [timeframe], tracked via [monitoring source], then [impact on investment thesis]"
  - **Must be specific, falsifiable, and time-bounded** — prohibit vague conditions like "if competition intensifies"; replace with "if Intel 18A yield reaches 80% and enters mass production (before 2026H2), advanced node share shifts from 90% to 70-75%"
  - Each trigger must include a verifiable data source or monitoring method

## Search Budget

Max 12 web_search calls per round. Suggested allocation:
- Geopolitical: 2-3 calls ("{TICKER} geopolitical risk", "{COUNTRY} strategic importance")
- ESG: 2-3 calls ("{TICKER} electricity water ESG", "{TICKER} carbon emissions")
- Bull vs Bear: 2 calls ("{TICKER} bull case bear case analysis 2025")

## Output Format

After tool calls complete, output JSON:
{"description": "added geopolitical silicon shield analysis, environmental electricity data...", "files_written": ["{TICKER}_Initial_MAX.md"], "dimensions_addressed": ["geopolitical", "sustainability", "contrarian"]}`;

// ── CLI args ──

function parseArgs() {
  const args: Record<string, string> = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const val = process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[++i] : 'true';
      args[key] = val;
    }
  }
  return args;
}

// ── Git helpers ──

function exec(cmd: string): string {
  return execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf-8', timeout: 60_000 }).trim();
}

function gitShortHash(): string {
  try {
    return exec('git rev-parse --short HEAD');
  } catch {
    return 'nogit';
  }
}

function gitCommit(message: string): string {
  try {
    const addResult = spawnSync('git', ['add', 'data/companies/', 'data/knowledge/'], { cwd: PROJECT_ROOT });
    if (addResult.status !== 0) {
      console.warn(`[gitCommit] git add failed (status ${addResult.status}): ${addResult.stderr?.toString().trim()}`);
      return '';
    }
    const commitResult = spawnSync('git', ['commit', '-m', message], { cwd: PROJECT_ROOT });
    if (commitResult.status !== 0) {
      console.warn(`[gitCommit] git commit failed (status ${commitResult.status}): ${commitResult.stderr?.toString().trim()}`);
      return '';
    }
    return gitShortHash();
  } catch (err: any) {
    console.warn(`[gitCommit] exception: ${err?.message}`);
    return '';
  }
}

/** Delete all initial_max_gaps_*.json and initial_max_score_*.json in the ticker directory (cleanup after run to avoid accumulation). */
function cleanupTickerScoreAndGapsFiles(ticker: string): void {
  const dir = path.join(PROJECT_ROOT, 'data', 'companies', ticker);
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    try {
      if ((f.startsWith('initial_max_gaps_') || f.startsWith('initial_max_score_')) && f.endsWith('.json')) {
        fs.unlinkSync(full);
      } else if (f === 'initial_max_scorecard.md') {
        fs.unlinkSync(full);
      }
    } catch (_) {}
  }
}

function countCompanyResearchFiles(ticker: string): number {
  const dir = path.join(PROJECT_ROOT, 'data', 'companies', ticker);
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  const walk = (current: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && !entry.name.endsWith('.bak')) {
        count++;
      }
    }
  };
  walk(dir);
  return count;
}

// ── TSV result tracking ──

interface RoundResult {
  round: number;
  commit: string;
  score: number;
  status: 'keep' | 'no_improvement' | 'crash' | 'baseline' | 'scorer_failure';
  description: string;
  timestamp: string;
  costAtStart?: number;
}

function appendTsv(tsvPath: string, r: RoundResult): void {
  const line = [r.commit, r.score.toFixed(1), r.status, r.description.replace(/\t/g, ' ').replace(/\n/g, ' ').slice(0, 200)].join('\t');
  fs.appendFileSync(tsvPath, line + '\n');
}

// ── Tool implementations extracted to api-tools.ts, markdown-utils.ts, tool-schemas.ts ──


// ── Gap-fill mini agent ──

const _ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY ?? '';
const _OPENROUTER_KEY = process.env.OPENROUTER_API_KEY ?? '';
const USE_CLAUDE_CLI = process.env.USE_CLAUDE_CLI === '1' || (!_ANTHROPIC_KEY && !_OPENROUTER_KEY);

async function runGapFillAgent(
  ticker: string,
  gaps: InitialMaxGaps,
  skillContent: string,
  programPrompt: string,
  round: number,
  model: string,
  investorNote?: string,
  phase: 'gap_fill' | 'polish' = 'gap_fill',
  costTracker?: { totalCostUsd: number },
  softTimeoutMs?: number,
): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);
  const mainFile = `${ticker}_Initial_MAX.md`;
  const tools = phase === 'polish' ? POLISH_TOOLS : GAP_FILL_TOOLS;

  const topGaps = gaps.gaps.slice(0, 5).map((g: (typeof gaps.gaps)[number], i: number) =>
    `${i + 1}. [${g.dimension}] ${g.item}: current ${g.current}, target ${g.target}, gap ${g.shortfall} pts`,
  ).join('\n');

  const investorSection = investorNote && investorNote.trim().length > 0
    ? `\n\n### Investor Focus (why we are researching this company)\n${investorNote.trim()}`
    : '';

  let taskMessage: string;
  if (phase === 'polish') {
    taskMessage = `## ${ticker} Initial MAX **Polish Round** (prose flow / formatting / deduplication, ${today})

**Context**: Research iteration has stopped. This round does **editing only** — no web search, no API, no new interviews. Full report is attached at the end of this message.

### Required tasks
1. **Prose flow**: natural paragraph transitions, remove repeated arguments and duplicate tables/lists.
2. **Formatting**: consistent heading levels, valid tables, uniform lists, appropriate spacing.
3. **Corrections**: typos, punctuation, obvious grammar issues; **preserve** numbers, sources, quotes, and links; do not add new facts.
4. **Write**: prefer \`replace_section\` for sections needing polish (full section output = **can fully rewrite the section**, including heading). **Append is prohibited**.

If the report is truncated in this message, use \`read_research_file\` to read \`${mainFile}\`.

**Output format** (after all tool calls):
{"description": "polished 1.1–2.3, fixed ## headings, deduped 4.1", "files_written": ["${mainFile}"], "interviews_added": 0, "dimensions_addressed": ["polish"]}`;
  } else {
    // Phase 3.4: TSV read-back — inject scoring history
    let historySection = '';
    const readback = getScoringReadback(ticker);
    if (readback) {
      const persistentGapStr = readback.persistentGaps.length > 0
        ? readback.persistentGaps.map(g => `  - ${g.gap} (resolution rate: ${(g.resolutionRate * 100).toFixed(0)}%)`).join('\n')
        : '  (none)';
      historySection = `\n\n### Research History
- Best score so far: ${readback.bestScore}/100
- Successfully resolved gaps: ${readback.resolvedGaps.length > 0 ? readback.resolvedGaps.join(', ') : '(none)'}
- Repeatedly unresolved gaps:
${persistentGapStr}`;
    }

    taskMessage = `## ${ticker} Research Gap-Fill Task (Round ${round}, ${today})

**Current score**: ${gaps.score}/100 (target **≥${PASS_THRESHOLD}/100**, structural≥34 + quality≥51, section 2.5 DCF required)${historySection}

### Priority gaps (ordered by score deficit):
${topGaps}

### Instructions:
- **Compare against report**: the current \`${mainFile}\` full text (or first ${INITIAL_MAX_MAIN_IN_USER_CHARS.toLocaleString()} chars) is **attached at the end of this message**. **Always check before writing**: only fill gaps, **do not repeat** existing paragraphs, tables, cited interviews, or numbers.
- **Full-section rewrite**: prefer \`replace_section\` — output the **full section** (including heading), you can **trim, rewrite, reorganize, merge** old and new content into polished prose; this is NOT append-only. Use \`insert_into_section\` only when truly appending to the section end.
- **Call tools only when needed**: only call tools when the **gap being filled this round** requires it. Example: to fill "People" or CEO quotes, use \`search_data_for_company\` or \`read_project_file\`; to fill financials, use \`ninja_api(earnings_historical)\`. When the report is attached in this message, **do not** call \`read_research_file\` just to compare — only call it if the message was truncated or you need to re-verify. Do not start every round by calling list_company_files, query_companies_db, or search_data_for_company.
1. Based on the **priority gaps**, decide which 1–2 dimensions to fill this round. Missing financials → ninja_api(earnings_historical); missing earnings call → ninja_api(earningstranscript) or fetch_url; missing management quotes → search_data_for_company then read_project_file to extract. **For every interview or earnings call transcript obtained, you MUST use \`write_research_section\` to save the transcript as a standalone file \`transcripts/[source]-[date].md\` (mode=append)** — do not only embed quotes in the main report without saving the file.
2. web_search max 12 calls per round — reserve for gaps that truly need searching.
3. When writing to \`${mainFile}\`: after comparing against the full text, use \`replace_section\` (full section rewrite/edit) as primary, \`insert_into_section\` as secondary; never append to the end of the file.
4. **Source links (required this round)**: every piece of data, table note, regulatory/market statement, interview, or financial citation that is new or rewritten this round **must include a clickable \`https://\` link** (Markdown link or bare URL); **prohibited**: writing only "10-K", "Annual Report", "Research firm" without a URL. Interviews: use original article URL; annual reports: use SEC/IR document link; downloaded transcripts: link to \`transcripts/filename\`.
5. Geographic/business segments must cite annual report or earnings call source (with link); each subsection must have ≥5 direct management quotes (in quotes + source + date + interview/transcript **URL**).
6. After completion, output JSON summary (see format below)${investorSection}

**Output format** (after all tool calls are complete):
{"description": "filled X interviews, added geographic revenue from 10-K, ...", "files_written": ["${mainFile}", "transcripts/..."], "interviews_added": number, "dimensions_addressed": [...]}`;
  }

  const userContent = taskMessage + buildMainFileFullAttachment(ticker);

  const MAX_SKILL_CHARS = 14000;
  const MAX_PROGRAM_CHARS = 3500;
  let systemContent: string;
  if (phase === 'polish') {
    systemContent = POLISH_PHASE_SYSTEM;
  } else {
    const skillTrimmed = skillContent.length > MAX_SKILL_CHARS ? skillContent.slice(0, MAX_SKILL_CHARS) + '\n\n...(SKILL truncated — follow section structure and tool descriptions above)' : skillContent;
    const programTrimmed = programPrompt.length > MAX_PROGRAM_CHARS ? programPrompt.slice(0, MAX_PROGRAM_CHARS) + '\n\n...(see SKILL for remainder)' : programPrompt;
    systemContent = `${programTrimmed}\n\n---\n\n## Research SKILL Reference\n\n${skillTrimmed}`;
  }

  // ── CLI agent path (Gemini for gap-fill, Claude for polish) ──
  // MLX local model bypasses CLI and uses the API tool loop below.
  if (USE_CLAUDE_CLI && model !== LOCAL_MODEL) {
    const cliSystemPrompt = systemContent
      .replace(/write_research_section\([^)]*\)/g, 'Write tool')
      .replace(/read_research_file\([^)]*\)/g, 'Read tool')
      .replace(/web_search\([^)]*\)/g, 'WebSearch tool')
      .replace(/fetch_url\([^)]*\)/g, 'WebFetch tool');

    const cliTaskPrompt = `## Working Directory
${PROJECT_ROOT}

## File Paths
- Main report: data/companies/${ticker}/${mainFile}
- Transcripts: data/companies/${ticker}/transcripts/
- Companies DB: data/database/companies_database.json

## Instructions
Write all research to the main report file at \`data/companies/${ticker}/${mainFile}\`.
Use WebSearch to find information, WebFetch to download pages, Write to create/update files.
Use Read to check existing files. Use Bash for API calls (curl) to API Ninjas if NINJA_API_KEY is set.

Create the data/companies/${ticker}/ directory if it doesn't exist.

${userContent}`;

    // Gap-fill → Gemini (grounded search, saves Claude capacity). Polish → Claude.
    if (phase === 'gap_fill') {
      console.log('  [gemini-agent] Launching Gemini agent for gap-fill...');
      const { result, costUsd } = await runGeminiAgent(
        cliSystemPrompt,
        cliTaskPrompt,
        { model: MODELS.GEMINI, ...(softTimeoutMs ? { softTimeoutMs } : {}) },
      );
      if (costTracker) costTracker.totalCostUsd += costUsd;
      console.log(`  [gemini-agent] Done (cost: ~$${costUsd.toFixed(2)})`);
      return result;
    } else {
      console.log('  [claude-agent] Launching Claude agent for polish...');
      const { result, costUsd } = await runClaudeAgent(
        cliSystemPrompt,
        cliTaskPrompt,
        { model, ...(softTimeoutMs ? { softTimeoutMs } : {}) },
      );
      if (costTracker) costTracker.totalCostUsd += costUsd;
      console.log(`  [claude-agent] Done (cost: $${costUsd.toFixed(2)})`);
      return result;
    }
  }

  // ── API-based tool loop (Anthropic SDK / OpenRouter) ──
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: userContent },
  ];

  let searchCalls = 0;
  const MAX_SEARCH = phase === 'gap_fill' ? 12 : 0;
  const MAX_TOOL_ROUNDS = 25;
  let finalResponse = '';

  for (let toolRound = 0; toolRound < MAX_TOOL_ROUNDS; toolRound++) {
    const response = await chat(systemContent, messages, { model, backend: model === LOCAL_MODEL ? 'mlx' : undefined, tools, maxTokens: 16384 });

    if (costTracker) costTracker.totalCostUsd += response.usage.costUsd;

    if (response.content) finalResponse = response.content;
    if (response.toolUses.length === 0) break;

    // Push assistant message with content blocks (text + tool_use)
    const assistantContent: Anthropic.ContentBlockParam[] = [];
    if (response.content) {
      assistantContent.push({ type: 'text', text: response.content });
    }
    for (const tu of response.toolUses) {
      assistantContent.push({ type: 'tool_use', id: tu.id, name: tu.name, input: tu.input });
    }
    messages.push({ role: 'assistant', content: assistantContent });

    // Process all tool calls and batch results into one user message
    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const tc of response.toolUses) {
      const args = tc.input;
      let result: string;

      switch (tc.name) {
        case 'web_search': {
          const query = String(args.query ?? '');
          if (searchCalls >= MAX_SEARCH) {
            result = JSON.stringify({ error: `Search budget exhausted (max ${MAX_SEARCH} calls)` });
          } else {
            // Phase 3.3: Search dedup — check if similar query already tried
            const cached = findSimilarSearch(ticker, query);
            if (cached) {
              console.log(`  [search-dedup] Reusing cached result for "${query.slice(0, 50)}..."`);
              result = JSON.stringify({ query: cached.query, results: cached.topResults, cached: true });
            } else {
              searchCalls++;
              console.log(`  [search ${searchCalls}/${MAX_SEARCH}] ${query.slice(0, 60)}...`);
              result = await webSearch(query, Number(args.count ?? 5));
              // Log the search for future dedup
              try {
                const parsed = JSON.parse(result);
                appendSearchEntry({
                  ticker,
                  query,
                  timestamp: new Date().toISOString(),
                  resultCount: parsed.results?.length ?? 0,
                  topResults: (parsed.results ?? []).slice(0, 5).map((r: any) => ({ title: r.title ?? '', url: r.url ?? '' })),
                });
              } catch {}
            }
          }
          break;
        }
        case 'fetch_url':
          console.log(`  [fetch] ${String(args.url ?? '').slice(0, 80)}...`);
          result = await fetchUrl(String(args.url ?? ''));
          break;
        case 'write_research_section':
          console.log(`  [write] ${args.ticker}/${args.filename} (${String(args.content ?? '').length} chars)${args.mode === 'replace_section' || args.mode === 'insert_into_section' ? ` → ${args.mode} ${args.section_anchor}` : ''}`);
          result = writeResearchSection(
            String(args.ticker ?? ticker),
            String(args.filename ?? ''),
            String(args.content ?? ''),
            (args.mode as 'append' | 'overwrite' | 'insert_into_section' | 'replace_section') ?? 'append',
            args.section_anchor ? String(args.section_anchor) : undefined
          );
          break;
        case 'read_research_file':
          result = readResearchFile(String(args.ticker ?? ticker), String(args.filename ?? ''));
          break;
        case 'list_company_files':
          console.log(`  [list] ${args.ticker ?? ticker}`);
          result = listCompanyFiles(String(args.ticker ?? ticker));
          break;
        case 'query_companies_db':
          console.log(`  [db] ${args.ticker ?? ticker}`);
          result = queryCompaniesDb(String(args.ticker ?? ticker));
          break;
        case 'ninja_api':
          console.log(`  [ninja] ${args.action} ${args.ticker ?? ''}`);
          result = await callNinjaApi(String(args.action ?? ''), args);
          break;
        case 'search_data_for_company':
          console.log(`  [search_data] ${args.ticker ?? ticker}`);
          result = searchDataForCompany(String(args.ticker ?? ticker));
          break;
        case 'read_project_file':
          console.log(`  [read_project] ${String(args.path ?? '').slice(0, 60)}...`);
          result = readProjectFile(String(args.path ?? ''));
          break;
        case 'query_knowledge_base':
          console.log(`  [knowledge] query=${String(args.query ?? '')} company=${String(args.company ?? '')}`);
          result = queryKnowledgeBaseJson({
            query: args.query ? String(args.query) : undefined,
            company: args.company ? String(args.company) : undefined,
            person: args.person ? String(args.person) : undefined,
            archetype: args.archetype ? String(args.archetype) : undefined,
            industry: args.industry ? String(args.industry) : undefined,
            tag: args.tag ? String(args.tag) : undefined,
            limit: args.limit ? Number(args.limit) : undefined,
          });
          break;
        default:
          result = JSON.stringify({ error: `Unknown tool: ${tc.name}` });
      }

      const maxToolChars =
        tc.name === 'read_research_file' ? READ_RESEARCH_FILE_MAX_CHARS + 4096 : 12000;
      const contentToPush =
        result.length > maxToolChars
          ? result.slice(0, maxToolChars) + '\n\n...(content truncated, showing first ' + maxToolChars + ' chars)'
          : result;
      toolResults.push({ type: 'tool_result', tool_use_id: tc.id, content: contentToPush });
    }

    // Batch all tool results into one user message
    messages.push({ role: 'user', content: toolResults });
  }

  return finalResponse || '(no response)';
}

// ── Main loop ──

async function main() {
  const args = parseArgs();
  const ticker = (args.ticker ?? args.t ?? '').toUpperCase();
  if (!ticker) {
    console.error('Usage: npx tsx src/initial-max-runner.ts --ticker NVDA [--max-rounds 30] [--model MODEL] [--score-only] [--skip-polish] [--tag label]');
    process.exit(1);
  }

  const maxRounds = parseInt(args['max-rounds'] ?? String(DEFAULT_MAX_ROUNDS), 10);
  const scoreOnly = args['score-only'] === 'true';
  const skipPolish = args['skip-polish'] === 'true';
  const extended = args['extended'] === 'true';
  const extractKnowledgeFlag = args['extract-knowledge'] === 'true';
  const model = args.model ?? DEFAULT_MODEL;
  const scoringModel = args['scoring-model'] ?? MODELS.CLAUDE;
  const investorNote = args.why ?? args.note ?? '';
  const resetGapHistory = args['reset-gap-history'] === 'true' || /\bretry\b/i.test(investorNote);
  const tag = args.tag ?? new Date().toISOString().slice(5, 10).replace('-', '');
  const maxCost = parseFloat(args['max-cost'] ?? String(DEFAULT_MAX_COST_USD));
  const costTracker = { totalCostUsd: 0 };

  console.log('╔══════════════════════════════════════╗');
  console.log('║       Initial MAX Runner             ║');
  console.log('╚══════════════════════════════════════╝');
  console.log(`Ticker:     ${ticker}`);
  console.log(`Max rounds: ${maxRounds}`);
  console.log(`Model:      ${model}`);
  console.log(`Score only: ${scoreOnly}`);
  console.log(`Extended:   ${extended}`);
  console.log(`Max cost:   $${maxCost}`);
  if (investorNote) {
    console.log(`Why:        ${investorNote}`);
  }
  if (resetGapHistory) {
    console.log('Gap caps:   ignoring historical gap attempts for this retry run');
  }
  console.log(`Tag:        initial-max-${ticker}-${tag}`);
  console.log();

  // Setup TSV tracking
  const resultsDir = path.join(PROJECT_ROOT, 'results');
  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });
  const tsvPath = path.join(resultsDir, `initial-max-${ticker.toLowerCase()}-${tag}.tsv`);
  if (!fs.existsSync(tsvPath)) {
    fs.writeFileSync(tsvPath, 'commit\tscore\tstatus\tdescription\n');
  }

  // Load SKILL and program prompt
  const skillPath = path.join(PROJECT_ROOT, 'skills', 'initial-max', 'SKILL.md');
  const programPath = path.join(__dirname, 'program-initial-max.md');
  if (!fs.existsSync(skillPath)) {
    console.error(`SKILL not found: ${skillPath}`);
    process.exit(1);
  }
  const skillContent = fs.readFileSync(skillPath, 'utf-8');
  const programPrompt = fs.existsSync(programPath) ? fs.readFileSync(programPath, 'utf-8') : '';

  // Baseline score
  console.log('\n═══ Baseline Scoring ═══');
  const { score: baselineScore, gaps: baselineGaps } = await scoreCompanyResearch(ticker, 0, scoringModel);
  costTracker.totalCostUsd += baselineScore.scoringCostUsd ?? 0;
  const baselineResult: RoundResult = {
    round: 0,
    commit: gitShortHash(),
    score: baselineScore.total,
    status: 'baseline',
    description: `baseline score ${baselineScore.total}/100`,
    timestamp: new Date().toISOString(),
  };
  appendTsv(tsvPath, baselineResult);

  if (scoreOnly) {
    console.log(`\nScore-only mode. Final score: ${baselineScore.total}/100`);
    cleanupTickerScoreAndGapsFiles(ticker);
    return;
  }

  if (baselineScore.passThreshold && !extended) {
    console.log(`\n✓ Already at ${baselineScore.total}/100 — threshold met. No further research needed.`);
    cleanupTickerScoreAndGapsFiles(ticker);
    return;
  } else if (baselineScore.passThreshold && extended) {
    console.log(`\n✓ Core score ${baselineScore.total}/100 — threshold met. Skipping core rounds, proceeding to extended analysis.`);
  }

  // Main loop
  const history: RoundResult[] = [baselineResult];
  let prevScore = baselineScore.total;
  let bestScore = baselineScore.total;
  let plateauCount = 0;
  // Gap attempts now tracked persistently via gap-tracker.ts (cross-company learning)

  for (let round = 1; round <= maxRounds && !baselineScore.passThreshold; round++) {
    console.log(`\n═══ Round ${round}/${maxRounds} (current: ${prevScore}/100) ═══`);
    const roundStart = Date.now();
    const roundStartCost = costTracker.totalCostUsd;
    const roundScoreBefore = prevScore;

    try {
      // Get latest gaps (from previous round)
      const gapsPath = path.join(PROJECT_ROOT, 'data', 'companies', ticker, `initial_max_gaps_${round - 1}.json`);
      let gaps: InitialMaxGaps = baselineGaps;
      if (fs.existsSync(gapsPath)) {
        gaps = JSON.parse(fs.readFileSync(gapsPath, 'utf-8'));
      }
      const mainFilePathForRound = path.join(PROJECT_ROOT, 'data', 'companies', ticker, `${ticker}_Initial_MAX.md`);

      // Filter out gap items using persistent gap-tracker (adaptive + global retirement).
      // Do not apply historical retirement before a real report exists: retry tasks
      // need a clean chance to create the base report even if older attempts failed.
      const hasMainFileForRound = fs.existsSync(mainFilePathForRound)
        && fs.statSync(mainFilePathForRound).size > 1000;
      if (resetGapHistory) {
        console.log('[round-cap] Skipping historical gap retirement — retry run');
      } else if (prevScore < 10 && !hasMainFileForRound) {
        console.log('[round-cap] Skipping historical gap retirement — no substantive report exists yet');
      } else {
        // Load all gap data once to avoid O(N) file reads per gap
        const gapData = loadGapAttempts(ticker);
        const preFilterCount = gaps.gaps.length;
        let globalRetiredCount = 0;
        gaps.gaps = gaps.gaps.filter(g => {
          const key = normalizeGapKey(g.dimension, g.item);
          // Global retirement: universally unsolvable across tickers
          if (isGloballyRetired(gapData, key)) {
            globalRetiredCount++;
            return false;
          }
          // Per-ticker adaptive retirement
          const attempts = countAttemptsFromLoaded(gapData, key);
          const maxAttempts = getMaxAttemptsFromLoaded(gapData, key);
          return attempts < maxAttempts;
        });
        const retired = preFilterCount - gaps.gaps.length;
        if (globalRetiredCount > 0) console.log(`[global-retire] Retired ${globalRetiredCount} gap(s) — universally unsolvable across tickers`);
        if (retired > globalRetiredCount) console.log(`[round-cap] Retired ${retired - globalRetiredCount} gap(s) via adaptive threshold`);
      }

      if (gaps.gaps.length === 0) {
        console.log('[round-cap] All remaining gaps have been retired — stopping core loop');
        break;
      }

      // Micro-round mode: after Round 2, if cumulative improvement < threshold, limit gaps
      const cumulativeImprovement = prevScore - baselineScore.total;
      const isMicroRound = round > 2 && cumulativeImprovement < MICRO_ROUND_THRESHOLD;
      if (isMicroRound) {
        gaps.gaps = gaps.gaps.slice(0, MICRO_ROUND_GAP_COUNT);
        console.log(`[micro-round] Targeting top ${MICRO_ROUND_GAP_COUNT} gap(s) only (cumulative +${cumulativeImprovement}pts < ${MICRO_ROUND_THRESHOLD})`);
      }

      // Snapshot main file before agent modifies it (for rollback protection)
      const bakPath = mainFilePathForRound + '.bak';
      const filesBeforeRound = countCompanyResearchFiles(ticker);
      if (fs.existsSync(mainFilePathForRound)) {
        fs.copyFileSync(mainFilePathForRound, bakPath);
      }

      console.log(`Running gap-fill agent... (cost so far: $${costTracker.totalCostUsd.toFixed(2)})`);
      const prevGapKeys = new Set(gaps.gaps.map(g => normalizeGapKey(g.dimension, g.item)));
      const agentResponse = await runGapFillAgent(ticker, gaps, skillContent, programPrompt, round, model, investorNote, 'gap_fill', costTracker);

      // Parse agent summary
      let description = `round ${round} gap-fill`;
      try {
        const jsonMatch = agentResponse.match(/\{[\s\S]*"description"[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          description = parsed.description ?? description;
        }
      } catch {}
      console.log(`Agent summary: ${description}`);

      // Score new state
      console.log('Scoring...');
      let { score: newScore, gaps: newGaps } = await scoreCompanyResearch(ticker, round, scoringModel);
      costTracker.totalCostUsd += newScore.scoringCostUsd ?? 0;
      let delta = newScore.total - bestScore;

      // Rollback protection: if score regressed, check for scorer partial failure
      if (newScore.total < bestScore) {
        if (newScore.scorerPartialFailure) {
          console.log(`[rollback] Score regressed ${bestScore}→${newScore.total} with scorer_partial_failure — re-scoring once...`);
          const rescore = await scoreCompanyResearch(ticker, round, scoringModel);
          costTracker.totalCostUsd += rescore.score.scoringCostUsd ?? 0;
          if (rescore.score.total >= bestScore) {
            newScore = rescore.score;
            newGaps = rescore.gaps;
            delta = newScore.total - bestScore;
            console.log(`[rollback] Re-score OK: ${newScore.total}/100`);
          } else {
            // Still regressed after re-score — rollback
            console.log(`[rollback] Re-score still regressed (${rescore.score.total}) — restoring from backup`);
            if (fs.existsSync(bakPath)) fs.copyFileSync(bakPath, mainFilePathForRound);
            description = `[rollback] ${description}`;
          }
        } else {
          // Score regressed without partial failure — rollback
          console.log(`[rollback] Score regressed ${bestScore}→${newScore.total} — restoring from backup`);
          if (fs.existsSync(bakPath)) fs.copyFileSync(bakPath, mainFilePathForRound);
          description = `[rollback] ${description}`;
        }
      }
      // Only commit if we kept the changes (not rolled back)
      const wasRolledBack = description.startsWith('[rollback]');

      // F8: After rollback, restore newScore so that delta, TSV history, plateau detection,
      // and prevScore for the next round all reflect the pre-rollback (best) score.
      if (wasRolledBack) {
        newScore = { ...newScore, total: bestScore };
        delta = 0;
      }

      console.log(`Score: ${newScore.total}/100 (${delta >= 0 ? '+' : ''}${delta} from best ${bestScore})`);

      // Clean up backup
      if (fs.existsSync(bakPath)) fs.unlinkSync(bakPath);

      // Persist gap attempts to gap-tracker (cross-company learning)
      // Skip when rolled back — scores reflect pre-rollback state and would record misleading data
      if (!wasRolledBack) {
        const newGapKeys = new Set(newGaps.gaps.map(g => normalizeGapKey(g.dimension, g.item)));
        for (const key of prevGapKeys) {
          const resolved = !newGapKeys.has(key);
          appendGapAttempt({
            ticker,
            round,
            timestamp: new Date().toISOString(),
            gapKey: key,
            scoreBefore: prevScore,
            scoreAfter: newScore.total,
            resolved,
            costUsd: costTracker.totalCostUsd - roundStartCost,
            remedy: description.slice(0, 200),
          });
          if (!resolved) {
            const attempts = countAttempts(ticker, key);
            const maxAttempts = getMaxAttemptsForGap(key);
            if (attempts >= maxAttempts) {
              console.log(`[round-cap] Retiring gap: ${key} after ${attempts} attempts (max: ${maxAttempts})`);
            }
          }
        }
      }
      const commitMsg = wasRolledBack
        ? `initial-max r${round}: rollback — score stayed ${bestScore}/100`
        : `initial-max r${round}: ${description.slice(0, 60)} — score ${newScore.total}/100`;
      const commitHash = wasRolledBack ? gitShortHash() : gitCommit(commitMsg);

      const status: RoundResult['status'] = delta > 0 ? 'keep' : 'no_improvement';
      const result: RoundResult = {
        round, commit: commitHash, score: newScore.total, status,
        description, timestamp: new Date().toISOString(),
        costAtStart: roundStartCost,
      };
      history.push(result);
      appendTsv(tsvPath, result);

      if (newScore.total > bestScore) {
        console.log(`✓ IMPROVED by +${delta} (new best: ${newScore.total})`);
        bestScore = newScore.total;
        plateauCount = 0;
      } else {
        console.log(`→ No improvement (plateau count: ${plateauCount + 1}/${PLATEAU_ROUNDS})`);
        plateauCount++;
      }

      const elapsedSec = Math.round((Date.now() - roundStart) / 1000);
      console.log(`Round ${round} done in ${elapsedSec}s`);
      const filesAfterRound = countCompanyResearchFiles(ticker);

      // Trace entry for observability
      appendTrace({
        ts: new Date().toISOString(),
        ticker,
        phase: 'gap-fill',
        round,
        model,
        durationSec: elapsedSec,
        inputTokens: 0,
        outputTokens: 0,
        costUsd: costTracker.totalCostUsd - roundStartCost,
        filesWritten: Math.max(0, filesAfterRound - filesBeforeRound),
        scoreChange: `${delta >= 0 ? '+' : ''}${delta}`,
        agentExitCode: 0,
        status: wasRolledBack ? 'blocked' : 'completed',
        scorerStatus: newScore.scorerStatus,
        structural: newScore.structural,
        quality: newScore.quality,
        scoreBefore: roundScoreBefore,
        scoreAfter: newScore.total,
        bestScore,
        gapsRemaining: newGaps.gaps.length,
        metadata: {
          rolledBack: wasRolledBack,
          description,
          plateauCount,
        },
      });

      prevScore = newScore.total;

      // Stop conditions
      if (newScore.passThreshold) {
        console.log(`\n✓ TARGET REACHED: ${newScore.total}/100 ≥ ${PASS_THRESHOLD}`);
        break;
      }
      if (plateauCount >= PLATEAU_ROUNDS) {
        console.log(`\n⚠ PLATEAU DETECTED: ${PLATEAU_ROUNDS} consecutive rounds with no improvement. Stopping.`);
        break;
      }
      if (costTracker.totalCostUsd >= maxCost) {
        console.log(`\n⚠ COST BUDGET REACHED: $${costTracker.totalCostUsd.toFixed(2)} >= $${maxCost}. Stopping.`);
        break;
      }

      // Cost-aware circuit breaker: if cost > $50 and marginal cost/point over last 3 rounds > $3 → stop
      if (costTracker.totalCostUsd > 50 && history.length >= 4) {
        const last3 = history.slice(-3);
        const scoreGain = newScore.total - (last3[0]?.score ?? newScore.total);
        const windowStartCost = last3[0]?.costAtStart ?? 0;
        const marginalCost = costTracker.totalCostUsd - windowStartCost;
        if (scoreGain > 0 && marginalCost / scoreGain > 3) {
          console.log(`\n⚠ COST CIRCUIT BREAKER: $${(marginalCost / scoreGain).toFixed(1)}/point > $3/point threshold (marginal $${marginalCost.toFixed(2)} for +${scoreGain}pts). Stopping.`);
          break;
        }
      }

    } catch (err: any) {
      console.error(`Round ${round} CRASH: ${err.message}`);
      appendTrace({
        ts: new Date().toISOString(),
        ticker,
        phase: 'gap-fill',
        round,
        model,
        durationSec: Math.round((Date.now() - roundStart) / 1000),
        inputTokens: 0,
        outputTokens: 0,
        costUsd: costTracker.totalCostUsd - roundStartCost,
        filesWritten: 0,
        scoreChange: 'crash',
        agentExitCode: 1,
        status: 'failed',
        scoreBefore: prevScore,
        bestScore,
        error: err.message,
      });
      const result: RoundResult = {
        round, commit: gitShortHash(), score: prevScore, status: 'crash',
        description: err.message.slice(0, 100), timestamp: new Date().toISOString(),
      };
      history.push(result);
      appendTsv(tsvPath, result);
    }
  }

  const polishRoundId = maxRounds + 1;
  const mainFilePath = path.join(PROJECT_ROOT, 'data', 'companies', ticker, `${ticker}_Initial_MAX.md`);
  const ranAtLeastOneResearchRound = history.some((h) => h.round >= 1);

  if (!skipPolish && fs.existsSync(mainFilePath) && ranAtLeastOneResearchRound) {
    console.log('\n═══ Polish pass (prose flow / formatting, no new research) ═══');
    try {
      // Snapshot before polish for rollback protection
      const polishBakPath = mainFilePath + '.polish-bak';
      fs.copyFileSync(mainFilePath, polishBakPath);

      const polishGaps: InitialMaxGaps = { round: polishRoundId, score: prevScore, gaps: [] };
      const polishResp = await runGapFillAgent(
        ticker,
        polishGaps,
        skillContent,
        programPrompt,
        polishRoundId,
        MODELS.CLAUDE,
        investorNote,
        'polish',
        costTracker,
        45 * 60 * 1000,  // 45min for polish on large reports
      );
      let polishDesc = 'polish pass';
      try {
        const jsonMatch = polishResp.match(/\{[\s\S]*"description"[\s\S]*\}/);
        if (jsonMatch) polishDesc = JSON.parse(jsonMatch[0]).description ?? polishDesc;
      } catch {}
      console.log(`Polish summary: ${polishDesc}`);
      console.log('Scoring after polish...');
      const { score: afterPolish } = await scoreCompanyResearch(ticker, polishRoundId, scoringModel);
      costTracker.totalCostUsd += afterPolish.scoringCostUsd ?? 0;
      console.log(`Score after polish: ${afterPolish.total}/100`);

      // Rollback if polish degraded the score
      if (afterPolish.total < bestScore) {
        console.log(`[rollback] Polish degraded score ${bestScore}→${afterPolish.total} — restoring from backup`);
        fs.copyFileSync(polishBakPath, mainFilePath);
        polishDesc = `[rollback] ${polishDesc}`;
        history.push({
          round: polishRoundId,
          commit: gitShortHash(),
          score: bestScore,
          status: 'no_improvement',
          description: polishDesc,
          timestamp: new Date().toISOString(),
        });
      } else {
        const commitHash = gitCommit(`initial-max polish: ${polishDesc.slice(0, 55)} — score ${afterPolish.total}/100`);
        history.push({
          round: polishRoundId,
          commit: commitHash,
          score: afterPolish.total,
          status: 'keep',
          description: polishDesc,
          timestamp: new Date().toISOString(),
        });
        if (afterPolish.total > bestScore) bestScore = afterPolish.total;
        prevScore = afterPolish.total;
      }
      appendTsv(tsvPath, history[history.length - 1]!);

      // Clean up polish backup
      if (fs.existsSync(polishBakPath)) fs.unlinkSync(polishBakPath);
    } catch (err: any) {
      console.error(`Polish pass CRASH: ${err.message}`);
      const crashResult: RoundResult = {
        round: polishRoundId,
        commit: gitShortHash(),
        score: prevScore,
        status: 'crash',
        description: `polish: ${err.message.slice(0, 80)}`,
        timestamp: new Date().toISOString(),
      };
      history.push(crashResult);
      appendTsv(tsvPath, crashResult);
    }
  } else if (skipPolish && ranAtLeastOneResearchRound) {
    console.log('\n(Skipping polish round: --skip-polish)');
  } else if (!skipPolish && ranAtLeastOneResearchRound && !fs.existsSync(mainFilePath)) {
    console.log('\n(Skipping polish round: main report file does not exist)');
  }

  // ── Adversarial contrarian phase ──
  async function runContrarianPhase(tk: string, mdl: string, ct: { totalCostUsd: number }): Promise<void> {
    console.log('\n── Adversarial Contrarian: steelman bull + bear separately ──');
    const mainPath = path.join(PROJECT_ROOT, 'data', 'companies', tk, `${tk}_Initial_MAX.md`);
    const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf-8').slice(0, 50000) : '';

    // Snapshot 8.3 and 8.4 before contrarian rewrites 8.1/8.2
    const preLines = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf-8').split(/\r?\n/) : [];
    const snap83Range = findSectionRange(preLines, '8.3');
    const snap84Range = findSectionRange(preLines, '8.4');
    const snap83 = snap83Range ? preLines.slice(snap83Range[0], snap83Range[1]).join('\n') : null;
    const snap84 = snap84Range ? preLines.slice(snap84Range[0], snap84Range[1]).join('\n') : null;

    const bullPrompt = `You are an equity BULL analyst. Make the STRONGEST possible investment case for ${tk}.

## Rules
- At least 5 bull arguments, each with specific data + source URL
- Assume your audience is deeply skeptical and short the stock
- Every claim must be falsifiable with specific metrics
- Use 2024-2026 data only
- Output: pure Markdown for section "## 8.1 Bull Case"

## Current report context (abbreviated):
${mainContent.slice(0, 20000)}

Write section 8.1 now. Output ONLY the Markdown for that section (including the heading). Write it to: data/companies/${tk}/${tk}_Initial_MAX.md using replace_section mode with section_anchor 8.1`;

    const bearPrompt = `You are a SHORT SELLER analyst. Make the STRONGEST possible case AGAINST ${tk}.

## Rules
- At least 5 bear arguments, each with specific data + source URL
- Assume your audience wants to buy and you must convince them NOT to
- Every claim must be falsifiable with specific metrics
- Use 2024-2026 data only
- Output: pure Markdown for section "## 8.2 Bear Case"

## Current report context (abbreviated):
${mainContent.slice(0, 20000)}

Write section 8.2 now. Output ONLY the Markdown for that section (including the heading). Write it to: data/companies/${tk}/${tk}_Initial_MAX.md using replace_section mode with section_anchor 8.2`;

    try {
      // Call 1: Steelman Bull
      console.log('  [contrarian] Steelman Bull Case...');
      const contrarianTools = ['WebSearch', 'WebFetch', 'Read', 'Write'];
      const bullResult = await runClaudeAgent(
        'You are a conviction equity bull analyst. Write the strongest possible investment case.',
        bullPrompt,
        { model: mdl, maxBudgetUsd: 2, allowedTools: contrarianTools },
      );
      ct.totalCostUsd += bullResult.costUsd;
      console.log(`  [contrarian] Bull done ($${bullResult.costUsd.toFixed(2)})`);

      // Call 2: Steelman Bear
      console.log('  [contrarian] Steelman Bear Case...');
      const bearResult = await runClaudeAgent(
        'You are a conviction short seller. Write the strongest possible case against this stock.',
        bearPrompt,
        { model: mdl, maxBudgetUsd: 2, allowedTools: contrarianTools },
      );
      ct.totalCostUsd += bearResult.costUsd;
      console.log(`  [contrarian] Bear done ($${bearResult.costUsd.toFixed(2)})`);

      // Restore 8.3/8.4 if damaged by contrarian agents
      if (snap83 || snap84) {
        const postContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf-8') : '';
        const postLines = postContent.split(/\r?\n/);
        const post83Range = findSectionRange(postLines, '8.3');
        const post84Range = findSectionRange(postLines, '8.4');
        const post83 = post83Range ? postLines.slice(post83Range[0], post83Range[1]).join('\n') : null;
        const post84 = post84Range ? postLines.slice(post84Range[0], post84Range[1]).join('\n') : null;

        let restored = false;
        if (snap83 && post83 !== snap83) {
          if (post83Range) {
            replaceSection(mainPath, '8.3', snap83);
          } else {
            // Section was deleted — append it back
            fs.writeFileSync(mainPath, fs.readFileSync(mainPath, 'utf-8') + '\n\n' + snap83);
          }
          console.log('  [contrarian] Restored section 8.3 (was damaged)');
          restored = true;
        }
        if (snap84 && post84 !== snap84) {
          if (findSectionRange(fs.readFileSync(mainPath, 'utf-8').split(/\r?\n/), '8.4')) {
            replaceSection(mainPath, '8.4', snap84);
          } else {
            fs.writeFileSync(mainPath, fs.readFileSync(mainPath, 'utf-8') + '\n\n' + snap84);
          }
          console.log('  [contrarian] Restored section 8.4 (was damaged)');
          restored = true;
        }
        if (!restored) {
          console.log('  [contrarian] Sections 8.3/8.4 intact — no restoration needed');
        }
      }

      gitCommit(`initial-max contrarian: adversarial bull+bear for ${tk}`);
    } catch (err: any) {
      console.error(`  [contrarian] Error: ${err.message.slice(0, 100)}`);
    }
  }

  // ── Extended pass (geopolitical, sustainability, contrarian) ──
  if (extended && fs.existsSync(mainFilePath)) {
    console.log('\n═══ Extended Analysis Pass (Geopolitical / ESG / Bull vs Bear) ═══');
    const extMaxRounds = 5;
    for (let extRound = 1; extRound <= extMaxRounds; extRound++) {
      if (costTracker.totalCostUsd >= maxCost) {
        console.log(`⚠ COST BUDGET REACHED during extended pass: $${costTracker.totalCostUsd.toFixed(2)}`);
        break;
      }
      try {
        console.log(`\nExtended round ${extRound}/${extMaxRounds} (cost: $${costTracker.totalCostUsd.toFixed(2)})`);
        const extScore = await scoreExtendedResearch(ticker, 100 + extRound, scoringModel);
        costTracker.totalCostUsd += extScore.scoringCostUsd ?? 0;
        console.log(`Extended score: ${extScore.extendedTotal}/45 (geo:${extScore.geopolitical?.score ?? 0} sus:${extScore.sustainability?.score ?? 0} con:${extScore.contrarian?.score ?? 0})`);

        if (extScore.extendedTotal >= 35) {
          console.log('✓ Extended dimensions sufficient.');
          break;
        }

        // Build gaps for extended dimensions
        const extGaps: InitialMaxGaps = {
          round: 100 + extRound,
          score: extScore.extendedTotal,
          gaps: [
            ...(extScore.geopolitical && extScore.geopolitical.score < 12 ? extScore.geopolitical.gaps.map(g => ({ dimension: 'Geopolitical', item: g, current: extScore.geopolitical!.score, target: '15', shortfall: 15 - extScore.geopolitical!.score, priority: 1 })) : []),
            ...(extScore.sustainability && extScore.sustainability.score < 12 ? extScore.sustainability.gaps.map(g => ({ dimension: 'ESG', item: g, current: extScore.sustainability!.score, target: '15', shortfall: 15 - extScore.sustainability!.score, priority: 2 })) : []),
            ...(extScore.contrarian && extScore.contrarian.score < 12 ? extScore.contrarian.gaps.map(g => ({ dimension: 'Bull vs Bear', item: g, current: extScore.contrarian!.score, target: '15', shortfall: 15 - extScore.contrarian!.score, priority: 3 })) : []),
          ],
        };
        if (extGaps.gaps.length === 0) {
          extGaps.gaps.push({ dimension: 'Extended Analysis', item: 'Add geopolitical/ESG/bull-vs-bear analysis', current: extScore.extendedTotal, target: '35+', shortfall: 35 - extScore.extendedTotal, priority: 1 });
        }

        const extResp = await runGapFillAgent(
          ticker, extGaps, '', EXTENDED_PHASE_SYSTEM,
          100 + extRound, model, investorNote, 'gap_fill', costTracker, 35 * 60 * 1000,
        );

        let extDesc = `extended round ${extRound}`;
        try {
          const m = extResp.match(/\{[\s\S]*"description"[\s\S]*\}/);
          if (m) extDesc = JSON.parse(m[0]).description ?? extDesc;
        } catch {}
        console.log(`Extended agent: ${extDesc}`);

        const commitHash = gitCommit(`initial-max ext-r${extRound}: ${extDesc.slice(0, 55)} — ext ${extScore.extendedTotal}/45`);
        history.push({
          round: 100 + extRound, commit: commitHash, score: prevScore,
          status: 'keep', description: `[extended] ${extDesc}`, timestamp: new Date().toISOString(),
        });
        appendTsv(tsvPath, history[history.length - 1]!);
      } catch (err: any) {
        console.error(`Extended round ${extRound} CRASH: ${err.message}`);
        history.push({
          round: 100 + extRound, commit: gitShortHash(), score: prevScore,
          status: 'crash', description: `[extended] ${err.message.slice(0, 80)}`, timestamp: new Date().toISOString(),
        });
        appendTsv(tsvPath, history[history.length - 1]!);
        break;
      }
    }
    // Adversarial contrarian: replace 8.1/8.2 with steelman bull+bear
    if (costTracker.totalCostUsd < maxCost) {
      await runContrarianPhase(ticker, model, costTracker);
    }

    // Final extended score
    const finalExtScore = await scoreExtendedResearch(ticker, 999, scoringModel);
    costTracker.totalCostUsd += finalExtScore.scoringCostUsd ?? 0;
    console.log(`\nFinal extended score: ${finalExtScore.extendedTotal}/45`);
    const commitHash = gitCommit(`initial-max extended-final: score ${finalExtScore.extendedTotal}/45`);
  } else if (!extended) {
    console.log('\n(Extended analysis not enabled — use --extended to activate)');
  }

  // Knowledge extraction (post-pipeline)
  if (extractKnowledgeFlag && fs.existsSync(mainFilePath)) {
    console.log('\n═══ Knowledge Extraction ═══');
    try {
      await extractKnowledge(ticker, false);
      gitCommit(`initial-max knowledge: extract atoms for ${ticker}`);
    } catch (err: any) {
      console.error(`Knowledge extraction failed: ${err.message.slice(0, 100)}`);
    }
  }

  // Final summary
  const finalScore = history[history.length - 1].score;
  const kept = history.filter(r => r.status === 'keep').length;
  const noImprove = history.filter(r => r.status === 'no_improvement').length;
  const crashed = history.filter(r => r.status === 'crash').length;

  console.log('\n╔══════════════════════════════════════╗');
  console.log(`║  Initial MAX Complete: ${ticker.padEnd(6)} ${String(finalScore).padStart(3)}/100     ║`);
  console.log('╚══════════════════════════════════════╝');
  console.log(`Rounds: ${history.length - 1} | Improved: ${kept} | No-improvement: ${noImprove} | Crashed: ${crashed}`);
  console.log(`Score: ${baselineScore.total} → ${finalScore} (+${finalScore - baselineScore.total})`);
  console.log(`Cost:   $${costTracker.totalCostUsd.toFixed(2)}`);
  console.log(`Status: ${finalScore >= PASS_THRESHOLD ? '✓ PASSED' : '✗ NOT YET (more rounds needed)'}`);
  console.log(`Results: ${tsvPath}`);
  cleanupTickerScoreAndGapsFiles(ticker);
  if (!scoreOnly) {
    const tickerDir = path.join(PROJECT_ROOT, 'data', 'companies', ticker);
    if (fs.existsSync(tickerDir)) {
      syncIntelligencePaths([tickerDir]);
    }
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
