---
id: "tsmc-financial-snapshot-valuation-dcf"
archetype: "financial-snapshot"
title: "TSMC Financial Valuation 2026: AI Margins, Capital Expenditure Black Holes, and the Taiwan Discount"
companies: ["TSM","NVDA","ASML"]
people: ["Wendell Huang","C.C. Wei"]
industries: ["semiconductor-foundry"]
tags: ["valuation","dcf","capex","margins","financials"]
temporality: "time-bound"
created: "2026-03-29"
updated: "2026-03-29"
source_report: "data/companies/TSM/TSM_Initial_MAX.md"
source_sections: ["all"]
quality: 4
---
### Financial Trajectory and AI Supercycle Impact

TSMC's financial metrics reflect a company experiencing explosive, structural growth driven by the AI supercycle. Following a brief inventory correction in 2023 (where revenue dipped to $70.45B), TSMC roared back in 2024 with $88.34B in revenue (+34% YoY) and net income of NT$1,158B (EPS NT$226). 

The momentum accelerated into 2025, with revenue hitting approximately $115B (+32% YoY) and net margins reaching an unprecedented 45.1%. Return on Invested Capital (ROIC) jumped to an all-time high of 41.5% in 2025—an astonishing figure for a company deploying over $38 billion in annual CapEx. 

Looking ahead to 2026, management provided a highly bullish guide: Q1 2026 revenue of $34.6-$35.8B (up 38% YoY), with full-year USD revenue growth projected at roughly 30%, pushing estimated 2026 revenue to $150B. Gross margins, which hit 62.3% in Q4 2025, are guided to remain elevated at 63-65% in Q1 2026, driven by higher utilization and the lucrative pricing of advanced nodes (N3/N2) and CoWoS packaging ([來源：TSMC Q4 2025 Transcript](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-01/51d09df96cd89ac19d65af39032b038dc2896a24/TSMC%204Q25%20Transcript.pdf)).

### The CapEx Drag on Free Cash Flow

While profitability is historic, TSMC is entering its most aggressive capital expenditure phase ever. Management guided 2026 CapEx to $52-$56 billion (up from ~$38B in 2025). Approximately 70-80% of this is earmarked for advanced process technologies (N2, A16), with 10-20% allocated to advanced packaging to clear the CoWoS bottleneck. 

CFO Wendell Huang justified this massive outlay: "A higher level of capital expenditures is always going to be correlated with higher growth opportunities in the following years... If we do our job right, the growth of our business should outpace the growth of the CapEx." ([來源：App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine)).

However, from a valuation standpoint, this creates a Free Cash Flow (FCF) squeeze. In our base case model, while 2026 operating cash flow reaches ~$85B, the $54B CapEx leaves roughly $31B in FCF. This FCF compression results in a high P/FCF multiple of ~55x (TTM) as of March 2026. Bulls argue this is temporary, predicting FCF will normalize to ~$64B by 2028 as CapEx intensity (CapEx/Revenue) falls from 36% back toward 20-25%.

### Discounted Cash Flow (DCF) Valuation

A 5-year explicit DCF model (2026E-2030E) highlights the tension between high margins and heavy reinvestment:

*   **WACC Assumption:** 9.0% (Using a 4.3% Risk-Free Rate, 5.5% ERP, 0.85 Beta. No debt cost as TSMC holds ~$70B net cash in 2026E). 
*   **Terminal Growth Rate (g):** 2.0% - 3.0% (Reflecting long-term secular semiconductor growth via AI/Edge, offset by cyclicality).
*   **FCF Projections (USD B):** 2026E ($31), 2027E ($48), 2028E ($64), 2029E ($72), 2030E ($78).

**Results:**
At a 2.5% terminal growth rate, the PV of explicit FCF is ~$220B, and the PV of Terminal Value is ~$800B. Adding $70B in net cash yields an Equity Value of $1,089B. Divided by 5.186B ADR equivalent shares and converted at 33 NT$/USD, the DCF implies a fair value of **NT$6,933 per share**.

This DCF output represents a strict lower bound, severely punishing TSMC for its near-term CapEx cycle while potentially undervaluing the terminal value of an AI-dominant monopoly.

### Multi-ples and "The Taiwan Discount"

To triangulate fair value, we look at multiples. TSMC's 2026E Forward P/E sits at roughly **24.5x**. 

Compare this to global semiconductor peers:
*   NVIDIA: ~35-40x Forward P/E
*   ASML: ~30-35x Forward P/E
*   AMD: ~28-32x Forward P/E
*   Broadcom: ~28-30x Forward P/E

TSMC's PEG ratio is roughly 1.0x, representing a massive 48% discount compared to the broader IT sector's ~1.9x PEG. This structural undervaluation is widely recognized as the "Taiwan Discount" or "Geopolitical Discount." The market applies a heavy risk premium to TSMC's earnings due to the tail risk of a cross-strait conflict or blockade. 

Applying a base case Forward P/E of 25x to our 2026E EPS of NT$439 yields a target price of **NT$10,975**. EV/EBITDA triangulation (applying a 16-22x multiple to 2026E EBITDA of ~$100B) yields a range of NT$8,500–11,700. 

**Conclusion:** The median fair value of TSMC is approximately **NT$10,800**. With the current ADR-equivalent stock price hovering around NT$10,500, the stock is fairly valued under the base case (assuming 30% revenue growth and no severe geopolitical escalation). To see significant upside, the geopolitical discount must compress (WACC dropping toward 8%), or AI inference demand must push 2026 top-line growth closer to 35%.