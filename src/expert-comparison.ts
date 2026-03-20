#!/usr/bin/env node
/**
 * Expert Comparison: Per-section before/after analysis
 *
 * Runs 4 focused comparison calls on TSM pre vs post expert-review improvements:
 * 1. Section 2.5 DCF/Valuation methodology depth
 * 2. Section 4.1 Leadership succession risk coverage
 * 3. Section 8.x Bull/Bear + 8.4 falsifiability
 * 4. Blind preference test (truncated full reports)
 *
 * Usage:
 *   npx tsx src/expert-comparison.ts --ticker TSM
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runClaudeAgent } from './llm.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

function extractSection(content: string, sectionId: string): string {
  const re = new RegExp(`^(##\\s*${sectionId.replace('.', '\\.')}\\b.*)`, 'm');
  const match = content.match(re);
  if (!match || match.index == null) return `[Section ${sectionId} not found]`;
  const start = match.index;
  const after = content.slice(start + match[0].length);
  // Find next heading at same or higher level
  const nextHeading = after.match(/\n(#{1,2}\s)/m);
  const end = nextHeading && nextHeading.index != null
    ? start + match[0].length + nextHeading.index
    : Math.min(start + 15000, content.length);
  return content.slice(start, end).trim();
}

function extractSections(content: string, ids: string[]): string {
  return ids.map(id => extractSection(content, id)).join('\n\n---\n\n');
}

interface ComparisonResult {
  call: number;
  title: string;
  verdict: string;
  reasoning: string;
}

async function main() {
  const args: Record<string, string> = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const val = process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[++i] : 'true';
      args[key] = val;
    }
  }

  const ticker = (args.ticker ?? 'TSM').toUpperCase();
  const dir = path.join(PROJECT_ROOT, 'data', 'companies', ticker);
  const prePath = path.join(dir, `${ticker}_Initial_MAX_v1_pre_expert.md`);
  const postPath = path.join(dir, `${ticker}_Initial_MAX.md`);

  if (!fs.existsSync(prePath)) {
    console.error(`Pre-improvement snapshot not found: ${prePath}`);
    process.exit(1);
  }
  if (!fs.existsSync(postPath)) {
    console.error(`Post-improvement report not found: ${postPath}`);
    process.exit(1);
  }

  const pre = fs.readFileSync(prePath, 'utf-8');
  const post = fs.readFileSync(postPath, 'utf-8');
  const results: ComparisonResult[] = [];
  let totalCost = 0;

  console.log('╔══════════════════════════════════════╗');
  console.log('║  Expert Comparison: Before vs After   ║');
  console.log('╚══════════════════════════════════════╝\n');

  // Call 1: Section 2.5 DCF/Valuation
  console.log('── Call 1/4: Section 2.5 Valuation Methodology ──');
  const pre25 = extractSection(pre, '2.5');
  const post25 = extractSection(post, '2.5');
  const { result: r1, costUsd: c1 } = await runClaudeAgent(
    'You are a CFA charterholder reviewing equity research quality.',
    `Compare these two versions of the valuation section (Section 2.5) for the same company.

## BEFORE (Report A):
${pre25.slice(0, 25000)}

## AFTER (Report B):
${post25.slice(0, 25000)}

## Task:
1. Compare valuation methodology depth: How many distinct methods used? (P/E, EV/EBITDA, P/FCF, DCF, etc.)
2. Compare data quality: Are assumptions sourced? Sensitivity analysis present?
3. Compare actionability: Does the reader get a clear fair value range?

Output a JSON object (no code fence):
{"verdict": "A" or "B" or "tie", "score_A": 1-10, "score_B": 1-10, "reasoning": "2-3 sentences explaining key differences"}`,
    { model: 'sonnet', allowedTools: [], maxBudgetUsd: 0.5 },
  );
  totalCost += c1;
  console.log(`  Cost: $${c1.toFixed(2)}`);
  try {
    const p1 = JSON.parse(r1.match(/\{[\s\S]*\}/)?.[0] ?? '{}');
    results.push({ call: 1, title: '2.5 Valuation Methodology', verdict: p1.verdict ?? 'unknown', reasoning: p1.reasoning ?? r1.slice(0, 200) });
    console.log(`  Verdict: ${p1.verdict} (A:${p1.score_A} B:${p1.score_B})`);
  } catch { results.push({ call: 1, title: '2.5 Valuation Methodology', verdict: 'parse_error', reasoning: r1.slice(0, 200) }); }

  // Call 2: Section 4.1 Leadership/Succession
  console.log('\n── Call 2/4: Section 4.1 Leadership & Succession ──');
  const pre41 = extractSection(pre, '4.1');
  const post41 = extractSection(post, '4.1');
  const { result: r2, costUsd: c2 } = await runClaudeAgent(
    'You are a governance analyst reviewing leadership risk coverage.',
    `Compare these two versions of the leadership section (Section 4.1) for the same company.

## BEFORE (Report A):
${pre41.slice(0, 25000)}

## AFTER (Report B):
${post41.slice(0, 25000)}

## Task:
1. Does each version state CEO age and tenure explicitly?
2. Does each version profile next-generation leaders (SVP/EVP level)?
3. Does each version assess bench depth (high/medium/low)?
4. Does each version discuss succession plan disclosure?

Output a JSON object (no code fence):
{"verdict": "A" or "B" or "tie", "score_A": 1-10, "score_B": 1-10, "reasoning": "2-3 sentences on succession risk coverage differences"}`,
    { model: 'sonnet', allowedTools: [], maxBudgetUsd: 0.5 },
  );
  totalCost += c2;
  console.log(`  Cost: $${c2.toFixed(2)}`);
  try {
    const p2 = JSON.parse(r2.match(/\{[\s\S]*\}/)?.[0] ?? '{}');
    results.push({ call: 2, title: '4.1 Leadership & Succession', verdict: p2.verdict ?? 'unknown', reasoning: p2.reasoning ?? r2.slice(0, 200) });
    console.log(`  Verdict: ${p2.verdict} (A:${p2.score_A} B:${p2.score_B})`);
  } catch { results.push({ call: 2, title: '4.1 Leadership & Succession', verdict: 'parse_error', reasoning: r2.slice(0, 200) }); }

  // Call 3: Section 8.x Bull/Bear + 8.4 Falsifiability
  console.log('\n── Call 3/4: Section 8.x Bull/Bear + Falsifiability ──');
  const pre8 = extractSections(pre, ['8.1', '8.2', '8.3', '8.4']);
  const post8 = extractSections(post, ['8.1', '8.2', '8.3', '8.4']);
  const { result: r3, costUsd: c3 } = await runClaudeAgent(
    'You are an investment committee member evaluating intellectual honesty.',
    `Compare the bull/bear analysis sections (8.1-8.4) from two versions of the same research report.

## BEFORE (Report A):
${pre8.slice(0, 25000)}

## AFTER (Report B):
${post8.slice(0, 25000)}

## Task:
1. Compare falsifiability: Does each version have specific, measurable triggers that would invalidate the thesis?
2. Compare balance: Are bull and bear arguments equally strong?
3. Does either version have section 8.4 "What Would Change Our Mind?" with time-bound, metric-based triggers?
4. Compare intellectual honesty: Does the report acknowledge what could go wrong with specific thresholds?

Output a JSON object (no code fence):
{"verdict": "A" or "B" or "tie", "score_A": 1-10, "score_B": 1-10, "has_8_4_A": true/false, "has_8_4_B": true/false, "reasoning": "2-3 sentences on falsifiability and intellectual honesty"}`,
    { model: 'sonnet', allowedTools: [], maxBudgetUsd: 0.5 },
  );
  totalCost += c3;
  console.log(`  Cost: $${c3.toFixed(2)}`);
  try {
    const p3 = JSON.parse(r3.match(/\{[\s\S]*\}/)?.[0] ?? '{}');
    results.push({ call: 3, title: '8.x Bull/Bear + Falsifiability', verdict: p3.verdict ?? 'unknown', reasoning: p3.reasoning ?? r3.slice(0, 200) });
    console.log(`  Verdict: ${p3.verdict} (A:${p3.score_A} B:${p3.score_B}) 8.4: A=${p3.has_8_4_A} B=${p3.has_8_4_B}`);
  } catch { results.push({ call: 3, title: '8.x Bull/Bear + Falsifiability', verdict: 'parse_error', reasoning: r3.slice(0, 200) }); }

  // Call 4: Blind preference test (Opus, truncated to 50K each)
  console.log('\n── Call 4/4: Blind Preference Test (Opus) ──');
  const { result: r4, costUsd: c4 } = await runClaudeAgent(
    'You are a portfolio manager at a $2B fund evaluating research reports for investment decisions.',
    `You are shown two anonymized equity research reports on the same company. Read both carefully.

## REPORT A (anonymized):
${pre.slice(0, 50000)}

## REPORT B (anonymized):
${post.slice(0, 50000)}

## Task:
Which report would you trust MORE for making an investment decision? Consider:
1. Depth of valuation analysis (multiple methods vs single)
2. Leadership risk assessment (succession planning)
3. Intellectual honesty (falsifiable triggers, balanced bull/bear)
4. Data sourcing quality (clickable URLs, cited sources)
5. Overall analytical rigor

You MUST pick one. No ties allowed.

Output a JSON object (no code fence):
{"preferred": "A" or "B", "confidence": "high" or "medium" or "low", "reasoning": "3-5 sentences explaining your preference", "strengths_A": ["..."], "strengths_B": ["..."]}`,
    { model: 'opus', allowedTools: [], maxBudgetUsd: 3 },
  );
  totalCost += c4;
  console.log(`  Cost: $${c4.toFixed(2)}`);
  try {
    const p4 = JSON.parse(r4.match(/\{[\s\S]*\}/)?.[0] ?? '{}');
    results.push({ call: 4, title: 'Blind Preference Test', verdict: p4.preferred ?? 'unknown', reasoning: p4.reasoning ?? r4.slice(0, 300) });
    console.log(`  Preferred: Report ${p4.preferred} (confidence: ${p4.confidence})`);
  } catch { results.push({ call: 4, title: 'Blind Preference Test', verdict: 'parse_error', reasoning: r4.slice(0, 300) }); }

  // Write comparison report
  const report = `# Expert Comparison Report: ${ticker} Pre vs Post Expert Review

Generated: ${new Date().toISOString()}
Total cost: $${totalCost.toFixed(2)}

## Summary

| # | Comparison | Verdict | Reasoning |
|---|-----------|---------|-----------|
${results.map(r => `| ${r.call} | ${r.title} | **${r.verdict}** | ${r.reasoning.replace(/\n/g, ' ').slice(0, 150)} |`).join('\n')}

## Methodology
- Calls 1-3: Sonnet (per-section focused comparison)
- Call 4: Opus (blind preference test on truncated full reports)
- Report A = pre-improvement snapshot (v1_pre_expert)
- Report B = post-improvement (current)

## Detailed Results

${results.map(r => `### Call ${r.call}: ${r.title}
**Verdict:** ${r.verdict}
**Reasoning:** ${r.reasoning}
`).join('\n')}
`;

  const reportPath = path.join(dir, 'expert_comparison_report.md');
  fs.writeFileSync(reportPath, report);
  console.log(`\n✓ Comparison report written to: ${reportPath}`);
  console.log(`Total comparison cost: $${totalCost.toFixed(2)}`);

  // Write improvement metrics JSON
  const preScorePath = path.join(dir, 'initial_max_score_0.json');
  let preScore = 0;
  if (fs.existsSync(preScorePath)) {
    try { preScore = JSON.parse(fs.readFileSync(preScorePath, 'utf-8')).total ?? 0; } catch {}
  }

  // Try to find latest score file
  let postScore = 0;
  const allFiles = fs.readdirSync(dir);
  const scoreFiles = allFiles.filter(f => f.startsWith('initial_max_score_') && f.endsWith('.json')).sort();
  if (scoreFiles.length > 0) {
    try { postScore = JSON.parse(fs.readFileSync(path.join(dir, scoreFiles[scoreFiles.length - 1]), 'utf-8')).total ?? 0; } catch {}
  }

  const metrics = {
    pre_score: preScore,
    post_score: postScore,
    items_implemented: ['multi-metric-valuation', 'falsifiable-triggers', 'succession-risk'],
    items_deferred: ['dcf-waterfall', 'fx-sensitivity'],
    items_cut: ['consensus-comparison', 'capacity-model'],
    blind_preference: results.find(r => r.call === 4)?.verdict ?? 'unknown',
    blind_preference_reasoning: results.find(r => r.call === 4)?.reasoning ?? '',
    per_section_deltas: Object.fromEntries(results.filter(r => r.call <= 3).map(r => [r.title, r.verdict])),
    comparison_cost_usd: totalCost,
    next_sprint_priorities: ['DCF waterfall with sanity bounds', 'FX sensitivity', 'industry-gating config'],
  };

  const metricsPath = path.join(dir, 'improvement_metrics.json');
  fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2));
  console.log(`✓ Metrics written to: ${metricsPath}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
