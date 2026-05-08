# Initial MAX Autoresearch

**Automated deep-research engine for investment research.**

---

## Inspiration: Andrej Karpathy's "overnight researcher"

In 2026, Andrej Karpathy—one of the most respected voices in AI—released an experimental project called [autoresearch](https://github.com/karpathy/autoresearch).

The idea is simple and striking:

> **Let an AI agent do research, run experiments, evaluate results, and adjust course—on a loop—while you sleep, until it finds an answer.**

Karpathy's system targets ML optimization: the agent edits training code → runs a 5-minute experiment → measures → keeps or rolls back → repeats. Twelve experiments in one night, fully automated.

**Initial MAX Autoresearch brings that spirit into investment research.**

The agent searches sources → writes research sections → self-scores against a framework → finds gaps → fills them → re-scores—until the report reaches an institutional-style bar (85/100).

---

## The question that actually matters

Before the technical details, one question.

Have you ever had this experience?

A name worth digging into appears—maybe NVDA's third growth curve in the AI wave, or a China ADR you've heard about for six months but never had time to study. You open ChatGPT or Google Deep Research, ask a few questions, and get pages that *look* complete.

Then you ask yourself honestly: **Would I stake a seven-figure decision on this report?**

You know the answer.

---

## Why conversational AI and "Deep Research" fall short for investors

For serious research, today's tools have three structural limits:

### 1. They give you "answers," not "theses"

Ask ChatGPT whether BABA is a buy, and you get a balanced essay—pros, cons, "investors should decide for themselves."

That isn't research. It's a high-school paper.

Real investment work needs **verifiable claims**: sourced numbers, dated management quotes, industry history with a time axis, DCF with explicit assumptions.

### 2. They are one-shot; you stay alone

Deep Research hands you a report and stops. If a section is thin, a number unsourced, or CEO quotes sparse—you chase and integrate on your own.

Every run starts from zero. Your effort doesn't compound.

### 3. They lack a quality bar

What counts as "good enough research"? Neither the tool nor you can say precisely. You rely on a gut feeling that it "seems fine."

**"Seems fine" is one of the most dangerous signals in investing.**

---

## Initial MAX: three fundamental differences

### 1. Framework, standard, and scores

Initial MAX uses a **four-dimension investment framework** as the scoring system:

| Dimension | Max pts | Core questions |
|-----------|---------|----------------|
| Environment | 20 | TAM? Regulatory risk? Tech trends? |
| Business | 35 | Business model? Moat? DCF? |
| Organization | 20 | Execution? Geography? ROIC trend? |
| People | 25 | Who is the CEO? What have they decided and said? |

After each round, the system scores automatically, finds the weakest dimensions, and prioritizes them next round.

**This is not "how does it feel?"—it's "did we hit the bar?"**

Pass line: total ≥85, each dimension above a minimum floor, DCF required. If not, keep iterating—up to 20 rounds by default.

### 2. Automatic iteration; you don't have to be there

Enter a ticker, set your angle (`--why "I want to understand Alibaba Cloud growth"`), and walk away.

The system will:

- Search for recent industry reports, filings, management interviews
- Pull ~10 years of financials and earnings-call transcripts via API
- Draft sections with CEO quotes (≥5 per subsection; ≥25 in the business-model dimension)
- Build a three-scenario DCF (bull / base / bear)
- Score, find gaps, research, re-score
- Run a final "polish" pass so the output reads like a narrative, not a bullet dump

**When you're back, an institutional-style report is waiting.**

### 3. A readable report, not a data dump

The deliverable is a **narrative investment memo**, structured as:

1. **IRR model and scenarios** (valuation and assumptions up front)
2. **Investment thesis summary** (1–2 paragraphs, standalone)
3. **KEY QUESTION** (what the company is trying to do; how management thinks)
4. **Environment → Business → Organization → People** (full four dimensions, prose per section)
5. **Scorecard** (transparent strengths and weaknesses)

Numbers link to sources. Quotes have attribution and dates. The CEO arc runs from background to today on a timeline.

**This isn't screen-scraping notes—it's something you can print and take to an IC.**

---

## Extended analysis phases

Beyond the core four dimensions, reports can include optional extended phases:

| Phase | Sections | Coverage |
|-------|----------|----------|
| Geopolitical | 6.1–6.3 | Supply chain risk, trade policy, geographic concentration |
| ESG | 7.1–7.3 | Carbon footprint, water usage, regulatory compliance |
| Contrarian debate | 8.1–8.3 | Bull vs. bear case with probability-weighted scenarios |

Extended phases are triggered automatically when the core report reaches a sufficient score, or can be requested via CLI flags.

---

## Knowledge base

Research doesn't start from zero. Initial MAX maintains a **reusable knowledge base** of structured research atoms extracted from completed reports.

### Atom archetypes

| Archetype | Examples |
|-----------|----------|
| `company-profile` | Business model, unit economics, segment breakdown |
| `leadership` | CEO/founder profiles, career history, philosophy |
| `quotes` | Direct executive quotes with date, source, attribution |
| `competitive-landscape` | Five forces, moat analysis, regulatory environment |
| `financial-snapshot` | 10-year history, DCF, ROIC, margins |
| `industry` | TAM, growth drivers, market structure, S-curves |
| `technology` | Product roadmaps, adoption curves, R&D strategy |
| `geopolitical` | Regional risks, trade policy, supply chain |
| `esg` | Sustainability metrics, carbon, water, compliance |

Each atom is a Markdown file with YAML frontmatter containing structured metadata: `id`, `archetype`, `companies[]`, `people[]`, `industries[]`, `tags[]`, `temporality`, `quality` (1–5), and source traceability back to the originating report section.

### Knowledge pipeline

```bash
# 1. Extract atoms from a completed report
npm run extract-knowledge -- --ticker AAPL

# 2. Rebuild the searchable index
npm run rebuild-index

# 3. Query the knowledge base
npm run query-kb -- --company AAPL --archetype leadership
```

The index (`data/knowledge/_index.json`) provides inverted lookups by company, person, archetype, tag, and industry — enabling fast retrieval during research runs.

---

## Research queue

For portfolio-scale research, Initial MAX supports batch automation:

```bash
# Generate a research queue from your portfolio (prioritized by weight, staleness)
npm run queue-gen

# Execute the queue (runs initial-max for each ticker sequentially)
npm run queue-run
```

The queue (`data/research_queue.json`) tracks status, priority scores, and completion state across runs.

---

## In Carnegie's terms: what you actually want

Dale Carnegie wrote:

> "The only way on earth to influence other people is to talk about what they want and show them how to get it."

So here it is directly.

You don't do equity research because you love formatting spreadsheets or hunting numbers in 10-Ks.

You do it because you **want conviction**.

In an uncertain market, you want your view grounded in evidence. When someone asks why you own a name, you want to say: "Management said X on the Q3 2024 call; TAM is in this range; base-case DCF implies IRR of Y%."

What you want is **confidence**.

The reality: research never feels "done." Each name can absorb dozens of hours. You have more tickers than time. AI tools help—but you don't fully trust them. You're stuck between "not deep enough" and "no time."

**Initial MAX exists for that tension.**

It does not make the investment decision—that stays yours, and that's where your edge lives. But it can take you out of the grind—sourcing, citations, section fill-ins, DCF scaffolding—so you spend judgment where humans matter: **interpretation, comparison, decision.**

You deserve a better research workflow. Your time belongs on what matters most.

---

## Install and usage

### Requirements

- Node.js 18+
- Claude CLI (authenticate via `claude login`)
- Optional: API Ninjas key (financials / transcripts), Brave Search API key (better web search)

### Setup

```bash
# 1. Clone or download the project
git clone <repo-url>
cd equityautoresearch

# 2. Install dependencies
npm install

# 3. Authenticate with Claude
claude login

# 4. Environment variables
cp .env.example .env
# Edit .env and set:
#   USE_CLAUDE_CLI=1                   ← default, uses your Claude subscription
#   NINJA_API_KEY=...                  ← optional (filings & transcripts)
#   BRAVE_SEARCH_API_KEY=...           ← optional (search quality)
```

### Run research

```bash
# Minimal: research NVIDIA
npm run initial-max -- --ticker NVDA

# Pass your focus (strongly recommended)
npm run initial-max -- --ticker BABA --why "Cloud growth and valuation at Alibaba"

# Max rounds (default 20; lower for a quick draft)
npm run initial-max -- --ticker FUTU --max-rounds 10

# Score only, no new research (existing report)
npm run score -- --ticker NVDA
```

### Outputs

After a run:

```
data/companies/{TICKER}/
├── {TICKER}_Initial_MAX.md      ← main report (single file)
├── dcf_config.json              ← DCF assumptions
└── transcripts/                 ← CEO / management transcripts
    ├── CEO_2024_podcast.md
    └── ...

data/knowledge/
├── atoms/                       ← reusable knowledge atoms
│   ├── company-profile/
│   ├── leadership/
│   ├── quotes/
│   ├── competitive-landscape/
│   ├── financial-snapshot/
│   ├── industry/
│   ├── technology/
│   ├── geopolitical/
│   └── esg/
├── _index.json                  ← searchable atom index
└── _taxonomy.json               ← archetype definitions & refresh schedule

data/
└── run-trace.jsonl              ← token/cost trace log

results/
└── MMDD_scores.tsv              ← per-round scores
```

### CLI quick reference

| Command | Description | Example |
|---------|-------------|---------|
| `npm run initial-max` | Run full research loop | `-- --ticker NVDA --why "AI growth"` |
| `npm run score` | Score only, no research | `-- --ticker NVDA` |
| `npm run extract-knowledge` | Decompose report into atoms | `-- --ticker AAPL` |
| `npm run rebuild-index` | Rebuild knowledge base index | |
| `npm run query-kb` | Search knowledge base | `-- --company AAPL --archetype leadership` |
| `npm run compare` | Compare reports across tickers | `-- --ticker AAPL --ticker MSFT` |
| `npm run queue-gen` | Generate research queue from portfolio | |
| `npm run queue-run` | Batch run research queue | `-- --force --capacity 80` |

### Research flags

| Flag | Description | Example |
|------|-------------|---------|
| `--ticker` / `-t` | Ticker symbol (required) | `--ticker NVDA` |
| `--why` | Your research focus | `--why "Focus on cloud growth"` |
| `--max-rounds` | Max iterations (default 20) | `--max-rounds 10` |
| `--score-only` | Score only, no research | `--score-only` |
| `--skip-polish` | Skip final polish pass | `--skip-polish` |
| `--tag` | TSV filename tag (default: today MMDD) | `--tag q1review` |

### Queue runner flags

| Flag | Description | Example |
|------|-------------|---------|
| `--capacity` | Current usage capacity % (0-100). Refuses if <20% | `--capacity 80` |
| `--force` | Override schedule window check | `--force` |
| `--ticker` | Force a specific ticker | `--ticker MCD` |
| `--max-cost` | Override per-ticker cost limit | `--max-cost 50` |
| `--dry-run` | Show what would run without executing | `--dry-run` |

### Observability

Token consumption and run traces are logged to `data/run-trace.jsonl` (append-only JSONL). Each entry records ticker, phase, round, model, duration, token counts, cost, and score changes.

```bash
# View trace for a specific ticker
grep MCD data/run-trace.jsonl

# View all recent traces
tail -20 data/run-trace.jsonl
```

---

## Integration with investment-intelligence

This project is designed to work alongside [investment-intelligence](../investment-intelligence) — a portfolio monitoring and multi-analyst coordination system. While the two projects are currently independent, they share a complementary data model.

### Data access paths

| Data | Path | Format |
|------|------|--------|
| Research reports | `data/companies/{TICKER}/{TICKER}_Initial_MAX.md` | Markdown |
| Knowledge atoms | `data/knowledge/atoms/{archetype}/*.md` | Markdown + YAML frontmatter |
| Searchable index | `data/knowledge/_index.json` | JSON (inverted indexes) |
| Taxonomy | `data/knowledge/_taxonomy.json` | JSON (archetype definitions) |
| Research queue | `data/research_queue.json` | JSON (priority queue) |
| Run traces | `data/run-trace.jsonl` | JSONL (token/cost observability) |

### Atom metadata schema

Each knowledge atom file includes YAML frontmatter:

```yaml
---
id: "aapl-tim-cook-ceo-profile-2025"
archetype: "leadership"
title: "Tim Cook: CEO Profile — Career History, Leadership Philosophy"
companies: ["AAPL"]
people: ["Tim Cook", "Jeff Williams", "Craig Federighi"]
industries: ["consumer-electronics"]
tags: ["founding", "culture", "moat"]
temporality: "evergreen"          # evergreen | semi-evergreen | event-driven
created: "2026-03-23"
updated: "2026-03-23"
source_report: "data/companies/AAPL/AAPL_Initial_MAX.md"
source_sections: ["4.1"]
quality: 4                        # 1–5
---
```

### Querying the knowledge base programmatically

The index (`_index.json`) provides inverted lookups:

- `by_company["AAPL"]` → list of atom IDs for Apple
- `by_archetype["leadership"]` → all leadership atoms
- `by_person["Tim Cook"]` → atoms mentioning Tim Cook
- `by_tag["moat"]` → atoms tagged with moat analysis
- `by_industry["cloud-infrastructure"]` → industry-filtered atoms

Each index entry contains `id`, `file` (relative path), `title`, `companies`, and `tags`. Read the atom file directly for full content.

### Triggering research from another project

```bash
# Run research for a specific ticker
cd /path/to/equityautoresearch
npm run initial-max -- --ticker AAPL --why "Focus on AI strategy"

# Extract knowledge atoms after research completes
npm run extract-knowledge -- --ticker AAPL

# Rebuild index (run after any extraction)
npm run rebuild-index

# Query knowledge base
npm run query-kb -- --company AAPL --archetype competitive-landscape
```

### Integration ideas (future)

- **Portfolio → research priorities**: investment-intelligence portfolio positions feed `queue-gen` to auto-prioritize research for highest-conviction holdings
- **Atoms → portfolio advisor**: Knowledge atoms enrich analyst debate prompts and conviction tracking with deep fundamental context
- **Moat monitoring**: Competitive landscape atoms flag thesis drift when moat characteristics change between research refreshes

---

## License

This project is released under the [MIT License](https://opensource.org/licenses/MIT): use, modify, distribute, and commercialize freely, provided copyright and license notices are preserved. See [`LICENSE`](LICENSE) in the repo root.

---

## One-line summary

**Karpathy had the agent optimize LLMs overnight. Initial MAX has it draft your investment memo overnight.**

You open your laptop to something better than a blank page—a deep-dive at 85+ with citations, DCF, and a CEO narrative—ready for your final human judgment.

That is what AI should do for people who do equity research.

---

*Initial MAX Autoresearch — inspired by [Andrej Karpathy's autoresearch](https://github.com/karpathy/autoresearch), scored with a four-dimension framework, benchmarked against institutional-grade depth.*
