/**
 * External API tool implementations for the Initial MAX gap-fill agent.
 *
 * Extracted from initial-max-runner.ts — web search, URL fetch, API Ninjas,
 * companies DB queries, and data directory search.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(__dirname, '..');

export interface SearchResult {
  title: string;
  url: string;
  description: string;
}

export const NINJA_BASE = 'https://api.api-ninjas.com/v1';

export async function webSearch(query: string, count = 5): Promise<string> {
  const num = Math.min(count, 10);
  const braveKey = process.env.BRAVE_SEARCH_API_KEY ?? '';
  if (braveKey && braveKey !== 'REPLACE_ME') {
    try {
      const url = new URL('https://api.search.brave.com/res/v1/web/search');
      url.searchParams.set('q', query);
      url.searchParams.set('count', String(num));
      const res = await fetch(url.toString(), {
        headers: { Accept: 'application/json', 'X-Subscription-Token': braveKey },
      });
      if (res.ok) {
        const data = await res.json() as any;
        const results = (data.web?.results ?? []).slice(0, num).map((r: any) => ({
          title: r.title ?? '', url: r.url ?? '', description: r.description ?? '',
        }));
        return JSON.stringify({ query, results });
      }
    } catch {}
  }
  // DuckDuckGo fallback
  try {
    const ddgUrl = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`;
    const res = await fetch(ddgUrl, {
      headers: {
        Accept: 'text/html',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0',
      },
    });
    if (!res.ok) return JSON.stringify({ query, results: [] });
    const html = await res.text();
    const results: SearchResult[] = [];
    const seen = new Set<string>();
    const linkRegex = /<a[^>]+href="[^"]*uddg=([^&"]+)[^"]*"[^>]*>([^<]*)<\/a>/gi;
    let m: RegExpExecArray | null;
    while ((m = linkRegex.exec(html)) !== null && results.length < num) {
      let realUrl = '';
      try { realUrl = decodeURIComponent(m[1].replace(/\+/g, ' ')); } catch { continue; }
      if (!realUrl.startsWith('http') || seen.has(realUrl)) continue;
      seen.add(realUrl);
      const title = m[2].replace(/&amp;/g, '&').trim() || realUrl.slice(0, 60);
      results.push({ title: title.slice(0, 200), url: realUrl, description: '' });
    }
    return JSON.stringify({ query, results });
  } catch {
    return JSON.stringify({ query, results: [] });
  }
}

export async function fetchUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0',
        Accept: 'text/html,text/plain',
      },
    });
    if (!res.ok) return JSON.stringify({ error: `HTTP ${res.status}` });
    const text = await res.text();
    // Strip most HTML tags, keep text content
    const stripped = text
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
      .replace(/\s{3,}/g, '\n\n')
      .trim()
      .slice(0, 12000);
    return JSON.stringify({ url, content: stripped });
  } catch (err: any) {
    return JSON.stringify({ error: err.message });
  }
}

/** Query companies_database.json for the given ticker (matches by symbol). */
export function queryCompaniesDb(ticker: string): string {
  const dbPath = path.join(PROJECT_ROOT, 'data', 'database', 'companies_database.json');
  if (!fs.existsSync(dbPath)) return JSON.stringify({ error: 'companies_database.json not found' });
  const raw = fs.readFileSync(dbPath, 'utf-8');
  let data: { companies?: Array<{ symbol?: string; ticker?: string; [k: string]: unknown }> };
  try {
    data = JSON.parse(raw);
  } catch {
    return JSON.stringify({ error: 'companies_database.json parse failed' });
  }
  const sym = String(ticker ?? '').trim().toUpperCase().split(/\s+/)[0];
  const company = (data.companies ?? []).find(
    (c) => (c.symbol ?? '').toUpperCase() === sym || (String(c.ticker ?? '').toUpperCase().startsWith(sym))
  );
  if (!company) return JSON.stringify({ ticker: sym, found: false, message: 'No matching company in database' });
  return JSON.stringify({ ticker: sym, found: true, company }, null, 2);
}

export function cleanTicker(t: string): string {
  return String(t ?? '').trim().toUpperCase().split(/\s+/)[0] || '';
}

export async function callNinjaApi(action: string, args: Record<string, unknown>): Promise<string> {
  const key = process.env.NINJA_API_KEY ?? '';
  if (!key || key === 'REPLACE_ME') return JSON.stringify({ error: 'NINJA_API_KEY 未設定（請在專案根目錄 .env 設定）' });
  const ticker = cleanTicker(String(args.ticker ?? ''));
  if (['stockprice', 'earnings', 'earningstranscript', 'sec', 'earnings_historical'].includes(action) && !ticker && !args.cik) {
    return JSON.stringify({ error: `${action} 需要 ticker（或 cik）` });
  }
  const params: Record<string, string | number> = {};
  if (ticker) params['ticker'] = ticker;
  if (args.cik != null) params['cik'] = String(args.cik);
  if (args.year != null) params['year'] = Number(args.year);
  if (args.quarter != null) params['quarter'] = Number(args.quarter);
  if (action === 'earnings' && args.period_fy === true) params['period'] = 'fy';
  if (action === 'sec') {
    params['filing'] = (args.filing as string) || '10-K';
    params['limit'] = Math.min(10, Math.max(1, Number(args.limit) || 5));
    if (args.start) params['start'] = String(args.start);
    if (args.end) params['end'] = String(args.end);
  }
  if (action === 'earnings_historical') {
    const start = args.start_year ?? new Date().getFullYear() - 10;
    const end = args.end_year ?? new Date().getFullYear();
    const results: { year: number; data: unknown }[] = [];
    for (let y = Number(end); y >= Number(start) && results.length < 25; y--) {
      const u = new URL(NINJA_BASE + '/earnings');
      u.searchParams.set('ticker', ticker);
      u.searchParams.set('year', String(y));
      u.searchParams.set('quarter', '4');
      try {
        const res = await fetch(u.toString(), { headers: { 'X-Api-Key': key } });
        const data = res.ok ? await res.json() : null;
        results.push({ year: y, data });
      } catch (e: any) {
        results.push({ year: y, data: { error: e?.message } });
      }
      await new Promise((r) => setTimeout(r, 150));
    }
    return JSON.stringify({ ticker, start_year: start, end_year: end, by_year: results }, null, 2);
  }
  const pathMap: Record<string, string> = {
    stockprice: '/stockprice',
    earnings: '/earnings',
    earningstranscript: '/earningstranscript',
    sec: '/sec',
  };
  const p = pathMap[action];
  if (!p) return JSON.stringify({ error: `action 須為: stockprice, earnings, earningstranscript, sec, earnings_historical` });
  const url = new URL(NINJA_BASE + p);
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') url.searchParams.set(k, String(v)); });
  try {
    const res = await fetch(url.toString(), { headers: { 'X-Api-Key': key } });
    if (!res.ok) {
      const text = await res.text();
      if (res.status === 402 || res.status === 403) return JSON.stringify({ error: '此端點為 API Ninjas Premium 限定' });
      return JSON.stringify({ error: `API ${res.status}: ${text.slice(0, 200)}` });
    }
    const data = await res.json();
    return JSON.stringify(data, null, 2);
  } catch (e: any) {
    return JSON.stringify({ error: e?.message ?? 'Request failed' });
  }
}

/** Get company name and CEO from companies_database (for search keywords). */
export function getCompanyNameAndCeo(ticker: string): { name: string; ceo: string } {
  const dbPath = path.join(PROJECT_ROOT, 'data', 'database', 'companies_database.json');
  if (!fs.existsSync(dbPath)) return { name: '', ceo: '' };
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const sym = String(ticker).trim().toUpperCase().split(/\s+/)[0];
    const company = (data.companies ?? []).find(
      (c: any) => (c.symbol ?? '').toUpperCase() === sym || String(c.ticker ?? '').toUpperCase().startsWith(sym)
    );
    if (!company) return { name: '', ceo: '' };
    const name = (company.name ?? '').trim();
    const ceo = (company.executive?.ceo ?? '').trim().split(/\n/)[0];
    return { name, ceo };
  } catch {
    return { name: '', ceo: '' };
  }
}

/** Recursively list .md/.txt files under a directory (relative paths with prefix). */
export function listDataFilesUnder(dir: string, prefix: string, max: number): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const rel = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isFile() && (e.name.endsWith('.md') || e.name.endsWith('.txt'))) {
      out.push(rel);
      if (out.length >= max) return out;
    } else if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
      const nextPrefix = prefix ? `${prefix}/${e.name}` : e.name;
      out.push(...listDataFilesUnder(path.join(dir, e.name), nextPrefix, max));
      if (out.length >= max) return out;
    }
  }
  return out;
}

/** Search data/ for content related to a company (what-happened interviews, meeting-minutes, Knowledge). */
export function searchDataForCompany(ticker: string): string {
  const sym = String(ticker).trim().toUpperCase().split(/\s+/)[0];
  const { name: companyName, ceo: ceoName } = getCompanyNameAndCeo(ticker);
  const keywords: string[] = [sym];
  if (companyName) keywords.push(companyName);
  if (ceoName) {
    keywords.push(ceoName);
    keywords.push(ceoName.replace(/\s+/g, '')); // e.g. Sundar Pichai -> SundarPichai
  }
  const dataRoot = path.join(PROJECT_ROOT, 'data');
  const dirsToScan = [
    'content/what-happened',
    'content/meeting-minutes',
    'Knowledge/Extracted',
    'Knowledge/Translations',
  ];
  const matches: { path: string; snippet: string }[] = [];
  const seen = new Set<string>();
  const MAX_FILES = 150;
  const SNIPPET_LEN = 180;

  for (const sub of dirsToScan) {
    const dir = path.join(dataRoot, sub);
    const files = listDataFilesUnder(dir, sub, MAX_FILES);
    for (const rel of files) {
      if (seen.has(rel)) continue;
      const fullPath = path.join(dataRoot, rel);
      let content = '';
      try {
        content = fs.readFileSync(fullPath, 'utf-8').slice(0, 2500);
      } catch {
        continue;
      }
      const fileName = path.basename(rel);
      const toMatch = `${fileName} ${content}`.toLowerCase();
      const found = keywords.some((k) => k && toMatch.includes(k.toLowerCase()));
      if (found) {
        seen.add(rel);
        const firstLine = content.split(/\n/).find((l) => l.trim().length > 0) ?? '';
        matches.push({ path: `data/${rel}`, snippet: firstLine.trim().slice(0, SNIPPET_LEN) });
      }
    }
  }

  return JSON.stringify({
    ticker: sym,
    company_name: companyName || undefined,
    ceo: ceoName || undefined,
    keywords_used: keywords,
    matches,
    message: matches.length ? '可用 read_project_file(path) 讀取上述 path 的完整內容' : '未找到與該公司/CEO 相關的 data 內容',
  });
}

/** Read any file under data/ directory (restricted to .md/.txt/.json). */
export function readProjectFile(relativePath: string): string {
  const normalized = path.normalize(relativePath).replace(/\\/g, '/');
  if (!normalized.startsWith('data/') || normalized.includes('..')) {
    return JSON.stringify({ error: 'path 必須以 data/ 開頭且不得含 ..' });
  }
  const ext = path.extname(normalized).toLowerCase();
  if (!['.md', '.txt', '.json'].includes(ext)) {
    return JSON.stringify({ error: '僅支援 .md / .txt / .json' });
  }
  const fullPath = path.join(PROJECT_ROOT, normalized);
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
    return JSON.stringify({ error: `File not found: ${normalized}` });
  }
  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    return JSON.stringify({ path: normalized, content: content.slice(0, 25000), total_chars: content.length });
  } catch (e: any) {
    return JSON.stringify({ error: e?.message ?? 'Read failed' });
  }
}
