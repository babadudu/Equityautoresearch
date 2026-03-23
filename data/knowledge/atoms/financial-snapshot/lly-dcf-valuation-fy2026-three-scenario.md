---
id: "lly-dcf-valuation-fy2026-three-scenario"
archetype: "financial-snapshot"
title: "Eli Lilly DCF Valuation & Multi-Method Appraisal — FY2026 Three-Scenario Analysis"
companies: ["LLY"]
people: []
industries: []
tags: ["valuation","dcf","margins","revenue-mix","capex"]
temporality: "time-bound"
created: "2026-03-23"
updated: "2026-03-23"
source_report: "data/companies/LLY/LLY_Initial_MAX.md"
source_sections: ["2.5"]
quality: 4
---
## Eli Lilly (LLY) — DCF Valuation & Multi-Method Appraisal (FY2026 Base)

*Data as of March 2026. Reference price: ~$850/share. Market cap: ~$770B.*

Sources: [Yahoo Finance Key Statistics](https://finance.yahoo.com/quote/LLY/key-statistics/), [Eli Lilly Q4 2025 Press Release](https://investor.lilly.com/news-releases/news-release-details/lilly-reports-fourth-quarter-2025-financial-results-and-provides)

---

### Multi-Method Valuation Comparison

| Metric | LLY Current | LLY 5-Year Avg | NVO (Peer) | PFE (Peer) | Notes |
|---|---|---|---|---|---|
| P/E (Forward) | ~35x | ~38x | ~28x | ~12x | Based on 2026E EPS ~$34 |
| EV/EBITDA | ~28x | ~32x | ~22x | ~9x | Based on 2025 EBITDA ~$28B |
| P/FCF | ~40x | ~45x | ~30x | ~14x | FCF suppressed by high CapEx |
| P/S | ~7.5x | ~9x | ~8x | ~2.5x | Based on 2025 revenue $65.2B |

LLY trades at a meaningful premium to both its large-cap pharma peer PFE and its GLP-1 rival NVO across all multiples, reflecting the market's pricing of superior near-term growth. Current multiples are below LLY's own 5-year historical averages, suggesting some multiple compression already occurred relative to peak enthusiasm.

---

### Fair Value Range — Triangulated Across Three Methods

**P/E Method:**
- 2026E EPS: $34
- Applied multiple range: 30–35x
- Implied fair value: **$1,020–$1,190 per share**

**EV/EBITDA Method:**
- 2026E EBITDA: ~$35B
- Applied EV/EBITDA range: 25–30x
- Implied EV: $875B–$1,050B
- Implied per-share value: **~$960–$1,150**

**P/FCF Method:**
- 2026E FCF: ~$18B
- Applied P/FCF range: 35–40x
- Implied market cap: $630B–$720B
- Implied per-share value: **~$700–$800**
- Note: P/FCF depressed due to high ongoing capital expenditure for manufacturing expansion

**Triangulated Fair Value Range: $850–$1,100 per share** (midpoint ~$970)

At the reference price of ~$850, LLY sits at the lower bound of the triangulated range, implying approximately **14% upside to the midpoint valuation** of ~$970.

---

### WACC Decomposition

| Component | Value | Notes |
|---|---|---|
| Risk-Free Rate (Rf) | 4.3% | US 10-year Treasury yield, March 2026 ([Treasury.gov](https://www.treasury.gov/resource-center/data-chart-center/interest-rates/)) |
| Equity Risk Premium (ERP) | 5.0% | [Damodaran January 2026 US ERP estimate](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/ctryprem.html) |
| Beta (β) | 0.85 | 5-year monthly regression vs S&P 500; adjusted upward to reflect tirzepatide revenue concentration (56% of revenue) |
| Product Concentration Premium | 1.0% | Tirzepatide accounts for 56% of revenue — single-drug dependency risk above diversified large-cap pharma peers |
| **Cost of Equity (Ke)** | **9.55%** | = Rf 4.3% + ERP 5.0% × β 0.85 + Concentration Premium 1.0% |
| After-Tax Cost of Debt (Kd) | 3.2% | A+ investment-grade rating; pre-tax ~4.0% × (1 − 21% tax rate) |
| Equity Weight (E/V) | 95.5% | Market-cap basis: ~$770B / ($770B + ~$36B net debt) |
| Debt Weight (D/V) | 4.5% | Same basis |
| **WACC** | **~9.3%** | = 95.5% × 9.55% + 4.5% × 3.2% = 9.12% + 0.14% ≈ 9.3% |

**Methodology notes on capital structure:**
Book-value D/E of ~1.6x is not representative of LLY's true financing structure due to accumulated buybacks and high intangible asset amortization in pharma. Market-cap-based weights show LLY is almost entirely equity-financed (95.5%), making WACC essentially equivalent to Ke. All terminal growth rates (2.5%–3.5%) are materially below the minimum WACC scenario (8.3%), ensuring DCF terminal value convergence.

**Beta context:** Peer comparison — NVO β ≈ 0.90, PFE β ≈ 0.65. LLY's β of 0.85 with the 1.0% concentration add-on reflects a deliberate choice to penalize the tirzepatide dependency, analogous to Merck's Keytruda concentration risk.

---

### Three-Scenario DCF

| Assumption | Conservative | Base | Optimistic |
|---|---|---|---|
| 2026–2030 Revenue CAGR | 13% | 19% | 23% |
| Terminal Net Margin | 28% | 32% | 35% |
| Terminal Growth Rate | 2.5% | 3.0% | 3.5% |
| Terminal P/E | 25x | 30x | 35x |
| **Intrinsic Value per Share** | **~$780** | **~$1,080** | **~$1,450** |
| vs. Current Price (~$850) | **−8%** | **+27%** | **+71%** |

**Conservative scenario (~$780, −8%):** Assumes competitive pressure from oral GLP-1s (Novo Nordisk semaglutide pill, Roche/others) accelerates sooner than expected, combined with adverse drug pricing policy (IRA Medicare negotiation expands scope), compressing both revenue growth and margins.

**Base scenario (~$1,080, +27%):** Tirzepatide maintains dominant share through 2030, oral orforglipron achieves successful Phase 3 and launch, manufacturing capacity scales to meet demand, and IRA impact is contained to current scope.

**Optimistic scenario (~$1,450, +71%):** GLP-1 category penetration accelerates materially (from ~3% of eligible US adults to 8–10%+), orforglipron gains outsized share in oral segment, pipeline assets (retatrutide, lepodisiran) add meaningful value, and margin expansion exceeds expectations as manufacturing efficiencies accrue.

---

### 3×3 Sensitivity Matrix (Revenue CAGR vs WACC)

| | WACC 8.3% | WACC 9.3% | WACC 10.3% |
|---|---|---|---|
| Revenue CAGR 13% | $870 | $780 | $700 |
| Revenue CAGR 19% | $1,220 | $1,080 | $960 |
| Revenue CAGR 23% | $1,600 | $1,450 | $1,290 |

The matrix center (WACC 9.3%, CAGR 19%) = base scenario ~$1,080. WACC ±1% corresponds to adjustments in β or risk premium assumptions. All terminal growth rates (2.5%–3.5%) remain below even the lowest WACC scenario (8.3%), confirming terminal value mathematical convergence in all cases.

**Key sensitivity observations:**
- A 1% rise in WACC (8.3% → 9.3%) reduces base-scenario value by ~$140/share (~13%)
- The base CAGR scenario (19%) is approximately 2.3× more valuable than the conservative (13%) at the same WACC — confirming that revenue growth is the dominant value driver, not discount rate
- Even the worst-case cell (CAGR 13%, WACC 10.3% → $700) implies only ~18% downside from current price, providing a floor assessment

---

### Valuation Conclusion

At ~$850, LLY roughly reflects the lower-end of the base scenario (WACC 10.3% + Revenue CAGR 19% ≈ $960), implying a modest discount to fair value in an optimistic-but-not-irrational growth case.

**Bull case:** If GLP-1 penetration accelerates and oral formulations succeed, upside to the base midpoint ($1,080, +27%) or beyond is well-supported.

**Bear case:** Downside is structurally limited at ~−8% (conservative scenario ~$780) given the near-term earnings visibility from tirzepatide's already-booked demand.

**Investment posture implied by valuation:** *Hold rather than chase.* Current valuation is fair-to-slightly-expensive relative to base expectations, but the high certainty of the near-term growth trajectory (tirzepatide supply ramp through 2027) limits downside materially. The P/FCF discount (~$700–$800) reflects the capital intensity of manufacturing buildout and should normalize as CapEx peaks.

**Key re-rating catalysts (upside):** Orforglipron Phase 3 success, retatrutide regulatory progress, faster-than-expected manufacturing yield improvements.

**Key de-rating risks (downside):** IRA drug pricing expansion, superior competing oral GLP-1 (semaglutide pill or next-gen), manufacturing quality issues, tirzepatide safety signal.