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
    description: 'Search the web. Max 12 calls per round.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query string' },
        count: { type: 'number', description: 'Number of results (default 5, max 10)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'fetch_url',
    description: 'Fetch the full content of a URL (suitable for downloading transcripts, annual report pages).',
    input_schema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL to fetch' },
      },
      required: ['url'],
    },
  },
  {
    name: 'write_research_section',
    description:
      'Write to a company research file. For the **main report**: prefer **replace_section** = full section **rewrite/edit** (can trim, rewrite sentences, reorganize paragraphs, merge duplicates); content must include the section heading. This is NOT append-only — if the existing section needs major revision, replace the whole section. Use insert_into_section only when appending to the end of a section is truly needed. Never use append mode on the main report.',
    input_schema: {
      type: 'object',
      properties: {
        ticker: { type: 'string', description: 'Company ticker (uppercase)' },
        filename: { type: 'string', description: 'Main report: {TICKER}_Initial_MAX.md; or transcripts/xxx.md' },
        content: { type: 'string', description: 'Markdown content to write. For replace_section: full polished section content including the section heading, in readable narrative form.' },
        mode: { type: 'string', enum: ['append', 'overwrite', 'insert_into_section', 'replace_section'], description: 'Main report: replace_section=replace entire section with polished content; insert_into_section=append to section end. transcripts=append. Full rewrite=overwrite.' },
        section_anchor: { type: 'string', description: 'Required when mode is insert_into_section or replace_section: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 4.1, 4.2, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3' },
      },
      required: ['ticker', 'filename', 'content'],
    },
  },
  {
    name: 'read_research_file',
    description: `Read the content of an existing research file (up to ~${READ_RESEARCH_FILE_MAX_CHARS.toLocaleString()} chars; longer files are truncated). The main report is usually already attached in the user message — only call this when you need to re-read or the message was truncated.`,
    input_schema: {
      type: 'object',
      properties: {
        ticker: { type: 'string' },
        filename: { type: 'string', description: 'Filename to read' },
      },
      required: ['ticker', 'filename'],
    },
  },
  {
    name: 'list_company_files',
    description: 'List all existing files and transcripts under data/companies/{TICKER}/ to decide what is missing before adding content.',
    input_schema: {
      type: 'object',
      properties: {
        ticker: { type: 'string', description: 'Company ticker (uppercase)' },
      },
      required: ['ticker'],
    },
  },
  {
    name: 'query_companies_db',
    description: 'Query the entry for a ticker in data/database/companies_database.json (company name, CEO, industry, financial summary, etc.).',
    input_schema: {
      type: 'object',
      properties: {
        ticker: { type: 'string', description: 'Company ticker (uppercase)' },
      },
      required: ['ticker'],
    },
  },
  {
    name: 'ninja_api',
    description: 'Call API Ninjas: financials (earnings/earnings_historical), earnings call transcripts (earningstranscript), stock price (stockprice), SEC filings (sec). Requires NINJA_API_KEY.',
    input_schema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['stockprice', 'earnings', 'earnings_historical', 'earningstranscript', 'sec'], description: 'earnings=single quarter, earnings_historical=multi-year financials, earningstranscript=earnings call transcript' },
        ticker: { type: 'string' },
        year: { type: 'number', description: 'For earnings/earningstranscript' },
        quarter: { type: 'number', description: 'For earnings/earningstranscript' },
        period_fy: { type: 'boolean', description: 'For earnings: true = full year' },
        start_year: { type: 'number', description: 'For earnings_historical: start year' },
        end_year: { type: 'number', description: 'For earnings_historical: end year' },
        filing: { type: 'string', description: 'For sec: e.g. 10-K, 10-Q' },
        limit: { type: 'number', description: 'For sec: number of filings to return' },
      },
      required: ['action', 'ticker'],
    },
  },
  {
    name: 'search_data_for_company',
    description: 'Search data/ for content related to a company: what-happened interviews, meeting-minutes, Knowledge files — matched by ticker/company name/CEO. Returns matching paths and snippets; use read_project_file to load full content.',
    input_schema: {
      type: 'object',
      properties: {
        ticker: { type: 'string', description: 'Company ticker (uppercase)' },
      },
      required: ['ticker'],
    },
  },
  {
    name: 'read_project_file',
    description: 'Read any file under data/. Path is relative to project root, e.g. data/content/what-happened/20260215_AminVahdat_Google.md. Supports .md/.txt/.json only.',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path relative to project root, must start with data/' },
      },
      required: ['path'],
    },
  },
  {
    name: 'query_knowledge_base',
    description: 'Query the knowledge base (data/knowledge/atoms/): search reusable knowledge atoms by company, person, industry, archetype, tag, or full-text. Returns ranked results with id, snippet, and quality score.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Full-text search keywords (space-separated)' },
        company: { type: 'string', description: 'Company ticker (uppercase)' },
        person: { type: 'string', description: 'Person name (partial match)' },
        archetype: { type: 'string', enum: ['company-profile', 'leadership', 'quotes', 'competitive-landscape', 'industry', 'financial-snapshot', 'geopolitical', 'esg', 'supply-chain', 'technology'], description: 'Knowledge atom type' },
        industry: { type: 'string', description: 'Industry tag' },
        tag: { type: 'string', description: 'Topic tag' },
        limit: { type: 'number', description: 'Max results to return (default 10)' },
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
      '[Polish round] Write to the Initial MAX main report (filename like NVDA_Initial_MAX.md). Prefer replace_section: rewrite the full section as polished prose (trim duplicates, rewrite, reorganize); content must include the section Markdown heading. Use overwrite for the full file only if you have the complete content with zero omissions. Never append.',
    input_schema: {
      type: 'object',
      properties: {
        ticker: { type: 'string', description: 'Company ticker (uppercase)' },
        filename: { type: 'string', description: 'Main report filename: {TICKER}_Initial_MAX.md' },
        content: { type: 'string', description: 'For replace_section: full section Markdown including heading; for overwrite: complete file content' },
        mode: { type: 'string', enum: ['overwrite', 'insert_into_section', 'replace_section'], description: 'Polish round: replace_section preferred; overwrite for full file when necessary' },
        section_anchor: { type: 'string', description: 'Required for replace_section / insert_into_section: e.g. 1.1, 2.3' },
      },
      required: ['ticker', 'filename', 'content', 'mode'],
    },
  },
  {
    name: 'read_research_file',
    description: `[Polish round] Read the main report to fill gaps where the user message was truncated (up to ~${READ_RESEARCH_FILE_MAX_CHARS.toLocaleString()} chars).`,
    input_schema: {
      type: 'object',
      properties: {
        ticker: { type: 'string' },
        filename: { type: 'string', description: 'Filename to read' },
      },
      required: ['ticker', 'filename'],
    },
  },
];
