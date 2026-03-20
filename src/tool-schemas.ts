/**
 * Tool definition arrays (Anthropic tool format) for Initial MAX agents.
 *
 * Extracted from initial-max-runner.ts — GAP_FILL_TOOLS and POLISH_TOOLS.
 */
import type { AnthropicTool } from './llm.js';
import { READ_RESEARCH_FILE_MAX_CHARS } from './markdown-utils.js';

/** Full tool set for gap-fill research rounds. */
export const GAP_FILL_TOOLS: AnthropicTool[] = [
  {
    name: 'web_search',
    description: '搜尋網頁。最多 5 次/輪。',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '搜尋關鍵詞' },
        count: { type: 'number', description: '結果數量（預設 5，最多 10）' },
      },
      required: ['query'],
    },
  },
  {
    name: 'fetch_url',
    description: '抓取 URL 完整內容（適合下載逐字稿、年報頁面）。',
    input_schema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: '要抓取的 URL' },
      },
      required: ['url'],
    },
  },
  {
    name: 'write_research_section',
    description:
      '寫入公司研究檔案。**主檔**：優先 **replace_section**＝整節**重寫／修正**（可刪冗、改寫句子、重排段落、合併重複），內文須含該小節標題；**不是**只能插入——若舊節需大改，直接 replace 整節。必要時才用 insert_into_section 接在節尾。禁止 append 堆文末。',
    input_schema: {
      type: 'object',
      properties: {
        ticker: { type: 'string', description: '公司 ticker（大寫）' },
        filename: { type: 'string', description: '主檔為 {TICKER}_Initial_MAX.md；或 transcripts/xxx.md' },
        content: { type: 'string', description: '要寫入的 Markdown。replace_section 時為整節順過後內文（含小節標題），具可讀性、段落連貫。' },
        mode: { type: 'string', enum: ['append', 'overwrite', 'insert_into_section', 'replace_section'], description: '主檔：replace_section=整節替換並順稿；insert_into_section=插在節尾。transcripts=append。整份重寫=overwrite' },
        section_anchor: { type: 'string', description: 'mode 為 insert_into_section 或 replace_section 時必填：1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 4.1, 4.2, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3' },
      },
      required: ['ticker', 'filename', 'content'],
    },
  },
  {
    name: 'read_research_file',
    description: `讀取現有研究檔案內容（最多約 ${READ_RESEARCH_FILE_MAX_CHARS.toLocaleString()} 字元；超長會標 truncated）。每輪 user 訊息通常已附主檔全文，僅在需重新對照或截斷補讀時呼叫。`,
    input_schema: {
      type: 'object',
      properties: {
        ticker: { type: 'string' },
        filename: { type: 'string', description: '檔案名稱' },
      },
      required: ['ticker', 'filename'],
    },
  },
  {
    name: 'list_company_files',
    description: '列出該公司在 data/companies/{TICKER}/ 下已有檔案與 transcripts 清單，判斷缺什麼再補充。',
    input_schema: {
      type: 'object',
      properties: {
        ticker: { type: 'string', description: '公司 ticker（大寫）' },
      },
      required: ['ticker'],
    },
  },
  {
    name: 'query_companies_db',
    description: '查詢 data/database/companies_database.json 中該 ticker 的條目（公司名、CEO、產業、財務摘要等）。',
    input_schema: {
      type: 'object',
      properties: {
        ticker: { type: 'string', description: '公司 ticker（大寫）' },
      },
      required: ['ticker'],
    },
  },
  {
    name: 'ninja_api',
    description: '呼叫 API Ninjas：財報(earnings/earnings_historical)、法說逐字稿(earningstranscript)、股價(stockprice)、SEC(sec)。需 NINJA_API_KEY。',
    input_schema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['stockprice', 'earnings', 'earnings_historical', 'earningstranscript', 'sec'], description: 'earnings=單年季, earnings_historical=多年財報, earningstranscript=法說逐字稿' },
        ticker: { type: 'string' },
        year: { type: 'number', description: 'earnings/earningstranscript 用' },
        quarter: { type: 'number', description: 'earnings/earningstranscript 用' },
        period_fy: { type: 'boolean', description: 'earnings 時 true=全年' },
        start_year: { type: 'number', description: 'earnings_historical 起始年' },
        end_year: { type: 'number', description: 'earnings_historical 結束年' },
        filing: { type: 'string', description: 'sec 用，如 10-K, 10-Q' },
        limit: { type: 'number', description: 'sec 筆數' },
      },
      required: ['action', 'ticker'],
    },
  },
  {
    name: 'search_data_for_company',
    description: '在 data/ 下搜尋與該公司相關的內容：what-happened 訪談、meeting-minutes、Knowledge 等，依 ticker/公司名/CEO 匹配。回傳匹配的 path 與 snippet，再用 read_project_file 讀取。',
    input_schema: {
      type: 'object',
      properties: {
        ticker: { type: 'string', description: '公司 ticker（大寫）' },
      },
      required: ['ticker'],
    },
  },
  {
    name: 'read_project_file',
    description: '讀取 data/ 下任意檔案。path 為相對專案根目錄，例如 data/content/what-happened/20260215_AminVahdat_Google.md。僅支援 .md/.txt/.json。',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: '相對專案根目錄之路徑，須以 data/ 開頭' },
      },
      required: ['path'],
    },
  },
  {
    name: 'query_knowledge_base',
    description: '查詢知識庫（data/knowledge/atoms/）：依公司、人物、產業、archetype、tag 或全文搜尋可重用的知識原子。回傳排名結果含 id、snippet、quality。',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '全文搜尋關鍵詞（空格分隔）' },
        company: { type: 'string', description: '公司 ticker（大寫）' },
        person: { type: 'string', description: '人名（部分匹配）' },
        archetype: { type: 'string', enum: ['company-profile', 'leadership', 'quotes', 'competitive-landscape', 'industry', 'financial-snapshot', 'geopolitical', 'esg', 'supply-chain', 'technology'], description: '知識類型' },
        industry: { type: 'string', description: '產業標籤' },
        tag: { type: 'string', description: '主題標籤' },
        limit: { type: 'number', description: '回傳數量上限（預設 10）' },
      },
      required: [],
    },
  },
];

/** Reduced tool set for polish rounds (read/write only, no research). */
export const POLISH_TOOLS: AnthropicTool[] = [
  {
    name: 'write_research_section',
    description:
      '【整理輪】寫入 Initial MAX 主檔（檔名形如 NVDA_Initial_MAX.md）。優先 replace_section：整節**重寫**為順稿（刪重、改寫、重排），content 須含該節 Markdown 標題。必要時 overwrite 整檔（須已掌握全文、零遺漏）。禁止 append。',
    input_schema: {
      type: 'object',
      properties: {
        ticker: { type: 'string', description: '公司 ticker（大寫）' },
        filename: { type: 'string', description: '主檔檔名：{TICKER}_Initial_MAX.md' },
        content: { type: 'string', description: 'replace_section 時為整節完整 Markdown（含標題）；overwrite 時為整檔全文' },
        mode: { type: 'string', enum: ['overwrite', 'insert_into_section', 'replace_section'], description: '整理輪：replace_section 為主；必要時 overwrite 整檔' },
        section_anchor: { type: 'string', description: 'replace_section / insert_into_section 時必填：1.1, 2.3 等' },
      },
      required: ['ticker', 'filename', 'content', 'mode'],
    },
  },
  {
    name: 'read_research_file',
    description: `【整理輪】讀取主檔以補齊 user 訊息截斷（最多約 ${READ_RESEARCH_FILE_MAX_CHARS.toLocaleString()} 字元）。`,
    input_schema: {
      type: 'object',
      properties: {
        ticker: { type: 'string' },
        filename: { type: 'string', description: '檔案名稱' },
      },
      required: ['ticker', 'filename'],
    },
  },
];
