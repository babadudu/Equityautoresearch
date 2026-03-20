---
id: "tsmc-china-smic-euv-catchup-timeline"
archetype: "geopolitical"
title: "China's Semiconductor Catch-Up: SMIC Progress and EUV Breakthrough Assessment"
companies: ["TSM"]
people: ["Morris Chang","C.C. Wei"]
industries: ["semiconductor-foundry","semiconductor-equipment","eda-tools"]
tags: ["geopolitics","process-node","euv","trade-war","sanctions","supply-chain"]
temporality: "semi-evergreen"
created: "2026-03-20"
updated: "2026-03-20"
source_report: "data/companies/TSM/TSM_Initial_MAX.md"
source_sections: ["6.1","6.2","6.3"]
quality: 4
---
## China's Semiconductor Catch-Up: SMIC Advancement and the EUV Breakthrough Question

### TSMC vs. SMIC Technology Gap

| Metric | TSMC | SMIC | Gap | Source |
|--------|------|------|-----|--------|
| Most advanced production node | 2nm (N2, in production since 2025) | 7nm (N+1, in production since 2023) | 2–3 generations | [TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf); [TechInsights](https://www.techinsights.com/blog/chinas-smic-plays-7-nm-card) |
| 5nm progress | In production for years (since 2020) | Development completed by end of 2025 (N+3), using multi-patterning | 5+ years | [WCCFTech, 2025](https://wccftech.com/smic-5nm-development-completed-in-2025/) |
| 7nm monthly capacity | N/A (already at 3nm/2nm) | <20,000 wafers/month (2025) → target doubled (2026) | Massive scale gap | [TrendForce, 2025-08](https://www.trendforce.com/news/2025/08/29/news-smic-1h25-net-profit-rises-35-6-7nm-capacity-reportedly-to-double-in-2026/) |
| EUV lithography | Extensively deployed | Cannot acquire due to US export controls | Equipment blockade | [TrendForce](https://www.trendforce.com/news/2026/02/25/news-china-reportedly-aims-to-boost-7nm-5nm-output-fivefold-in-two-years-driven-by-smic-and-hua-hong/) |
| China advanced capacity target | — | 100,000 wafers/month (within 1–2 years), 500,000 more by 2030 | — | [TrendForce, 2026-02](https://www.trendforce.com/news/2026/02/25/news-china-reportedly-aims-to-boost-7nm-5nm-output-fivefold-in-two-years-driven-by-smic-and-hua-hong/) |
| 5nm cost differential | Baseline | ~50% higher than TSMC (due to multi-patterning with older equipment) | Cost disadvantage | [WCCFTech](https://wccftech.com/smic-5nm-development-completed-in-2025/) |

**Key Assessment**: SMIC has achieved mass production at the 7nm node and completed 5nm development, but faces three core constraints: (1) No EUV equipment — requires DUV multi-patterning as substitute, with significant yield and cost disadvantages; (2) Production capacity far below market demand (<20,000 vs. global advanced process demand of hundreds of thousands of wafers/month); (3) China is advancing domestic equipment substitution (YMTC has established an all-domestic equipment pilot production line), but equipment performance gap remains large.

According to Yole Group (2025), China's "14th Five-Year Plan" plans to prioritize advanced logic processes as a key breakthrough direction, driving 7nm/5nm yield optimization and capacity expansion. ([Source: Yole Group, 2025](https://www.yolegroup.com/strategy-insights/chinas-next-move-the-five-year-plan-that-could-reshape-semiconductors/))

### China's Domestic EUV Development: Milestone Timeline

| Milestone | Progress | Technical Route | Distance to Mass Production | Source |
|-----------|----------|----------------|----------------------------|--------|
| Q3 2025 | SMIC/Huawei LDP-EUV trial production begins | LDP (Laser-Discharged Plasma) | Power only 50–100W; mass production requires ≥250W | [Digitimes, 2025-03](https://www.digitimes.com/news/a20250311VL200/euv-huawei-smic-2026-production.html) |
| December 2025 | Shenzhen lab validates domestic EUV prototype | LDP (not ASML's LPP route) | Prototype stage, not production machine | [Global SMT Asia](https://globalsmtasia.com/chinas-euv-breakthrough-huawei-smic-reportedly-advancing-ldp-lithography-eye-3q25-trial-2026-rollout/) |
| 2026E | First "EUV-refined" chips off the line (target) | LDP-EUV | Yield/volume unknown | [WCCFTech, 2025](https://wccftech.com/china-in-house-euv-machines-entering-trial-production-in-q3-2025/) |
| January 2026 | China semiconductor equipment self-sufficiency reaches 35% | DUV + ancillary equipment primarily | EUV self-sufficiency still 0% | [Chronicle Journal](https://markets.chroniclejournal.com/chroniclejournal/article/tokenring-2026-1-21-china-reaches-35-semiconductor-equipment-self-sufficiency-amid-advanced-lithography-breakthroughs) |

### Technical Feasibility Assessment

According to CSIS (2025), China's lithography progress "project ambition but do not fundamentally alter the strategic reality." CSIS analysis notes: (1) China's e-beam lithography (Xizhi system) is "ill-suited for high-volume chip production required to power advanced AI systems" due to throughput limitations that preclude mass production; (2) Shanghai Micro Electronics Equipment (SMEE) holds only 4% of the global i-line market, and DUV tools remain far behind ASML/Nikon; (3) Huawei-affiliated SiCarrier 28nm DUV tools remain in early stages. CSIS conclusion: EUV capability "remain firmly out of reach despite massive state investment." ([Source: CSIS — Breakthroughs or Boasts?, 2025](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography))

According to EE Times (2025), China's LDP-EUV route chose a different technical direction from ASML (LPP route), theoretically simpler in design, but power bottleneck (currently 50–100W vs. production requirement of 250W+), multilayer mirror (MLM) precision, mask and photoresist sub-systems remain major challenges. Even if the power problem is solved, moving from prototype to production-grade equipment typically requires 5–8 years — ASML itself took 20 years from EUV concept to commercialization. ([Source: EE Times — China EUV Breakthrough](https://www.eetimes.com/china-euv-breakthrough-and-the-rise-of-the-silicon-curtain/); [TrendForce, 2025-11](https://www.trendforce.com/news/2025/11/10/news-decoding-chinas-lithography-push-to-challenge-asml-from-sicarrier-to-alternative-euv-paths/))

### China EUV Progress Threat Assessment to TSMC by Time Horizon

| Time Horizon | Threat Level to TSMC | Basis for Judgment |
|-------------|---------------------|-------------------|
| 2026–2028 | **Extremely Low** | LDP-EUV prototype insufficient power, no mass production capability; SMIC reliant on DUV multi-patterning at 50%+ higher cost |
| 2028–2030 | **Low** | Even with power breakthrough, 3–5 years needed from trial to stable mass production; TSMC will be in A14/A12 generation by then |
| 2030–2035 | **Low-Medium** | China may achieve limited EUV mass production, but technology still 2–3 generations behind TSMC; "good enough" domestic chips primarily serve Chinese domestic market |

### Leadership Perspectives on China's Catch-Up

Wei's response to competitor catch-up in the January 2026 earnings call was direct: "In the development of semiconductor technology to this point, receiving investment has not helped to improve competitiveness, right?" — bluntly stating that money alone cannot buy competitiveness, and that technological leadership requires long-term accumulation of time, talent, and culture. ([Source: WCCFTech, 2026-01](https://wccftech.com/tsmcs-ceo-says-intel-foundry-wont-be-competitive-by-just-throwing-money/))

Morris Chang, in his last public speech in 2023, delivered a verdict on China's catch-up: "Mainland is not yet a rival, especially in terms of wafer manufacturing." ([Source: Interconnected Blog, 2023-04](https://interconnected.blog/morris-changs-last-speech/)) — but he also implied that if China judges the window of opportunity is closing, the risk lies in its behavior rather than its technical capability.

The strategic implication of SMIC's catch-up is a double-edged sword: slow progress reduces the short-term invasion incentive (no need to rush), but if China perceives its technology window closing due to TSMC's overseas expansion reducing dependency, this could perversely accelerate the timeline for military action — the core argument of the "Silicon Trap" thesis.