---
id: "amzn-dcf-valuation-fy2026-three-scenario"
archetype: "financial-snapshot"
title: "Amazon DCF Valuation — Three-Scenario Model & Multi-Method Fair Value (FY2026E, as of March 2026)"
companies: ["AMZN"]
people: []
industries: ["cloud-infrastructure"]
tags: ["valuation","dcf","margins","revenue-mix"]
temporality: "time-bound"
created: "2026-03-23"
updated: "2026-03-23"
source_report: "data/companies/AMZN/AMZN_Initial_MAX.md"
source_sections: ["2.5"]
quality: 4
---
## Amazon DCF Valuation — Three-Scenario Model & Multi-Method Fair Value (FY2026E)

*Data as of March 2026 (estimated values; verify against real-time data before trading)*

---

### Multi-Method Valuation Comparison

The following table compares Amazon's current valuation multiples against its own 5-year historical averages and key peers (Microsoft, Alphabet, Walmart):

| Metric | AMZN Current | AMZN 5-Year Avg | MSFT | GOOG | WMT | Notes |
|--------|-------------|-----------------|------|------|-----|-------|
| P/E (Forward) | ~28x | ~55x | 32x | 21x | 36x | Post-normalization, relatively reasonable |
| EV/EBITDA | ~18x | ~28x | 24x | 16x | 14x | Below historical average |
| P/FCF | ~35x | ~60x | 38x | 24x | 30x | Above peers but profit acceleration ongoing |
| P/S | ~3.0x | ~3.5x | 12x | 6x | 0.9x | Reflects retail's low margin mix |

*Source: Market data as of 2026/03 (estimates; validate with real-time data)*

**Key observations:**
- Amazon's forward P/E of ~28x is dramatically below its 5-year average of ~55x, reflecting the post-2022 multiple compression and the dramatic improvement in profitability (operating income inflection driven by AWS mix shift and retail efficiency).
- EV/EBITDA at ~18x is below both its own 5-year average (~28x) and Microsoft (24x), suggesting embedded conservatism in consensus expectations.
- P/FCF at ~35x is higher than Google (24x) and Walmart (30x) but below Microsoft (38x), justified by accelerating free cash flow generation as AWS and advertising margins expand.
- P/S at ~3.0x remains low relative to pure software peers due to the large low-margin retail revenue base, which depresses the consolidated margin profile.

---

### Triangle Cross-Validation — Fair Value Range

Three independent valuation methods produce a triangulated fair value estimate:

| Method | Formula | Fair Value |
|--------|---------|------------|
| P/E Method | 28x × FY2026E EPS $8.50 | ~$238 |
| EV/EBITDA Method | 20x × FY2026E EBITDA $120B | ~$220 |
| P/FCF Method | 30x × FY2026E FCF $75B | ~$215 |
| **Three-Method Average** | | **~$224** |

**Implied upside vs. current price (~$205): ~9%**

The convergence across three independent methods around the $215–$238 range provides high-confidence support for the $224 mid-point estimate. The modest premium to current price (~9%) suggests the market is pricing AMZN near fair value under consensus assumptions, with the upside optionality concentrated in the bull scenario.

---

### WACC Decomposition

| Component | Value | Notes |
|-----------|-------|-------|
| Risk-Free Rate (Rf) | 4.3% | US 10-year Treasury |
| Equity Risk Premium (ERP) | 5.5% | Damodaran 2025 estimate |
| Beta (β) | 1.1 | 5-year monthly beta |
| Geopolitical Premium | 0% | US domestic company |
| **Cost of Equity (Ke)** | **10.35%** | Rf + ERP × β |
| After-Tax Cost of Debt | 3.5% | |
| Debt-to-Equity Ratio | 0.15 | Low leverage |
| **WACC** | **10.2%** | Blended WACC |

**Key points:**
- Amazon's beta of 1.1 reflects its position as a large-cap compounding company with moderate sensitivity to market cycles — higher than Walmart (defensive retail) but lower than pure-play hyper-growth tech.
- The D/E ratio of 0.15 confirms Amazon's balance sheet strength. The company has shifted from capital-intensive expansion to free cash flow harvesting, reducing financial risk significantly.
- WACC of 10.2% is the base-case discount rate used across all three DCF scenarios.

---

### Three-Scenario DCF Model

| Assumption | Conservative | Base Case | Optimistic |
|------------|-------------|-----------|------------|
| Revenue CAGR (5-Year) | 8% | 12% | 15% |
| Terminal Net Margin | 7.5% | 9.5% | 11% |
| Terminal Growth Rate | 2.5% | 3.0% | 3.5% |
| Exit P/E Multiple | 22x | 28x | 35x |
| **Target Price** | **$165** | **$280** | **$430** |
| **Implied IRR** | **4%** | **14%** | **22%** |

**Scenario narratives:**

**Conservative ($165 / 4% IRR):** Revenue growth decelerates to 8% CAGR as AWS faces intensifying competition from Azure and GCP, retail margins plateau, and advertising growth slows. Terminal net margin of 7.5% reflects structural cost pressures (logistics infrastructure, headcount). Exit P/E of 22x implies derating toward mature retailer/infrastructure multiples. IRR of 4% is below cost of capital — a value-destructive scenario for new investors.

**Base Case ($280 / 14% IRR):** AWS maintains ~17–18% growth driven by enterprise cloud migration and AI workloads. Retail operating margins expand to 5–6% as same-day delivery efficiency and advertising flywheel mature. Terminal net margin of 9.5% reflects normalization of the AWS/Retail/Ads mix toward higher-margin digital revenues. IRR of 14% comfortably exceeds the 10.2% WACC, creating value.

**Optimistic ($430 / 22% IRR):** AWS accelerates to become the dominant AI infrastructure layer, with Bedrock/Trainium/Inferentia capturing significant share of enterprise AI spend. Amazon Advertising reaches $80B+ in revenue with 40%+ margins. Retail achieves 7–8% operating margins through autonomous fulfillment. Terminal net margin of 11% approaches software-like economics at scale. Exit P/E of 35x reflects sustained premium growth franchise. IRR of 22% represents exceptional capital efficiency.

---

### 3×3 Sensitivity Matrix (Revenue CAGR vs. WACC)

The following matrix stress-tests the base-case assumptions across a range of revenue growth and discount rate assumptions:

| | WACC 9% | WACC 10.2% | WACC 11.5% |
|--|---------|-----------|------------|
| Revenue CAGR 8% | $195 | $165 | $140 |
| Revenue CAGR 12% | $330 | $280 | $240 |
| Revenue CAGR 15% | $510 | $430 | $365 |

**Interpretation:**
- Current price of ~$205 is bracketed between the (8% growth, WACC 9%) cell ($195) and the (12% growth, WACC 10.2%) base case ($280), suggesting the market is implicitly pricing in slightly below-base-case growth expectations OR a slightly lower WACC environment.
- The $140 floor (8% growth, WACC 11.5%) represents the worst-case downside if growth disappoints AND rates rise — approximately 32% below current levels.
- The $510 ceiling (15% growth, WACC 9%) is achievable if the AI infrastructure super-cycle plays out and rates decline — approximately 149% above current levels.
- The wide dispersion ($140–$510) underscores that Amazon is a high-optionality, high-uncertainty investment where scenario selection dominates the valuation outcome.

---

### Probability-Weighted Expected Return

Applying subjective probabilities to each scenario:

| Scenario | Probability | Target Price | IRR | Contribution |
|----------|------------|-------------|-----|-------------|
| Conservative | 25% | $165 | 4% | $41.25 |
| Base Case | 50% | $280 | 14% | $140.00 |
| Optimistic | 25% | $430 | 22% | $107.50 |
| **Weighted Average** | **100%** | **$288.75** | **13.5%** | |

**Probability-Weighted Expected Price: ~$289**
**Probability-Weighted IRR: 25% × 4% + 50% × 14% + 25% × 22% = 13.5%**

At current prices (~$205), the probability-weighted IRR of 13.5% exceeds the WACC of 10.2% by ~330 basis points, suggesting positive expected alpha. The weighted target price of ~$289 implies approximately 41% upside from current levels on a probability-adjusted basis — driven primarily by the base case (50% weight) and amplified by the high IRR in the optimistic scenario.

---

### Model Limitations & Caveats

1. **Full three-statement model pending:** Complete 5-year projections (income statement, cash flow statement, balance sheet) have not yet been modeled. Current estimates are top-down; bottom-up segment-level forecasts would improve precision.
2. **Estimates require real-time validation:** All multiples and target prices are based on estimated consensus figures as of March 2026. Verify FY2026E EPS, EBITDA, and FCF against current FactSet/Bloomberg consensus before use.
3. **Scenario probabilities are subjective:** The 25/50/25 split reflects a symmetric distribution assumption. Investors with stronger views on AWS AI acceleration or macro headwinds should adjust weights accordingly.
4. **Terminal value sensitivity:** As with all DCFs, the terminal value dominates (typically 60–80% of total value). Small changes in terminal growth rate (2.5% vs. 3.5%) or exit multiple (22x vs. 35x) drive large price target differences — as the sensitivity matrix illustrates.
5. **Geopolitical and regulatory risks not modeled:** FTC antitrust scrutiny, EU DMA compliance costs, and potential AWS data localization requirements could compress margins in ways not captured in the base case.