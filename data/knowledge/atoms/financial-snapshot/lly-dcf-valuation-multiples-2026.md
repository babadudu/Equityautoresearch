---
id: "lly-dcf-valuation-multiples-2026"
archetype: "financial-snapshot"
title: "Eli Lilly DCF Valuation, WACC Decomposition & Multi-Method Fair Value (March 2026)"
companies: ["LLY"]
people: ["Aswath Damodaran"]
industries: []
tags: ["valuation","dcf","margins","revenue-mix"]
temporality: "time-bound"
created: "2026-03-23"
updated: "2026-03-23"
source_report: "data/companies/LLY/LLY_Initial_MAX.md"
source_sections: ["2.5"]
quality: 4
---
## Eli Lilly (LLY) — DCF Valuation & Multi-Method Fair Value Analysis (March 2026)

*Reference date: March 2026. Stock price basis: ~$850. Market cap basis: ~$770B. Sources: [Yahoo Finance](https://finance.yahoo.com/quote/LLY/key-statistics/), [Eli Lilly Q4 2025 Press Release](https://investor.lilly.com/news-releases/news-release-details/lilly-reports-fourth-quarter-2025-financial-results-and-provides)*

---

### Multi-Method Valuation Comparison

| Valuation Method | LLY Current | LLY 5-Year Avg | NVO (Peer) | PFE (Peer) | Notes |
|------------------|-------------|----------------|------------|------------|-------|
| P/E (Forward) | ~35x | ~38x | ~28x | ~12x | Based on 2026E EPS ~$34 |
| EV/EBITDA | ~28x | ~32x | ~22x | ~9x | Based on 2025 EBITDA ~$28B |
| P/FCF | ~40x | ~45x | ~30x | ~14x | FCF suppressed by CapEx |
| P/S | ~7.5x | ~9x | ~8x | ~2.5x | Based on 2025 revenue $65.2B |

All multiples are estimates based on March 2026 stock price of ~$850 and market cap of ~$770B.

---

### Fair Value Range (Triangulated)

- **P/E Method:** 2026E EPS $34 × 30–35x = **$1,020–$1,190**
- **EV/EBITDA Method:** 2026E EBITDA ~$35B × 25–30x = EV $875B–$1,050B → **~$960–$1,150 per share**
- **P/FCF Method:** 2026E FCF ~$18B × 35–40x = $630B–$720B → **~$700–$800 per share** (suppressed by high CapEx)
- **Triangulated Fair Value Range: $850–$1,100** (midpoint ~$970)

At ~$850, the current price sits at the low end of fair value, implying ~14% upside to the midpoint estimate.

---

### WACC Decomposition

| Component | Value | Notes |
|-----------|-------|-------|
| Risk-Free Rate (Rf) | 4.3% | US 10-year Treasury yield, March 2026 ([Treasury.gov](https://www.treasury.gov/resource-center/data-chart-center/interest-rates/)) |
| Equity Risk Premium (ERP) | 5.0% | [Damodaran January 2026 US ERP estimate](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/ctryprem.html) |
| Beta (β) | 0.85 | 5-year monthly regression vs S&P 500; lower than peers (NVO 0.90, PFE 0.65), but adjusted upward to reflect tirzepatide revenue concentration (56%) |
| Product Concentration Premium | 1.0% | tirzepatide accounts for 56% of revenue — single-drug dependency risk higher than diversified large-cap pharma (cf. Merck/Keytruda faces similar concentration) |
| **Cost of Equity (Ke)** | **9.55%** | **= Rf 4.3% + ERP 5.0% × β 0.85 + concentration premium 1.0%** |
| After-Tax Cost of Debt (Kd) | 3.2% | A+ investment-grade rating; pre-tax ~4.0% × (1 − 21% tax rate) |
| Capital Structure (E/V) | 95.5% | Market-value basis: market cap ~$770B / (market cap $770B + net debt ~$36B); book D/E ~1.6x unrepresentative due to high pharma intangibles |
| Capital Structure (D/V) | 4.5% | Same basis |
| **WACC** | **~9.3%** | **= 95.5% × 9.55% + 4.5% × 3.2% = 9.12% + 0.14% ≈ 9.3%** |

**Methodology note:** Market-value capital structure used rather than book value. LLY's book equity is depressed by cumulative buybacks and intangible asset amortization (book D/E ~1.6x), which does not reflect actual financing structure. On a market-value basis, LLY is almost entirely equity-financed (95.5%), so WACC converges toward Ke. Terminal growth rates (2.5%–3.5%) are all materially below the lowest WACC scenario (8.3%), ensuring terminal value convergence.

---

### Three-Scenario DCF Summary

| Assumption | Bear | Base | Bull |
|------------|------|------|------|
| 2026–2030 Revenue CAGR | 13% | 19% | 23% |
| Terminal Net Margin | 28% | 32% | 35% |
| Terminal Growth Rate | 2.5% | 3.0% | 3.5% |
| Terminal P/E | 25x | 30x | 35x |
| **Intrinsic Value per Share** | **~$780** | **~$1,080** | **~$1,450** |
| vs. Current Price (~$850) | −8% | +27% | +71% |

---

### 3×3 Sensitivity Matrix: Revenue CAGR vs. WACC

| | WACC 8.3% | WACC 9.3% | WACC 10.3% |
|---|-----------|-----------|------------|
| Revenue CAGR 13% | $870 | $780 | $700 |
| Revenue CAGR 19% | $1,220 | $1,080 | $960 |
| Revenue CAGR 23% | $1,600 | $1,450 | $1,290 |

Center value (WACC 9.3%, CAGR 19%) = base scenario ~$1,080. WACC ±1% corresponds to Ke ±1% (beta or risk premium adjustment). All terminal growth rates (2.5%–3.5%) remain below the minimum WACC (8.3%), ensuring terminal value convergence across all scenarios.

---

### Valuation Conclusion

At ~$850, the current stock price approximately reflects the low end of the base scenario (WACC 10.3% + Revenue CAGR 19% ≈ $960). 

- **Upside case:** If GLP-1 penetration accelerates and oral formulation (orforglipron) succeeds, fair value rises to the base midpoint of $1,080 (+27%) or higher.
- **Downside case:** If competition intensifies or drug pricing policy turns adverse, downside is limited (bear scenario ~$780, −8%).

**Overall assessment: Current valuation is fair-to-slightly-rich, but high growth visibility makes LLY a hold rather than a chase.** The asymmetry favors patience — limited downside (−8%) versus substantial upside (+27% to +71%) if secular GLP-1 growth continues on trajectory.