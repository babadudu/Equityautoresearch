---
name: initial-max
description: Using FUTU as the 100-point benchmark, conduct iterative deep research on a new target across the four-dimension framework "Environment→Business→Organization→People" until quality meets the bar (≥95/100, each dimension meets its minimum, 2.5 DCF mandatory) or 20 rounds are exhausted. Triggers: "initial MAX [TICKER]", "deep initial [TICKER]", "/initial-max [TICKER]".
---

# Initial MAX Skill (Four-Dimension Framework Deep Iterative Research)

**Purpose**: Execute ultra-deep investment research on a target, benchmarked against FUTU_LATEST_REPORT.md (100 points). The four-dimension investment framework "Environment→Business→Organization→People" defines the scoring dimensions. Each round fills research gaps until the total score is **≥95/100** with **each dimension meeting its minimum** (Environment≥16, Business≥30, Organization≥16, People≥20), **2.5 DCF valuation is mandatory**, or 20 rounds are reached.

---

## When to Use

| Trigger | Action |
|---------|--------|
| `/initial-max [TICKER]` | Run the full Initial MAX flow for the specified target |
| `deep initial [TICKER]` | Same as above |
| `initial MAX [TICKER]` | Same as above |
| `score-only [TICKER]` | Score existing research only, no gap-fill |

---

## Available Tools

The following tools are available for research:
- **list_company_files** (Runner mode): List existing files and transcripts under the company directory before deciding what to supplement
- **query_companies_db** (Runner mode): Query the `data/database/companies_database.json` entry for the ticker (company name, CEO, industry, financial summary)
- **search_data_for_company** (Runner mode): Search under **data/** for content related to the company/CEO (**what-happened** interviews, meeting-minutes, Knowledge, etc.), returning matching paths and snippets; then use **read_project_file(path)** to read full content and extract management quotes for the master file
- **ninja_api** (Runner mode): Call API Ninjas for financials (earnings / earnings_historical), earnings call transcripts (earningstranscript), stock prices, SEC filings; requires NINJA_API_KEY (set in project root `.env`)
- **web_search**: Search the web (up to 5 times)
- **fetch_url**: Fetch the full content of a specified URL (transcripts, annual report pages, etc.)
- **Write**: Write or append content to company research files (single master file or existing files)

---

## Output Format: Single Master File + FUTU-Style Complete Report

**All Initial MAX research content must be written into a single master file**, and output quality is benchmarked against **FUTU_LATEST_REPORT.md**: a **readable investment report** (with thesis, narrative, readable from start to finish) — **not** a bulleted checklist or outline.

### Master File Path and Section Structure

- **Master file path**: `data/companies/{TICKER}/{TICKER}_Initial_MAX.md`
- **Section structure** (**opens with IRR Model & Executive Summary**, followed by the four-dimension framework; **every sub-section (1.1–4.2) must have coverage, none may be missing**; each chapter requires narrative paragraphs; each sub-point must cite at least 5 direct management quotes — see "Output Quality & Completeness" below):

```markdown
# {TICKER} Initial MAX Deep Research (Four-Dimension Framework)

## IRR Model & Key Assumptions
   (Result: scenario analysis table (optimistic/base/conservative) + key assumptions list (revenue growth, net margin, P/E, buyback rate, etc.); may sync with or summarize from section 2.5; reader sees valuation conclusions and assumptions at a glance upon opening)

## Executive Summary
   (1–2 paragraphs: investment thesis, key opportunities and risks, valuation conclusion and recommendation; may reference later sections but this section must be independently readable)

## KEY QUESTION (What does the company want to do? How will it get there? What does management think?)
## Scorecard
# I. Environment
   ## 1.1 TAM & Industry Growth Trends (paragraph + table + source)
   ## 1.2 Market Structure & Regulation (competitive landscape, regulatory risks, policy opportunities; paragraph + table)
   ## 1.3 Technology & Demand Trends (technology adoption or demand-shift narrative)
   ## 1.4 Geographic Segments and/or Revenue by Segment (annual report/earnings call source; table + optional brief narrative)
# II. Business
   ## 2.1 Ten-Year Financials & Inflection Points (table + inflection point narrative paragraphs)
   ## 2.2 Our Business (per-line narrative: 1–3 paragraphs + data + management quotes per business line)
   ## 2.3 Business Model & Unit Economics (revenue breakdown table + unit economics + >20 direct CEO quotes embedded in narrative)
   ## 2.4 Five Forces & Moat (5a–5e, 1 paragraph per force with specific company names + CEO moat quote)
   ## 2.5 Multi-Method Valuation & DCF (≥3 valuation methods: P/E + EV/EBITDA + P/FCF, each with current vs. 5-year avg vs. peers; aggregate fair value range. Full DCF: scenario table + three statements + estimated revenue breakdown + assumptions and evidence, written directly into master file, no external links. Reasonableness: WACC 8–14% (including geopolitical premium), terminal growth rate < WACC, P/E 10–40x is reasonable; anything outside must have explicit justification.)
# III. Organization
   ## 3.1 Organizational Culture & Incentives (talent strategy, equity incentives, counter-cyclical hiring cases; paragraph + source)
   ## 3.2 Operational Efficiency (ROIC/Operating Leverage; paragraph + data)
   ## 3.3 Market Penetration (≥2 markets or segments if applicable; table + source)
# IV. People
   ## 4.1 CEO/Founder (narrative arc: background, why they entered the industry, key decisions, who they learned from; embed worldview and integrity quotes in narrative. **Succession risk**: CEO age and tenure, ≥2 next-generation leaders (SVP/EVP level: background, tenure, strengths), bench depth rating: High/Medium/Low + rationale, succession plan disclosure status)
   ## 4.2 Public Interview List (table: #|Title|Date|Core Insights; transcripts stored in transcripts/)
# V. Scorecard (four-dimension line items with explanations)
```

- **Opening order**: The master file **top** must present in sequence: **IRR Model & Key Assumptions** (scenario table + key assumptions), **Executive Summary** (1–2 paragraphs), followed by KEY QUESTION, Scorecard, I. Environment … V. Scorecard. The reader sees valuation conclusions and investment thesis at a glance before diving into details.
- **Geographic segments and revenue by segment**: The Organization dimension's "geographic/segment revenue" may be **(1) geographic segments** (regional revenue, e.g. Americas/EMEA/APAC), **(2) revenue by segment** (e.g. Google Services / Google Cloud / Other Bets), or **(3) both**. All figures must come from annual reports or earnings calls with source citations, and **sources must include clickable links** (see "Data Source Links" below); at least ≥2 market penetration rates or ≥2 segment shares as verifiable metrics are required.
- **Data source links (required every round)**: For any **newly added or rewritten** data, table footnotes, market/regulatory/peer narratives, interview and earnings citations — **do not write source name only** (e.g. just "10-K 2024" or "McKinsey report"); must attach a **clickable `https://` (or `http://`) link** in Markdown format such as `[description](URL)` or directly paste the URL in parentheses. Interviews/transcripts = URL of the original article, video, or official PDF; annual reports/10-K/20-F = SEC EDGAR, company IR page, or official PDF link; earnings calls = transcript or recording URL; transcripts already downloaded in this repo may link to `transcripts/filename.md` (relative path). If no public URL exists (very rare), state the reason and provide a **next-best verifiable link** (e.g. press release, regulatory filing, exchange disclosure).
- **Per-round gap-fill: corresponding sub-section + readable prose**: When writing to the master file, (1) place content in the corresponding sub-section (**replace_section** or **insert_into_section** + section_anchor); (2) **ensure readability**: prefer **replace_section** to produce the full revised section — can **rewrite/cut redundancy/revise** (merge existing and new content, cohesive paragraphs), **not** just append to the section end; if using insert_into_section, supplemental paragraphs must connect to prior text. Do not pile content at the file end; do not produce scattered bullets or duplicate sub-section headings.
- **Automated Runner**: `initial-max-runner.ts` automatically runs one additional **polish round** (prose cleanup, formatting, dedup only — no web search/API) after research rounds conclude; `--skip-polish` to bypass.
- **DCF in two places**: **(1) Opening "IRR Model & Key Assumptions"**: place result scenario table + key assumptions list (condensed, consistent with or summarized from 2.5); **(2) II. Business → 2.5 DCF Valuation**: full content (scenario table + three statements + estimated revenue breakdown + assumptions and evidence) written directly into the master file, no external links. A separate `dcf_valuation_YYYYMMDD.md` archive may also be produced.
- **Exceptions**: `dcf_config.json` and transcripts under `transcripts/` remain as independent files.
- **Existing targets**: If the target already has scattered `initial_*.md` files, they may first be merged into a single `{TICKER}_Initial_MAX.md` and rewritten as a narrative report; subsequent rounds update only the master file.

### Output Quality & Completeness (Mandatory)

Benchmarked against **FUTU_LATEST_REPORT.md**, the following are mandatory requirements — missing any one renders the output incomplete:

1. **Required opening**: The master file top must have **IRR Model & Key Assumptions** (result scenario table + key assumptions list) and **Executive Summary** (1–2 paragraphs: investment thesis, key opportunities and risks, valuation conclusion); followed by KEY QUESTION and the existing chapters.
2. **Opening**: Has a **KEY QUESTION** (e.g. What does the company want to do? How will it get there? What does management think?), with 1–2 paragraphs stating the thesis or mission/vision/positioning (may quote CEO directly).
3. **Narrative-first and readability**: Each chapter, beyond tables, must have **continuous paragraphs** explaining "why, what happened, what management said"; CEO/management quotes must be **embedded in narrative** (e.g. "Li Hua stated: '…'"), not merely numbered bullets. Each sub-section must be **polished**: cohesive paragraphs, reads like an article; prefer replace_section when supplementing to produce the full revised section.
4. **Business→Our Business**: Modeled on FUTU's "Our Business" — each major business line (or segment) must have **1–3 explanatory paragraphs** (what it does, why it matters, key data) + management quotes embedded in narrative (source + date); a revenue breakdown table alone is insufficient.
5. **People→CEO narrative arc**: CEO/Founder must have a **narrative arc** (background, why they entered the industry, key decisions, who they learned from/who influenced them), weaving in worldview and integrity quotes; the interview list table is retained, but worldview/integrity may not consist only of a bullet list without surrounding prose.
6. **Environment**: TAM, market structure, regulation, and technology trends must each have **brief commentary** (at least 1 paragraph or key points + source), not just tables or single lines.
7. **Five Forces**: 5a–5e each force must have **at least 1 paragraph** (competitive dynamics, specific company names) + at least 1 CEO moat/differentiation quote with source citation; presented as narrative paragraphs, not just bullets.
8. **Geographic/segment**: Geographic segments or revenue by segment must have a **table** with **each figure citing annual report or earnings call source** (including **clickable document/page link** — see "Data Source Links"); may add 1–2 sentences of narrative (e.g. strategic priorities per region or segment).
9. **At least 5 direct management quotes per sub-point**: Every **sub-point** (1.1–4.1) in the master file must cite direct management quotes (must be enclosed in quotation marks「…」or "…" with source + date); **at least 5 per sub-point**, 7 or more recommended; embedded in narrative. **Strict**: indirect descriptions or unquoted statements do not count; quotes without source or date do not count. Section 4.2 (interview table) may be exempt; 2.5 DCF may have as few as 1–2.
10. **Strict scoring rules**: **Figures without source** (TAM, market share, revenue, geographic segments, etc.) are never counted for points; **source with text only, no clickable link** (when a public URL is available) is considered insufficiently verifiable and a link must be added. **Non-direct quotes** (management language not enclosed in quotation marks) do not count toward the "direct management quote" tally; any sub-point with fewer than 5 qualifying direct quotes is considered below standard and will lose points.
11. **Every sub-section must have coverage**: Sections 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 4.1, 4.2 must each have substantive content; missing any one fails the standard.
12. **Environment must start from the beginning**: Industry and environment research must begin from **the origin or starting point of the industry's modern form**. For example: research on the advertising industry starts from the birth of modern advertising and its industrialization; research on cloud starts from the commercialization of cloud services. TAM, market structure, regulation, and technology trends must all have historical depth, not just a current snapshot.
13. **Founder/management must start from the beginning**: Section 4.1 CEO/Founder must include **educational background** (education, early career), **major inflection points** (key decisions, strategic pivots, personal/professional turning points), **major achievements** (milestones at each stage), **interviews from each period** (public interviews and quotes from different eras/stages — not just recent), and **reflection on successes and failures** (management's own retrospective, learning, and reflection). The narrative arc must be laid out chronologically from the earliest point, not just a recent summary.
14. **Completeness check**: At the end of each round, ask: If someone reads only this master file and no other files, can they understand "what this company does, why it is competitive, who management is, and where the risks and opportunities lie"? If not, supplement narrative or paragraphs until it is readable.

---

## Four-Dimension Scoring Framework (100 Points)

### Environment (20 pts)
| Criterion | Max | Pass Standard |
|-----------|-----|---------------|
| TAM & Industry Growth Trends | 5 | Market size figure + CAGR + source |
| Market Structure | 5 | Competitive landscape (concentrated/fragmented) + major player market shares |
| Regulatory/Policy Environment | 5 | Key regulatory risks + policy opportunities |
| Technology & Demand Trends | 5 | Technology adoption curve or demand-shift narrative |

### Business (35 pts)
| Criterion | Max | Pass Standard |
|-----------|-----|---------------|
| Financial History Completeness | 10 | ≥10-year table; includes gross margin, operating income, EPS; at least one inflection point explanation |
| Business Model Depth | 10 | Revenue breakdown table + unit economics + **≥25 direct CEO quotes** (must include quotation marks + source + date) |
| Competitive Moat (Five Forces) | 10 | 5a–5e all headings present + technology differentiation paragraph + CEO moat quote |
| Multi-Method Valuation | 5 | **≥3 valuation methods** (P/E + EV/EBITDA + P/FCF as minimum), each with current vs. 5-year avg vs. peer comparison; aggregate fair value range (weighted or triangulated). **WACC decomposition** (Rf + ERP × β + geopolitical premium, listed line by line) + three-scenario table + IRR breakdown (growth + valuation + buyback) + **3×3 sensitivity matrix** (revenue growth vs. WACC); using only a single valuation method (e.g. P/E only) results in deduction; missing WACC decomposition or sensitivity matrix disqualifies from full marks |

### Organization (20 pts)
| Criterion | Max | Pass Standard |
|-----------|-----|---------------|
| Geographic/Segment Revenue | 8 | **Geographic segments** (regional revenue) or **revenue by segment** (e.g. business unit/product line), or both; from annual report or earnings call (source page/date cited); ≥2 market penetration rates or ≥2 segment shares |
| Organizational Culture & Incentives | 6 | Talent strategy + equity incentives + counter-cyclical hiring case |
| Operational Efficiency (ROIC / Operating Leverage) | 6 | ROIC calculation or gross margin/expense ratio trend analysis |

### People (25 pts)
| Criterion | Max | Pass Standard |
|-----------|-----|---------------|
| CEO Worldview & Business Philosophy | 5 | First-principles explanation of key decisions over multiple years |
| Succession Risk & Bench Depth | 5 | CEO age and tenure explicitly stated; ≥2 next-generation leaders (SVP/EVP level, with background, tenure, strengths); bench depth rating: High/Medium/Low + rationale; succession plan disclosure status |
| Integrity & Value-Creation Drive | 5 | Specific cases or quotes as evidence (not generic descriptions) |
| Public Interviews ≥25 + Transcripts Downloaded | 10 | URL count min(count/25, 1.0)×10; transcripts stored in transcripts/ |

### Extended Analysis Dimensions (45 pts, --extended mode)

| Dimension | Max | Sub-items |
|-----------|-----|-----------|
| Geopolitical Analysis | 15 | 6.1 Geopolitical Position(5) + 6.2 International Relations(5) + 6.3 Policy Risk(5) |
| ESG & Sustainability | 15 | 7.1 Energy Consumption(5) + 7.2 Environmental Controversies(5) + 7.3 Climate Transition(5) |
| Bull vs Bear | 20 | 8.1 Bull Case(5) + 8.2 Bear Case(5) + 8.3 Data Comparison(5) + 8.4 Investment Thesis Invalidation Conditions(5) |

**Impartiality methodology**:
- Academic style, citation format: "According to [source], X. However, [source] argues Y"
- Every claim backed by verifiable data + source URL
- No conclusory judgments — state facts and positions from all sides
- Prioritize 2024–2026 data
- At least 2 sources from different positions per argument
- **Success criterion: both sides are dissatisfied = objective neutrality**

### Extended Analysis Quality Standards (From Expert Reviewers)

#### Geopolitics (§6) — From Brookings + RAND Reviewers
- **Silicon Shield argument must bear the burden of proof**: Economic interdependence has historically failed to prevent wars (e.g. WWI); do not assume it is effective
- **Military capability gaps must be covered**: PLA amphibious capacity assessment, Taiwan's own defense investments (porcupine strategy, anti-ship missiles, extended conscription)
- **Conflict probability citations must be named sources**: Anonymous sources (e.g. "a consulting firm") are not acceptable; CFR Tier I refers to crisis escalation, not military action — note the distinction
- **"Destroy" deterrence clause**: Reports of the ability to disable TSMC fabs (EUV equipment destruction) in the event of invasion must be included
- **Japan's 2022 National Security Strategy revision** must be a primary source, including the defense budget doubling
- **CHIPS Act duality**: Both an opportunity for TSMC (subsidies) and a systemic erosion of TSMC's moat — must be explicitly modeled
- **Competitor success scenario**: The scenario in which Intel 18A succeeds must be modeled (even if TSMC remains dominant, a shift from 90%→70–75% changes the narrative)
- **Taiwan's democratic governance**: Taiwan's rule of law and IP protection are factors in TSMC's prosperity and must be included in the analysis

#### ESG & Sustainability (§7) — From RAND Reviewer
- **"Net positive" energy claims**: TSMC's self-reported 6.39x energy multiplier must be flagged as a lifecycle analysis not independently verified by a third party, or marked as pending verification
- **Compound risk loop**: TSMC growth → Taiwan energy vulnerability worsens → blockade scenarios worsen → geopolitical risk rises — this feedback loop must be explicitly described
- **Water data** must include details of the 2021 drought case (farmer impact, S&P credit risk link)

#### Bull vs Bear (§8) — From McKinsey + RAND Reviewers
- **Bull/Bear word count parity**: Bull discussion must not exceed Bear discussion by more than 1.5x throughout the document
- **IRR vs. risk probability contradiction must be reconciled**: If the report shows 18% IRR but a 60% blockade probability, this contradiction must be explicitly quantified and discussed in 8.3
- **Probability-weighted expected return**: Must include probability-weighted IRR for Bull/Base/Bear (e.g. 25%/50%/25%)
- **Zero duplicate quotes**: No CEO quote may appear more than once in the full report (mandatory check in the polish round)

#### Report Structure (From McKinsey Reviewer)
- **Report must open with an Executive Summary (1 page)**: Investment thesis, key metrics, valuation, top 3 risks, recommendation — IC members should be able to read only this page
- **Self-scoring tables must be removed**: Do not self-score within the report (external scoring system handles this)
- **Current price vs. intrinsic value**: Must explicitly state "current price is X, our fair value is Y, margin of safety is Z%"

---

## Execution Flow

### Step 0: Score and Identify Gaps

**Two execution modes — auto-detected:**

#### Mode A: Direct Cursor Trigger (saying "initial MAX TICKER")
1. Use `list_dir` or `read_file` to scan all research files under `data/companies/{TICKER}/`
2. **Self-score** using this SKILL's four-dimension framework (Environment 20 + Business 35 + Organization 20 + People 25 = 100)
3. List scores and gaps per dimension; decide which dimensions to prioritize this round
4. Execute Steps 1–4; after supplementing research, **self-score again**, loop until **≥95/100 with all dimensions meeting minimums, 2.5 DCF mandatory** or 20 rounds reached

#### Mode B: Runner Script Auto-Invocation
Read the gap file injected by the runner (path provided in task message):
```
data/companies/{TICKER}/initial_max_gaps_{N}.json
```

---

**Regardless of mode, confirm the following state before continuing:**
- Current total score: ? /100
- Lowest-scoring dimension: ?
- This round's target: which 1–3 gaps to fill

### Step 1: Allocate Search Budget by Priority

**If run by Runner**: First `list_company_files` to see existing files in the company directory; may `query_companies_db` to check the database; **use `search_data_for_company(ticker)` to check if what-happened interviews or other articles about this company/CEO already exist under data/**; if found, `read_project_file(path)` and extract management quotes; for missing financials or earnings calls, prioritize `ninja_api` (earnings_historical, earningstranscript), then supplement with web_search.

Up to 5 web_search calls per round, allocated by deficit score:
- Prioritize the dimension with the highest deficit (generally start with "People" — 15 points × interview count is easiest to improve)
- 1–2 searches per dimension
- Reserve 1 search for DCF or geographic segments (if deficient)

### Step 2: Research Strategy per Dimension

#### Environment (20 pts)

```
Search: "{TICKER} total addressable market 2024 2025 {industry} report"
Search: "{industry} market structure consolidation competition landscape"
Search: "{TICKER} regulatory policy risk {country} 2024 2025"
```

Output target: Write to the "I. Environment" chapter of master file **`{TICKER}_Initial_MAX.md`** (or create the master file).
Content requirement: **Environment must begin from the industry's origin or the starting point of its modern form** (e.g. advertising starts from the birth of modern advertising); TAM figures (with source URL + date), competitive landscape table, key regulatory summary; must have historical depth, not just a current snapshot.

#### Business→Financials (10 pts)

```
Search: "{TICKER} annual revenue gross margin operating income history 10-K"
Search: "{TICKER} EPS history turning point inflection"
```

Output target: Write to "II. Business → 2.1 Ten-Year Financials & Inflection Points" of master file **`{TICKER}_Initial_MAX.md`**.
Content requirement: ≥10-year Markdown table (Year | Revenue | Gross Margin | Operating Income | EPS) with inflection points marked (bold or explained).

#### Business→Business Model (10 pts) — Target ≥25 direct CEO quotes (quotation marks + source + date)

```
Search: "{CEO_NAME} interview revenue model unit economics 2024 2025"
Search: "{TICKER} business model revenue breakdown take rate ROIC"
fetch_url: found interview transcript page
```

Output target: Write to "II. Business → 2.2 Our Business" and "2.3 Business Model & Unit Economics" of master file **`{TICKER}_Initial_MAX.md`**.
Content requirement:
- **2.2 Our Business**: Each major business line (or segment) has 1–3 explanatory paragraphs (what it does, why it matters, key data) + management quotes embedded in narrative (source + date); a revenue breakdown table alone is not sufficient.
- Revenue breakdown table (per-business-line share) + unit economics (CAC/LTV/ARPU/take rate, etc.).
- **≥25 direct CEO quotes**: Must be presented in narrative paragraphs (e.g. "Pichai noted in the 2025 Q1 earnings call: '…'"), not just numbered lists; each must have **quotation marks + source + date**; indirect descriptions do not count.

#### Business→Five Forces Analysis (10 pts)

```
Search: "{TICKER} vs competitors market share differentiation"
Search: "{CEO_NAME} competitive moat technology differentiation quote"
```

Output target: Write to "II. Business → 2.4 Five Forces & Moat" of master file **`{TICKER}_Initial_MAX.md`**.
Content requirement: 5a–5e **at least 1 paragraph per force** (competitive dynamics, specific company names) + at least 1 CEO moat/differentiation quote with source citation; presented as narrative paragraphs, not just bullets.

#### Business→DCF / Investment Thesis (5 pts)

**Trigger the dcf-valuation skill and write results into the master file**:
1. Check if `data/companies/{TICKER}/dcf_config.json` exists; if not, copy from `data/templates/dcf_config_template.json` and fill in `base_data`.
2. Populate `base_data` from financials or Ninja API (revenue, net_margin, current_price, etc.); adjust three-scenario assumptions (optimistic/base/conservative) to fit the company's growth characteristics.
3. Trigger the DCF Skill to produce `dcf_valuation_YYYYMMDD.md` (three statements + scenario table).
4. **Write the scenario valuation table and three statements (income, cash flow, balance sheet) directly into the master file** `{TICKER}_Initial_MAX.md` under "II. Business → 2.5 DCF Valuation" — **do not substitute with external links**; readers should see the full DCF content within the master file alone.
5. Confirm the IRR breakdown fields exist in the master file (return from growth + return from valuation change + buyback rate = expected total return).

#### Organization→Geographic Segments and/or Revenue by Segment (8 pts) — **Must come from annual reports or earnings calls**

```
Search: "{TICKER} 10-K 20-F segment revenue geographic breakdown {YEAR}"
Search: "{TICKER} earnings call Q4 revenue by region by segment"
fetch_url: found annual report or earnings call transcript page
```

Output target: Write to "I. Environment → 1.4 Geographic Segments and/or Revenue by Segment" of master file **`{TICKER}_Initial_MAX.md`**.
**Key requirements**:
- **Geographic segments**: Table (Region | Revenue | Share | Source), e.g. Americas / EMEA / APAC.
- **Revenue by segment**: Table (Segment/Business Unit | Revenue | Share | Source), e.g. Google Services / Google Cloud / Other Bets; may choose one or both.
- Every figure must cite a source: "Source: {TICKER} 20-F/10-K {YEAR} Annual Report" or "Source: {TICKER} {YEAR} Q4 Earnings Call Transcript {date}".
- ≥2 market penetration rates or ≥2 segment shares; may add 1–2 sentences of narrative (strategic priorities per region or segment).

#### Organization→Culture Execution (12 pts)

```
Search: "{TICKER} organizational culture talent strategy {CEO_NAME} interview"
Search: "{TICKER} ROIC return on invested capital {YEAR} operating leverage"
```

Output target: Write to the "III. Organization" chapter of master file **`{TICKER}_Initial_MAX.md`**.
Content requirement: Equity incentive structure, talent strategy, counter-cyclical hiring case (if applicable), ROIC trend.

#### People (25 pts) — **Must download transcripts**

```
Search: "{CEO_NAME} interview transcript podcast 2024 2025 site:youtube.com OR site:open.spotify.com"
Search: "{CEO_NAME} keynote conference full text 2024 2025"
Search: "{CEO_NAME} philosophy decision-making founding story"
```

**For each interview URL found**:
1. `fetch_url` to retrieve the full page content (including transcript)
2. Use `write_research_section` to save to `data/companies/{TICKER}/transcripts/{CEO_NAME}_{YYYY}_{slug}.md`
3. Add a summary entry for that interview to the "IV. People → Interview List" section of master file **`{TICKER}_Initial_MAX.md`** (format below):
   ```
   | {#} | [{Title}]({URL}) | {Date} | {3–5 sentence core insights} |
   ```

**Worldview & Integrity** (10 pts): Must be written into the **narrative arc** in master file "IV. People → 4.1 CEO/Founder", conveying quotes through narrative, not bullet lists. **Founder research must start from the beginning**:
- **Educational background**: Education, early career, entry point into the industry.
- **Major inflection points**: Key decisions, strategic pivots, personal/professional turning points.
- **Major achievements**: Milestones and results at each stage.
- **Interviews from each period**: Public interviews and quotes from different eras/stages (not just recent).
- **Reflection on successes and failures**: Management's own retrospectives, learning, and self-reflection.
- Topics also include: worldview (founding purpose, first-principles thinking, key decision logic), integrity (sense of responsibility, attitude toward adversity); may be modeled on FUTU's "Founder — Li Hua" structure.

### Step 3: Write to Research Files

- **Always write to the single master file** `data/companies/{TICKER}/{TICKER}_Initial_MAX.md` (create if it does not exist, using the section structure above).
- **Gap-fill must be placed in the corresponding sub-section and be readable prose**: If run by Runner, prefer **replace_section**: first read the sub-section's existing content, produce the **full polished version** (merging existing and new content, cohesive paragraphs, readable) before writing; or when using **insert_into_section**, supplemental content must connect to prior text. Do not append bulk content to the file end; output must be readable (like an article). When writing manually in Cursor, append within the corresponding sub-section and polish — do not pile an entire block at the file end.
- Do not produce scattered `initial_*.md` files. DCF scenario tables and three statements must be written into the master file (no external links); a `dcf_valuation_YYYYMMDD.md` archive may also be produced. Transcripts under `transcripts/` remain independent.

### Step 4: Confirm Output & Completeness

At the end of each round, confirm:
- [ ] List of files written this round (master file + DCF/transcripts if applicable)
- [ ] Number of new interviews added this round (People dimension)
- [ ] Does geographic segment or revenue by segment have annual report/earnings call source citations?
- [ ] Has DCF been built (if applicable)?
- [ ] **Narrative completeness**: Does each chapter have narrative paragraphs (not just tables or bullets)? Are CEO quotes embedded in narrative? Does "Our Business" have per-line explanatory paragraphs? Does "IV. People" have a CEO narrative arc?
- [ ] **≥5 direct quotes per sub-point**: Do sub-points 1.1–4.1 each have at least 5 **direct** quotes (quotation marks + source + date)? Indirect descriptions do not count; 2.5 may have 1–2; 4.2 (table) may be exempt.
- [ ] **Readability**: If someone reads only this master file, can they understand what the company does, why it is competitive, who management is, and where the risks and opportunities lie? If not, prioritize supplementing narrative next round.
- Output this round's summary: `Completed: {description}. Dimensions expected to improve: {dimension list}.`

---

## Scoring Reference: FUTU (100-Point Benchmark)

| Dimension | FUTU Score | Key Characteristics |
|-----------|------------|---------------------|
| Environment | 19/20 | Detailed Hong Kong/Singapore/Malaysia/Australia market analysis |
| Business | 34/35 | Leaf Li 20+ interview quotes, complete 7-year financials, DCF with IRR breakdown |
| Organization | 19/20 | Market penetration rates per market from annual reports/earnings calls, clearly sourced |
| People | 24/25 | Leaf Li worldview narrative over multiple years, 40+ interview transcripts |

---

## Notes

1. **Output must be a readable report**: Modeled on FUTU_LATEST_REPORT.md, the master file should be a **narrative investment report** (KEY QUESTION, paragraphs, narrative arc, per-business-line explanations) — avoid producing only bullets and tables.
2. **Geographic segments or revenue by segment**: May be geographic segments (regional revenue), revenue by segment, or both; every figure must trace back to an annual report or earnings call with source citation — **do not write estimates without a source**.
3. **Interview transcripts must be downloaded**: Do not just list URLs — actually `fetch_url` the content and save it in `transcripts/`.
4. **CEO/management quotes must be sufficient and embedded in narrative**: Business model and People dimensions require **≥25 direct CEO quotes**, each **enclosed in quotation marks + source + date**, presented in narrative paragraphs (e.g. "So-and-so stated: '…'"); **each sub-point (1.1–4.1) must have at least 5**, with 7 recommended. Indirect descriptions or unquoted statements do not count. Sections 4.2 and 2.5 may be held to a more lenient standard.
5. **Pass threshold: 95 points and each dimension's minimum**: Total score **≥95/100**, with Environment≥16, Business≥30, Organization≥16, People≥20; **2.5 DCF valuation is mandatory** (missing it fails the threshold). Figures without source do not count for points; non-direct quotes do not count toward the direct quote tally.
6. **DCF can be adjusted manually or by AI**: `dcf_config.json` is designed to allow human modification of assumptions, and AI can update them based on the latest financials.
7. **Scoring method**: When triggered directly in Cursor, Claude self-scores (see Step 0 Mode A); when called by the runner script, initial-max-scorer.ts handles scoring.
