---
id: "aapl-dcf-valuation-fy2026-three-scenario"
archetype: "financial-snapshot"
title: "Apple DCF Valuation: Three-Scenario Model, WACC Decomposition & Multi-Method Fair Value (FY2025–FY2030)"
companies: ["AAPL"]
people: []
industries: ["consumer-electronics"]
tags: ["valuation","dcf","margins","revenue-mix","capex"]
temporality: "time-bound"
created: "2026-03-23"
updated: "2026-03-23"
source_report: "data/companies/AAPL/AAPL_Initial_MAX.md"
source_sections: ["2.5"]
quality: 4
---
## Apple DCF Valuation & Multi-Method Fair Value Analysis (As of March 2026)

### Multi-Method Valuation Comparison

Apple's current (TTM) valuation versus its 5-year historical averages and peer comparables:

| Metric | AAPL Current (TTM) | AAPL 5-Year Avg | Peer Comparables |
|--------|-------------------|-----------------|------------------|
| P/E | ~33x | ~28x | MSFT ~34x, GOOG ~23x, AMZN ~40x |
| EV/EBITDA | ~26x | ~22x | MSFT ~27x, GOOG ~17x, AMZN ~20x |
| P/FCF | ~30x | ~25x | MSFT ~35x, GOOG ~22x, AMZN ~30x |
| P/S | ~9x | ~7x | MSFT ~13x, GOOG ~6x, AMZN ~4x |

Sources: [StockAnalysis AAPL](https://stockanalysis.com/stocks/aapl/financials/); [Yahoo Finance AAPL](https://finance.yahoo.com/quote/AAPL/key-statistics/)

AAPL trades at a premium to its own 5-year historical averages across all four metrics, and commands a premium to Alphabet on most measures while trading at a discount to Microsoft on P/E and P/FCF.

### Fair Value Range (Cross-Validated, Three Methods)

Three independent valuation methods were applied and cross-validated against FY2026 estimates:

- **P/E Method**: FY2026E EPS ~$8.00 × reasonable P/E 28–32x → **$224–$256**
- **EV/EBITDA Method**: FY2026E EBITDA ~$150B × reasonable multiple 22–26x → implied share price **$220–$260**
- **P/FCF Method**: FY2026E FCF ~$110B × reasonable multiple 25–30x → implied share price **$230–$270**

**Composite Fair Value Range: $225–$265** (weighted median ~$245)

At a current price of approximately $250, Apple trades at the upper bound of the composite fair value range, offering limited margin of safety. Upside justification requires either Services revenue acceleration or a new AI-driven growth engine.

---

### WACC Decomposition (March 2026)

| Component | Value | Notes |
|-----------|-------|-------|
| Risk-Free Rate (Rf) | 4.3% | 10-year US Treasury (March 2026) |
| Equity Risk Premium (ERP) | 5.0% | Damodaran US market ERP |
| Beta (β) | 1.2 | 5-year monthly vs S&P 500 |
| Cost of Equity (Ke) | 10.3% | Rf + β × ERP |
| After-Tax Cost of Debt (Kd) | 3.2% | Apple effective rate × (1 − 21%) |
| Equity Weight (E/V) | 90% | Market cap / total capital |
| **WACC** | **9.6%** | Ke × E/V + Kd × D/V |

Apple's capital structure is overwhelmingly equity-financed (90% weight), reflecting its minimal net debt position after decades of buybacks and cash accumulation.

---

### DCF Three-Scenario Model

**Base Assumptions:**
- Base revenue: FY2025A $416.2B
- Forecast period: 5 years (FY2026–FY2030)
- Terminal growth rate: 3.0% (below WACC of 9.6%)
- Share count: ~14.8B (net of ongoing buybacks)

| Item | Conservative | Base | Optimistic |
|------|-------------|------|------------|
| 5-Year Revenue CAGR | 4% | 7% | 10% |
| FY2030 Revenue | $507B | $584B | $670B |
| Terminal Net Margin | 25% | 27% | 28% |
| Terminal P/E | 25x | 30x | 35x |
| Terminal Value | $3.2T | $4.7T | $6.6T |
| Present Value (Discounted) | $2.0T | $3.0T | $4.2T |
| **Per-Share Intrinsic Value** | **$135** | **$203** | **$284** |
| **IRR** | **−5%** | **4%** | **12%** |

### IRR Attribution by Scenario

| IRR Component | Conservative | Base | Optimistic |
|--------------|-------------|------|------------|
| From Revenue Growth | 4% | 7% | 10% |
| From Margin Expansion | 0% | 1% | 2% |
| From Valuation Re-rating | −12% | −6% | −2% |
| From Share Buybacks | 3% | 3% | 3% |
| **Total IRR** | **−5%** | **4%** | **12%** |

Key insight: The primary IRR drag in all scenarios is valuation compression. Even in the base case, the re-rating from current ~33x P/E toward a normalized 30x terminal multiple subtracts 6 percentage points of annual return. Buybacks provide a consistent +3% IRR contribution across scenarios.

---

### 3×3 Sensitivity Matrix (Revenue CAGR vs WACC)

| | WACC 8.5% | WACC 9.6% | WACC 10.5% |
|---|-----------|-----------|------------|
| **CAGR 4%** | $155 | $135 | $120 |
| **CAGR 7%** | $230 | $203 | $180 |
| **CAGR 10%** | $320 | $284 | $252 |

At current ~$250 share price, the DCF only supports the current valuation if: (a) WACC compresses to ~8.5% and revenue CAGR exceeds 7%, or (b) revenue CAGR achieves 10% at current WACC. Neither is the base case.

---

### Simplified Income Statement Projections (FY2025A–FY2030E)

| Item | FY2025A | FY2026E | FY2027E | FY2028E | FY2029E | FY2030E |
|------|---------|---------|---------|---------|---------|----------|
| Revenue ($B) | 416.2 | 445.3 | 476.5 | 509.9 | 545.5 | 583.7 |
| Gross Profit ($B) | 195.2 | 213.7 | 233.5 | 254.9 | 278.2 | 303.5 |
| Gross Margin | 46.9% | 48.0% | 49.0% | 50.0% | 51.0% | 52.0% |
| Operating Income ($B) | 133.1 | 147.0 | 161.9 | 178.5 | 196.0 | 214.6 |
| Net Income ($B) | 112.0 | 120.3 | 133.0 | 143.8 | 157.5 | 172.3 |
| EPS | $7.46 | $8.13 | $9.18 | $10.13 | $11.32 | $12.66 |
| FCF ($B) | 98.8 | 112.0 | 124.0 | 136.0 | 149.0 | 163.0 |

Gross margin is projected to expand ~100 bps per year from 46.9% in FY2025 to 52.0% by FY2030, driven primarily by the continued mix shift toward high-margin Services revenue.

---

### Revenue Growth Drivers by Segment

| Segment | Projected CAGR | Key Drivers |
|---------|---------------|-------------|
| iPhone | 3% | Flat unit volume; ASP +3% per year |
| Services | 12% | User base expansion + ARPU uplift |
| Mac | 8% | Apple Silicon-driven upgrade cycle |
| iPad | 4% | Steady replacement demand |
| Wearables | 2% | Mature category, growth decelerating |

Services is the critical swing factor. At a 12% CAGR, Services grows from approximately $96B (FY2025) to ~$169B by FY2030, accounting for roughly 29% of total revenue and an outsized share of gross profit given ~70%+ margins in the segment.

---

### Investment Conclusion

At an assumed current price of ~$250:
- **Base case intrinsic value**: $203 (19% downside)
- **Optimistic case intrinsic value**: $284 (14% upside)
- **Base case IRR**: ~4% (below most investors' required return)

The current valuation is defensible only if Services accelerates beyond the 12% base CAGR assumption or if Apple Intelligence (generative AI features) creates a measurable new growth vector that supports the current ~33x P/E multiple. The margin of safety is insufficient for value-oriented investors at current prices.