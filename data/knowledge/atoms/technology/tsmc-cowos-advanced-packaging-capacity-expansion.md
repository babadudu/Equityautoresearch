---
id: "tsmc-cowos-advanced-packaging-capacity-expansion"
archetype: "technology"
title: "TSMC CoWoS Advanced Packaging: Capacity S-Curve and AI Demand Dynamics"
companies: ["TSM","NVDA","AMD","GOOGL"]
people: ["CC Wei","Wendell Huang"]
industries: ["semiconductor-foundry","ai-accelerator","cloud-infrastructure"]
tags: ["packaging","capacity","ai-accelerator","supply-chain","capex","tam"]
temporality: "semi-evergreen"
created: "2026-03-20"
updated: "2026-03-20"
source_report: "data/companies/TSM/TSM_Initial_MAX.md"
source_sections: ["1.3"]
quality: 4
---
## TSMC CoWoS Advanced Packaging: Capacity S-Curve and AI Demand Dynamics

### CoWoS Technology Overview

CoWoS (Chip-on-Wafer-on-Substrate) is TSMC's 2.5D advanced packaging technology that places multiple chips — GPU die, HBM memory stacks, and I/O logic — side by side on a silicon interposer, enabling ultra-wide bandwidth interconnects that would be impossible with traditional packaging. CoWoS has become the standard packaging format for AI accelerators: NVIDIA H100/H200/B100/B200/GB200, AMD MI300X, and Google TPU v5 all require CoWoS.

### Capacity Expansion: 2023–2026

CoWoS production capacity has expanded dramatically to meet AI demand, tracing a textbook technology adoption S-curve:

| Time Point | CoWoS Monthly Capacity (equivalent wafers) | YoY Growth | Est. Annual Demand | Source |
|---|---|---|---|---|
| End 2023 | ~13,000 units/month | Baseline | — | [Andy Lin's Blog](https://www.granitefirm.com/blog/us/2025/01/05/semiconductor-packaging-2/) |
| End 2024 | ~35,000 units/month | ~170% | ~370,000 units/year | [Andy Lin's Blog](https://www.granitefirm.com/blog/us/2025/01/05/semiconductor-packaging-2/); [36kr](https://eu.36kr.com/en/p/3580962946874242) |
| End 2025 | ~70,000–75,000 units/month | ~100–114% | ~670,000 units/year (+81%) | [Institutional Investor](https://www.institutionalinvestor.com/article/market-intelligence/physical-world-upgrade-2026-outlook-when-ai-spreads-cloud-edge); [36kr](https://eu.36kr.com/en/p/3580962946874242) |
| End 2026E | ~90,000–140,000 units/month | ~30–87% | ~1,000,000+ units/year | [Institutional Investor](https://www.institutionalinvestor.com/article/market-intelligence/physical-world-upgrade-2026-outlook-when-ai-spreads-cloud-edge); [Andy Lin's Blog](https://www.granitefirm.com/blog/us/2025/01/05/semiconductor-packaging-2/) |

From 2023 to 2026, TSMC's CoWoS capacity expands approximately 7–10x, implying a CAGR exceeding 50%.

### S-Curve Characteristics and Supply-Demand Gap

The YoY growth rate decelerating from 170% (2024) toward 30–87% (2026) is characteristic of a technology in the "fast penetration → high-growth" transition. However, demand continues expanding at 80%+ annually, meaning the supply-demand gap persists through 2025–2026 — the source of TSMC's pricing power in advanced packaging.

CEO CC Wei explicitly described the sold-out dynamic: *"Our CoWoS capacity is very tight and remains sold out through 2025 and into 2026."* ([Source: Fusion Worldwide, 2025](https://info.fusionww.com/blog/inside-the-ai-bottleneck-cowos-hbm-and-2-3nm-capacity-constraints-through-2027))

On the doubling trajectory, Wei stated at the 2024 Q2 earnings call: *"From last year to this year, we have more than doubled [CoWoS capacity], and I expect next year we can double it again."* ([Source: The Register, 2024-07-18](https://www.theregister.com/2024/07/18/tsmc_ceo_predicts_ai_chip/))

The supply tightness extends beyond packaging to front-end wafers: *"Advanced-node wafer demand is currently about three times short of available capacity."* ([Source: Fusion Worldwide](https://info.fusionww.com/blog/inside-the-ai-bottleneck-cowos-hbm-and-2-3nm-capacity-constraints-through-2027)) Wei acknowledged the rebalancing timeline with measured optimism: *"I hope in 2025 or 2026 we can reach the balance."* ([Source: The Register, 2024-07-18](https://www.theregister.com/2024/07/18/tsmc_ceo_predicts_ai_chip/))

### NVIDIA Demand Concentration

Morgan Stanley estimates NVIDIA's CoWoS demand for 2026 will reach approximately 595,000 units (roughly 60% of global CoWoS demand), with ~510,000 units expected to be fulfilled by TSMC, primarily for next-generation Rubin architecture chips. ([Source: 36kr](https://eu.36kr.com/en/p/3580962946874242))

### Capital Allocation: Advanced Packaging as Strategic Priority

CFO Wendell Huang described the capex philosophy: *"A higher level of capital expenditures is always going to be correlated with higher growth opportunities in the following years. As long as we believe there are business opportunities, we will not hesitate to invest."* He specified that *"roughly 10–20% of capex in 2025 will go into advanced packaging/test facilities"* — signaling that packaging has been elevated from a support service to a strategic investment category. ([Source: App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine); [LongYield Substack](https://longyield.substack.com/p/tsmc-at-the-center-of-the-ai-boom))

### Advanced Packaging Revenue Trajectory

TSMC's packaging revenue grew from $2.4B (Q2 2024) to $3.2B (Q3 2024), a 36% quarter-over-quarter increase, reaching 7–9% of total company revenue. Analysts project advanced packaging's share of TSMC total revenue could reach approximately 30% as CoWoS, SoIC, and successor technologies scale. ([Source: Andy Lin's Blog](https://www.granitefirm.com/blog/us/2025/01/05/semiconductor-packaging-2/))

### Market Structure: Advanced Packaging Crossing 50%

In 2025, global advanced packaging market share surpassed traditional packaging for the first time, exceeding 51% of total semiconductor packaging revenue — a structural inflection. The advanced packaging market is projected to grow from approximately $41B (2023) at 10.6% CAGR to $78.6B by 2028. TSMC holds 76.7% market share in fan-out packaging. ([Source: Andy Lin's Blog](https://www.granitefirm.com/blog/us/2025/01/05/semiconductor-packaging-2/))

Wei's summary of the overall capacity situation: *"Everything related like front-end and back-end capacity is very tight. We are working very hard to make sure that the gap will be narrow."* ([Source: App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine))

### Chiplet and Heterogeneous Integration

Beyond CoWoS, semiconductor design is shifting from monolithic to multi-chip (chiplet) heterogeneous integration. TSMC's SoIC (System-on-Integrated-Chips) 3D stacking technology enables vertical integration of logic, memory, and I/O dies with fine-pitch hybrid bonding. This trend transforms packaging from a cost center to a value-creation center, giving TSMC a second growth engine beyond traditional wafer fabrication.