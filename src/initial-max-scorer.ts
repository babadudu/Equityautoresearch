/**
 * Initial MAX Scorer — v2 (Scorer Reliability + Rubric Reform)
 *
 * Two-channel scoring: structural (heuristic, 0-37) + quality (LLM, 0-60).
 * 5 dimensions: 環境(18), 生意(30), 組織(17), 人(20), 論點(15).
 * Per-dimension LLM calls: remote uses 3-call median; MLX uses deterministic
 * single-pass by default (set SCORER_MLX_SINGLE_PASS=0 to restore median).
 * Reference-anchored pairwise calibration vs FUTU report.
 *
 * Usage (standalone):
 *   npx tsx src/initial-max-scorer.ts --ticker FUTU
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chat } from './llm.js';
import {
  MODELS, SCORER_NUM_CALLS, STRUCTURAL_MAX, QUALITY_MAX,
  PASS_THRESHOLD, STRUCTURAL_PASS_MIN, QUALITY_PASS_MIN,
  SCORER_THINKING_BUDGET, SCORER_MAX_RETRIES,
} from './config.js';
import { hashRubricSet } from './rubric-versions.js';
import { appendScoringEvent, type ScoringEvent } from './scoring-store.js';
import { appendTrace } from './run-trace.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

/** Required subsections (1.1–4.2) — all must have substantive content to pass */
const REQUIRED_SECTIONS = ['1.1', '1.2', '1.3', '1.4', '2.1', '2.2', '2.3', '2.4', '2.5', '3.1', '3.2', '3.3', '4.1', '4.2'];
const MIN_SECTION_CHARS = 80;

// ── New dimension weights (Phase 2.1) ──
const WEIGHTS = { 環境: 18, 生意: 30, 組織: 17, 人: 20, 論點: 15 } as const;
type Dimension = keyof typeof WEIGHTS;
const ALL_DIMENSIONS: Dimension[] = ['環境', '生意', '組織', '人', '論點'];

// ── Types ──

export interface DimensionScore {
  score: number;
  max: number;
  criteria?: Record<string, number>;
  gaps: string[];
}

export interface InitialMaxScore {
  環境: DimensionScore;
  生意: DimensionScore;
  組織: DimensionScore;
  人: DimensionScore;
  論點: DimensionScore;
  structural: number;
  quality: number;
  total: number;
  passThreshold: boolean;
  round: number;
  rubricVersion?: string;
  structuralBreakdown?: Record<string, number>;
  structuralDetails?: string[];
  scorerStatus?: 'full' | 'llm_partial_failure';
  scorerPartialFailure?: boolean;
  scoringCostUsd?: number;
}

interface GapItem {
  dimension: string;
  item: string;
  current: number | string;
  target: string;
  shortfall: number;
  priority: number;
}

export interface InitialMaxGaps {
  round: number;
  score: number;
  gaps: GapItem[];
}

export interface ExtendedScore {
  core: InitialMaxScore;
  geopolitical?: DimensionScore;
  sustainability?: DimensionScore;
  contrarian?: DimensionScore;
  extendedTotal: number;
  scoringCostUsd?: number;
}

const EXTENDED_SECTIONS = ['6.1', '6.2', '6.3', '7.1', '7.2', '7.3', '8.1', '8.2', '8.3', '8.4'];

// ── File reading helpers ──

function getCompanyDir(ticker: string): string {
  return path.join(PROJECT_ROOT, 'data', 'companies', ticker);
}

function readMainFile(ticker: string): string {
  const mainPath = path.join(getCompanyDir(ticker), `${ticker}_Initial_MAX.md`);
  return fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf-8') : '';
}

function readResearchFiles(ticker: string): string {
  const dir = getCompanyDir(ticker);
  if (!fs.existsSync(dir)) return '';

  const targetFiles = [
    `${ticker}_Initial_MAX.md`,
    `${ticker}_Super_Initial_*.md`,
    `${ticker}_Initial_*.md`,
    'initial_financial.md',
    'initial_business_model.md',
    'initial_market_size.md',
    'initial_management.md',
    'initial_products_services.md',
    'initial_competition.md',
    'super_initial_section_*.md',
    'super_initial_five_forces_*.md',
    `dcf_valuation_*.md`,
  ];

  const collected: string[] = [];
  const allFiles = fs.readdirSync(dir);

  for (const pattern of targetFiles) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    for (const f of allFiles) {
      if (regex.test(f)) {
        const fullPath = path.join(dir, f);
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          collected.push(`\n\n=== ${f} ===\n${content.slice(0, 15000)}`);
        } catch {}
      }
    }
  }

  const transcriptsDir = path.join(dir, 'transcripts');
  if (fs.existsSync(transcriptsDir)) {
    const transcriptFiles = fs.readdirSync(transcriptsDir).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
    collected.push(`\n\n=== TRANSCRIPTS INDEX (${transcriptFiles.length} files downloaded) ===\n${transcriptFiles.join('\n')}`);
  }

  return collected.join('');
}

/** Check whether every required subsection (1.1–4.2) has substantive content */
function checkAllSectionsCovered(mainContent: string): { allCovered: boolean; missing: string[] } {
  const missing: string[] = [];
  for (const id of REQUIRED_SECTIONS) {
    const re = new RegExp(`^##\\s*${id.replace('.', '\\.')}\\b.*$`, 'm');
    const match = mainContent.match(re);
    if (!match || match.index == null) {
      missing.push(id);
      continue;
    }
    const sectionStart = match.index! + match[0].length;
    const after = mainContent.slice(sectionStart);
    const nextHeading = after.match(/\n##\s/m);
    const sectionEnd = nextHeading && nextHeading.index != null ? sectionStart + nextHeading.index : mainContent.length;
    const body = mainContent.slice(sectionStart, sectionEnd).replace(/\s+/g, ' ').trim();
    if (body.length < MIN_SECTION_CHARS || /^待補充\s*$/i.test(body)) missing.push(id);
  }
  return { allCovered: missing.length === 0, missing };
}

// ── Section extraction per dimension (Phase 1.2) ──

function extractSectionContent(mainContent: string, sectionIds: string[]): string {
  const extracted: string[] = [];
  for (const id of sectionIds) {
    const re = new RegExp(`^##\\s*${id.replace('.', '\\.')}\\b.*$`, 'm');
    const match = mainContent.match(re);
    if (!match || match.index == null) continue;
    const sectionStart = match.index!;
    const after = mainContent.slice(sectionStart + match[0].length);
    const nextHeading = after.match(/\n##\s/m);
    const sectionEnd = nextHeading && nextHeading.index != null
      ? sectionStart + match[0].length + nextHeading.index
      : mainContent.length;
    extracted.push(mainContent.slice(sectionStart, sectionEnd));
  }
  return extracted.join('\n\n');
}

function extractIntroContent(mainContent: string): string {
  const firstNumberedSection = mainContent.search(/^##\s*1\.1\b/m);
  const intro = firstNumberedSection >= 0 ? mainContent.slice(0, firstNumberedSection) : mainContent;
  return intro.slice(0, 20000);
}

function extractDimensionContent(mainContent: string, dimension: Dimension): string {
  const sectionMap: Record<Dimension, string[]> = {
    環境: ['1.1', '1.2', '1.3', '1.4'],
    生意: ['2.1', '2.2', '2.3', '2.4', '2.5'],
    組織: ['1.4', '3.1', '3.2', '3.3'],
    人: ['4.1', '4.2'],
    論點: ['2.5', '8.1', '8.2', '8.3', '8.4'],
  };

  let content = extractSectionContent(mainContent, sectionMap[dimension]);

  // For 生意, also include executive summary
  if (dimension === '生意') {
    content = extractIntroContent(mainContent).slice(0, 5000) + '\n\n' + content;
  }

  // For 論點, the actionable recommendation and variant perception often live
  // before numbered sections, not in 8.x. Include that opening block so the
  // scorer evaluates the thesis text the gap-filler actually edits.
  if (dimension === '論點') {
    content = extractIntroContent(mainContent).slice(0, 12000) + '\n\n' + content;
  }

  // For 人, include interview table if present
  if (dimension === '人') {
    const interviewMatch = mainContent.match(/訪談.*\|[\s\S]*?\n\n/m);
    if (interviewMatch) content += '\n\n' + interviewMatch[0];
  }

  // Cap at ~20K chars per dimension (the key variance reducer)
  return content.slice(0, 20000);
}

// ══════════════════════════════════════════════════════════════
// CHANNEL A: Structural Completeness (heuristic, deterministic)
// Max 37 points (8+6+6+6+4+4+3, minus up to 3 consistency deductions)
// ══════════════════════════════════════════════════════════════

interface StructuralResult {
  score: number;
  breakdown: Record<string, number>;
  details: string[];
}

function scoreStructural(ticker: string): StructuralResult {
  const dir = getCompanyDir(ticker);
  const mainPath = path.join(dir, `${ticker}_Initial_MAX.md`);
  const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf-8') : '';
  const breakdown: Record<string, number> = {};
  const details: string[] = [];

  if (!mainContent) {
    return { score: 0, breakdown: {}, details: ['No main file found'] };
  }

  // 1. Section coverage (0-8): all 14 sections present with ≥80 chars
  const { allCovered, missing } = checkAllSectionsCovered(mainContent);
  const coveredCount = REQUIRED_SECTIONS.length - missing.length;
  breakdown['sections_covered'] = allCovered ? 8 : Math.floor((coveredCount / REQUIRED_SECTIONS.length) * 6);
  if (missing.length > 0) details.push(`Missing sections: ${missing.join(', ')}`);

  // 2. DCF structural elements (0-6): WACC + scenarios + sensitivity
  let dcfScore = 0;
  const section25 = mainContent.match(/##\s*2\.5[\s\S]*?(?=\n#\s|\n##\s[^2]|$)/);
  if (section25) {
    if (/WACC|加權平均|折現率/i.test(section25[0])) dcfScore += 1;
    const scenarioCount = (section25[0].match(/樂觀|保守|合理|optimistic|conservative|base case/gi) ?? []).length;
    if (scenarioCount >= 2) dcfScore += 1;
    if (/sensitivity|敏感度/i.test(section25[0])) dcfScore += 1;
    // Multi-method
    const hasEV = /EV\/EBITDA|EV.EBITDA/i.test(section25[0]);
    const hasPFCF = /P\/FCF|price.to.free.cash/i.test(section25[0]);
    const hasPE = /P\/E|本益比/i.test(section25[0]);
    if ([hasEV, hasPFCF, hasPE].filter(Boolean).length >= 2) dcfScore += 2;
    else if ([hasEV, hasPFCF, hasPE].filter(Boolean).length >= 1) dcfScore += 1;
    // Fair value stated
    if (/公允價值|fair value|目標價|price target/i.test(section25[0])) dcfScore += 1;
  } else {
    details.push('Section 2.5 (DCF) not found');
  }
  breakdown['dcf_structure'] = Math.min(dcfScore, 6);

  // 3. Interview count (0-6): concave scoring
  const transcriptsDir = path.join(dir, 'transcripts');
  let interviewCount = 0;
  if (fs.existsSync(transcriptsDir)) {
    interviewCount = fs.readdirSync(transcriptsDir).filter(f => f.endsWith('.md') || f.endsWith('.txt')).length;
  }
  // Concave: 0→0, 10→4, 15→5, 20→5.5, 25+→6
  let interviewScore: number;
  if (interviewCount === 0) interviewScore = 0;
  else if (interviewCount <= 10) interviewScore = Math.floor((interviewCount / 10) * 4);
  else if (interviewCount <= 15) interviewScore = 4 + Math.floor(((interviewCount - 10) / 5));
  else if (interviewCount <= 25) interviewScore = 5 + Math.floor(((interviewCount - 15) / 10));
  else interviewScore = 6;
  breakdown['interview_count'] = Math.min(interviewScore, 6);
  details.push(`Interviews: ${interviewCount}`);

  // 4. URL citation count (0-6): concave
  const urlCount = (mainContent.match(/https?:\/\//g) ?? []).length;
  let urlScore: number;
  if (urlCount < 10) urlScore = 0;
  else if (urlCount < 20) urlScore = 2;
  else if (urlCount < 40) urlScore = 3;
  else if (urlCount < 60) urlScore = 4;
  else if (urlCount < 100) urlScore = 5;
  else urlScore = 6;
  breakdown['url_citations'] = urlScore;
  details.push(`URLs: ${urlCount}`);

  // 5. Quote count with proper formatting (0-4)
  const directQuotes = (mainContent.match(/「[^」]{10,}」|"[^"]{10,}"|『[^』]{10,}』/g) ?? []);
  let quoteScore: number;
  if (directQuotes.length < 10) quoteScore = 0;
  else if (directQuotes.length < 20) quoteScore = 1;
  else if (directQuotes.length < 30) quoteScore = 2;
  else if (directQuotes.length < 40) quoteScore = 3;
  else quoteScore = 4;
  breakdown['quotes'] = quoteScore;
  details.push(`Direct quotes: ${directQuotes.length}`);

  // 6. Financial table years covered (0-4)
  const yearMatches = mainContent.match(/20\d\d/g) ?? [];
  const uniqueYears = new Set(yearMatches).size;
  let yearsScore = 0;
  if (uniqueYears >= 10) yearsScore = 4;
  else if (uniqueYears >= 7) yearsScore = 3;
  else if (uniqueYears >= 5) yearsScore = 2;
  else if (uniqueYears >= 3) yearsScore = 1;
  breakdown['financial_years'] = yearsScore;

  // 7. Five Forces presence (0-3)
  const hasFiveForces = /五力|Five Forces|5a|5b|5c|5d|5e|護城河|moat/i.test(mainContent);
  breakdown['five_forces'] = hasFiveForces ? 3 : 0;

  // 8. Internal consistency checks (Phase 2.4) — deductions (0 to -3)
  const consistencyIssues = checkInternalConsistency(ticker, mainContent);
  breakdown['consistency_deduction'] = -Math.min(consistencyIssues.length, 3);
  if (consistencyIssues.length > 0) details.push(`Consistency issues: ${consistencyIssues.join('; ')}`);

  const total = Math.max(0, Math.min(STRUCTURAL_MAX,
    Object.values(breakdown).reduce((a, b) => a + b, 0)
  ));

  return { score: total, breakdown, details };
}

// ── Internal consistency checks (Phase 2.4) ──

function checkInternalConsistency(ticker: string, mainContent: string): string[] {
  const issues: string[] = [];

  // 1. DCF WACC matches stated WACC in assumptions
  const section25 = mainContent.match(/##\s*2\.5[\s\S]*?(?=\n#\s|\n##\s[^2]|$)/);
  if (section25) {
    const waccValues = section25[0]
      .split(/\r?\n/)
      .filter(line => /WACC|加權平均|折現率/i.test(line))
      .filter(line => !/敏感度|sensitivity|\\\s*WACC|\bvs\.?\s*WACC|terminal growth\s*\\?\s*WACC|at WACC|implied WACC|closer to market/i.test(line))
      .flatMap(line => {
        const explicit = line.match(/(?:WACC|加權平均資本成本|折現率)[^\d\n]*(\d+(?:\.\d+)?)%/i);
        if (explicit) return [parseFloat(explicit[1])];
        return [];
      });
    const uniqueWaccs = [...new Set(waccValues.filter(v => v > 0))];
    if (uniqueWaccs.length > 1) {
      issues.push(`Inconsistent WACC values: ${uniqueWaccs.join('%, ')}%`);
    }

    // 2. Terminal growth < WACC
    const termMatch = section25[0].match(/terminal.*growth[^0-9]*(\d+\.?\d*)%/i) ?? section25[0].match(/終端.*成長[^0-9]*(\d+\.?\d*)%/i);
    if (termMatch && uniqueWaccs.length > 0) {
      const termGrowth = parseFloat(termMatch[1]);
      if (termGrowth >= uniqueWaccs[0]) {
        issues.push(`Terminal growth (${termGrowth}%) >= WACC (${uniqueWaccs[0]}%)`);
      }
    }

    // 3. WACC in reasonable range
    if (uniqueWaccs.length > 0 && (uniqueWaccs[0] < 8 || uniqueWaccs[0] > 14)) {
      issues.push(`WACC (${uniqueWaccs[0]}%) outside 8-14% range`);
    }
  }

  // 4. Interview count matches actual files
  const transcriptsDir = path.join(getCompanyDir(ticker), 'transcripts');
  if (fs.existsSync(transcriptsDir)) {
    const actualFiles = fs.readdirSync(transcriptsDir).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
    const mentionedMatch = mainContent.match(/(?:^|[^\d])(\d{1,2})\s*(?:篇|則|interviews?|transcripts?)/i);
    if (mentionedMatch) {
      const mentioned = parseInt(mentionedMatch[1]);
      if (Math.abs(mentioned - actualFiles.length) > 3) {
        issues.push(`Report claims ${mentioned} interviews but ${actualFiles.length} files in transcripts/`);
      }
    }
  }

  // 5. Geographic revenue section presence check (section 1.4)
  // Find the ## 1.4 heading and measure content until the next heading
  const section14Match = mainContent.match(/##\s*1\.4[\s\S]*?(?=\n##\s|\n#\s|$)/);
  if (!section14Match || section14Match[0].length < 200) {
    issues.push('Geographic revenue section missing or incomplete (expected section 1.4 with >200 chars)');
  }

  return issues;
}

// ══════════════════════════════════════════════════════════════
// CHANNEL B: Analytical Quality (LLM, 3-call median)
// Max 60 points — from 5 dimensions
// ══════════════════════════════════════════════════════════════

// ── Dimension-specific anchored rubric prompts (Phase 1.4) ──

const DIMENSION_PROMPTS: Record<Dimension, string> = {
  環境: `You are an investment research quality reviewer playing three expert roles simultaneously. Evaluate the quality of the **Environment** (industry & market) analysis below.

## Scoring Criteria (max 12 pts)

### TAM & Industry Trend (0-3)
0 = Not mentioned at all
1 = Mentioned only vaguely (e.g., "TAM is large")
2 = Data present but no source (e.g., "TAM $500B")
3 = Multi-source evidence + time series (e.g., 3 different TAM estimates with growth breakdown + URLs)

### Market Structure Analysis (0-3)
0 = Not mentioned at all
1 = Generic description only (e.g., "highly competitive")
2 = Market share data + named players (e.g., "Top 3 players hold 70%")
3 = Concentration analysis + barriers to entry + historical evolution (e.g., HHI trend, moat quantification)

### Regulatory/Policy Environment (0-3)
0 = Not mentioned at all
1 = Regulation names listed only
2 = Regulation + impact analysis (e.g., "CHIPS Act provides $52B, benefiting X")
3 = Regulatory matrix: opportunities + risks + timeline + management quotes responding to policy

### Technology & Demand Trends (0-3)
0 = Not mentioned at all
1 = Trend names listed only
2 = Trends + data support
3 = Adoption curve + demand breakdown + technology roadmap

## Expert Panel (complete before scoring)

**Stock Analyst perspective (near-term catalysts, TAM momentum):**
- Does the TAM momentum identified have visible 12-24 month catalysts (customer capex decisions, regulatory timelines, technology nodes)?
- Are there acceleration signs (AI demand pull, new application penetration) or deceleration risks (customer inventory correction, substitute technologies)?
- Is the regulatory timeline specific enough to affect EPS over the next 2 years?

**Value Investor perspective (market structure, moat durability):**
- Is the market structure trending toward consolidation (deepening moat) or fragmentation (moat erosion)? Does the report have data supporting this?
- Is the competitive advantage structural (scale/IP/switching costs) or cyclical (supply-demand gap)? Does the report distinguish between the two?
- Does the TAM framework identify which market share is "defensible" vs. transient?

**Risk Advisor perspective (asymmetric upside, unpriced optionality):**
- If TAM forecasts are underestimated, what is the 2x upside scenario? Does the report touch on this?
- Is the worst-case regulatory scenario already priced in, or is the market underestimating the probability of a regulatory tailwind?
- Does the report identify emerging opportunities not yet priced in (new geographies, new applications, platform expansion)?

## Scoring Procedure
1. Complete the three expert perspectives above
2. For each sub-criterion, cite specific text from the report as evidence
3. Score against the anchors — do not score based solely on report length

## Output Format (pure JSON, no code fence)
{
  "expert_panel": {"stock_analyst": "...", "value_investor": "...", "risk_advisor": "..."},
  "TAM趨勢": number,
  "市場結構": number,
  "監管政策": number,
  "技術趨勢": number,
  "total": number,
  "evidence": ["..."],
  "gaps": ["..."]
}`,

  生意: `You are an investment research quality reviewer playing three expert roles simultaneously. Evaluate the quality of the **Business** (business model & financials) analysis below.

## Scoring Criteria (max 18 pts)

### Financial History Completeness (0-5)
0 = No financial data
1 = <5 years, revenue only
2 = 5-7 years, basic P&L
3 = 8-10 years with gross margin/operating income/EPS, inflection point notes
4 = 10+ years full table + source URLs
5 = 10+ years + deep inflection narrative + management quote support

### Business Model Depth (0-5)
0 = Not described
1 = Generic description only (e.g., "SaaS model")
2 = Revenue breakdown + basic model explanation
3 = Revenue breakdown + unit economics + management quotes (10+ quotes)
4 = Above + strategic quotes covering ≥3 time periods + source URLs
5 = Integrated analysis: underlying drivers + strategic evolution + cross-validation

### Competitive Moat (0-5)
0 = Not analyzed
1 = Moat types listed only
2 = Five Forces partially complete (3/5)
3 = Five Forces 5a-5e complete + management quote support
4 = Above + moat quantification (switching cost/scale effect/brand premium data)
5 = Full Five Forces + internal logic consistency + management quotes supporting moat view

### DCF Valuation Quality (0-3)
0 = No DCF/valuation
1 = P/E only or single method
2 = ≥2 methods + WACC + scenario table (but missing sensitivity or IRR)
3 = ≥3 methods + WACC decomposition + 3-scenario table + IRR + 3×3 sensitivity + sanity check

## Expert Panel (complete before scoring)

**Value Investor perspective (primary — moat durability, ROIC, capital allocation):**
- Multi-year ROIC vs WACC trend: does the report show ROIC consistently above WACC? How many years of data?
- Capital allocation discipline: what is the FCF conversion rate? Did management control expansion during boom years, or burn cash for growth?
- How durable is the moat? Is it technology leadership (disruptable) or scale/switching costs (more durable)? Does the Five Forces analysis quantify moat strength?

**Stock Analyst perspective (near-term earnings quality, consensus gap):**
- Does the revenue/margin trajectory beat market consensus expectations? Is there data supporting potential EPS upside?
- How visible is revenue (contract backlog percentage, recurring revenue mix)?
- Is there a thesis for multiple expansion or contraction (ROIC improvement → P/E re-rating, moat erosion → valuation discount)?

**Risk Advisor perspective (asymmetric upside, optionality):**
- If the moat is more durable than the market believes, is the bull-case DCF IRR attractive (>15%)?
- Does the report identify option value not yet priced in (new geographies, adjacent market entry, technology licensing)?
- Does the bear-case IRR downside asymmetry support position building relative to potential returns?

## Scoring Procedure
1. Complete the three expert perspectives above
2. Enumerate: does the DCF valuation range converge or conflict with multi-method valuation (P/E, EV/EBITDA)?
3. For each sub-criterion, cite specific text from the report as evidence
4. Score against the anchors

## Output Format (pure JSON, no code fence)
{
  "expert_panel": {"stock_analyst": "...", "value_investor": "...", "risk_advisor": "..."},
  "財務歷史": number,
  "商業模式": number,
  "五力分析": number,
  "DCF投資論文": number,
  "total": number,
  "evidence": ["..."],
  "gaps": ["..."]
}`,

  組織: `You are an investment research quality reviewer playing three expert roles simultaneously. Evaluate the quality of the **Organization** (structure & operations) analysis below.

## Scoring Criteria (max 12 pts)

### Geographic/Business Segments (0-4)
0 = Not mentioned
1 = Major markets listed only
2 = Data present but no source (e.g., "North America is 60%")
3 = Annual report/earnings call source + URL + multi-year data
4 = Multi-year segment data + source URLs + trend analysis + management quote support

### Organizational Culture & Incentives (0-4)
0 = Not mentioned
1 = Generic description only (e.g., "innovative culture")
2 = Specific mechanisms described (equity incentive plan details)
3 = Mechanisms + case examples + management quotes
4 = Mechanisms + case examples + counter-cyclical expansion decisions + talent strategy + sources

### Operational Efficiency (0-4)
0 = Not mentioned
1 = Margin mentioned only
2 = ROIC calculation or Operating Leverage analysis
3 = Multi-year ROIC trend + peer comparison + sources
4 = ROIC + OL + expense ratio breakdown + efficiency improvement driver analysis

## Expert Panel (complete before scoring)

**Value Investor perspective (primary — incentive alignment, ROIC trend, culture as moat):**
- Are incentive mechanisms aligned with long-term shareholder interests (compensation structure vs EPS dilution, buyback timing)? Does the report have specific data?
- What is the 5-year ROIC trend? Improving (good capital allocation) or diluting (growing too fast consuming capital)?
- Is culture a sustainable moat (talent density, innovation mechanisms) or corporate PR? Does the report have examples of counter-cyclical decisions?

**Stock Analyst perspective (geographic mix, efficiency catalysts):**
- Which geographies are accelerating, which are slowing? What is the near-term margin impact of the geographic mix shift?
- Is the expense ratio trend (R&D/SG&A as % of revenue) improving? Are there near-term restructuring or efficiency catalysts?
- Could geographic expansion or contraction trigger management guidance revision (positive or negative EPS revision)?

**Risk Advisor perspective (hidden value, asymmetric efficiency gains):**
- Does the report identify hidden value in sub-segments or geographies not yet fully priced by the market?
- If operational efficiency improvement accelerates (expense ratio down 1-2 percentage points), what is the EPS leverage?
- Does the culture and incentive structure support counter-cyclical expansion at market troughs (exactly when long-term value is created)?

## Scoring Procedure
1. Complete the three expert perspectives above
2. For each sub-criterion, cite specific text from the report as evidence
3. Score against the anchors — do not systematically over-score because the report is lengthy

## Output Format (pure JSON, no code fence)
{
  "expert_panel": {"stock_analyst": "...", "value_investor": "...", "risk_advisor": "..."},
  "地理分部": number,
  "組織文化": number,
  "運營效率": number,
  "total": number,
  "evidence": ["..."],
  "gaps": ["..."]
}`,

  人: `You are an investment research quality reviewer playing three expert roles simultaneously. Evaluate the quality of the **People** (management team) analysis below.

## Scoring Criteria (max 12 pts)

### CEO Philosophy & Business Vision (0-4)
0 = Not mentioned
1 = CEO name and background listed only
2 = Philosophy described but no quotes as evidence
3 = Multi-year narrative + quotes (5+) + sources + inflection point analysis
4 = Full narrative from education onwards + per-period quotes + success/failure reflection + first-principles logic

### Succession Risk & Bench Depth (0-4)
0 = Not mentioned at all
1 = CEO age mentioned only
2 = CEO age + tenure + vague succession description
3 = CEO age + ≥2 next-generation leaders profiled (background, strengths) + bench rating
4 = Above + succession plan disclosure + historical succession cases + sources

### Ethics & Value Creation (0-4)
0 = Not mentioned
1 = Generic description only (e.g., "integrity-driven")
2 = Specific case examples present
3 = Multiple cases + sources + management quotes
4 = Values-driven decisions + long-term cases + link to financial performance

## Expert Panel (complete before scoring)

**Value Investor perspective (primary — capital allocation across cycles, intellectual honesty):**
- How did management allocate capital across a full market cycle (boom and bust)? Were there peak-cycle acquisition mistakes or trough-cycle missed opportunities?
- Does the CEO's philosophy reflect first principles (specific, actionable) or vague "customer first" platitudes? Which decisions does the report cite as philosophical evidence?
- Does management honestly confront failures and challenges (overconfident management is more likely to over-expand)?

**Stock Analyst perspective (guidance track record, succession as catalyst):**
- How accurate has management guidance been historically? Is there a pattern of systematic over- or under-estimation (affecting market guidance discount)?
- Is succession risk a near-term (1-2 year) investment catalyst or risk? Is the successor's style known?
- Does governance risk (related-party transactions, independent director ratio, compensation transparency) affect near-term valuation?

**Risk Advisor perspective (visionary premium, succession as re-rating opportunity):**
- If the founder/visionary CEO role is discounted by the market, could post-succession strategy repositioning trigger a valuation re-rating?
- Does management's counter-cyclical expansion history (increasing R&D during downturns, contrarian acquisitions) represent a long-term compounding acceleration trait?
- Does this management team have "execution optionality" beyond what financial models capture (ability to enter new markets, ecosystem integration)?

## Scoring Procedure
1. Complete the three expert perspectives above
2. For each sub-criterion, cite specific text from the report as evidence
3. Score against the anchors

## Output Format (pure JSON, no code fence)
{
  "expert_panel": {"stock_analyst": "...", "value_investor": "...", "risk_advisor": "..."},
  "格局觀哲學": number,
  "繼任風險": number,
  "道德操守": number,
  "total": number,
  "evidence": ["..."],
  "gaps": ["..."]
}`,

  論點: `You are an investment research quality reviewer playing three expert roles simultaneously. Evaluate the **Investment Thesis quality** of the research report below.

## Scoring Criteria (max 9 pts)

### Variant Perception / Non-Consensus View (0-3)
0 = No clear investment thesis
1 = Buy/sell recommendation but no differentiated view (just restates fundamentals)
2 = Identifies where the market may be wrong, but argument is insufficient
3 = Clear variant perception: market consensus is X, we believe Y because Z (requires data + logic chain)

### Internal Consistency (0-3)
0 = Obvious contradictions
1 = Partially consistent, 1-2 contradictions
2 = Generally consistent, occasional minor contradictions
3 = Fully consistent: DCF assumptions ↔ financial forecasts ↔ TAM analysis ↔ competitive position form a complete logic chain

### Actionability (0-3) — verify each item before scoring
Before scoring, confirm whether the following 5 items **explicitly appear** in the report (do not infer or imply from valuation):
□ A. Explicit BUY / SELL / HOLD text recommendation
□ B. Specific price target (number)
□ C. Explicit time horizon
□ D. ≥3 specific catalysts
□ E. Explicit risk trigger conditions
If "BUY", "SELL", or "HOLD" (or equivalent) cannot be found as explicit text, actionability max is 2.

## Expert Panel (complete before scoring)

**Stock Analyst perspective (catalyst actionability, failure hypothesis):**
- Are catalysts specific enough to verify within 12-24 months (with time points and measurable success criteria)?
- Are failure trigger conditions specific enough ("if X happens, change stance" vs. "if market deteriorates")?
- Is the investment rating (BUY/SELL/HOLD) explicitly stated in text, or only implied by a valuation range?

**Value Investor perspective (thesis durability, analytical consistency):**
- Does the investment thesis hold over a 2-3 year holding period (considering competitive dynamics and industry cycle)?
- Is the analytical framework internally consistent (do valuation assumptions align with competitive position analysis)?
- Are DCF assumptions (WACC, terminal growth rate) consistent with financial history and moat strength?

**Risk Advisor perspective (scenario probability, IRR adequacy):**
- Is the scenario probability weighting reasonable (does the bull-case allocation reflect true probability rather than optimistic bias)?
- Does the base-case IRR adequately compensate for risk (relative to risk-free rate + equity risk premium + idiosyncratic risk)?
- Does the report identify unpriced upside tail (technology breakthrough, geopolitical tailwind) or downside tail (black swan)?

## Scoring Procedure
1. Complete the three expert perspectives above
2. Enumerate internal consistency: do DCF assumptions converge or conflict with multi-method valuation? Is IRR consistent with probability-weighted returns?
3. Enumerate variant perception: what is the stated market consensus? What is the analyst's differentiated view? Is it data-backed?
4. Score based on enumeration — each dimension must cite specific evidence

## Output Format (pure JSON, no code fence)
{
  "expert_panel": {"stock_analyst": "...", "value_investor": "...", "risk_advisor": "..."},
  "非共識觀點": number,
  "內部一致性": number,
  "可行動性": number,
  "total": number,
  "evidence": ["..."],
  "gaps": ["..."]
}`,
};

// All 5 dimensions confirmed calibrated for MLX (median gap ≤ 1 vs Claude in 3×median bake-off):
// 環境: Δ=0, 生意: Δ=0, 組織: Δ=-1, 人: Δ=-1, 論點: Δ=+1 (with structured CoT prompt).
// scoreDimension() routes ALL dimensions to MLX; only 論點 needs a different prompt.
const MLX_ROUTED_DIMENSIONS = new Set<Dimension>(['環境', '生意', '組織', '人', '論點']);

// Prompt overrides for MLX — only dimensions where the standard prompt isn't calibrated.
// 論點 needs checklist-gate + few-shot + expert panel + structured CoT to prevent actionability inflation.
const MLX_DIMENSION_PROMPT_OVERRIDES: Partial<Record<Dimension, string>> = {
  論點: `You are an investment research quality reviewer playing three expert roles simultaneously. Evaluate the **Investment Thesis quality** of the research report below.

## Scoring Criteria (max 9 pts)

### Variant Perception / Non-Consensus View (0-3)
0 = No clear investment thesis
1 = Buy/sell recommendation but no differentiated view (just restates fundamentals)
2 = Identifies where the market may be wrong, but argument is insufficient
3 = Clear variant perception: market consensus is X, we believe Y because Z (requires data + logic chain)

### Internal Consistency (0-3)
0 = Obvious contradictions
1 = Partially consistent, 1-2 contradictions
2 = Generally consistent, occasional minor contradictions
3 = Fully consistent: DCF assumptions ↔ financial forecasts ↔ TAM analysis ↔ competitive position form a complete logic chain

### Actionability (0-3) — verify each item before scoring
Before scoring, confirm one by one whether the following 5 items **explicitly appear** in the report (do not infer or imply from valuation):
□ A. Explicit BUY / SELL / HOLD text recommendation (do not accept "implied buy signal" or "undervaluation" as substitutes)
□ B. Specific price target (number)
□ C. Explicit time horizon (e.g., "12 months", "by end of 2026")
□ D. ≥3 specific catalysts
□ E. Explicit risk trigger conditions

Scoring rules:
- 3: A+B+C+D+E all explicitly present
- 2: Missing A (no explicit buy/sell/hold) but B+C+D+E all present; or has A but missing D or E
- 1: Has buy/sell only but no price target; or multiple items missing
- 0: No conclusion

**Key**: If "BUY", "SELL", or "HOLD" (or equivalent) cannot be found as explicit text, actionability max is 2.

## Counter-Example (do not repeat this mistake)

Input excerpt: "Fair value range $9,500–$11,700, median $10,800. Probability-weighted IRR ~10%.
7 kill-switch conditions provided. N2 production ramp and CoWoS expansion are primary catalysts."

Wrong score: {"可行動性": 3, ...}
Correct score: {"可行動性": 2, ...}
Reason: valuation range ≠ explicit BUY recommendation; IRR ≠ investment rating; no "BUY/SELL/HOLD" text → Item A missing → max 2.

## Expert Panel (complete before scoring)

**Stock Analyst perspective (catalyst actionability, failure hypothesis):**
- Are catalysts specific enough to verify within 12-24 months (with time points and measurable success criteria)?
- Are failure trigger conditions specific enough ("if X happens, change stance" vs. "if market deteriorates")?
- Is the investment rating (BUY/SELL/HOLD) explicitly stated in text, or only implied by a valuation range?

**Value Investor perspective (thesis durability, analytical consistency):**
- Does the investment thesis hold over a 2-3 year holding period (considering competitive dynamics and industry cycle)?
- Is the analytical framework internally consistent (do valuation assumptions align with competitive position analysis)?
- Are DCF assumptions (WACC, terminal growth rate) consistent with financial history and moat strength?

**Risk Advisor perspective (scenario probability, IRR adequacy):**
- Is the scenario probability weighting reasonable (does the bull-case allocation reflect true probability rather than optimistic bias)?
- Does the base-case IRR adequately compensate for risk (relative to risk-free rate + equity risk premium + idiosyncratic risk)?
- Does the report identify unpriced upside tail (technology breakthrough, geopolitical tailwind) or downside tail (black swan)?

## Scoring Procedure (complete in order)

### Step 1: Enumerate internal consistency (before scoring)
List the following first, then score:
- DCF valuation range vs P/E/EV-EBITDA multi-method → do they converge or contradict?
- Report IRR/return vs tail risk/failure scenarios → is probability weighting consistent?
- Bull scenario vs bear scenario → do they share the same analyst stance, or are they just neutrally juxtaposed?

### Step 2: Enumerate variant perception (before scoring)
List the following first, then score:
- What market consensus does the report explicitly state?
- What is the analyst's differentiated view vs consensus?
- Is that differentiated claim data-backed or just assertion? (answer "yes + data citation" or "no + reason")

### Step 3: Score based on enumeration — each dimension must cite specific items from the steps above

## Output Format (pure JSON, no code fence)
{
  "expert_panel": {"stock_analyst": "...", "value_investor": "...", "risk_advisor": "..."},
  "enumeration": {
    "consistency": {"dcf_vs_multiples": "...", "irr_vs_tail_risk": "...", "bull_bear_stance": "..."},
    "variant_perception": {"stated_consensus": "...", "analyst_diff": "...", "data_backed": "yes/no + reason"}
  },
  "checklist": {"A_explicit_rating": true, "B_price_target": true, "C_timeframe": true, "D_catalysts_3plus": true, "E_risk_triggers": true},
  "非共識觀點": number,
  "內部一致性": number,
  "可行動性": number,
  "total": number,
  "evidence": ["..."],
  "gaps": ["..."]
}`,
};

function scorerBackendIntent(dimension: Dimension): 'mlx' | 'remote' {
  return MLX_ROUTED_DIMENSIONS.has(dimension) ? 'mlx' : 'remote';
}

function effectiveDimensionPrompt(dimension: Dimension): string {
  return scorerBackendIntent(dimension) === 'mlx'
    ? (MLX_DIMENSION_PROMPT_OVERRIDES[dimension] ?? DIMENSION_PROMPTS[dimension])
    : DIMENSION_PROMPTS[dimension];
}

function effectiveRubricSet(): Record<Dimension, string> {
  return Object.fromEntries(
    ALL_DIMENSIONS.map(dim => [
      dim,
      `backend:${scorerBackendIntent(dim)}\n${effectiveDimensionPrompt(dim)}`,
    ]),
  ) as Record<Dimension, string>;
}

// Quality score mapping: LLM raw → quality points (normalized to 60 total)
// Raw totals: 環境 12 + 生意 18 + 組織 12 + 人 12 + 論點 9 = 63 raw max
const RAW_MAX = 63;

// Canonical key names per dimension — maps LLM output to expected keys
const CANONICAL_CRITERIA_KEYS: Record<Dimension, string[]> = {
  環境: ['TAM趨勢', '市場結構', '監管政策', '技術趨勢'],
  生意: ['財務歷史', '商業模式', '五力分析', 'DCF投資論文'],
  組織: ['組織文化', '地理分部', '運營效率'],
  人: ['格局觀哲學', '繼任風險', '道德操守'],
  論點: ['非共識觀點', '內部一致性', '可行動性'],
};

/** Find the canonical key that best matches a returned key (prefix match) */
function findCanonicalKey(returnedKey: string, canonicalKeys: string[]): string {
  // Exact match first
  if (canonicalKeys.includes(returnedKey)) return returnedKey;
  // Prefix match: if returned key starts with or is a prefix of a canonical key
  for (const ck of canonicalKeys) {
    if (ck.startsWith(returnedKey) || returnedKey.startsWith(ck)) return ck;
  }
  // Substring match: if returned key is contained in a canonical key or vice versa
  for (const ck of canonicalKeys) {
    if (ck.includes(returnedKey) || returnedKey.includes(ck)) return ck;
  }
  return returnedKey; // fallback to original
}

function looseParseDimensionJson(jsonText: string, dimension: Dimension): any | null {
  const canonicalKeys = CANONICAL_CRITERIA_KEYS[dimension] ?? [];
  const parsed: Record<string, number | string[]> = {};
  for (const key of canonicalKeys) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = jsonText.match(new RegExp(`["']?${escaped}["']?\\s*[:：]\\s*(\\d+(?:\\.\\d+)?)`));
    if (match) parsed[key] = Number(match[1]);
  }
  const numericKeys = Object.keys(parsed);
  if (numericKeys.length === 0) return null;
  const totalMatch = jsonText.match(/["']?total["']?\s*[:：]\s*(\d+(?:\.\d+)?)/i);
  parsed.total = totalMatch
    ? Number(totalMatch[1])
    : numericKeys.reduce((sum, key) => sum + Number(parsed[key] ?? 0), 0);
  parsed.gaps = [];
  return parsed;
}

/** Call LLM for one dimension, return sub-criteria scores */
async function scoreDimension(
  dimension: Dimension,
  sectionContent: string,
  ticker: string,
  model: string,
): Promise<{ subCriteria: Record<string, number>; total: number; gaps: string[]; costUsd: number; backend: string; model: string } | null> {
  if (sectionContent.trim().length < 50) {
    return { subCriteria: {}, total: 0, gaps: [`${dimension}: content too short to score`], costUsd: 0, backend: 'skipped', model: 'none' };
  }

  const useMlx = scorerBackendIntent(dimension) === 'mlx';
  const systemPrompt = effectiveDimensionPrompt(dimension);
  const userMessage = `請評分以下 ${ticker} 研究報告的「${dimension}」維度：

${sectionContent}`;

  try {
    const response = await chat(
      systemPrompt,
      [{ role: 'user', content: userMessage }],
      useMlx
        ? { maxTokens: 4096, backend: 'mlx' as const }
        : { model, maxTokens: 4096, thinkingBudget: SCORER_THINKING_BUDGET },
    );

    if (!response.content) return null;

    let jsonStr = response.content.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();

    const start = jsonStr.indexOf('{');
    if (start === -1) return null;
    let depth = 0, end = -1;
    for (let i = start; i < jsonStr.length; i++) {
      if (jsonStr[i] === '{') depth++;
      else if (jsonStr[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) return null;

    // Sanitize CJK fullwidth punctuation that MLX models sometimes emit inside JSON values.
    const CJK_PUNCT: Record<string, string> = { '。': '.', '，': ',', '：': ':', '；': ';', '！': '!', '？': '?' };
    const candidate = jsonStr.slice(start, end + 1).replace(/[。，：；！？]/g, c => CJK_PUNCT[c] ?? c);
    let parsed: any;
    try {
      parsed = JSON.parse(candidate);
    } catch (parseErr: any) {
      parsed = looseParseDimensionJson(candidate, dimension);
      if (!parsed) throw parseErr;
      console.log(`  [scorer] ${dimension}: recovered scores from malformed MLX JSON`);
    }
    const { total, evidence, gaps, ...subCriteria } = parsed;

    // Normalize keys to canonical names (LLM may return abbreviations)
    const canonicalKeys = CANONICAL_CRITERIA_KEYS[dimension];
    const normalized: Record<string, number> = {};
    if (canonicalKeys) {
      for (const [key, val] of Object.entries(subCriteria)) {
        if (typeof val !== 'number') continue;
        const canonical = findCanonicalKey(key, canonicalKeys);
        normalized[canonical] = val;
      }
    } else {
      for (const [key, val] of Object.entries(subCriteria)) {
        if (typeof val === 'number') normalized[key] = val;
      }
    }

    const computedTotal = Object.values(normalized).reduce((a, b) => a + b, 0);

    return {
      subCriteria: normalized,
      total: typeof total === 'number' ? total : computedTotal,
      gaps: Array.isArray(gaps) ? gaps : [],
      costUsd: response.usage.costUsd,
      backend: response.backend ?? (useMlx ? 'mlx' : 'unknown'),
      model: response.model ?? (useMlx ? 'mlx-local' : model),
    };
  } catch (err: any) {
    console.error(`  [scorer] ${dimension} LLM error: ${err.message}`);
    return null;
  }
}

/** Take median of N numbers */
function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/** Calculate variance of numbers */
function variance(nums: number[]): number {
  if (nums.length < 2) return 0;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  return nums.reduce((a, b) => a + (b - mean) ** 2, 0) / (nums.length - 1);
}

function scorerTargetCalls(dimension: Dimension): number {
  if (scorerBackendIntent(dimension) !== 'mlx') return SCORER_NUM_CALLS;
  return process.env.SCORER_MLX_SINGLE_PASS === '0' ? SCORER_NUM_CALLS : 1;
}

/** Phase 1.2: Score all dimensions with adaptive median/single-pass */
async function llmScoreStructured(
  ticker: string,
  mainContent: string,
  model: string = MODELS.CLAUDE,
): Promise<{
  dimensions: Record<Dimension, { score: number; criteria: Record<string, number>; gaps: string[] }>;
  rawCalls: ScoringEvent['rawCalls'];
  totalRaw: number;
  totalVariance: number;
  perDimensionVariance: Record<string, number>;
  backendByDimension: Record<string, string>;
  modelByDimension: Record<string, string>;
  scorerPartialFailure: boolean;
  scoringCostUsd: number;
} | null> {
  const dimensions: Record<string, { score: number; criteria: Record<string, number>; gaps: string[] }> = {};
  const rawCalls: ScoringEvent['rawCalls'] = [];
  const perDimensionVariance: Record<string, number> = {};
  const backendByDimension: Record<string, string> = {};
  const modelByDimension: Record<string, string> = {};
  let anySuccess = false;
  let scorerPartialFailure = false;
  let scoringCostUsd = 0;

  for (const dim of ALL_DIMENSIONS) {
    const sectionContent = extractDimensionContent(mainContent, dim);
    const callResults: Array<{ subCriteria: Record<string, number>; total: number; gaps: string[]; costUsd: number; backend: string; model: string }> = [];

    const targetCalls = scorerTargetCalls(dim);
    const minValidCalls = targetCalls >= 2 ? 2 : 1;

    // Remote: 3 calls per dimension with median. MLX: single deterministic call
    // by default; retry still protects malformed JSON or transient server errors.
    for (let i = 0; i < targetCalls; i++) {
      let result: Awaited<ReturnType<typeof scoreDimension>> = null;
      for (let retry = 0; retry <= SCORER_MAX_RETRIES; retry++) {
        result = await scoreDimension(dim, sectionContent, ticker, model);
        if (result) break;
        if (retry < SCORER_MAX_RETRIES) {
          console.log(`  [scorer] ${dim} call ${i} failed, retry ${retry + 1}/${SCORER_MAX_RETRIES}...`);
        }
      }
      if (result) {
        scoringCostUsd += result.costUsd;
        callResults.push(result);
        rawCalls.push({ dimension: dim, callIndex: i, backend: result.backend, model: result.model, subCriteria: result.subCriteria, total: result.total });
      }
    }

    // Require enough valid calls for the chosen scoring mode.
    if (callResults.length === 0) {
      dimensions[dim] = { score: 0, criteria: {}, gaps: [`${dim}: LLM 評分失敗`] };
      perDimensionVariance[dim] = 0;
      continue;
    }
    if (callResults.length < minValidCalls) {
      console.log(`  [scorer] ⚠ ${dim}: only ${callResults.length} valid call(s) — retrying once...`);
      const retryResult = await scoreDimension(dim, sectionContent, ticker, model);
      if (retryResult) {
        scoringCostUsd += retryResult.costUsd;
        callResults.push(retryResult);
        rawCalls.push({ dimension: dim, callIndex: targetCalls, backend: retryResult.backend, model: retryResult.model, subCriteria: retryResult.subCriteria, total: retryResult.total });
        console.log(`  [scorer] ${dim}: retry succeeded (${callResults.length} valid calls)`);
      }
      if (callResults.length < minValidCalls) {
        scorerPartialFailure = true;
        console.log(`  [scorer] ⚠ ${dim}: still only ${callResults.length} valid call(s) after retry — applying 0.85x confidence penalty`);
      }
    }

    anySuccess = true;

    // Take median per sub-criterion
    const allKeys = new Set(callResults.flatMap(r => Object.keys(r.subCriteria)));
    const medianCriteria: Record<string, number> = {};
    for (const key of allKeys) {
      const values = callResults.map(r => r.subCriteria[key] ?? 0);
      medianCriteria[key] = median(values);
    }
    let medianTotal = Object.values(medianCriteria).reduce((a, b) => a + b, 0);

    // Apply confidence penalty if the selected mode did not reach enough valid calls.
    if (callResults.length < minValidCalls) {
      medianTotal = Math.round(medianTotal * 0.85);
      for (const key of Object.keys(medianCriteria)) {
        medianCriteria[key] = Math.round(medianCriteria[key] * 0.85);
      }
    }

    // Collect all gaps (deduplicated)
    const allGaps = [...new Set(callResults.flatMap(r => r.gaps))];

    // Variance tracking
    const totals = callResults.map(r => r.total);
    perDimensionVariance[dim] = variance(totals);
    backendByDimension[dim] = [...new Set(callResults.map(r => r.backend))].join('+');
    modelByDimension[dim] = [...new Set(callResults.map(r => r.model))].join('+');

    dimensions[dim] = { score: medianTotal, criteria: medianCriteria, gaps: allGaps };
    console.log(`  [scorer] ${dim}: ${medianTotal} (calls: ${totals.join(',')} var: ${perDimensionVariance[dim].toFixed(2)})`);
  }

  if (!anySuccess) return null;

  const totalRaw = Object.values(dimensions).reduce((a, d) => a + d.score, 0);
  const totalVariance = Object.values(perDimensionVariance).reduce((a, b) => a + b, 0);

  return {
    dimensions: dimensions as Record<Dimension, { score: number; criteria: Record<string, number>; gaps: string[] }>,
    rawCalls,
    totalRaw,
    totalVariance,
    perDimensionVariance,
    backendByDimension,
    modelByDimension,
    scorerPartialFailure,
    scoringCostUsd,
  };
}

// ── Phase 1.5: Reference-anchored pairwise calibration ──

const FUTU_REFERENCE_PATH = path.join(PROJECT_ROOT, 'data', 'companies', 'FUTU', 'FUTU_Initial_MAX.md');

async function pairwiseCalibrate(
  dimension: Dimension,
  candidateContent: string,
  candidateScore: number,
  maxScore: number,
  model: string,
  futuContent: string,
  futuRefScore: number,
): Promise<{ adjustment: number; costUsd: number }> {
  const refContent = extractDimensionContent(futuContent, dimension).slice(0, 10000);
  if (refContent.length < 100) return { adjustment: 0, costUsd: 0 };

  const refScore = futuRefScore;

  const prompt = `比較兩份研究報告在「${dimension}」維度的品質。

## 參考報告（已評 ${refScore}/${maxScore}）：
${refContent.slice(0, 5000)}

## 候選報告（rubric 評分 ${candidateScore}/${maxScore}）：
${candidateContent.slice(0, 5000)}

## 問題
候選報告的「${dimension}」分析相比參考報告如何？
- 明顯較弱 → -1
- 略弱 → 0
- 大致相當 → 0
- 略強 → 0
- 明顯較強 → +1

輸出純 JSON：{"comparison": "weaker|similar|stronger", "adjustment": -1或0或1, "reason": "..."}`;

  try {
    const response = await chat(
      '你是投資研究品質校準員。比較候選報告與參考報告的品質差異。',
      [{ role: 'user', content: prompt }],
      { maxTokens: 1024, thinkingBudget: SCORER_THINKING_BUDGET, backend: 'mlx' },
    );

    if (!response.content) return { adjustment: 0, costUsd: response.usage.costUsd };
    let jsonStr = response.content.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    const start = jsonStr.indexOf('{');
    if (start === -1) return { adjustment: 0, costUsd: response.usage.costUsd };
    let depth = 0, end = -1;
    for (let i = start; i < jsonStr.length; i++) {
      if (jsonStr[i] === '{') depth++;
      else if (jsonStr[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) return { adjustment: 0, costUsd: response.usage.costUsd };

    const parsed = JSON.parse(jsonStr.slice(start, end + 1));
    const adj = parsed.adjustment ?? 0;
    return { adjustment: Math.max(-1, Math.min(1, adj)), costUsd: response.usage.costUsd };
  } catch {
    return { adjustment: 0, costUsd: 0 };
  }
}

// ── Gap builder ──

function buildGapsJson(score: InitialMaxScore, round: number, ticker?: string): InitialMaxGaps {
  const gaps: GapItem[] = [];
  let priority = 1;
  const seen = new Set<string>();

  const pushGap = (gap: Omit<GapItem, 'priority'>) => {
    const key = `${gap.dimension}|${gap.item}`;
    if (seen.has(key)) return;
    seen.add(key);
    gaps.push({ ...gap, priority: priority++ });
  };

  // Structural gates are pass blockers even when LLM dimensions look decent.
  if (score.structural < STRUCTURAL_PASS_MIN) {
    const b = score.structuralBreakdown ?? {};
    const structuralShortfall = STRUCTURAL_PASS_MIN - score.structural;
    if ((b.interview_count ?? 0) < 4) {
      pushGap({
        dimension: '結構',
        item: '保存足量 transcripts/*.md（至少 10 份訪談/法說逐字稿，並在主文引用）',
        current: b.interview_count ?? 0,
        target: 'interview_count ≥4/6',
        shortfall: structuralShortfall,
      });
    }
    if ((b.url_citations ?? 0) < 5) {
      pushGap({
        dimension: '結構',
        item: '補足主報告 URL citations（每個新增數據/引言附 clickable source）',
        current: b.url_citations ?? 0,
        target: 'url_citations ≥5/6',
        shortfall: structuralShortfall,
      });
    }
    if ((b.quotes ?? 0) < 4) {
      pushGap({
        dimension: '結構',
        item: '增加可歸因直接引言並分散到各章節（CEO/COO/CFO/監管/客戶）',
        current: b.quotes ?? 0,
        target: 'quotes ≥4/4',
        shortfall: structuralShortfall,
      });
    }
    if ((b.dcf_structure ?? 0) < 6) {
      pushGap({
        dimension: '結構',
        item: '補齊 DCF 結構：WACC 分解、三情境、IRR、WACC × terminal growth 3x3 敏感度',
        current: b.dcf_structure ?? 0,
        target: 'dcf_structure 6/6',
        shortfall: structuralShortfall,
      });
    }
  }

  // 論點維度 (15pts) — new dimension
  if ((score.論點.criteria?.['非共識觀點'] ?? 0) < 2) {
    pushGap({ dimension: '論點', item: '非共識觀點/Variant Perception', current: score.論點.criteria?.['非共識觀點'] ?? 0, target: '3分', shortfall: 3 - (score.論點.criteria?.['非共識觀點'] ?? 0) });
  }
  if ((score.論點.criteria?.['內部一致性'] ?? 0) < 2) {
    pushGap({ dimension: '論點', item: 'DCF假設與財務預測內部一致性', current: score.論點.criteria?.['內部一致性'] ?? 0, target: '3分', shortfall: 3 - (score.論點.criteria?.['內部一致性'] ?? 0) });
  }
  if ((score.論點.criteria?.['可行動性'] ?? 0) < 2) {
    pushGap({ dimension: '論點', item: '投資結論可行動性（價格目標+催化劑+時間框架）', current: score.論點.criteria?.['可行動性'] ?? 0, target: '3分', shortfall: 3 - (score.論點.criteria?.['可行動性'] ?? 0) });
  }

  // 人維度 (20pts)
  if ((score.人.criteria?.['格局觀哲學'] ?? 0) < 3) {
    pushGap({ dimension: '人', item: 'CEO格局觀與商業哲學', current: score.人.criteria?.['格局觀哲學'] ?? 0, target: '4分', shortfall: 4 - (score.人.criteria?.['格局觀哲學'] ?? 0) });
  }
  if ((score.人.criteria?.['繼任風險'] ?? 0) < 3) {
    pushGap({ dimension: '人', item: '繼任風險：CEO年齡、≥2位次世代領導人、板凳深度評級', current: score.人.criteria?.['繼任風險'] ?? 0, target: '4分', shortfall: 4 - (score.人.criteria?.['繼任風險'] ?? 0) });
  }

  // 生意維度 (30pts)
  if ((score.生意.criteria?.['財務歷史'] ?? 0) < 4) {
    pushGap({ dimension: '生意', item: '財務歷史完整度', current: score.生意.criteria?.['財務歷史'] ?? 0, target: '5分', shortfall: 5 - (score.生意.criteria?.['財務歷史'] ?? 0) });
  }
  if ((score.生意.criteria?.['商業模式'] ?? 0) < 4) {
    pushGap({ dimension: '生意', item: '商業模式深度（CEO引言涵蓋≥3時期+策略演進）', current: score.生意.criteria?.['商業模式'] ?? 0, target: '5分', shortfall: 5 - (score.生意.criteria?.['商業模式'] ?? 0) });
  }
  if ((score.生意.criteria?.['五力分析'] ?? 0) < 4) {
    pushGap({ dimension: '生意', item: '五力分析+護城河量化', current: score.生意.criteria?.['五力分析'] ?? 0, target: '5分', shortfall: 5 - (score.生意.criteria?.['五力分析'] ?? 0) });
  }
  if ((score.生意.criteria?.['DCF投資論文'] ?? 0) < 2) {
    pushGap({ dimension: '生意', item: 'DCF模型+三情境+IRR拆分+敏感度矩陣', current: score.生意.criteria?.['DCF投資論文'] ?? 0, target: '3分', shortfall: 3 - (score.生意.criteria?.['DCF投資論文'] ?? 0) });
  }

  // 組織維度 (17pts)
  if ((score.組織.criteria?.['組織文化'] ?? 0) < 3) {
    pushGap({ dimension: '組織', item: '組織文化與激勵（薪酬結構+員工評分+人才保留）', current: score.組織.criteria?.['組織文化'] ?? 0, target: '4分', shortfall: 4 - (score.組織.criteria?.['組織文化'] ?? 0) });
  }
  if ((score.組織.criteria?.['地理分部'] ?? 0) < 3) {
    pushGap({ dimension: '組織', item: '地理/業務分部收入(年報出處+URL)', current: score.組織.criteria?.['地理分部'] ?? 0, target: '4分', shortfall: 4 - (score.組織.criteria?.['地理分部'] ?? 0) });
  }
  if ((score.組織.criteria?.['運營效率'] ?? 0) < 3) {
    pushGap({ dimension: '組織', item: 'ROIC趨勢/Operating Leverage', current: score.組織.criteria?.['運營效率'] ?? 0, target: '4分', shortfall: 4 - (score.組織.criteria?.['運營效率'] ?? 0) });
  }

  // 環境維度 (18pts)
  if (score.環境.score < 14) {
    for (const gap of score.環境.gaps) {
      pushGap({ dimension: '環境', item: gap, current: 0, target: '完整', shortfall: 18 - score.環境.score });
    }
    if (score.環境.gaps.length === 0) {
      pushGap({ dimension: '環境', item: '需補充市場結構/監管/技術趨勢分析', current: score.環境.score, target: '18', shortfall: 18 - score.環境.score });
    }
  }

  if (score.quality < QUALITY_PASS_MIN) {
    for (const dim of ALL_DIMENSIONS) {
      for (const gap of score[dim].gaps.slice(0, 2)) {
        pushGap({
          dimension: dim,
          item: gap,
          current: score[dim].score,
          target: `${score[dim].max}`,
          shortfall: QUALITY_PASS_MIN - score.quality,
        });
      }
    }
  }

  // Sort by shortfall descending
  gaps.sort((a, b) => b.shortfall - a.shortfall);
  gaps.forEach((g, i) => { g.priority = i + 1; });

  return { round, score: score.total, gaps };
}

// ══════════════════════════════════════════════════════════════
// Main exported function: scoreCompanyResearch
// ══════════════════════════════════════════════════════════════

export async function scoreCompanyResearch(
  ticker: string,
  round = 0,
  model: string = MODELS.CLAUDE,
): Promise<{ score: InitialMaxScore; gaps: InitialMaxGaps }> {
  const scoringStartedAt = Date.now();
  const reportContent = readResearchFiles(ticker);
  const mainContent = readMainFile(ticker);
  const dir = getCompanyDir(ticker);

  // Compute hash from the prompts and route decisions the scorer actually uses.
  const rubricVersion = hashRubricSet(effectiveRubricSet());

  if (reportContent.trim().length < 100) {
    console.log(`[scorer] No research files found for ${ticker}, using zero score`);
    const emptyDim: DimensionScore = { score: 0, max: 0, gaps: ['無研究資料'] };
    const score: InitialMaxScore = {
      環境: { ...emptyDim, max: WEIGHTS.環境 },
      生意: { ...emptyDim, max: WEIGHTS.生意 },
      組織: { ...emptyDim, max: WEIGHTS.組織 },
      人: { ...emptyDim, max: WEIGHTS.人 },
      論點: { ...emptyDim, max: WEIGHTS.論點 },
      structural: 0, quality: 0, total: 0,
      passThreshold: false, round, rubricVersion,
    };
    const gaps = buildGapsJson(score, round, ticker);
    appendTrace({
      ts: new Date().toISOString(),
      ticker,
      phase: 'scoring',
      round,
      model,
      durationSec: Math.round((Date.now() - scoringStartedAt) / 1000),
      inputTokens: 0,
      outputTokens: 0,
      costUsd: 0,
      filesWritten: 0,
      scoreChange: '0',
      agentExitCode: 0,
      status: 'completed',
      scorerStatus: 'no_research_files',
      structural: 0,
      quality: 0,
      scoreAfter: 0,
      gapsRemaining: gaps.gaps.length,
    });
    return { score, gaps };
  }

  // ── Channel A: Structural score (deterministic) ──
  const structural = scoreStructural(ticker);
  console.log(`[scorer] Structural: ${structural.score}/${STRUCTURAL_MAX} (${Object.entries(structural.breakdown).map(([k, v]) => `${k}:${v}`).join(' ')})`);

  // ── Channel B: Quality score (LLM, 3-call median) ──
  let qualityScore = 0;
  let scorerStatus: InitialMaxScore['scorerStatus'] = 'full';
  let dimensionResults: Record<Dimension, { score: number; criteria: Record<string, number>; gaps: string[] }> | null = null;
  let rawCalls: ScoringEvent['rawCalls'] = [];
  let perDimensionVariance: Record<string, number> = {};
  let backendByDimension: Record<string, string> = {};
  let modelByDimension: Record<string, string> = {};
  let totalVariance = 0;
  let pairwiseAdjustments: Record<string, number> = {};
  let scoringCostUsd = 0;

  if (structural.score < 10) {
    // Very incomplete report — skip LLM
    console.log(`[scorer] Structural < 10, skipping LLM scorer`);
    scorerStatus = 'llm_partial_failure';
  } else {
    console.log(`[scorer] Running structured LLM scorer (MLX→fallback:${model}) for ${ticker}...`);
    const llmResult = await llmScoreStructured(ticker, mainContent, model);

    if (llmResult) {
      dimensionResults = llmResult.dimensions;
      rawCalls = llmResult.rawCalls;
      totalVariance = llmResult.totalVariance;
      perDimensionVariance = llmResult.perDimensionVariance;
      backendByDimension = llmResult.backendByDimension;
      modelByDimension = llmResult.modelByDimension;
      scoringCostUsd += llmResult.scoringCostUsd;
      if (llmResult.scorerPartialFailure) scorerStatus = 'llm_partial_failure';

      // Phase 1.5: Pairwise calibration — read FUTU reference once
      console.log(`[scorer] Running pairwise calibration...`);
      const futuContent = fs.existsSync(FUTU_REFERENCE_PATH)
        ? fs.readFileSync(FUTU_REFERENCE_PATH, 'utf-8')
        : '';
      const rawMaxMap: Record<Dimension, number> = { 環境: 12, 生意: 18, 組織: 12, 人: 12, 論點: 9 };
      for (const dim of ALL_DIMENSIONS) {
        if (!futuContent) break;
        const dimContent = extractDimensionContent(mainContent, dim);
        const futuRefScore = Math.round(rawMaxMap[dim] * 0.85);
        const { adjustment: adj, costUsd: calibCost } = await pairwiseCalibrate(dim, dimContent, dimensionResults[dim].score, rawMaxMap[dim], model, futuContent, futuRefScore);
        scoringCostUsd += calibCost;
        if (adj !== 0) {
          // Apply adjustment as additive term on dimension total, not by mutating sub-criteria
          dimensionResults[dim].score = Math.max(0, dimensionResults[dim].score + adj);
          pairwiseAdjustments[dim] = adj;
          console.log(`  [calibrate] ${dim}: adjustment ${adj > 0 ? '+' : ''}${adj}`);
        }
      }

      // Normalize raw LLM total (63 max) → quality score (60 max)
      const totalRaw = Object.values(dimensionResults).reduce((a, d) => a + d.score, 0);
      qualityScore = Math.round((totalRaw / RAW_MAX) * QUALITY_MAX);
      console.log(`[scorer] Quality: ${qualityScore}/${QUALITY_MAX} (raw: ${totalRaw}/${RAW_MAX})`);
    } else {
      console.log('[scorer] LLM scorer failed — using structural only');
      scorerStatus = 'llm_partial_failure';
    }
  }

  // ── Combined score ──
  const total = structural.score + qualityScore;
  const passThreshold =
    structural.score >= STRUCTURAL_PASS_MIN &&
    qualityScore >= QUALITY_PASS_MIN &&
    total >= PASS_THRESHOLD;

  // Map LLM dimension scores → weighted dimension scores for the output
  function mapDimensionScore(dim: Dimension): DimensionScore {
    const max = WEIGHTS[dim];
    if (!dimensionResults || !dimensionResults[dim]) {
      return { score: 0, max, gaps: [`${dim}: 未評分`] };
    }
    const rawMaxMap: Record<Dimension, number> = { 環境: 12, 生意: 18, 組織: 12, 人: 12, 論點: 9 };
    const rawMax = rawMaxMap[dim];
    const rawScore = dimensionResults[dim].score;
    // Scale raw → weighted
    const scaledScore = Math.round((rawScore / rawMax) * max);
    return {
      score: scaledScore,
      max,
      criteria: dimensionResults[dim].criteria,
      gaps: dimensionResults[dim].gaps,
    };
  }

  // Section coverage check
  const sectionCoverage = checkAllSectionsCovered(mainContent);
  const sectionGaps = sectionCoverage.missing.length > 0
    ? [`子節未全覆蓋：${sectionCoverage.missing.join('、')} 須有實質內容`]
    : [];

  const score: InitialMaxScore = {
    環境: mapDimensionScore('環境'),
    生意: mapDimensionScore('生意'),
    組織: mapDimensionScore('組織'),
    人: mapDimensionScore('人'),
    論點: mapDimensionScore('論點'),
    structural: structural.score,
    quality: qualityScore,
    total,
    passThreshold,
    round,
    rubricVersion,
    structuralBreakdown: structural.breakdown,
    structuralDetails: structural.details,
    scorerStatus,
    scorerPartialFailure: scorerStatus === 'llm_partial_failure',
    scoringCostUsd,
  };

  // Add section coverage gaps to 環境 (since it's the first dimension)
  if (sectionGaps.length > 0) {
    score.環境.gaps = [...score.環境.gaps, ...sectionGaps];
    score.passThreshold = false;
  }

  console.log(`[scorer] Combined: ${total}/100 (structural:${structural.score} quality:${qualityScore}) pass:${score.passThreshold}`);

  const gaps = buildGapsJson(score, round, ticker);

  // Write score and gaps files
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `initial_max_score_${round}.json`),
    JSON.stringify(score, null, 2),
  );
  fs.writeFileSync(
    path.join(dir, `initial_max_gaps_${round}.json`),
    JSON.stringify(gaps, null, 2),
  );

  // Append to scoring history (Phase 3.1)
  try {
    const event: ScoringEvent = {
      ticker,
      round,
      timestamp: new Date().toISOString(),
      rubricVersion,
      model,
      backendByDimension,
      modelByDimension,
      rawCalls,
      finalScore: {
        環境: score.環境.score,
        生意: score.生意.score,
        組織: score.組織.score,
        人: score.人.score,
        論點: score.論點.score,
        structural: structural.score,
        quality: qualityScore,
        total,
      },
      pairwiseAdjustments: Object.keys(pairwiseAdjustments).length > 0 ? pairwiseAdjustments : undefined,
      variance: {
        perDimension: perDimensionVariance,
        total: totalVariance,
      },
      consistencyChecks: {
        passed: structural.details.filter(d => !d.startsWith('Consistency')).length,
        failed: structural.details.filter(d => d.startsWith('Consistency')).length,
        details: structural.details,
      },
      costUsd: scoringCostUsd,
      reportLengthChars: mainContent.length,
      scorerVersion: 2,
    };
    appendScoringEvent(event);
  } catch (err: any) {
    console.error(`[scorer] Failed to append scoring event: ${err.message}`);
  }

  try {
    appendTrace({
      ts: new Date().toISOString(),
      ticker,
      phase: 'scoring',
      round,
      model,
      durationSec: Math.round((Date.now() - scoringStartedAt) / 1000),
      inputTokens: 0,
      outputTokens: 0,
      costUsd: scoringCostUsd,
      filesWritten: 2,
      scoreChange: String(total),
      agentExitCode: 0,
      status: score.passThreshold ? 'completed' : 'blocked',
      backend: Object.values(backendByDimension).filter(Boolean).join('+') || undefined,
      scorerStatus,
      structural: structural.score,
      quality: qualityScore,
      scoreAfter: total,
      gapsRemaining: gaps.gaps.length,
      metadata: {
        backendByDimension,
        modelByDimension,
        variance: totalVariance,
        consistencyIssues: structural.details.filter(d => d.startsWith('Consistency')),
      },
    });
  } catch (err: any) {
    console.error(`[scorer] Failed to append trace: ${err.message}`);
  }

  return { score, gaps };
}

// ══════════════════════════════════════════════════════════════
// Extended scoring (geopolitical, sustainability, contrarian)
// ══════════════════════════════════════════════════════════════

const EXTENDED_SCORER_PROMPT = `你是一位專業的研究品質評審。請對以下公司研究報告的**延伸分析**（地緣政治、環境永續、正反論辯）進行評分。

## 評分框架（45分）

### 六、地緣政治分析 (15分)
- 6.1 地緣政治地位與影響（公司對所在國/地區的戰略重要性）：0-5分
- 6.2 國際關係與供應鏈風險（盟友關係、供應鏈依賴、脫鉤風險）：0-5分
- 6.3 政策/制裁/貿易風險（CHIPS Act、出口管制、關稅等）：0-5分

### 七、環境永續分析 (15分)
- 7.1 能源與資源消耗（電力、水、土地等數據+出處）：0-5分
- 7.2 環境爭議與ESG（爭議事件、ESG評級、環保團體立場）：0-5分
- 7.3 氣候風險與轉型（碳排路徑、再生能源承諾、轉型成本）：0-5分

### 八、正反論辯 (15分)
- 8.1 Bull Case（投資多頭論點，有數據支撐）：0-4分
- 8.2 Bear Case（投資空頭論點，有數據支撐）：0-4分
- 8.3 關鍵爭議與數據對比（雙方論點並列，數據互相對照）：0-4分
- 8.4 投資論點失效條件（What Would Change Our Mind?）：≥5 個具體、可證偽、有時限的觸發條件，各含指標+門檻值+時間框架+監測來源+對論點影響；須涵蓋競爭、需求、地緣政治、財務、技術五領域。若僅列模糊條件（無數值門檻或時間框架）最多 2 分：0-3分

## 評分規則
- **無出處不計分**：所有數字必須有可驗證來源
- **平衡性**：正反論辯必須兩方論點強度對等，非刻意偏頗
- **時效性**：數據應盡量使用近 2 年內的資料，除非描述歷史趨勢
- **深度**：每個子節至少 2 段論述+數據，非僅條列

## 輸出格式
純 JSON（不加 code fence）：
{
  "geopolitical": {"score": 數字, "max": 15, "criteria": {"地緣地位": 數字, "國際關係": 數字, "政策風險": 數字}, "gaps": ["缺口"]},
  "sustainability": {"score": 數字, "max": 15, "criteria": {"能源消耗": 數字, "環境爭議": 數字, "氣候轉型": 數字}, "gaps": ["缺口"]},
  "contrarian": {"score": 數字, "max": 15, "criteria": {"Bull Case": 數字, "Bear Case": 數字, "數據對比": 數字, "論點失效條件": 數字}, "gaps": ["缺口"]},
  "extendedTotal": 數字
}`;

async function llmExtendedScore(
  ticker: string,
  reportContent: string,
  model: string = MODELS.CLAUDE,
): Promise<ExtendedScore | null> {
  const emptyCoreScore: InitialMaxScore = {
    環境: { score: 0, max: WEIGHTS.環境, gaps: [] },
    生意: { score: 0, max: WEIGHTS.生意, gaps: [] },
    組織: { score: 0, max: WEIGHTS.組織, gaps: [] },
    人: { score: 0, max: WEIGHTS.人, gaps: [] },
    論點: { score: 0, max: WEIGHTS.論點, gaps: [] },
    structural: 0, quality: 0, total: 0, passThreshold: false, round: 0,
  };

  try {
    const response = await chat(
      EXTENDED_SCORER_PROMPT,
      [{ role: 'user', content: `請評分以下 ${ticker} 的延伸分析：\n\n${reportContent.slice(0, 80000)}` }],
      { model, maxTokens: 4096, thinkingBudget: SCORER_THINKING_BUDGET },
    );
    if (!response.content) return null;

    let jsonStr = response.content.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    const start = jsonStr.indexOf('{');
    if (start === -1) return null;
    let depth = 0, end = -1;
    for (let i = start; i < jsonStr.length; i++) {
      if (jsonStr[i] === '{') depth++;
      else if (jsonStr[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) return null;

    const parsed = JSON.parse(jsonStr.slice(start, end + 1));
    return {
      core: emptyCoreScore,
      geopolitical: { score: parsed.geopolitical?.score ?? 0, max: 15, criteria: parsed.geopolitical?.criteria, gaps: parsed.geopolitical?.gaps ?? [] },
      sustainability: { score: parsed.sustainability?.score ?? 0, max: 15, criteria: parsed.sustainability?.criteria, gaps: parsed.sustainability?.gaps ?? [] },
      contrarian: { score: Math.min(parsed.contrarian?.score ?? 0, 15), max: 15, criteria: parsed.contrarian?.criteria, gaps: parsed.contrarian?.gaps ?? [] },
      extendedTotal: parsed.extendedTotal ?? ((parsed.geopolitical?.score ?? 0) + (parsed.sustainability?.score ?? 0) + (parsed.contrarian?.score ?? 0)),
      scoringCostUsd: response.usage.costUsd,
    };
  } catch (err: any) {
    console.error('Extended LLM scorer error:', err.message);
    return null;
  }
}

function heuristicExtendedScore(mainContent: string): { geopolitical: number; sustainability: number; contrarian: number } {
  let geo = 0;
  if (/geopolit|地緣|silicon shield|矽盾/i.test(mainContent)) geo += 2;
  if (/sanction|制裁|tariff|關稅|export control|出口管制/i.test(mainContent)) geo += 2;
  if (/supply chain|供應鏈|CHIPS Act|chip act|晶片法/i.test(mainContent)) geo += 1;

  let sus = 0;
  if (/electricity|電力|water.*usage|用水|能源消耗/i.test(mainContent)) sus += 2;
  if (/ESG|carbon|碳排|emission|排放/i.test(mainContent)) sus += 2;
  if (/renewable|再生能源|sustainability|永續|climate/i.test(mainContent)) sus += 1;

  let con = 0;
  if (/bull case|多頭|投資論點/i.test(mainContent)) con += 2;
  if (/bear case|空頭|反面論點/i.test(mainContent)) con += 2;
  if (/爭議|debate|兩方|both sides|pro.*con/i.test(mainContent)) con += 1;
  if (/8\.4|失效條件|What Would Change|falsif|change our mind/i.test(mainContent)) con += 3;
  if (/門檻|threshold|within.*month|within.*quarter|監測|monitor/i.test(mainContent)) con += 2;

  return { geopolitical: Math.min(geo, 15), sustainability: Math.min(sus, 15), contrarian: Math.min(con, 15) };
}

export async function scoreExtendedResearch(
  ticker: string,
  round = 0,
  model: string = MODELS.CLAUDE,
): Promise<ExtendedScore> {
  const dir = getCompanyDir(ticker);
  const mainFile = path.join(dir, `${ticker}_Initial_MAX.md`);
  const mainContent = fs.existsSync(mainFile) ? fs.readFileSync(mainFile, 'utf-8') : '';

  if (mainContent.length < 100) {
    const emptyDim: DimensionScore = { score: 0, max: 15, gaps: ['無延伸分析內容'] };
    return {
      core: {
        環境: { score: 0, max: WEIGHTS.環境, gaps: [] },
        生意: { score: 0, max: WEIGHTS.生意, gaps: [] },
        組織: { score: 0, max: WEIGHTS.組織, gaps: [] },
        人: { score: 0, max: WEIGHTS.人, gaps: [] },
        論點: { score: 0, max: WEIGHTS.論點, gaps: [] },
        structural: 0, quality: 0, total: 0, passThreshold: false, round,
      },
      geopolitical: emptyDim, sustainability: emptyDim, contrarian: emptyDim, extendedTotal: 0,
    };
  }

  console.log(`[scorer] Running extended LLM scorer (${model}) for ${ticker}...`);
  const llmResult = await llmExtendedScore(ticker, mainContent, model);

  if (llmResult) {
    const extTotal = (llmResult.geopolitical?.score ?? 0) + (llmResult.sustainability?.score ?? 0) + (llmResult.contrarian?.score ?? 0);
    llmResult.extendedTotal = extTotal;
    console.log(`[scorer] Extended score: ${extTotal}/45 (geo:${llmResult.geopolitical?.score ?? 0} sus:${llmResult.sustainability?.score ?? 0} con:${llmResult.contrarian?.score ?? 0})`);
    return llmResult;
  }

  console.log('[scorer] Extended LLM failed, using heuristic fallback');
  const h = heuristicExtendedScore(mainContent);
  const emptyCoreScore: InitialMaxScore = {
    環境: { score: 0, max: WEIGHTS.環境, gaps: [] },
    生意: { score: 0, max: WEIGHTS.生意, gaps: [] },
    組織: { score: 0, max: WEIGHTS.組織, gaps: [] },
    人: { score: 0, max: WEIGHTS.人, gaps: [] },
    論點: { score: 0, max: WEIGHTS.論點, gaps: [] },
    structural: 0, quality: 0, total: 0, passThreshold: false, round,
  };
  return {
    core: emptyCoreScore,
    geopolitical: { score: h.geopolitical, max: 15, gaps: h.geopolitical < 10 ? ['需補充地緣政治分析'] : [] },
    sustainability: { score: h.sustainability, max: 15, gaps: h.sustainability < 10 ? ['需補充環境永續分析'] : [] },
    contrarian: { score: h.contrarian, max: 15, gaps: h.contrarian < 10 ? ['需補充正反論辯與投資論點失效條件(8.4)'] : [] },
    extendedTotal: h.geopolitical + h.sustainability + h.contrarian,
    scoringCostUsd: 0,
  };
}

// ── CLI entry point ──

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

  const ticker = args.ticker ?? args.t;
  if (!ticker) {
    console.error('Usage: npx tsx src/initial-max-scorer.ts --ticker FUTU');
    process.exit(1);
  }

  const model = args.model ?? MODELS.CLAUDE;
  const round = parseInt(args.round ?? '0', 10);

  const { score } = await scoreCompanyResearch(ticker.toUpperCase(), round, model);

  console.log('\n╔══════════════════════════════════════╗');
  console.log(`║  Initial MAX Score: ${ticker.padEnd(6)} ${String(score.total).padStart(3)}/100        ║`);
  console.log('╚══════════════════════════════════════╝');
  console.log(`  Structural: ${score.structural}/${STRUCTURAL_MAX}`);
  console.log(`  Quality:    ${score.quality}/${QUALITY_MAX}`);
  console.log(`  環境 (${WEIGHTS.環境}pts): ${score.環境.score}`);
  console.log(`  生意 (${WEIGHTS.生意}pts): ${score.生意.score}`);
  console.log(`  組織 (${WEIGHTS.組織}pts): ${score.組織.score}`);
  console.log(`  人   (${WEIGHTS.人}pts): ${score.人.score}`);
  console.log(`  論點 (${WEIGHTS.論點}pts): ${score.論點.score}`);
  console.log(
    `  達標 (total≥${PASS_THRESHOLD}, structural≥${STRUCTURAL_PASS_MIN}, quality≥${QUALITY_PASS_MIN}): `
    + `${score.passThreshold ? '✓ YES' : '✗ NO'}`,
  );
  if (score.rubricVersion) console.log(`  Rubric: ${score.rubricVersion}`);
  if (score.環境.gaps.length) console.log('\n環境缺口:', score.環境.gaps.join('; '));
  if (score.生意.gaps.length) console.log('生意缺口:', score.生意.gaps.join('; '));
  if (score.組織.gaps.length) console.log('組織缺口:', score.組織.gaps.join('; '));
  if (score.人.gaps.length) console.log('人缺口:', score.人.gaps.join('; '));
  if (score.論點.gaps.length) console.log('論點缺口:', score.論點.gaps.join('; '));
}

const _entry = process.argv[1] ?? '';
if (_entry.includes('initial-max-scorer')) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
