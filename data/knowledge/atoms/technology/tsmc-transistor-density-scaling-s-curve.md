---
id: "tsmc-transistor-density-scaling-s-curve"
archetype: "technology"
title: "TSMC Transistor Density Scaling: S-Curve Analysis from N16 to N2"
companies: ["TSM"]
people: ["Morris Chang"]
industries: ["semiconductor-foundry"]
tags: ["process-node","finfet","gaa","euv","moores-law","density-scaling"]
temporality: "semi-evergreen"
created: "2026-03-20"
updated: "2026-03-20"
source_report: "data/companies/TSM/TSM_Initial_MAX.md"
source_sections: ["1.3"]
quality: 4
---
## TSMC Transistor Density Scaling: S-Curve Analysis from N16 to N2

### Quantitative Density Data by Node

TSMC's transistor density progression over the past decade exhibits a classic S-curve: rapid scaling during the FinFET era (N16→N5), a notable slowdown at N3, and a GAA-driven step-up at N2.

| Process Node | Volume Prod. Year | Transistor Density (MTr/mm²) | Density Gain vs. Prior Node | Transistor Architecture | EUV Layers | Source |
|---|---|---|---|---|---|---|
| N16 (16nm) | 2015 | ~29 | — | FinFET (first gen) | 0 | [WikiChip](https://en.wikichip.org/wiki/16_nm_lithography_process) |
| N10 (10nm) | 2017 | ~52 | ~1.8x | FinFET | 0 | [WikiChip](https://en.wikichip.org/wiki/10_nm_lithography_process) |
| N7 (7nm) | 2018 | ~96.5 | ~1.85x | FinFET | 4–5 layers (N7+) | [WikiChip](https://en.wikichip.org/wiki/7_nm_lithography_process); [SemiWiki](https://semiwiki.com/forum/threads/declining-density-scaling-trend-for-tsmc-nodes.20262/) |
| N5 (5nm) | 2020 | ~171.3 | ~1.78x | FinFET | 14 layers | [WikiChip Fuse](https://fuse.wikichip.org/news/3398/tsmc-details-5-nm/); [Wikipedia](https://en.wikipedia.org/wiki/5_nm_process) |
| N3E (3nm) | 2023 | ~208 | ~1.22x | FinFET (final gen) | ~20+ layers | [NextBigFuture](https://www.nextbigfuture.com/2025/07/samsung-versus-tsmc-versus-intel.html) |
| N3P (3nm+) | 2024 | ~224 | ~1.08x vs N3E | FinFET optimized | ~20+ layers | [NextBigFuture](https://www.nextbigfuture.com/2025/07/samsung-versus-tsmc-versus-intel.html) |
| N2 (2nm) | 2025 | ~313 (HD cell) | ~1.50x vs N3E | **GAA Nanosheet (first gen)** | 20+ layers | [Tom's Hardware](https://www.tomshardware.com/tech-industry/intels-18a-and-tsmcs-n2-process-nodes-compared-intel-is-faster-but-tsmc-is-denser) |
| A16 (1.6nm) | 2026 | TBD | — | GAA + Super Power Rail | TBD | [TSMC](https://www.tsmc.com/english/dedicatedFoundry/technology/platform_smartphone_tech_advancedTech) |

### Interpreting the S-Curve: Three Phases

**Phase 1 — Healthy Scaling (N16→N5, 2015–2020):** Each node delivered approximately 1.8x density improvement, closely tracking the theoretical Moore's Law 2x doubling. Annual average density growth was approximately 35%. The key enablers were FinFET electrostatics improvements and, beginning at N7+, EUV lithography adoption (4–5 layers initially).

**Phase 2 — Slowdown at N3 (2022–2024):** The N3E density gain dropped sharply to only ~1.22x versus N5 — a major deceleration. SRAM cell scaling plateaued first, followed by logic. Industry analysis on SemiWiki forum documented this trend: metal minimum pitch (MMP) compressed only modestly from 28nm at N5 to 23nm at N3E, reflecting the limits of immersion + EUV double-patterning. The number of EUV layers grew to 20+, adding cost and cycle time without proportional density returns. ([Source: SemiWiki Forum](https://semiwiki.com/forum/threads/declining-density-scaling-trend-for-tsmc-nodes.20262/))

**Phase 3 — GAA Step-Up at N2 (2025):** The transition from FinFET to GAA Nanosheet at N2 delivers a "springboard" density gain — HD cell density reaches 313 MTr/mm², a ~50% improvement over N3E. However, industry analysts note that N2→A16 density scaling is already expected to offer "very little scaling," suggesting the S-curve is entering its high-plateau phase earlier than prior transitions. ([Source: SemiWiki Forum](https://semiwiki.com/forum/threads/declining-density-scaling-trend-for-tsmc-nodes.20262/))

### Why Density Scaling Is Locally Dependent

Morris Chang offered a foundational insight connecting manufacturing concentration to density leadership: *"It works, the learning curve, the experience curve, it works only when you have a common location. Learning is local."* ([Source: MIT News, 2023-10-25](https://news.mit.edu/2023/morris-chang-describes-secrets-semiconductor-success-1025)) TSMC's Hsinchu/Tainan fab cluster generates iterative process learning that feeds directly into yield improvements and density pushes — a structural advantage that geographically dispersed fabs in the US, Japan, and Europe cannot fully replicate in the near term.

### Post-Nanosheet Exploration

As conventional scaling approaches physical limits, TSMC R&D Director Carlos Diaz has outlined exploratory post-2028 directions: 2D transition metal dichalcogenides (TMD, e.g., MoS₂ channel materials), carbon nanotube transistors (CNT), and graphene nanoribbons (GNR). These remain research-stage technologies with no confirmed commercialization timeline. ([Source: Mark LaPedus Substack](https://marklapedus.substack.com/p/tsmcs-roadmap-and-other-takeaways))