#!/usr/bin/env node
/**
 * Knowledge Extractor — LLM-assisted decomposition of research reports into knowledge atoms.
 *
 * Reads a company's main report, splits by section anchors, calls Claude Sonnet
 * to extract reusable knowledge atoms, and writes them as markdown files
 * with YAML frontmatter.
 *
 * Usage:
 *   npx tsx src/knowledge-extractor.ts --ticker TSM --migrate
 *   npx tsx src/knowledge-extractor.ts --ticker TSM --dry-run
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chat } from './llm.js';
import { MODELS } from './config.js';
import { dispatchToGemini } from './gemini-dispatch.js';
// Note: We use findFullSectionRange() locally instead of findSectionRange() from markdown-utils,
// because the latter stops at sub-headings (###) within a section.
import { rebuildIndex } from './knowledge-index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ATOMS_DIR = path.join(PROJECT_ROOT, 'data', 'knowledge', 'atoms');
const TAXONOMY_PATH = path.join(PROJECT_ROOT, 'data', 'knowledge', '_taxonomy.json');

interface AtomOutput {
  id: string;
  archetype: string;
  title: string;
  companies: string[];
  people: string[];
  industries: string[];
  tags: string[];
  temporality: string;
  body: string;
}

/** Section-to-archetype mapping for Initial MAX reports. */
const SECTION_ARCHETYPE_MAP: { sections: string[]; archetype: string; label: string }[] = [
  { sections: ['1.1'], archetype: 'industry', label: 'TAM & industry growth' },
  { sections: ['1.2', '2.4'], archetype: 'competitive-landscape', label: 'Market structure & five forces' },
  { sections: ['1.3'], archetype: 'technology', label: 'Technology & demand trends' },
  { sections: ['1.4'], archetype: 'financial-snapshot', label: 'Geographic revenue' },
  { sections: ['2.1'], archetype: 'financial-snapshot', label: '10-year financials' },
  { sections: ['2.2', '2.3'], archetype: 'company-profile', label: 'Business model DNA' },
  { sections: ['2.5'], archetype: 'financial-snapshot', label: 'DCF valuation' },
  { sections: ['3.1'], archetype: 'company-profile', label: 'Organizational culture' },
  { sections: ['3.2'], archetype: 'financial-snapshot', label: 'Operating efficiency' },
  { sections: ['4.1'], archetype: 'leadership', label: 'CEO/founder profiles' },
  { sections: ['6.1', '6.2', '6.3'], archetype: 'geopolitical', label: 'Geopolitical analysis' },
  { sections: ['7.1', '7.2', '7.3'], archetype: 'esg', label: 'ESG & sustainability' },
  { sections: ['8.1', '8.2', '8.3'], archetype: 'competitive-landscape', label: 'Bull/bear debate' },
];

/**
 * Find section range including sub-headings (###).
 * Unlike findSectionRange() which stops at any heading, this stops only at
 * same-level or higher-level headings (## stops at next ##, not ###).
 */
function findFullSectionRange(lines: string[], sectionAnchor: string): [number, number] | null {
  const anchorNum = sectionAnchor.trim();
  let sectionStart = -1;
  let sectionLevel = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(#{2,3})\s+(\d+\.\d+)/);
    if (m && m[2] === anchorNum) {
      sectionStart = i;
      sectionLevel = m[1].length;
      break;
    }
    if (!m && /^(#{2,3})\s+/.test(lines[i]) && lines[i].includes(anchorNum)) {
      const hm = lines[i].match(/^(#+)/);
      sectionStart = i;
      sectionLevel = hm ? hm[1].length : 2;
      break;
    }
  }
  if (sectionStart === -1) return null;
  let sectionEnd = lines.length;
  for (let j = sectionStart + 1; j < lines.length; j++) {
    const hm = lines[j].match(/^(#{1,3})\s+/);
    if (hm && hm[1].length <= sectionLevel) {
      sectionEnd = j;
      break;
    }
  }
  return [sectionStart, sectionEnd];
}

/** Extract section content by anchor from the report lines. */
function extractSections(lines: string[], anchors: string[]): string {
  const parts: string[] = [];
  for (const anchor of anchors) {
    const range = findFullSectionRange(lines, anchor);
    if (range) {
      parts.push(lines.slice(range[0], range[1]).join('\n'));
    }
  }
  return parts.join('\n\n---\n\n');
}

/** Known executive names to match in quote attribution. */
const KNOWN_PERSONS = [
  'Morris Chang', 'C.C. Wei', 'Wendell Huang', 'Mark Liu',
  'Jensen Huang', 'Lisa Su', 'Pat Gelsinger', 'Tim Cook',
  '張忠謀', '魏哲家', '黃仁勳', '劉德音',
];

/** Extract quotes grouped by attributed person. Returns Map<person, quoteBlocks>. */
function extractQuotesByPerson(content: string): Map<string, string[]> {
  const lines = content.split('\n');
  const personQuotes = new Map<string, string[]>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match lines containing direct quotes
    const hasQuote =
      (line.includes('「') && line.includes('」')) ||
      (line.includes('\u201c') && line.includes('\u201d')) ||
      />\s*"[^"]{20,}"/.test(line);
    if (!hasQuote) continue;

    // Grab context window: 2 lines before + quote line + 1 line after
    const start = Math.max(0, i - 2);
    const end = Math.min(lines.length, i + 2);
    const block = lines.slice(start, end).join('\n');
    const blockLower = block.toLowerCase();

    // Attribute to a person
    let attributed = '_other';
    for (const person of KNOWN_PERSONS) {
      if (blockLower.includes(person.toLowerCase())) {
        // Normalize CJK names to their English equivalent for grouping
        const normalized = person === '張忠謀' ? 'Morris Chang'
          : person === '魏哲家' ? 'C.C. Wei'
          : person === '黃仁勳' ? 'Jensen Huang'
          : person === '劉德音' ? 'Mark Liu'
          : person;
        attributed = normalized;
        break;
      }
    }

    const existing = personQuotes.get(attributed) ?? [];
    existing.push(block);
    personQuotes.set(attributed, existing);
  }

  return personQuotes;
}

/** Build the extraction prompt for Claude. */
function buildExtractionPrompt(
  sectionContent: string,
  archetype: string,
  label: string,
  ticker: string,
  taxonomyJson: string,
): string {
  return `You are a knowledge extraction system. Extract reusable "knowledge atoms" from the following research report section(s).

## Rules
1. Each atom must be **self-contained** — readable without the original report
2. Preserve inline source URLs verbatim
3. Preserve exact numerical data, quotes, and attributions
4. Each atom should be 500-3000 words
5. The atom ID should be a lowercase kebab-case slug (e.g., "tsmc-business-model-dna")
6. For quotes atoms: group by person, deduplicate, include context for each quote

## Target archetype: ${archetype}
## Section label: ${label}
## Company: ${ticker}

## Taxonomy (for reference):
${taxonomyJson}

## Section content:
${sectionContent.slice(0, 80000)}

## Output format
Return a JSON array of atom objects. Each atom has:
- id: string (kebab-case slug)
- archetype: string (from taxonomy)
- title: string (human-readable)
- companies: string[] (ticker symbols)
- people: string[] (full names)
- industries: string[] (from taxonomy tag vocabulary)
- tags: string[] (from taxonomy tag vocabulary, plus custom if needed)
- temporality: "evergreen" | "semi-evergreen" | "time-bound"
- body: string (the full markdown content of the atom, 500-3000 words, with inline source URLs preserved)

Return ONLY the JSON array, no other text. Example:
[{"id":"tsmc-founding-story","archetype":"company-profile","title":"TSMC Founding Story","companies":["TSM"],"people":["Morris Chang"],"industries":["semiconductor-foundry"],"tags":["founding","business-model"],"temporality":"evergreen","body":"..."}]`;
}

/** Build extraction prompt for single-call (Gemini) mode — whole report in one call. */
function buildSingleCallPrompt(ticker: string, taxonomyJson: string): string {
  const archetypes = [...new Set(SECTION_ARCHETYPE_MAP.map(m => m.archetype))];
  return `You are a world-class knowledge extraction system. Extract a comprehensive set of "knowledge atoms" from the provided research report in a SINGLE response.

## CRITICAL REQUIREMENTS
1. **EXHAUSTIVE**: Extract at least 10 distinct knowledge atoms, covering as many archetypes as possible.
2. **SUBSTANTIVE**: Each atom body MUST be **500-3000 words**. Do NOT provide short summaries. We need depth, data, and detailed analysis.
3. **SELF-CONTAINED**: Each atom must be a complete, readable standalone article.
4. **DATA-RICH**: Include exact numerical data, market share percentages, revenue figures, specific names, and dates.
5. **VERBATIM**: Preserve direct quotes and source URLs exactly as they appear in the report.
6. **FORMAT**: Valid JSON array only. If your response would exceed the output limit, return fewer atoms rather than truncating mid-JSON.

## Target Archetypes (aim for 1+ per archetype)
${archetypes.join(', ')}

## Company: ${ticker}

## Taxonomy (for reference):
${taxonomyJson}

## Output Format
Return a JSON array of atom objects. Each atom has:
- id: string (kebab-case slug, e.g., "${ticker.toLowerCase()}-business-model-dna")
- archetype: string (one of the target archetypes)
- title: string (human-readable)
- companies: string[] (ticker symbols)
- people: string[] (full names of people mentioned)
- industries: string[] (relevant industries)
- tags: string[] (relevant tags)
- temporality: "evergreen" | "semi-evergreen" | "time-bound"
- source_sections: string[] (report section numbers this atom draws from, e.g., ["2.1", "2.2"], or ["all"] if spanning the whole report)
- body: string (Markdown, 500-3000 words, high depth, with inline source URLs preserved)

Return ONLY the JSON array. No other text.`;
}

/** Write a single atom to disk. */
function writeAtom(atom: AtomOutput, ticker: string, sourceReport: string, sourceSections: string[]): string {
  const dir = path.join(ATOMS_DIR, atom.archetype);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${atom.id}.md`);
  const today = new Date().toISOString().slice(0, 10);

  // Phase 3.5: Distinguish fact-atoms vs inference-atoms for cascade risk
  const isInference = /inference|opinion|predict|估計|推測|可能|或許|widening|narrowing|trend/i.test(atom.body);
  const atomType = isInference ? 'inference' : 'fact';

  const frontmatter = [
    '---',
    `id: "${atom.id}"`,
    `archetype: "${atom.archetype}"`,
    `title: "${atom.title.replace(/"/g, '\\"')}"`,
    `companies: ${JSON.stringify(atom.companies)}`,
    `people: ${JSON.stringify(atom.people)}`,
    `industries: ${JSON.stringify(atom.industries)}`,
    `tags: ${JSON.stringify(atom.tags)}`,
    `temporality: "${atom.temporality}"`,
    `created: "${today}"`,
    `updated: "${today}"`,
    `source_report: "${sourceReport}"`,
    `source_sections: ${JSON.stringify(sourceSections)}`,
    `quality: 4`,
    `atom_type: "${atomType}"`,
    `confidence: 1.0`,
    `provenance: "${ticker} research report ${today}"`,
    '---',
    '',
  ].join('\n');

  // Phase 3.5: Contradiction detection — flag if existing atom for same company differs significantly
  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath, 'utf-8');
    const existingBody = existing.split('---').slice(2).join('---').trim();
    // Simple heuristic: if the new body differs > 50% from existing, flag it
    const overlap = existingBody.split(/\s+/).filter(w => atom.body.includes(w)).length;
    const existingWords = existingBody.split(/\s+/).length;
    if (existingWords > 20 && overlap / existingWords < 0.5) {
      console.log(`  [atom-conflict] ${atom.id}: new content differs significantly from existing. Flagging, not overwriting.`);
      // Write as a conflict variant instead
      const conflictPath = filePath.replace('.md', `_conflict_${today.replace(/-/g, '')}.md`);
      fs.writeFileSync(conflictPath, frontmatter + atom.body);
      return conflictPath;
    }
  }

  fs.writeFileSync(filePath, frontmatter + atom.body);
  return filePath;
}

/** Multi-call extraction: one LLM call per section group (original 8-call pipeline). */
async function extractMultiCall(
  lines: string[], ticker: string, taxonomy: string, dryRun: boolean, sourceReport: string,
): Promise<number> {
  let atomCount = 0;
  for (const mapping of SECTION_ARCHETYPE_MAP) {
    const sectionContent = extractSections(lines, mapping.sections);
    if (!sectionContent.trim()) {
      console.log(`  [skip] No content for ${mapping.label} (sections: ${mapping.sections.join(', ')})`);
      continue;
    }

    console.log(`\n  [extract] ${mapping.label} → ${mapping.archetype} (${sectionContent.length} chars)`);

    if (dryRun) {
      console.log(`    [dry-run] Would extract from sections ${mapping.sections.join(', ')}`);
      continue;
    }

    const prompt = buildExtractionPrompt(sectionContent, mapping.archetype, mapping.label, ticker, taxonomy);

    try {
      const response = await chat(
        'You are a precise knowledge extraction system. Return only valid JSON arrays.',
        [{ role: 'user', content: prompt }],
        { model: MODELS.CLAUDE, maxTokens: 16384 },
      );

      const text = response.content ?? '';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error(`    [error] No JSON array in response for ${mapping.label}`);
        continue;
      }

      let atoms: AtomOutput[];
      try {
        atoms = JSON.parse(jsonMatch[0]);
      } catch (parseErr) {
        console.error(`    [error] JSON parse failed for ${mapping.label}: ${(parseErr as Error).message}`);
        continue;
      }

      for (const atom of atoms) {
        if (!atom.id || !atom.body) {
          console.log(`    [skip] Invalid atom (missing id or body)`);
          continue;
        }
        const filePath = writeAtom(atom, ticker, sourceReport, mapping.sections);
        console.log(`    [wrote] ${atom.id} → ${path.relative(PROJECT_ROOT, filePath)}`);
        atomCount++;
      }
    } catch (err: any) {
      console.error(`    [error] LLM call failed for ${mapping.label}: ${err.message}`);
    }
  }
  return atomCount;
}

/** Single-call extraction: full report in one Gemini call (with Claude fallback). */
function extractSingleCall(
  ticker: string, reportPath: string, taxonomy: string, dryRun: boolean, sourceReport: string,
): { atomCount: number; usedFallback: boolean; model: string } {
  if (dryRun) {
    console.log(`  [dry-run] Would extract all atoms in single Gemini call from ${reportPath}`);
    return { atomCount: 0, usedFallback: false, model: 'dry-run' };
  }

  const prompt = buildSingleCallPrompt(ticker, taxonomy);
  const result = dispatchToGemini(prompt, {
    inputFile: reportPath,
    timeoutSec: 400,
    outputFormat: 'json',
  });

  console.log(`  [single-call] Completed in ${(result.durationMs / 1000).toFixed(1)}s using ${result.model}${result.usedFallback ? ' (fallback)' : ''}`);

  // Parse JSON — strip code fences if present
  let cleanOutput = result.output.trim();
  if (cleanOutput.startsWith('```json')) {
    cleanOutput = cleanOutput.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleanOutput.startsWith('```')) {
    cleanOutput = cleanOutput.replace(/^```/, '').replace(/```$/, '').trim();
  }

  let rawAtoms: any[];
  try {
    rawAtoms = JSON.parse(cleanOutput);
  } catch (parseErr) {
    // Try extracting JSON array from within the response
    const jsonMatch = cleanOutput.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        rawAtoms = JSON.parse(jsonMatch[0]);
      } catch {
        console.error(`  [error] JSON parse failed. Output length: ${cleanOutput.length}, last 200 chars: ${cleanOutput.slice(-200)}`);
        return { atomCount: 0, usedFallback: result.usedFallback, model: result.model };
      }
    } else {
      console.error(`  [error] No JSON array in response. Output length: ${cleanOutput.length}, last 200 chars: ${cleanOutput.slice(-200)}`);
      return { atomCount: 0, usedFallback: result.usedFallback, model: result.model };
    }
  }

  let atomCount = 0;
  for (const raw of rawAtoms) {
    const atom: AtomOutput = {
      id: raw.id,
      archetype: raw.archetype,
      title: raw.title,
      companies: raw.companies ?? [],
      people: raw.people ?? [],
      industries: raw.industries ?? [],
      tags: raw.tags ?? [],
      temporality: raw.temporality ?? 'semi-evergreen',
      body: raw.body ?? '',
    };
    if (!atom.id || !atom.body) {
      console.log(`    [skip] Invalid atom (missing id or body)`);
      continue;
    }
    const sourceSections = Array.isArray(raw.source_sections) ? raw.source_sections : ['all'];
    const filePath = writeAtom(atom, ticker, sourceReport, sourceSections);
    console.log(`    [wrote] ${atom.id} → ${path.relative(PROJECT_ROOT, filePath)}`);
    atomCount++;
  }

  return { atomCount, usedFallback: result.usedFallback, model: result.model };
}

/** Main extraction pipeline. */
async function extractKnowledge(
  ticker: string, dryRun: boolean, quotesOnly = false, backend: 'gemini' | 'claude' = 'gemini',
): Promise<void> {
  const reportPath = path.join(PROJECT_ROOT, 'data', 'companies', ticker, `${ticker}_Initial_MAX.md`);
  if (!fs.existsSync(reportPath)) {
    console.error(`Report not found: ${reportPath}`);
    process.exit(1);
  }

  const reportContent = fs.readFileSync(reportPath, 'utf-8');
  const lines = reportContent.split('\n');
  const taxonomy = fs.readFileSync(TAXONOMY_PATH, 'utf-8');
  const sourceReport = `data/companies/${ticker}/${ticker}_Initial_MAX.md`;

  let totalAtoms = 0;

  if (quotesOnly) {
    console.log('  [quotes-only] Skipping section extraction');
  } else if (backend === 'gemini') {
    console.log(`\n  [extract] Single-call extraction (${(fs.statSync(reportPath).size / 1024).toFixed(0)} KB report)`);
    const result = extractSingleCall(ticker, reportPath, taxonomy, dryRun, sourceReport);
    totalAtoms = result.atomCount;
    if (!dryRun) console.log(`  [model] ${result.model}${result.usedFallback ? ' (fallback)' : ''}`);
  } else {
    totalAtoms = await extractMultiCall(lines, ticker, taxonomy, dryRun, sourceReport);
  }

  // Special-case: extract quotes per person (chunked to avoid timeout)
  console.log('\n  [extract] Quotes (per-person chunked)');
  const personQuotes = extractQuotesByPerson(reportContent);

  // Remove stale combined quotes atom from leadership extraction if it exists
  const staleQuotesPath = path.join(ATOMS_DIR, 'quotes', `${ticker.toLowerCase()}-leadership-quotes.md`);
  if (fs.existsSync(staleQuotesPath)) {
    fs.unlinkSync(staleQuotesPath);
    console.log(`    [cleanup] Removed ${ticker.toLowerCase()}-leadership-quotes.md (replaced by per-person atoms)`);
  }

  const MAX_QUOTE_CHARS = 20000; // Keep each LLM call under 20K content chars

  for (const [person, blocks] of personQuotes) {
    const MIN_QUOTES = person === '_other' ? 5 : 3;
    if (blocks.length < MIN_QUOTES) {
      console.log(`    [skip] ${person}: ${blocks.length} quotes (need ${MIN_QUOTES}+)`);
      continue;
    }

    const personSlug = person === '_other'
      ? `${ticker.toLowerCase()}-misc-quotes`
      : person.toLowerCase().replace(/[^a-z]+/g, '-').replace(/-+$/, '') + '-quotes';
    const label = person === '_other'
      ? `Miscellaneous quotes from ${ticker} report`
      : `Quotes by ${person}`;

    // Split blocks into chunks that fit under MAX_QUOTE_CHARS
    const chunks: string[][] = [[]];
    let currentSize = 0;
    for (const block of blocks) {
      if (currentSize + block.length > MAX_QUOTE_CHARS && chunks[chunks.length - 1].length > 0) {
        chunks.push([]);
        currentSize = 0;
      }
      chunks[chunks.length - 1].push(block);
      currentSize += block.length + 10; // +10 for separator
    }

    const totalChars = blocks.reduce((s, b) => s + b.length, 0);
    console.log(`    [extract] ${person}: ${blocks.length} quotes, ${totalChars} chars → ${personSlug} (${chunks.length} chunk${chunks.length > 1 ? 's' : ''})`);

    if (dryRun) continue;

    for (let ci = 0; ci < chunks.length; ci++) {
      const chunk = chunks[ci];
      const quoteContent = chunk.join('\n\n---\n\n');
      const chunkLabel = chunks.length > 1 ? `${label} (part ${ci + 1}/${chunks.length})` : label;

      const quotePrompt = buildExtractionPrompt(quoteContent, 'quotes', chunkLabel, ticker, taxonomy);

      try {
        const response = await chat(
          'You are a precise knowledge extraction system. Return only valid JSON arrays.',
          [{ role: 'user', content: quotePrompt }],
          { backend: 'mlx', maxTokens: 16384 },
        );

        const text = response.content ?? '';
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const atoms: AtomOutput[] = JSON.parse(jsonMatch[0]);
          for (const atom of atoms) {
            if (!atom.id || !atom.body) continue;
            atom.archetype = 'quotes';
            // Append chunk suffix to avoid overwrites when multiple chunks
            if (chunks.length > 1 && !atom.id.includes(`-part-${ci + 1}`)) {
              atom.id = `${atom.id}-part-${ci + 1}`;
            }
            const filePath = writeAtom(atom, ticker, sourceReport, ['all']);
            console.log(`    [wrote] ${atom.id} → ${path.relative(PROJECT_ROOT, filePath)}`);
            totalAtoms++;
          }
        }
      } catch (err: any) {
        console.error(`    [error] Quote extraction for ${person} chunk ${ci + 1} failed: ${err.message}`);
      }
    }
  }

  // Rebuild index
  if (!dryRun && totalAtoms > 0) {
    console.log('\n  Rebuilding index...');
    const index = rebuildIndex();
    console.log(`  Index: ${index.atom_count} atoms, ${Object.keys(index.by_archetype).length} archetypes`);
  }

  console.log(`\n  Extraction complete: ${totalAtoms} atoms created`);
}

// CLI entry
if (process.argv[1]?.endsWith('knowledge-extractor.ts') || process.argv[1]?.endsWith('knowledge-extractor.js')) {
  const args: Record<string, string> = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const val = process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[++i] : 'true';
      args[key] = val;
    }
  }

  const ticker = (args.ticker ?? '').toUpperCase();
  if (!ticker) {
    console.error('Usage: npx tsx src/knowledge-extractor.ts --ticker TSM --migrate [--dry-run]');
    process.exit(1);
  }

  const dryRun = args['dry-run'] === 'true';
  const migrate = args['migrate'] === 'true';
  const quotesOnly = args['quotes-only'] === 'true';
  const backend = (args.backend === 'claude' ? 'claude' : 'gemini') as 'gemini' | 'claude';

  if (!migrate && !dryRun) {
    console.error('Usage: npx tsx src/knowledge-extractor.ts --ticker TSM --migrate [--dry-run] [--backend gemini|claude]');
    process.exit(1);
  }

  console.log(`╔══════════════════════════════════════╗`);
  console.log(`║     Knowledge Extractor              ║`);
  console.log(`╚══════════════════════════════════════╝`);
  console.log(`Ticker:   ${ticker}`);
  console.log(`Dry run:  ${dryRun}`);
  console.log(`Backend:  ${backend} ${backend === 'gemini' ? '(single-call)' : '(multi-call)'}`);
  console.log();

  extractKnowledge(ticker, dryRun, quotesOnly, backend).catch((err) => {
    console.error('Fatal:', err);
    process.exit(1);
  });
}

export { extractKnowledge };
