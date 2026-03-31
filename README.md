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

---

## 中文

# Initial MAX Autoresearch：為投資研究而生的自動化深度研究引擎

---

## 靈感來源：Andrej Karpathy 的「過夜研究員」

2026 年，AI 領域最受尊敬的研究者之一 Andrej Karpathy 發表了一個名為 [autoresearch](https://github.com/karpathy/autoresearch) 的實驗性專案。

它的核心思想極其簡單，卻震撼人心：

> **讓 AI Agent 在你睡覺時，自己做研究、跑實驗、評估結果、修正方向——循環不止，直到找到答案。**

Karpathy 的系統是為機器學習優化設計的：Agent 修改訓練程式碼 → 跑 5 分鐘實驗 → 測量成效 → 決定保留或回滾 → 繼續下一輪。一個晚上，12 個實驗，全自動。

**Initial MAX Autoresearch 把這個精神，完整移植到投資研究的世界。**

Agent 搜尋資料 → 撰寫研究章節 → 依框架自我評分 → 識別缺口 → 補充研究 → 再評分 → 循環，直到報告達到 85/100 分的機構級水準。

---

## 你真正在意的問題

在深入介紹技術之前，讓我先問你一個問題。

你是否曾經有過這樣的經驗：

市場上出現了一個值得深入研究的標的——也許是 NVDA 在 AI 浪潮中的第三成長曲線，也許是一家你聽說了六個月、但一直沒時間深挖的中概股——然後你打開 ChatGPT，或是 Google 的 Deep Research，問了幾個問題，得到了幾頁看起來很完整的報告。

你閉上眼睛，摸著自己的心問：**這份報告，我敢把它當作百萬元投資決策的依據嗎？**

你知道答案。

---

## 對話式 AI 與 Deep Research 的本質局限

市面上的 AI 工具，對投資研究者來說，有三個根本性的缺陷：

### 1. 它們給你「答案」，不給你「論點」

當你問 ChatGPT「BABA 值得買嗎？」，它會給你一篇平衡的文章，優點幾條、風險幾條，結尾說「投資人應自行判斷」。

這不是研究。這是一篇高中作文。

真正的投資研究，需要的是**可被驗證的論點**：有出處的數字、有日期的管理層原話、有時間縱深的產業歷史、有假設的 DCF 估值。

### 2. 它們是一次性的，你是孤獨的

Deep Research 給你一份報告，然後就結束了。如果你發現某個章節不夠深、某個數字沒有出處、CEO 的訪談引用太少——你必須自己再去追，自己再整合。

每一次研究，你都在從零開始。你的努力不會累積。

### 3. 它們沒有品質標準

什麼叫「夠好的研究」？它們說不出來。你也說不出來。你只能靠直覺判斷這份報告「感覺不錯」。

**感覺不錯，在投資裡是最危險的信號。**

---

## Initial MAX：三個根本性的不同

### 不同之一：有框架，有標準，有分數

Initial MAX 採用**四維投資框架（環境→生意→組織→人）**作為評分體系：

| 維度 | 滿分 | 核心問題 |
|------|------|---------|
| 環境 | 20 分 | 這個產業的 TAM 有多大？監管風險？技術趨勢？ |
| 生意 | 35 分 | 商業模式是什麼？護城河有多深？DCF 值多少？ |
| 組織 | 20 分 | 公司的執行力如何？地理分佈？ROIC 趨勢？ |
| 人 | 25 分 | CEO 是什麼樣的人？做過什麼決策？說過什麼？ |

每一輪研究結束，系統自動打分，識別哪些維度分數最低，下一輪優先補那裡。

**這不是在問「感覺怎麼樣」，這是在問「分數到了沒有」。**

達標線是：總分 ≥85 分，且每個維度都達到最低門檻，DCF 估值為必達項。不達標，繼續跑。最多 20 輪。

### 不同之二：自動迭代，你不需要在場

你輸入一個股票代號，設定你關心的研究角度（`--why "我很好奇阿里巴巴的雲業務成長性"`），然後去睡覺。

系統會：
- 搜尋最新的產業報告、財報、管理層訪談
- 用 API 抓取 10 年財報數據、法說逐字稿
- 撰寫每個章節，鑲入 CEO 原話（每個子節至少 5 則，商業模式維度至少 25 則）
- 建立三情境 DCF 估值模型（樂觀/合理/保守）
- 評分、找缺口、補研究、再評分
- 最後自動跑一輪「整理輪」，讓報告讀起來像一篇文章，而不是一堆條目

**你醒來時，一份機構級投資報告已經等著你。**

### 不同之三：可讀的報告，而不是資料倉庫

Initial MAX 的最終產出，是一份**敘事型投資報告**。

它的結構是：
1. **IRR 模型與情境分析**（讀者打開第一眼就看到估值結論與假設）
2. **投資論點總結**（1-2 段，獨立可讀）
3. **KEY QUESTION**（這家公司想做什麼？管理層怎麼想？）
4. **環境 → 生意 → 組織 → 人**（完整四維分析，每節有段落敘事）
5. **評分表**（透明標示哪裡強、哪裡弱）

每個數字都有出處連結。每句管理層引言都有引號、日期、來源。CEO 故事線從學經歷鋪陳到現在，按時間軸展開。

**這不是讓你看著螢幕抄筆記。這是一份你可以直接打印出來、帶去投委會的報告。**

---

## 延伸分析階段

在核心四維分析之外，報告可包含三個可選的延伸階段：

| 階段 | 章節 | 涵蓋內容 |
|------|------|---------|
| 地緣政治 | 6.1–6.3 | 供應鏈風險、貿易政策、地理集中度 |
| ESG | 7.1–7.3 | 碳排放、水資源、監管合規 |
| 多空辯論 | 8.1–8.3 | 牛市 vs. 熊市論點，附機率加權情境 |

當核心報告達到足夠分數時，延伸階段會自動觸發，也可透過 CLI 參數手動啟動。

---

## 知識庫

研究不再從零開始。Initial MAX 維護一個**可重複使用的知識庫**，由已完成報告中萃取的結構化知識原子組成。

### 原子原型

| 原型 | 範例 |
|------|------|
| `company-profile` | 商業模式、單位經濟、業務分拆 |
| `leadership` | CEO/創辦人簡歷、職涯歷史、領導哲學 |
| `quotes` | 高管直接引言，含日期、出處、完整引用 |
| `competitive-landscape` | 五力分析、護城河、監管環境 |
| `financial-snapshot` | 10 年財務歷史、DCF、ROIC、利潤率 |
| `industry` | TAM、成長驅動力、市場結構、S 曲線 |
| `technology` | 產品路線圖、技術採用曲線、研發策略 |
| `geopolitical` | 區域風險、貿易政策、供應鏈 |
| `esg` | 永續指標、碳排放、水資源、合規 |

每個原子都是 Markdown 檔案，包含 YAML frontmatter 結構化中繼資料：`id`、`archetype`、`companies[]`、`people[]`、`industries[]`、`tags[]`、`temporality`、`quality`（1–5），以及可追溯至原始報告章節的來源資訊。

### 知識管線

```bash
# 1. 從已完成的報告中萃取知識原子
npm run extract-knowledge -- --ticker AAPL

# 2. 重建可搜尋索引
npm run rebuild-index

# 3. 查詢知識庫
npm run query-kb -- --company AAPL --archetype leadership
```

索引（`data/knowledge/_index.json`）提供按公司、人物、原型、標籤、產業的反向查詢，加速研究過程中的知識檢索。

---

## 研究佇列

針對投資組合規模的研究，Initial MAX 支援批次自動化：

```bash
# 根據投資組合生成研究佇列（按權重、過時程度排序）
npm run queue-gen

# 執行佇列（依序對每個標的執行 initial-max）
npm run queue-run
```

佇列（`data/research_queue.json`）追蹤各標的的狀態、優先分數與完成進度。

---

## 以卡內基的方式說：你真正渴望的是什麼

Dale Carnegie 在《人性的弱點》中說：

> 「世界上只有一種方法能影響別人，那就是談論他們想要的，並告訴他們如何得到它。」

所以讓我直接說。

你做投資研究，不是因為你喜歡整理 Excel 表格，也不是因為你享受在財報裡搜尋數字。

你做投資研究，是因為你**渴望確定性**。

在一個充滿不確定的市場裡，你希望自己的判斷是建立在紮實的基礎上。你希望當別人問你「為什麼買這支股票」時，你能清楚說出：「因為管理層在 2024 年 Q3 法說明確說過這件事，因為 TAM 在這個範圍，因為 DCF 顯示合理情境下 IRR 是 X%。」

你渴望的，是**信心**。

但你現在面對的現實是：研究永遠做不完。每個標的都需要幾十個小時的深挖。你有更多想看的公司，卻沒有更多時間。你用了 AI 工具，但又不完全信任它們。你夾在「研究不夠深」和「時間根本不夠」之間。

**Initial MAX 就是為了解決這個矛盾而存在的。**

它不能替你做投資決策——那永遠是你的責任，也是你的價值所在。但它可以把你從「整理資料、追引用、補章節、寫 DCF」這些消耗時間卻不需要你才智的工作中解放出來，讓你把心力放在真正需要人類判斷的地方：**解讀、比較、決策。**

你值得一個更好的研究工作流程。你的時間，值得花在更重要的事情上。

---

## 安裝與使用

### 環境需求

- Node.js 18+
- Claude CLI（透過 `claude login` 認證）
- 可選：API Ninjas Key（財報/法說逐字稿）、Brave Search API Key（網頁搜尋）

### 安裝步驟

```bash
# 1. 克隆或下載專案
git clone <repo-url>
cd equityautoresearch

# 2. 安裝依賴
npm install

# 3. 認證 Claude
claude login

# 4. 設定環境變數
cp .env.example .env
# 用任何文字編輯器打開 .env，填入你的 API 金鑰：
#   USE_CLAUDE_CLI=1                   ← 預設，使用你的 Claude 訂閱
#   NINJA_API_KEY=...                  ← 選填（財報與法說逐字稿）
#   BRAVE_SEARCH_API_KEY=...           ← 選填（搜尋品質提升）
```

### 立即開始研究

```bash
# 最簡單的開始：研究 NVIDIA
npm run initial-max -- --ticker NVDA

# 指定你的研究關注點（強烈建議加上 --why，讓 AI 知道你在意什麼）
npm run initial-max -- --ticker BABA --why "我很好奇阿里巴巴的雲業務成長性與估值"

# 控制迭代輪數（預設 20 輪；想快速出草稿可設 5）
npm run initial-max -- --ticker FUTU --max-rounds 10

# 只打分，不補研究（適合已有報告、只想看哪裡不足）
npm run score -- --ticker NVDA
```

### 產出說明

研究完成後，你會在以下路徑找到成果：

```
data/companies/{TICKER}/
├── {TICKER}_Initial_MAX.md      ← 主報告（單一完整文件）
├── dcf_config.json              ← DCF 假設
└── transcripts/                 ← CEO 訪談逐字稿
    ├── CEO_2024_podcast.md
    └── ...

data/knowledge/
├── atoms/                       ← 可重複使用的知識原子
│   ├── company-profile/
│   ├── leadership/
│   ├── quotes/
│   ├── competitive-landscape/
│   ├── financial-snapshot/
│   ├── industry/
│   ├── technology/
│   ├── geopolitical/
│   └── esg/
├── _index.json                  ← 可搜尋的原子索引
└── _taxonomy.json               ← 原型定義與更新排程

data/
└── run-trace.jsonl              ← Token/成本追蹤日誌

results/
└── MMDD_scores.tsv              ← 每輪評分紀錄
```

### CLI 命令速查表

| 命令 | 說明 | 範例 |
|------|------|------|
| `npm run initial-max` | 執行完整研究迴圈 | `-- --ticker NVDA --why "AI 成長"` |
| `npm run score` | 只打分，不研究 | `-- --ticker NVDA` |
| `npm run extract-knowledge` | 將報告分解為知識原子 | `-- --ticker AAPL` |
| `npm run rebuild-index` | 重建知識庫索引 | |
| `npm run query-kb` | 查詢知識庫 | `-- --company AAPL --archetype leadership` |
| `npm run compare` | 跨標的比較報告 | `-- --ticker AAPL --ticker MSFT` |
| `npm run queue-gen` | 從投資組合生成研究佇列 | |
| `npm run queue-run` | 批次執行研究佇列 | `-- --force --capacity 80` |

### 研究參數

| 參數 | 說明 | 範例 |
|------|------|------|
| `--ticker` / `-t` | 股票代號（必填） | `--ticker NVDA` |
| `--why` | 你的研究關注點 | `--why "關注雲業務成長"` |
| `--max-rounds` | 最多迭代輪數（預設 20） | `--max-rounds 10` |
| `--score-only` | 只打分，不研究 | `--score-only` |
| `--skip-polish` | 跳過最後整理輪 | `--skip-polish` |
| `--tag` | TSV 檔名標籤（預設今日 MMDD） | `--tag q1review` |

### 佇列執行參數

| 參數 | 說明 | 範例 |
|------|------|------|
| `--capacity` | 目前使用容量 %（0-100），低於 20% 拒絕執行 | `--capacity 80` |
| `--force` | 跳過排程時段檢查 | `--force` |
| `--ticker` | 強制指定標的 | `--ticker MCD` |
| `--max-cost` | 覆蓋單標的成本上限 | `--max-cost 50` |
| `--dry-run` | 預覽將執行的內容，不實際執行 | `--dry-run` |

### 可觀測性

Token 消耗與執行追蹤記錄在 `data/run-trace.jsonl`（僅附加式 JSONL）。每筆記錄包含標的、階段、輪次、模型、耗時、Token 數、成本與分數變化。

```bash
# 查看特定標的的追蹤記錄
grep MCD data/run-trace.jsonl

# 查看最近的追蹤記錄
tail -20 data/run-trace.jsonl
```

---

## 與 investment-intelligence 整合

本專案設計為與 [investment-intelligence](../investment-intelligence)（投資組合監控與多分析師協作系統）搭配使用。兩個專案目前獨立運作，但共享互補的資料模型。

### 資料存取路徑

| 資料 | 路徑 | 格式 |
|------|------|------|
| 研究報告 | `data/companies/{TICKER}/{TICKER}_Initial_MAX.md` | Markdown |
| 知識原子 | `data/knowledge/atoms/{archetype}/*.md` | Markdown + YAML frontmatter |
| 可搜尋索引 | `data/knowledge/_index.json` | JSON（反向索引） |
| 原型定義 | `data/knowledge/_taxonomy.json` | JSON（原型定義） |
| 研究佇列 | `data/research_queue.json` | JSON（優先佇列） |
| 執行追蹤 | `data/run-trace.jsonl` | JSONL（Token/成本可觀測性） |

### 原子中繼資料結構

每個知識原子檔案包含 YAML frontmatter：

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

### 程式化查詢知識庫

索引（`_index.json`）提供反向查詢：

- `by_company["AAPL"]` → Apple 相關的所有原子 ID
- `by_archetype["leadership"]` → 所有領導力原子
- `by_person["Tim Cook"]` → 提及 Tim Cook 的原子
- `by_tag["moat"]` → 標記為護城河分析的原子
- `by_industry["cloud-infrastructure"]` → 按產業篩選的原子

每個索引項目包含 `id`、`file`（相對路徑）、`title`、`companies`、`tags`。直接讀取原子檔案以取得完整內容。

### 從其他專案觸發研究

```bash
# 對特定標的執行研究
cd /path/to/equityautoresearch
npm run initial-max -- --ticker AAPL --why "聚焦 AI 策略"

# 研究完成後萃取知識原子
npm run extract-knowledge -- --ticker AAPL

# 重建索引（萃取後執行）
npm run rebuild-index

# 查詢知識庫
npm run query-kb -- --company AAPL --archetype competitive-landscape
```

### 整合方向（未來）

- **投資組合 → 研究優先序**：investment-intelligence 的持倉資料驅動 `queue-gen`，自動為最高信念持股安排研究
- **知識原子 → 投資顧問**：知識原子豐富分析師辯論提示詞與信念追蹤的基本面深度
- **護城河監控**：競爭格局原子在研究更新間偵測論點偏移

---

## 授權

本專案以 [MIT License](https://opensource.org/licenses/MIT) 開源釋出：可自由使用、修改、散布與商用，惟須保留版權與授權聲明。完整條文見專案根目錄的 [`LICENSE`](LICENSE)。

---

## 一句話總結

**Karpathy 讓 AI 在夜裡優化 LLM。Initial MAX 讓 AI 在夜裡替你寫投資報告。**

你明天早上打開電腦，不再是一張白紙——而是一份 85 分以上、有出處、有 DCF、有 CEO 故事線的深度研究報告，等著你做最後的人類判斷。

這，才是 AI 應該為投資研究者做的事。

---

*Initial MAX Autoresearch — 以 [Andrej Karpathy autoresearch](https://github.com/karpathy/autoresearch) 為靈感，以四維框架（環境→生意→組織→人）為評分標準，以機構級深度為品質標竿。*
