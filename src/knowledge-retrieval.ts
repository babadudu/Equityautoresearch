#!/usr/bin/env node
/**
 * Knowledge Base Retrieval Engine
 *
 * Loads the index, filters by structured fields (company, person, archetype, tag),
 * optionally greps atom files for text query, ranks by relevance + quality + freshness.
 *
 * Usage:
 *   npx tsx src/knowledge-retrieval.ts --query "Morris Chang integrity"
 *   npx tsx src/knowledge-retrieval.ts --company TSM --archetype leadership
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { rebuildIndex, type KnowledgeIndex, type AtomMeta } from './knowledge-index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(PROJECT_ROOT, 'data', 'knowledge', '_index.json');

export interface RetrievalResult {
  id: string;
  path: string;
  title: string;
  archetype: string;
  snippet: string;
  quality: number;
  updated: string;
  stale: boolean;
  score: number;
}

export interface QueryArgs {
  query?: string;
  company?: string;
  person?: string;
  archetype?: string;
  industry?: string;
  tag?: string;
  limit?: number;
}

/** Load index, rebuilding if needed. */
function loadIndex(): KnowledgeIndex {
  if (!fs.existsSync(INDEX_PATH)) {
    return rebuildIndex();
  }
  return JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
}

/** Extract a snippet around a keyword match from atom content. */
function extractSnippet(content: string, keywords: string[], maxLen = 200): string {
  // Strip frontmatter
  const body = content.replace(/^---[\s\S]*?---\n*/, '').trim();
  if (!keywords.length) return body.slice(0, maxLen);

  const lower = body.toLowerCase();
  for (const kw of keywords) {
    const idx = lower.indexOf(kw.toLowerCase());
    if (idx >= 0) {
      const start = Math.max(0, idx - 60);
      const end = Math.min(body.length, idx + maxLen - 60);
      return (start > 0 ? '...' : '') + body.slice(start, end).trim() + (end < body.length ? '...' : '');
    }
  }
  return body.slice(0, maxLen) + (body.length > maxLen ? '...' : '');
}

/** Query the knowledge base. Returns ranked results. */
export function queryKnowledgeBase(args: QueryArgs): RetrievalResult[] {
  const index = loadIndex();
  let candidates: AtomMeta[] = [...index.atoms];

  // Filter by structured fields
  if (args.company) {
    const ids = new Set(index.by_company[args.company.toUpperCase()] ?? []);
    candidates = candidates.filter(a => ids.has(a.id) || a.companies.some(c => c.toUpperCase() === args.company!.toUpperCase()));
  }
  if (args.person) {
    const personLower = args.person.toLowerCase();
    candidates = candidates.filter(a => a.people.some(p => p.toLowerCase().includes(personLower)));
  }
  if (args.archetype) {
    candidates = candidates.filter(a => a.archetype === args.archetype);
  }
  if (args.industry) {
    const ids = new Set(index.by_industry[args.industry] ?? []);
    candidates = candidates.filter(a => ids.has(a.id) || a.industries.includes(args.industry!));
  }
  if (args.tag) {
    candidates = candidates.filter(a => a.tags.includes(args.tag!));
  }

  // Text search: grep atom files for query terms
  const queryTerms = (args.query ?? '').toLowerCase().split(/\s+/).filter(Boolean);

  const scored: (RetrievalResult & { _relevance: number })[] = [];

  for (const atom of candidates) {
    const atomPath = path.join(PROJECT_ROOT, atom.path);
    let content = '';
    try {
      content = fs.readFileSync(atomPath, 'utf-8');
    } catch {
      continue;
    }
    const lower = content.toLowerCase();

    // Text relevance: count matching query terms
    let termHits = 0;
    if (queryTerms.length > 0) {
      for (const term of queryTerms) {
        if (lower.includes(term)) termHits++;
      }
      // Skip if no query terms match (when a text query was provided)
      if (termHits === 0) continue;
    }

    // Scoring: relevance (0-10) + quality (1-5) + freshness (0-3)
    const relevance = queryTerms.length > 0 ? (termHits / queryTerms.length) * 10 : 5;
    const quality = atom.quality;
    const daysSinceUpdate = (Date.now() - new Date(atom.updated).getTime()) / (1000 * 60 * 60 * 24);
    const freshness = daysSinceUpdate < 30 ? 3 : daysSinceUpdate < 90 ? 2 : daysSinceUpdate < 365 ? 1 : 0;

    const totalScore = relevance + quality + freshness;

    scored.push({
      id: atom.id,
      path: atom.path,
      title: atom.title,
      archetype: atom.archetype,
      snippet: extractSnippet(content, queryTerms),
      quality: atom.quality,
      updated: atom.updated,
      stale: index.stale.includes(atom.id),
      score: Math.round(totalScore * 10) / 10,
      _relevance: relevance,
    });
  }

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  const limit = args.limit ?? 10;
  return scored.slice(0, limit).map(({ _relevance, ...rest }) => rest);
}

/** Format results as JSON string (for tool use in pipeline). */
export function queryKnowledgeBaseJson(args: QueryArgs): string {
  const results = queryKnowledgeBase(args);
  return JSON.stringify({
    query: args,
    count: results.length,
    results,
  }, null, 2);
}

// CLI entry
if (process.argv[1]?.endsWith('knowledge-retrieval.ts') || process.argv[1]?.endsWith('knowledge-retrieval.js')) {
  const cliArgs: Record<string, string> = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const val = process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[++i] : 'true';
      cliArgs[key] = val;
    }
  }

  const results = queryKnowledgeBase({
    query: cliArgs.query,
    company: cliArgs.company,
    person: cliArgs.person,
    archetype: cliArgs.archetype,
    industry: cliArgs.industry,
    tag: cliArgs.tag,
    limit: cliArgs.limit ? parseInt(cliArgs.limit, 10) : 10,
  });

  if (results.length === 0) {
    console.log('No matching atoms found.');
  } else {
    console.log(`Found ${results.length} result(s):\n`);
    for (const r of results) {
      console.log(`  [${r.score}] ${r.id} (${r.archetype}) — ${r.title}`);
      console.log(`         ${r.snippet.slice(0, 120)}`);
      console.log(`         quality:${r.quality} updated:${r.updated}${r.stale ? ' STALE' : ''}`);
      console.log();
    }
  }
}
