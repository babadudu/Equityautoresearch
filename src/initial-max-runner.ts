#!/usr/bin/env node
/**
 * Initial MAX Runner
 *
 * 以「張磊四維框架（環境→生意→組織→人）」為評分基準，對公司研究報告進行
 * 迭代深度補研究，直到品質達標（≥80/100）、plateau（2輪同分）或用完 maxRounds。
 *
 * 核心差異 vs skill-optimizer.ts：
 *  - 研究內容是加法，不做 git reset on discard
 *  - 每輪 gap-fill agent 直接寫檔案（web_search + fetch_url + write_research_section）
 *  - 使用 google/gemini-3.1-pro-preview 模型
 *
 * Usage:
 *   npx tsx src/initial-max-runner.ts --ticker NVDA
 *   npx tsx src/initial-max-runner.ts --ticker FUTU --score-only
 *   npx tsx src/initial-max-runner.ts --ticker GOOG --max-rounds 5 --tag test
 *   npx tsx src/initial-max-runner.ts --ticker MU --model minimax/minimax-m2.7
 *   npx tsx src/initial-max-runner.ts --ticker NVDA --skip-polish   # 略過結束後的順稿整理輪
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import { chat, runClaudeAgent, type ToolUse, type AnthropicTool, type ChatResult } from './llm.js';
import { MODELS, DEFAULT_MAX_COST_USD, estimateCostUsd } from './config.js';
import { scoreCompanyResearch, scoreExtendedResearch, type InitialMaxScore, type InitialMaxGaps, type ExtendedScore } from './initial-max-scorer.js';
import { webSearch, fetchUrl, callNinjaApi, queryCompaniesDb, searchDataForCompany, readProjectFile } from './api-tools.js';
import {
  writeResearchSection, buildMainFileFullAttachment, readResearchFile, listCompanyFiles,
  INITIAL_MAX_MAIN_IN_USER_CHARS, READ_RESEARCH_FILE_MAX_CHARS,
} from './markdown-utils.js';
import { GAP_FILL_TOOLS, POLISH_TOOLS } from './tool-schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_MODEL = MODELS.RESEARCH;
const DEFAULT_MAX_ROUNDS = 20;
const PASS_THRESHOLD = 95;

const POLISH_PHASE_SYSTEM = `# Initial MAX 主檔整理輪

你是投研 Markdown 主檔的**編輯**（非研究員）。你**只有**兩個工具：讀取主檔、寫入主檔。

**絕對禁止**：任何新研究——不可網搜、不可 fetch URL、不可 Ninja API、不可 search_data_for_company、不可 read_project_file。只能依 user 訊息內已附的主檔全文，以及必要時 \`read_research_file\` 補齊截斷部分，做**編輯與重排**。

**目標**：（1）**順稿**：敘事連貫、段落銜接自然；（2）**格式**：# / ## / ### 層級一致，表格合法可讀，列表統一；（3）**去重**：刪除重複段落、重複表格或重複論點；（4）**保留事實**：數字、出處、管理層引言與**既有超連結**原則上保留；可修錯字、標點、明顯語病，**不可捏造新事實或新數字**。**連結**：勿刪除正文中的來源 URL；若某處僅文字「來源：年報」而同段或鄰近已有 URL，可改為 Markdown 連結格式（不新增新 URL）。

**寫入策略**：優先對各小節使用 \`replace_section\`——輸出**整節**順過稿（**含該節標題行**），等於**整節重寫／修正**，而非只在節尾堆字。僅在確有必要時用 \`insert_into_section\`。**禁止 append**。若開頭大段（如 IRR、結論）無法用數字錨點替換、且你已完整掌握全文，可謹慎使用 \`overwrite\` 一次寫回整檔（須零遺漏）。`;

const EXTENDED_PHASE_SYSTEM = `# Initial MAX 延伸分析：地緣政治 / 環境永續 / 正反論辯

你是一位頂尖的跨領域分析師，專長涵蓋地緣政治、環境科學與投資分析。你的任務是對一家公司進行**延伸分析**，補充核心投研報告。

## 你的角色

- 你**不是**在做傳統財務分析（那已完成），而是在補充**政治、環境、正反辯論**三個維度
- 你會收到當前主檔全文（已有四維框架研究）和延伸維度缺口清單
- 你的產出必須**客觀、不偏頗、有數據支撐**——雙方不滿意代表成功

## 不偏頗方法論（CRITICAL）

1. **學術風格**：每個論點用 "According to [source], X. However, [source] argues Y" 格式
2. **數據對照**：每個主張必須附可驗證的數據+出處URL
3. **不下結論**：報告陳述事實與各方立場，不做「我們認為」的判斷
4. **時效性**：優先使用 2024-2026 年的數據，歷史數據用於趨勢分析
5. **多元來源**：每個論點至少引用 2 個不同立場的來源

## 延伸維度結構

### 六、地緣政治分析
- 6.1 地緣政治地位與影響：公司對所在國/地區的戰略重要性（如矽盾理論）
- 6.2 國際關係與供應鏈風險：盟友關係、供應鏈集中度、脫鉤風險
- 6.3 政策/制裁/貿易風險：具體政策（CHIPS Act、出口管制、關稅等）

### 七、環境永續分析
- 7.1 能源與資源消耗：電力、水、土地用量（具體數字+佔比+出處）
- 7.2 環境爭議與ESG：爭議事件、環保團體立場、ESG評級
- 7.3 氣候風險與轉型：碳排路徑、RE100承諾、轉型成本估算

### 八、正反論辯
- 8.1 Bull Case：最強多頭論點（至少 5 個，各有數據支撐）
- 8.2 Bear Case：最強空頭論點（至少 5 個，各有數據支撐）
- 8.3 關鍵爭議與數據對比：雙方核心分歧的並列對照表

## 搜尋預算

每輪最多 8 次 web_search。建議分配：
- 地緣政治：2-3 次（"{TICKER} geopolitical risk", "{COUNTRY} strategic importance")
- 環境永續：2-3 次（"{TICKER} electricity water ESG", "{TICKER} carbon emissions")
- 正反論辯：2 次（"{TICKER} bull case bear case analysis 2025")

## 輸出格式

工具完成後輸出 JSON：
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
    exec('git add -A data/companies/');
    exec(`git commit -m "${message.replace(/"/g, "'")}"`);
    return gitShortHash();
  } catch {
    return gitShortHash();
  }
}

/** 刪除該 ticker 目錄下所有 initial_max_gaps_*.json 與 initial_max_score_*.json（跑完後清理，避免累積）。 */
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

// ── TSV result tracking ──

interface RoundResult {
  round: number;
  commit: string;
  score: number;
  status: 'keep' | 'no_improvement' | 'crash' | 'baseline';
  description: string;
  timestamp: string;
}

function appendTsv(tsvPath: string, r: RoundResult): void {
  const line = [r.commit, r.score.toFixed(1), r.status, r.description.replace(/\t/g, ' ').replace(/\n/g, ' ').slice(0, 200)].join('\t');
  fs.appendFileSync(tsvPath, line + '\n');
}

// ── Tool implementations extracted to api-tools.ts, markdown-utils.ts, tool-schemas.ts ──


// ── Gap-fill mini agent ──

const USE_CLAUDE_CLI = process.env.USE_CLAUDE_CLI === '1';

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
): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);
  const mainFile = `${ticker}_Initial_MAX.md`;
  const tools = phase === 'polish' ? POLISH_TOOLS : GAP_FILL_TOOLS;

  const topGaps = gaps.gaps.slice(0, 5).map((g: (typeof gaps.gaps)[number], i: number) =>
    `${i + 1}. 【${g.dimension}】${g.item}：現況 ${g.current}，目標 ${g.target}，缺 ${g.shortfall} 分`,
  ).join('\n');

  const investorSection = investorNote && investorNote.trim().length > 0
    ? `\n\n### 投資人關注重點（為什麼想看這家公司）\n${investorNote.trim()}`
    : '';

  let taskMessage: string;
  if (phase === 'polish') {
    taskMessage = `## ${ticker} Initial MAX **整理輪**（順稿／格式／去重，${today}）

**背景**：研究迭代已停止。本輪**只做編輯**，不網搜、不 API、不抓新訪談。主檔全文見本訊息末尾。

### 必做
1. **順稿**：段落銜接自然、刪除重複論點與重複表格／列表。
2. **格式**：標題層級一致、表格合法、列表統一、空白行適度。
3. **修正**：錯字、標點、明顯語病；**保留**數字、出處、引言與連結；不新增事實。
4. **寫入**：優先對需整理的小節使用 \`replace_section\`（整節輸出＝**可完全改寫該節**，含標題）。**禁止 append**。

若主檔在訊息內被截斷，用 \`read_research_file\` 讀 \`${mainFile}\`。

**輸出格式**（工具完成後）：
{"description": "polished 1.1–2.3, fixed ## headings, deduped 4.1", "files_written": ["${mainFile}"], "interviews_added": 0, "dimensions_addressed": ["polish"]}`;
  } else {
    taskMessage = `## ${ticker} 研究缺口補充任務（第 ${round} 輪，${today}）

**當前分數**：${gaps.score}/100（目標 **≥95/100**，且各維度達最低分、2.5 DCF 必達）

### 優先缺口（依缺分高低排列）：
${topGaps}

### 任務指示：
- **主檔對照**：本訊息**末尾已附**當前 \`${mainFile}\` 全文（或前 ${INITIAL_MAX_MAIN_IN_USER_CHARS.toLocaleString()} 字元）。**撰寫前務必對照**：只補缺口，**勿重複**既有段落、表格、已引用之訪談與數字。
- **整節修正與重寫**：優先 \`replace_section\`——對該小節輸出**整節**內容（含標題），可**刪冗、改寫、重排、合併**舊文與新補資料成順稿；**不是**只能往節尾插入。僅在確實要附加在節尾時才用 \`insert_into_section\`。
- **工具依需求呼叫，勿每輪固定全叫**：僅在**本輪要補的缺口**需要時才呼叫。例如：要補「人」或 CEO 原話時再 \`search_data_for_company\` 或 \`read_project_file\`；要補財報時再 \`ninja_api(earnings_historical)\`。主檔已附於本訊息時**不必**為了對照而再 \`read_research_file\`；若訊息內主檔被截斷或需二次確認再呼叫。勿每輪一開頭就呼叫 list_company_files、query_companies_db、search_data_for_company。
1. 依**優先缺口**決定本輪補哪 1～2 個維度；缺財報→ninja_api(earnings_historical)；缺法說→ninja_api(earningstranscript) 或 fetch_url；缺管理層原話→可 search_data_for_company 再 read_project_file 摘錄。
2. web_search 最多 5 次，留給真正需要搜尋的缺口。
3. 寫入主檔 \`${mainFile}\` 時：對照文末全文後，以 \`replace_section\`（整節重寫／修正）為主，\`insert_into_section\` 為輔；禁止 append 堆文末。
4. **資料來源連結（本輪必守）**：凡本輪新增／改寫的數據、表格註、監管與市場敘述、訪談與財報引用，**須附可點擊 \`https://\` 連結**（Markdown 連結或裸 URL）；**禁止**只寫「10-K」「年報」「某機構報告」等名稱而無 URL。訪談用原文 URL；年報用 SEC／IR 文件連結；已下載逐字稿可連 \`transcripts/檔名\`。
5. 地理/業務分部須標年報或法說出處（含連結）；每子點至少 5 則管理層原話（引號+出處+日期+訪談／逐字稿 **URL**）。
6. 完成後輸出 JSON summary（見下方格式）${investorSection}

**輸出格式**（在所有工具呼叫完成後）：
{"description": "filled X interviews, added geographic revenue from 10-K, ...", "files_written": ["${mainFile}", "transcripts/..."], "interviews_added": 數字, "dimensions_addressed": [...]}`;
  }

  const userContent = taskMessage + buildMainFileFullAttachment(ticker);

  const MAX_SKILL_CHARS = 14000;
  const MAX_PROGRAM_CHARS = 3500;
  let systemContent: string;
  if (phase === 'polish') {
    systemContent = POLISH_PHASE_SYSTEM;
  } else {
    const skillTrimmed = skillContent.length > MAX_SKILL_CHARS ? skillContent.slice(0, MAX_SKILL_CHARS) + '\n\n...(SKILL 後段省略，依章節結構與工具說明操作)' : skillContent;
    const programTrimmed = programPrompt.length > MAX_PROGRAM_CHARS ? programPrompt.slice(0, MAX_PROGRAM_CHARS) + '\n\n...(其餘見 SKILL)' : programPrompt;
    systemContent = `${programTrimmed}\n\n---\n\n## 研究 SKILL 指引\n\n${skillTrimmed}`;
  }

  // ── Claude CLI agent path ──
  if (USE_CLAUDE_CLI) {
    // Adapt the system prompt for Claude Code: replace custom tool references with
    // instructions to use built-in tools (WebSearch, Write, Read, Bash, WebFetch)
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

    console.log('  [claude-agent] Launching Claude Code agent...');
    const { result, costUsd } = await runClaudeAgent(
      cliSystemPrompt,
      cliTaskPrompt,
      { model, maxBudgetUsd: 5 },
    );
    if (costTracker) costTracker.totalCostUsd += costUsd;
    console.log(`  [claude-agent] Done (cost: $${costUsd.toFixed(2)})`);
    return result;
  }

  // ── API-based tool loop (Anthropic SDK / OpenRouter) ──
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: userContent },
  ];

  let searchCalls = 0;
  const MAX_SEARCH = phase === 'gap_fill' ? 8 : 0;
  const MAX_TOOL_ROUNDS = 20;
  let finalResponse = '';

  for (let toolRound = 0; toolRound < MAX_TOOL_ROUNDS; toolRound++) {
    const response = await chat(systemContent, messages, { model, tools, maxTokens: 16384 });

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
        case 'web_search':
          if (searchCalls >= MAX_SEARCH) {
            result = JSON.stringify({ error: `搜尋預算耗盡（最多${MAX_SEARCH}次）` });
          } else {
            searchCalls++;
            console.log(`  [search ${searchCalls}/${MAX_SEARCH}] ${String(args.query ?? '').slice(0, 60)}...`);
            result = await webSearch(String(args.query ?? ''), Number(args.count ?? 5));
          }
          break;
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
        default:
          result = JSON.stringify({ error: `Unknown tool: ${tc.name}` });
      }

      const maxToolChars =
        tc.name === 'read_research_file' ? READ_RESEARCH_FILE_MAX_CHARS + 4096 : 12000;
      const contentToPush =
        result.length > maxToolChars
          ? result.slice(0, maxToolChars) + '\n\n...(內容已截斷，僅顯示前 ' + maxToolChars + ' 字元)'
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
    console.error('Usage: npx tsx src/initial-max-runner.ts --ticker NVDA [--max-rounds 20] [--model MODEL] [--score-only] [--skip-polish] [--tag label]');
    process.exit(1);
  }

  const maxRounds = parseInt(args['max-rounds'] ?? String(DEFAULT_MAX_ROUNDS), 10);
  const scoreOnly = args['score-only'] === 'true';
  const skipPolish = args['skip-polish'] === 'true';
  const extended = args['extended'] === 'true';
  const model = args.model ?? DEFAULT_MODEL;
  const scoringModel = args['scoring-model'] ?? MODELS.SCORING;
  const investorNote = args.why ?? args.note ?? '';
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

  if (baselineScore.passThreshold) {
    console.log(`\n✓ Already at ${baselineScore.total}/100 — threshold met. No further research needed.`);
    cleanupTickerScoreAndGapsFiles(ticker);
    return;
  }

  // Main loop
  const history: RoundResult[] = [baselineResult];
  let prevScore = baselineScore.total;
  let plateauCount = 0;

  for (let round = 1; round <= maxRounds; round++) {
    console.log(`\n═══ Round ${round}/${maxRounds} (current: ${prevScore}/100) ═══`);
    const roundStart = Date.now();

    try {
      // Get latest gaps (from previous round)
      const gapsPath = path.join(PROJECT_ROOT, 'data', 'companies', ticker, `initial_max_gaps_${round - 1}.json`);
      let gaps: InitialMaxGaps = baselineGaps;
      if (fs.existsSync(gapsPath)) {
        gaps = JSON.parse(fs.readFileSync(gapsPath, 'utf-8'));
      }

      console.log(`Running gap-fill agent... (cost so far: $${costTracker.totalCostUsd.toFixed(2)})`);
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
      const { score: newScore } = await scoreCompanyResearch(ticker, round, scoringModel);
      const delta = newScore.total - prevScore;
      console.log(`Score: ${newScore.total}/100 (${delta >= 0 ? '+' : ''}${delta} from ${prevScore})`);

      // Commit (always — research is additive)
      const commitMsg = `initial-max r${round}: ${description.slice(0, 60)} — score ${newScore.total}/100`;
      const commitHash = gitCommit(commitMsg);

      const status: RoundResult['status'] = delta > 0 ? 'keep' : 'no_improvement';
      const result: RoundResult = {
        round, commit: commitHash, score: newScore.total, status,
        description, timestamp: new Date().toISOString(),
      };
      history.push(result);
      appendTsv(tsvPath, result);

      if (delta > 0) {
        console.log(`✓ IMPROVED by +${delta}`);
        plateauCount = 0;
      } else {
        console.log(`→ No improvement (plateau count: ${plateauCount + 1}/2)`);
        plateauCount++;
      }

      prevScore = newScore.total;

      // Stop conditions
      if (newScore.passThreshold) {
        console.log(`\n✓ TARGET REACHED: ${newScore.total}/100 ≥ ${PASS_THRESHOLD}`);
        break;
      }
      if (plateauCount >= 2) {
        console.log(`\n⚠ PLATEAU DETECTED: 2 consecutive rounds with no improvement. Stopping.`);
        break;
      }
      if (costTracker.totalCostUsd >= maxCost) {
        console.log(`\n⚠ COST BUDGET REACHED: $${costTracker.totalCostUsd.toFixed(2)} >= $${maxCost}. Stopping.`);
        break;
      }

      const elapsed = ((Date.now() - roundStart) / 1000).toFixed(1);
      console.log(`Round ${round} done in ${elapsed}s`);

    } catch (err: any) {
      console.error(`Round ${round} CRASH: ${err.message}`);
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
    console.log('\n═══ Polish pass（主檔順稿／格式整理，無新研究）═══');
    try {
      const polishGaps: InitialMaxGaps = { round: polishRoundId, score: prevScore, gaps: [] };
      const polishResp = await runGapFillAgent(
        ticker,
        polishGaps,
        skillContent,
        programPrompt,
        polishRoundId,
        MODELS.SCORING,
        investorNote,
        'polish',
        costTracker,
      );
      let polishDesc = 'polish pass';
      try {
        const jsonMatch = polishResp.match(/\{[\s\S]*"description"[\s\S]*\}/);
        if (jsonMatch) polishDesc = JSON.parse(jsonMatch[0]).description ?? polishDesc;
      } catch {}
      console.log(`Polish summary: ${polishDesc}`);
      console.log('Scoring after polish...');
      const { score: afterPolish } = await scoreCompanyResearch(ticker, polishRoundId, scoringModel);
      console.log(`Score after polish: ${afterPolish.total}/100`);
      const commitHash = gitCommit(`initial-max polish: ${polishDesc.slice(0, 55)} — score ${afterPolish.total}/100`);
      history.push({
        round: polishRoundId,
        commit: commitHash,
        score: afterPolish.total,
        status: 'keep',
        description: polishDesc,
        timestamp: new Date().toISOString(),
      });
      appendTsv(tsvPath, history[history.length - 1]!);
      prevScore = afterPolish.total;
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
    console.log('\n（略過整理輪：--skip-polish）');
  } else if (!skipPolish && ranAtLeastOneResearchRound && !fs.existsSync(mainFilePath)) {
    console.log('\n（略過整理輪：主檔不存在）');
  }

  // ── Extended pass (geopolitical, sustainability, contrarian) ──
  if (extended && fs.existsSync(mainFilePath) && ranAtLeastOneResearchRound) {
    console.log('\n═══ Extended Analysis Pass（地緣政治 / 環境永續 / 正反論辯）═══');
    const extMaxRounds = 5;
    for (let extRound = 1; extRound <= extMaxRounds; extRound++) {
      if (costTracker.totalCostUsd >= maxCost) {
        console.log(`⚠ COST BUDGET REACHED during extended pass: $${costTracker.totalCostUsd.toFixed(2)}`);
        break;
      }
      try {
        console.log(`\nExtended round ${extRound}/${extMaxRounds} (cost: $${costTracker.totalCostUsd.toFixed(2)})`);
        const extScore = await scoreExtendedResearch(ticker, 100 + extRound, scoringModel);
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
            ...(extScore.geopolitical && extScore.geopolitical.score < 12 ? extScore.geopolitical.gaps.map(g => ({ dimension: '地緣政治', item: g, current: extScore.geopolitical!.score, target: '15', shortfall: 15 - extScore.geopolitical!.score, priority: 1 })) : []),
            ...(extScore.sustainability && extScore.sustainability.score < 12 ? extScore.sustainability.gaps.map(g => ({ dimension: '環境永續', item: g, current: extScore.sustainability!.score, target: '15', shortfall: 15 - extScore.sustainability!.score, priority: 2 })) : []),
            ...(extScore.contrarian && extScore.contrarian.score < 12 ? extScore.contrarian.gaps.map(g => ({ dimension: '正反論辯', item: g, current: extScore.contrarian!.score, target: '15', shortfall: 15 - extScore.contrarian!.score, priority: 3 })) : []),
          ],
        };
        if (extGaps.gaps.length === 0) {
          extGaps.gaps.push({ dimension: '延伸分析', item: '補充地緣政治/環境永續/正反論辯分析', current: extScore.extendedTotal, target: '35+', shortfall: 35 - extScore.extendedTotal, priority: 1 });
        }

        const extResp = await runGapFillAgent(
          ticker, extGaps, '', EXTENDED_PHASE_SYSTEM,
          100 + extRound, model, investorNote, 'gap_fill', costTracker,
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
    // Final extended score
    const finalExtScore = await scoreExtendedResearch(ticker, 999, scoringModel);
    console.log(`\nFinal extended score: ${finalExtScore.extendedTotal}/45`);
    const commitHash = gitCommit(`initial-max extended-final: score ${finalExtScore.extendedTotal}/45`);
  } else if (extended && !ranAtLeastOneResearchRound) {
    console.log('\n（略過延伸分析：無研究輪執行）');
  } else if (!extended) {
    console.log('\n（未啟用延伸分析，使用 --extended 啟用）');
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
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
