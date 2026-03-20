/**
 * Markdown file operations for Initial MAX research files.
 *
 * Extracted from initial-max-runner.ts — section finding, insertion,
 * replacement, and high-level read/write dispatchers.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(__dirname, '..');

/** User-message attachment char limit for main file full text. */
export const INITIAL_MAX_MAIN_IN_USER_CHARS = 350_000;
/** read_research_file return content char limit. */
export const READ_RESEARCH_FILE_MAX_CHARS = 350_000;

/** Find section start/end by anchor (e.g. "1.1", "2.3"). Returns [start, end) or null. */
export function findSectionRange(lines: string[], sectionAnchor: string): [number, number] | null {
  const anchorNum = sectionAnchor.trim();
  let sectionStart = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(#{2,3})\s+(\d+\.\d+)/);
    if (m && m[2] === anchorNum) {
      sectionStart = i;
      break;
    }
    if (!m && /^#+\s+/.test(lines[i]) && lines[i].includes(anchorNum)) {
      sectionStart = i;
      break;
    }
  }
  if (sectionStart === -1) return null;
  let sectionEnd = lines.length;
  for (let j = sectionStart + 1; j < lines.length; j++) {
    if (/^#+\s+/.test(lines[j])) {
      sectionEnd = j;
      break;
    }
  }
  return [sectionStart, sectionEnd];
}

/** Insert content at the end of the section identified by sectionAnchor. */
export function insertIntoSection(fullPath: string, sectionAnchor: string, content: string): boolean {
  const raw = fs.readFileSync(fullPath, 'utf-8');
  const lines = raw.split(/\r?\n/);
  const range = findSectionRange(lines, sectionAnchor);
  if (!range) return false;
  const [, insertBefore] = range;
  const newBlock = content.trim();
  const before = lines.slice(0, insertBefore).join('\n').trimEnd();
  const after = lines.slice(insertBefore).join('\n');
  const out = after ? `${before}\n\n${newBlock}\n\n${after}` : `${before}\n\n${newBlock}\n`;
  fs.writeFileSync(fullPath, out);
  return true;
}

/** Replace entire section content identified by sectionAnchor (content should include the heading). */
export function replaceSection(fullPath: string, sectionAnchor: string, content: string): boolean {
  const raw = fs.readFileSync(fullPath, 'utf-8');
  const lines = raw.split(/\r?\n/);
  const range = findSectionRange(lines, sectionAnchor);
  if (!range) return false;
  const [start, end] = range;
  const newBlock = content.trim();
  const before = lines.slice(0, start).join('\n').trimEnd();
  const after = lines.slice(end).join('\n');
  const out = after ? `${before}\n\n${newBlock}\n\n${after}` : `${before}\n\n${newBlock}\n`;
  fs.writeFileSync(fullPath, out);
  return true;
}

/** High-level write dispatcher: overwrite/append/insert_into_section/replace_section. */
export function writeResearchSection(
  ticker: string,
  filename: string,
  content: string,
  mode: 'append' | 'overwrite' | 'insert_into_section' | 'replace_section' = 'append',
  sectionAnchor?: string
): string {
  const dir = path.join(PROJECT_ROOT, 'data', 'companies', ticker);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const parts = filename.split('/');
  if (parts.length > 1) {
    const subDir = path.join(dir, ...parts.slice(0, -1));
    if (!fs.existsSync(subDir)) fs.mkdirSync(subDir, { recursive: true });
  }

  const fullPath = path.join(dir, filename);
  if (mode === 'overwrite') {
    fs.writeFileSync(fullPath, content);
    return JSON.stringify({ status: 'written', file: `data/companies/${ticker}/${filename}`, chars: content.length });
  }
  if ((mode === 'insert_into_section' || mode === 'replace_section') && sectionAnchor) {
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, content);
      return JSON.stringify({ status: 'written', file: `data/companies/${ticker}/${filename}`, chars: content.length, note: 'file was empty, wrote content' });
    }
    if (mode === 'replace_section') {
      const ok = replaceSection(fullPath, sectionAnchor, content);
      if (!ok) {
        return JSON.stringify({ error: `section_anchor "${sectionAnchor}" not found; use insert_into_section or overwrite` });
      }
      return JSON.stringify({ status: 'replaced_section', file: `data/companies/${ticker}/${filename}`, section_anchor: sectionAnchor, chars: content.length });
    }
    const ok = insertIntoSection(fullPath, sectionAnchor, content);
    if (!ok) {
      return JSON.stringify({ error: `section_anchor "${sectionAnchor}" not found in file; use append or overwrite` });
    }
    return JSON.stringify({ status: 'inserted_into_section', file: `data/companies/${ticker}/${filename}`, section_anchor: sectionAnchor, chars: content.length });
  }
  const existing = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf-8') : '';
  fs.writeFileSync(fullPath, existing + (existing ? '\n\n' : '') + content);
  return JSON.stringify({ status: 'written', file: `data/companies/${ticker}/${filename}`, chars: content.length });
}

/** Format the main file content for prompt attachment (with truncation). */
export function buildMainFileFullAttachment(ticker: string): string {
  const mainFile = `${ticker}_Initial_MAX.md`;
  const mainPath = path.join(PROJECT_ROOT, 'data', 'companies', ticker, mainFile);
  if (fs.existsSync(mainPath)) {
    const raw = fs.readFileSync(mainPath, 'utf-8');
    const maxU = INITIAL_MAX_MAIN_IN_USER_CHARS;
    const truncated = raw.length > maxU;
    const shown = truncated ? raw.slice(0, maxU) : raw;
    return (
      `\n\n---\n\n## 當前 \`${mainFile}\` 原文（供對照）\n\n` +
      (truncated
        ? `_（此檔共 ${raw.length.toLocaleString()} 字元，以下僅前 ${maxU.toLocaleString()} 字元；其餘請用 \`read_research_file\` 或於本機開檔）_\n\n`
        : '') +
      `---BEGIN_${ticker}_INITIAL_MAX---\n${shown}\n---END_${ticker}_INITIAL_MAX---`
    );
  }
  return `\n\n---\n\n## 當前主檔\n\n（尚無 \`${mainFile}\`，請建立完整主檔骨架後再逐輪補強。）\n`;
}

/** Read a research file with truncation at READ_RESEARCH_FILE_MAX_CHARS. */
export function readResearchFile(ticker: string, filename: string): string {
  const fullPath = path.join(PROJECT_ROOT, 'data', 'companies', ticker, filename);
  if (!fs.existsSync(fullPath)) return JSON.stringify({ error: `File not found: ${filename}` });
  const content = fs.readFileSync(fullPath, 'utf-8');
  const max = READ_RESEARCH_FILE_MAX_CHARS;
  const truncated = content.length > max;
  const body = truncated ? content.slice(0, max) : content;
  return JSON.stringify({
    filename,
    content: body,
    total_chars: content.length,
    truncated,
    ...(truncated ? { note: `僅前 ${max} 字元，檔案共 ${content.length} 字元` } : {}),
  });
}

/** List company directory contents (files + transcripts subdirectory). */
export function listCompanyFiles(ticker: string): string {
  const dir = path.join(PROJECT_ROOT, 'data', 'companies', ticker);
  if (!fs.existsSync(dir)) return JSON.stringify({ ticker, files: [], transcripts: [], has_main_file: false });
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  let transcripts: string[] = [];
  let hasMainFile = false;
  for (const e of entries) {
    if (e.isFile()) {
      files.push(e.name);
      if (e.name === `${ticker}_Initial_MAX.md`) hasMainFile = true;
    } else if (e.isDirectory() && e.name === 'transcripts') {
      const sub = path.join(dir, 'transcripts');
      transcripts = fs.readdirSync(sub).filter((f) => f.endsWith('.md') || f.endsWith('.txt'));
    }
  }
  return JSON.stringify({ ticker, files, transcripts, has_main_file: hasMainFile });
}
