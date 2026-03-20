---
id: "tsm-third-party-quotes-water-crisis-china-euv-geopolitical-risk-part-4"
archetype: "quotes"
title: "Third-Party Quotes on TSMC: Water Crisis, China EUV Progress, and Geopolitical Risk (Part 4)"
companies: ["TSM"]
people: ["Gene You","CSIS analysts"]
industries: ["semiconductor-foundry"]
tags: ["water","energy","geopolitics","competitive-dynamics","trade-war"]
temporality: "semi-evergreen"
created: "2026-03-20"
updated: "2026-03-20"
source_report: "data/companies/TSM/TSM_Initial_MAX.md"
source_sections: ["all"]
quality: 4
---
## Water Management Expert Gene You: Government Prioritization of Chip Industry

**Context:** During Taiwan's 2021 drought — the worst in 56 years — the Taiwan government made an implicit decision to prioritize semiconductor manufacturing water supply over agricultural use. Southern farmers were restricted from planting rice for up to three consecutive years, with government subsidies offered in exchange for fallowing fields to preserve water for chip fabs. Water resource management expert Gene You described the government's implicit stance.

> "What you need we will give you, because the economy needs you."
— Gene You, water resource management expert; quoted in [NPR, 2023-04-19](https://www.npr.org/sections/goatsandsoda/2023/04/19/1170425349/epic-drought-in-taiwan-pits-farmers-against-high-tech-factories-for-water)

**Context:** You's characterization is a critique, not a compliment. His point is that Taiwan's water allocation framework effectively operated as a de facto industrial subsidy to semiconductor manufacturers, particularly TSMC, at the expense of agricultural communities and food security. TSMC's daily water consumption at the time of the drought was approximately 20,000 tonnes — equivalent to a city of 58,000 people — and had grown 71% in municipal water supply between 2015 and 2019 as production capacity expanded. During the drought, TSMC mobilized water tanker trucks from wetter southern regions to maintain northern fab operations, and issued a statement that "there is no impact on production, and we are monitoring the water supply situation closely" — a response that critics noted prioritized production continuity over acknowledging the broader resource conflict.

---

## Taiwanese Farmer Yang Kuanwei: Food Security as National Security

**Context:** In interviews with NPR and The Diplomat during the 2021–2024 drought period, Taiwanese farmers affected by government-mandated fallowing articulated the food security dimensions of Taiwan's semiconductor-centric economic policy.

> "A country needs to rely on its own food supply. It is a form of security."
— Farmer Yang Kuanwei (楊寬偉), southern Taiwan; quoted in [NPR, 2023-04-19](https://www.npr.org/sections/goatsandsoda/2023/04/19/1170425349/epic-drought-in-taiwan-pits-farmers-against-high-tech-factories-for-water) and [The Diplomat, 2024-09](https://thediplomat.com/2024/09/how-water-scarcity-threatens-taiwans-semiconductor-industry/)

**Context:** Yang's observation echoes a tension that extends beyond Taiwan: a country that subordinates agricultural self-sufficiency to semiconductor production is trading one form of strategic vulnerability (chip shortage) for another (food import dependency). Taiwan imports approximately 70% of its food. The additional ecological impact Yang described — reduced rainfall from fallowing causing insect pest increases, heavier pesticide use, and bee die-offs from pesticide runoff — suggests that the semiconductor-first water policy created cascading environmental externalities that ESG assessments of TSMC have rarely captured. Farmer association leader Zhang Meixue further noted that rice cultivation "locks moisture in the soil and stabilizes ground temperature," meaning fallowing land to conserve water for fabs paradoxically accelerated drought-related land degradation.

---

## CSIS Analysts on China's EUV Ambitions: Ambition vs. Strategic Reality

**Context:** In 2025, reports circulated about Huawei-SMIC collaboration on LDP-EUV (laser-induced discharge plasma) lithography, China's Shenzhen laboratory validating a domestic EUV prototype, and plans for trial production of "EUV-refined" chips by 2026. CSIS's Strategic Technologies program assessed whether these developments represented a genuine competitive threat to TSMC's process technology leadership.

> "[China's lithography progress] project ambition but do not fundamentally alter the strategic reality."
— CSIS Strategic Technologies Blog, ["Breakthroughs or Boasts?", 2025](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)

**Context:** CSIS identified three specific technical limitations:

1. China's e-beam lithography system (the "Xizhi" system) is "ill-suited for high-volume chip production required to power advanced AI systems" due to fundamental throughput constraints — e-beam tools expose one die at a time vs. EUV's simultaneous full-wafer exposure, making them orders of magnitude too slow for production volumes.

2. Shanghai Micro Electronics Equipment (SMEE) holds only 4% of the global i-line lithography market and its DUV tools remain far behind ASML/Nikon performance benchmarks.

3. SiCarrier's 28nm DUV tools (developed with Huawei involvement) remain in early-stage development, not production-qualified.

CSIS's conclusion: China's EUV capability "remain[s] firmly out of reach despite massive state investment."

**Context on LDP-EUV specifically:** The LDP (laser-induced discharge plasma) approach China is pursuing differs from ASML's LPP (laser-produced plasma) approach. The fundamental challenge is power output: LDP prototypes demonstrated in 2025 operated at 50–100W, while production-grade EUV requires ≥250W sustained output for viable throughput. Scaling from 100W to 250W+ while maintaining source stability and optics integrity is a multi-year engineering challenge that ASML itself required over a decade to solve, even with access to global supply chains for custom components that China cannot currently source.

**Timeline assessment from multiple sources:** Even optimistic projections suggest China will not achieve meaningful EUV production capability before 2030, and functional EUV production (high yield, sustained throughput) before 2033–2035 at the earliest. By that point, TSMC will be producing at A14/A12 nodes (equivalent to ~1.0nm equivalent scale), maintaining a 2–3 generation lead. The more likely near-term threat is SMIC's continued DUV-based production scaling — where SMIC 7nm already operates at <20,000 wafers/month vs. TSMC's hundreds of thousands, at a cost premium of 50%+ due to multi-patterning complexity — carving out a "good enough" domestic China market rather than competing for global advanced-node customers.