---
id: "goog-dcf-valuation-multiples-2024"
archetype: "financial-snapshot"
title: "Google (Alphabet) DCF Valuation & Multi-Method Fair Value Analysis — FY2024"
companies: ["GOOG"]
people: ["Aswath Damodaran"]
industries: ["cloud-infrastructure"]
tags: ["valuation","dcf","margins","revenue-mix","capex"]
temporality: "time-bound"
created: "2026-03-23"
updated: "2026-03-23"
source_report: "data/companies/GOOG/GOOG_Initial_MAX.md"
source_sections: ["2.5"]
quality: 4
---
## Google (Alphabet) DCF Valuation & Multi-Method Fair Value Analysis — FY2024

### Base Financial Data (FY2024)

| Metric | Value |
|--------|-------|
| Market Cap | ~$2.35T (assumes ~$190/share) |
| Net Cash | ~$80B ($95B cash − $15B long-term debt) |
| Enterprise Value (EV) | ~$2.27T |
| Revenue | $350B |
| EBITDA (est.) | ~$135B (operating income $112.4B + D&A ~$22.6B) |
| Net Income | $100.1B |
| FCF (est.) | ~$69B (operating cash flow ~$94B − CapEx ~$25B) |
| EPS | $8.04 |
| Buybacks | $62.2B |

---

### Multi-Method Valuation Comparison

| Method | Current Multiple | 5-Year Average | Peer Comparison | Implied Fair Value |
|--------|-----------------|----------------|-----------------|--------------------|
| **P/E** | 23.6x | ~26x | MSFT 32x, META 24x, AMZN 42x | ~$209 (5-yr avg) |
| **EV/EBITDA** | 16.8x | ~18x | MSFT 24x, META 16x, AMZN 22x | ~$210 (5-yr avg) |
| **P/FCF** | 34.1x | ~28x | MSFT 38x, META 28x, AMZN 45x | ~$165 (FCF suppressed by CapEx cycle) |

**Fair Value Range Summary**:
- P/E method (5-yr avg 26x × 2025E EPS $9.50): ~$247
- EV/EBITDA method (5-yr avg 18x × 2025E EBITDA $150B): ~$235
- P/FCF method (28x × normalized FCF ~$80B): ~$185 (CapEx cycle suppresses FCF)
- **Triangulated fair value: $200–$250, midpoint ~$225**

**Current price ~$190 vs. fair value midpoint ~$225 → ~16% margin of safety.**

---

### WACC Decomposition

| Component | Value | Notes |
|-----------|-------|-------|
| Risk-free rate (Rf) | 4.3% | 10-year US Treasury (March 2025) |
| Equity risk premium (ERP) | 5.0% | Damodaran 2025 estimate |
| Beta (β) | 1.05 | 5-year monthly returns vs. S&P 500 |
| Cost of equity (Ke) | 9.6% | Rf + β × ERP |
| After-tax cost of debt | 3.4% | AA+ credit rating, low rate |
| Capital structure | 97% equity / 3% debt | Near-fully equity-financed |
| **WACC** | **9.4%** | No geopolitical risk premium (US HQ) |

*Note: No geopolitical risk premium applied — Alphabet is headquartered in the US with limited country-specific risk.*

---

### DCF Three-Scenario Revenue Projections

| Year | Bull | Base | Bear |
|------|------|------|------|
| 2025E | +15% ($402B) | +12% ($392B) | +8% ($378B) |
| 2026E | +14% ($459B) | +11% ($435B) | +7% ($404B) |
| 2027E | +13% ($519B) | +10% ($479B) | +6% ($429B) |
| 2028E | +12% ($581B) | +9% ($522B) | +5% ($450B) |
| 2029E | +11% ($645B) | +8% ($564B) | +4% ($468B) |

**Key Assumptions & Evidence Base**:
- **Search**: Base case +8–10%/yr. AI Overviews expands use cases, partially offset by competitive pressure and antitrust uncertainty.
- **Google Cloud**: Base case +25–30%/yr decelerating to +20%. Supported by $155B backlog.
- **YouTube**: Base case +12–15%/yr driven by Connected TV penetration and subscription growth.
- **Net margins**: 27–30%. AI CapEx headwind offset by scale efficiencies and post-restructuring cost discipline.
- **Terminal growth rate**: 3.0% (below WACC of 9.4%).

---

### DCF Intrinsic Value by Scenario

| Scenario | Terminal FCF | Terminal Value | DCF Intrinsic Value | vs. Current Price |
|----------|-------------|----------------|---------------------|-------------------|
| Bull | $175B | $2.73T | ~$300 | +58% |
| Base | $140B | $2.19T | ~$240 | +26% |
| Bear | $105B | $1.64T | ~$175 | −8% |

---

### 3×3 Sensitivity Matrix (Revenue CAGR vs. WACC)

| WACC \ Revenue CAGR | 8% | 11% | 14% |
|----------------------|-----|------|------|
| **8.4%** | $210 | $265 | $330 |
| **9.4%** | $185 | $240 | $300 |
| **10.4%** | $165 | $215 | $270 |

---

### IRR Attribution

| Source | Contribution |
|--------|--------------|
| Earnings growth | ~8–10% (revenue 10–12% × margin expansion) |
| Valuation re-rating | ~0–2% (current P/E 23.6x → historical mean 26x) |
| Share buybacks | ~2–3% (~$60–70B/yr buybacks, ~3% of market cap) |
| **Expected total return** | **~10–15%** |

---

### Key Observations

1. **P/FCF distorted by CapEx cycle**: At 34.1x P/FCF, Alphabet appears expensive on this metric, but this reflects elevated 2024 CapEx ($25B+). Normalized FCF (~$80B) brings the implied fair value to ~$185, still below the P/E and EV/EBITDA signals.

2. **Discount to peers on P/E**: At 23.6x P/E vs. MSFT 32x and AMZN 42x, Alphabet trades at a meaningful discount despite comparable or superior FCF generation, likely reflecting antitrust overhangs and AI transition uncertainty.

3. **EV/EBITDA in-line with META**: EV/EBITDA of 16.8x is essentially at parity with META (16x), suggesting the market is not pricing in Alphabet's cloud optionality or YouTube monetization upside.

4. **Buyback yield is a structural IRR contributor**: $60–70B/year in repurchases (~3% of market cap) mechanically accretes per-share value and is a durable, management-controlled lever regardless of multiple expansion.

5. **Bear case does not imply catastrophe**: Even the bear scenario (+4–8% revenue CAGR, 9.4% WACC) yields an intrinsic value of ~$175 — only 8% below current prices — suggesting the downside is limited absent a structural collapse in Search.

*Data as of FY2024 results. WACC inputs reflect March 2025 market conditions. Fair value estimates are model outputs, not price targets.*