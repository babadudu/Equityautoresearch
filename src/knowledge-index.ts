#!/usr/bin/env node
/**
 * Knowledge Base Index Builder
 *
 * Walks data/knowledge/atoms/**\/*.md, parses YAML frontmatter,
 * and builds _index.json with inverted indexes for fast retrieval.
 *
 * Usage:
 *   npx tsx src/knowledge-index.ts --rebuild
 *   npx tsx src/knowledge-index.ts --stale
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ATOMS_DIR = path.join(PROJECT_ROOT, 'data', 'knowledge', 'atoms');
const INDEX_PATH = path.join(PROJECT_ROOT, 'data', 'knowledge', '_index.json');
const TAXONOMY_PATH = path.join(PROJECT_ROOT, 'data', 'knowledge', '_taxonomy.json');

export interface AtomMeta {
  id: string;
  archetype: string;
  title: string;
  companies: string[];
  people: string[];
  industries: string[];
  tags: string[];
  temporality: string;
  created: string;
  updated: string;
  source_report: string;
  source_sections: string[];
  quality: number;
  path: string;
}

export interface KnowledgeIndex {
  generated: string;
  atom_count: number;
  atoms: AtomMeta[];
  by_company: Record<string, string[]>;
  by_person: Record<string, string[]>;
  by_industry: Record<string, string[]>;
  by_archetype: Record<string, string[]>;
  by_tag: Record<string, string[]>;
  stale: string[];
}

/** Parse YAML frontmatter from a markdown file. Returns null if no frontmatter. */
export function parseFrontmatter(content: string): Record<string, unknown> | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const yaml = match[1];
  const result: Record<string, unknown> = {};
  for (const line of yaml.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();
    // Handle arrays: ["a", "b"]
    if (val.startsWith('[') && val.endsWith(']')) {
      try {
        result[key] = JSON.parse(val);
      } catch {
        result[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
    } else if (val.startsWith('"') && val.endsWith('"')) {
      result[key] = val.slice(1, -1);
    } else if (!isNaN(Number(val)) && val !== '') {
      result[key] = Number(val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

/** Collect all .md files under atoms/ recursively. */
function collectAtomFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectAtomFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.includes('_conflict_')) {
      results.push(full);
    }
  }
  return results;
}

/** Build the full index from atom files. */
export function rebuildIndex(): KnowledgeIndex {
  const files = collectAtomFiles(ATOMS_DIR);
  const atoms: AtomMeta[] = [];
  const by_company: Record<string, string[]> = {};
  const by_person: Record<string, string[]> = {};
  const by_industry: Record<string, string[]> = {};
  const by_archetype: Record<string, string[]> = {};
  const by_tag: Record<string, string[]> = {};
  const stale: string[] = [];

  // Load taxonomy for refresh_months
  let taxonomy: Record<string, { refresh_months: number }> = {};
  if (fs.existsSync(TAXONOMY_PATH)) {
    try {
      const t = JSON.parse(fs.readFileSync(TAXONOMY_PATH, 'utf-8'));
      taxonomy = t.archetypes ?? {};
    } catch {}
  }

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fm = parseFrontmatter(content);
    if (!fm || !fm.id) continue;

    const relPath = path.relative(PROJECT_ROOT, filePath);
    const meta: AtomMeta = {
      id: String(fm.id),
      archetype: String(fm.archetype ?? ''),
      title: String(fm.title ?? ''),
      companies: (fm.companies as string[]) ?? [],
      people: (fm.people as string[]) ?? [],
      industries: (fm.industries as string[]) ?? [],
      tags: (fm.tags as string[]) ?? [],
      temporality: String(fm.temporality ?? ''),
      created: String(fm.created ?? ''),
      updated: String(fm.updated ?? ''),
      source_report: String(fm.source_report ?? ''),
      source_sections: (fm.source_sections as string[]) ?? [],
      quality: Number(fm.quality ?? 3),
      path: relPath,
    };
    atoms.push(meta);

    // Build inverted indexes
    for (const c of meta.companies) {
      (by_company[c] ??= []).push(meta.id);
    }
    for (const p of meta.people) {
      (by_person[p] ??= []).push(meta.id);
    }
    for (const i of meta.industries) {
      (by_industry[i] ??= []).push(meta.id);
    }
    (by_archetype[meta.archetype] ??= []).push(meta.id);
    for (const t of meta.tags) {
      (by_tag[t] ??= []).push(meta.id);
    }

    // Stale check
    const refreshMonths = taxonomy[meta.archetype]?.refresh_months ?? 12;
    const updated = new Date(meta.updated);
    const staleDate = new Date(updated);
    staleDate.setMonth(staleDate.getMonth() + refreshMonths);
    if (staleDate < new Date()) {
      stale.push(meta.id);
    }
  }

  const index: KnowledgeIndex = {
    generated: new Date().toISOString(),
    atom_count: atoms.length,
    atoms,
    by_company,
    by_person,
    by_industry,
    by_archetype,
    by_tag,
    stale,
  };

  fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2));
  return index;
}

/** Find atoms that are past their refresh window. */
export function findStaleAtoms(): AtomMeta[] {
  if (!fs.existsSync(INDEX_PATH)) {
    rebuildIndex();
  }
  const index: KnowledgeIndex = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
  return index.atoms.filter(a => index.stale.includes(a.id));
}

// CLI entry
if (process.argv[1]?.endsWith('knowledge-index.ts') || process.argv[1]?.endsWith('knowledge-index.js')) {
  const args = process.argv.slice(2);
  if (args.includes('--rebuild')) {
    console.log('Rebuilding knowledge index...');
    const index = rebuildIndex();
    console.log(`Index built: ${index.atom_count} atoms across ${Object.keys(index.by_archetype).length} archetypes`);
    if (index.stale.length > 0) {
      console.log(`Stale atoms: ${index.stale.join(', ')}`);
    }
    console.log(`Written to: ${INDEX_PATH}`);
  } else if (args.includes('--stale')) {
    const stale = findStaleAtoms();
    if (stale.length === 0) {
      console.log('No stale atoms found.');
    } else {
      console.log(`${stale.length} stale atom(s):`);
      for (const a of stale) {
        console.log(`  ${a.id} (${a.archetype}) — updated ${a.updated}`);
      }
    }
  } else {
    console.log('Usage: npx tsx src/knowledge-index.ts --rebuild | --stale');
  }
}
