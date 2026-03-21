# TSM (台積電 TSMC) Initial MAX 深度研究（張磊四維框架）

## IRR 模型與關鍵假設

| 情境 | 2026E 營收 (USD B) | 毛利率 | 淨利率 | 2026E EPS (NT$) | 目標 P/E | 目標價 (NT$) | 3年 IRR |
|------|-------------------|--------|--------|----------------|----------|-------------|---------|
| 樂觀 | 155 (~NT$5,100B) | 63% | 48% | 472 | 30x | 14,160 | ~28% |
| 合理 | 150 (~NT$4,950B) | 61% | 46% | 439 | 25x | 10,975 | ~18% |
| 保守 | 138 (~NT$4,550B) | 58% | 43% | 377 | 20x | 7,540 | ~6% |

> **當前股價**：~NT$10,500（2026-03 ADR 折算）｜**公允價值中位數**：~NT$10,800（三法交叉）｜**安全邊際**：~+3%（接近合理估值上緣；地緣政治折價已反映於 24-25x Forward P/E）

**關鍵假設**（詳見 2.5 DCF）：
- **營收成長**：2026E +30%（管理層指引，[Q4 2025 法說](https://investor.tsmc.com/english/quarterly-results/2025/q4)）；AI/HPC 持續拉動先進製程需求，N2 量產
- **毛利率**：58~63%（Q4 2025 已達 62.3%；Q1 2026 指引 63-65%；海外廠稀釋 2-4pp vs. 先進製程 mix 提升）
- **CapEx**：$52-56B（管理層指引）；CapEx/Revenue ~36%
- **P/E 區間**：20~30x（半導體龍頭溢價 vs. 地緣政治折價）
- **股利**：TSMC 不回購股票，穩定股利（2024 現金殖利率約 1.5%）
- **風險因子**：台海地緣風險、美國建廠成本超支（早期稀釋 2-3pp）、中國市場萎縮（已從 22%降至 9%）、客戶集中度升高（前 10 大佔 76%）
- **WACC**：9%（含地緣政治風險溢價）｜**終值成長率**：3.5%

## 結論總結

TSMC 是全球最重要的半導體公司——不僅因為它製造了全球約 60% 的晶片代工產能與超過 90% 的先進製程晶片，更因為它處於 AI 革命的核心供應鏈位置。公司在先進製程（3nm/5nm 佔營收 60%+）具備幾乎不可替代的技術護城河，客戶涵蓋 Apple、NVIDIA、AMD、Broadcom 等全球頂級科技公司。

然而，TSMC 也承受著獨特的地緣政治風險（台海局勢）、環境壓力（2023 年用電 24.78 TWh，佔台灣用電約 9%）以及海外擴張的成本挑戰（美國廠成本較台灣高 30-50%）。投資人需權衡：**TSMC 的技術壟斷與 AI 需求爆發所帶來的盈利成長**，能否持續抵消地緣與成本風險帶來的估值折扣。以合理情境計，三年 IRR 約 18%，具備長線配置價值，但需密切監控台海局勢與海外建廠進度。

## Executive Summary

**投資論點**：TSMC 是 AI 超級週期中唯一不可繞過的技術壁壘。全球前五大 AI 晶片設計公司（NVIDIA、AMD、Broadcom、Apple、Qualcomm）100% 依賴 TSMC 先進製程，三年內無可行替代方案。公司在技術（3nm 良率 ~90% vs. Samsung 50%）、規模（年 CapEx $52-56B）、信任（40 年純代工不競爭）三維構築深護城河，在 AI 推理端爆發的結構性需求下持續受益。

**估值與股價**：當前股價 ~NT$10,500（ADR 折算），三種估值方法（P/E × 25x EPS 439 = NT$10,975；EV/EBITDA 16-22x；正常化 P/FCF 25-30x）三角交叉後公允價值區間 **NT$9,500–11,700**，中位數 ~**NT$10,800**。安全邊際約 **+3%**（中位數），當前股價已接近合理估值；概率加權預期年化報酬 **~14-15%**（Base IRR 18% × 50% + Bull 28% × 25% + Bear 6% × 20% + Tail -50% × 5%）。

**前三大風險**：
1. **台海地緣尾部風險**：CFR 列 2026 Tier I，封鎖情境下 TSMC 台灣產能（~80%）停擺，概率加權後 Tail 情境 IRR 約 -40~-60%（5% 概率）
2. **海外廠成本稀釋**：美國廠成本較台灣高 30-50%，$1,650 億長期投資早期毛利稀釋 2-4pp
3. **AI CapEx 週期反轉**：若 hyperscaler CapEx 連續兩季 QoQ -15%+，$52-56B CapEx 承諾將面臨產能利用率下降壓力

## KEY QUESTION

**TSMC 想做什麼？** 成為全球最先進、最可信賴的半導體製造夥伴，在 AI 時代維持技術與產能的絕對領先。

**如何做到？** 透過持續的製程微縮（N2→A14→A16）、先進封裝（CoWoS/SoIC）、全球分散製造佈局（美國、日本、歐洲、新加坡），以及深度綁定全球頂級 AI/HPC 客戶。

**管理層怎麼想？** CEO C.C. Wei（魏哲家）在 2024 Q2 法說表示：「I hope in 2025 or 2026 we can reach the balance」——面對 AI 晶片供不應求，TSMC 正全力擴產 CoWoS 封裝產能，「From last year to this year, we have more than doubled」CoWoS 產能，並計畫持續翻倍。([來源：The Register, 2024-07-18](https://www.theregister.com/2024/07/18/tsmc_ceo_predicts_ai_chip/))

---

# 一、環境

## 1.1 TAM 與產業成長趨勢

半導體代工（foundry）產業的現代形態始於 1987 年——Morris Chang（張忠謀）創立台積電，開創「純晶圓代工」（pure-play foundry）商業模式，將晶片設計與製造分離，徹底改變了半導體產業的分工結構。在此之前，半導體公司多為 IDM（整合元件製造商）模式，設計與製造一體。TSMC 的出現催生了 fabless 設計公司生態系（如 Qualcomm、NVIDIA、MediaTek），使半導體產業從垂直整合走向水平專業分工。

Morris Chang 曾回憶創業初心：「I wanted to establish a company that would be the foundry for the world's semiconductor industry. At that time, there was no such company.」（[來源：Morris Chang, TSMC 創辦故事](https://pr.tsmc.com/english/news/3210)）

**全球半導體代工市場規模——從利基走向戰略產業的四十年演進**：

半導體代工市場在 TSMC 1987 年創立時幾乎不存在——當時全球半導體營收約 $260 億美元（[來源：SIA](https://www.semiconductors.org/)），但代工僅佔極小比例。隨著 fabless 設計公司在 1990 年代興起，代工市場快速擴張：

| 年份 | 全球代工市場（USD B） | TSMC 營收（USD B） | TSMC 市佔 | 關鍵驅動 | 來源 |
|------|---------------------|-------------------|-----------|---------|------|
| 2000 | ~15 | ~5.3 | >50% | PC/通訊、fabless 崛起 | [SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/365049-a-brief-history-of-tsmc-through-2025/) |
| 2005 | ~22 | ~8.2 | ~50% | 手機晶片、90nm 量產 | [SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/365049-a-brief-history-of-tsmc-through-2025/) |
| 2010 | ~29 | ~13.9 | ~48% | 28nm 甜蜜點、智慧手機前夕 | [SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/365049-a-brief-history-of-tsmc-through-2025/) |
| 2015 | ~49 | ~26.4 | ~54% | 16nm FinFET、Apple A9 | [Statista](https://www.statista.com/statistics/867223/worldwide-semiconductor-foundries-by-market-share/) |
| 2020 | ~85 | ~47.7 | ~55% | 5G+COVID+EUV | [SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/365049-a-brief-history-of-tsmc-through-2025/) |
| 2024 | ~148.5 | ~88.3 | ~62% | AI/HPC 超級週期 | [Fortune Business Insights](https://www.fortunebusinessinsights.com/semiconductor-foundry-market-110068) |
| 2025E | ~162.7 | ~115 | ~64% | AI 推理端+Edge AI | [GM Insights](https://www.gminsights.com/industry-analysis/semiconductor-foundry-market) |
| 2030E | ~300+ | — | — | AI+車用+IoT | [Precedence Research](https://www.precedenceresearch.com/semiconductor-foundry-market) |
| 2035E | ~508.7 | — | — | 全產業 AI 化 | [GM Insights](https://www.gminsights.com/industry-analysis/semiconductor-foundry-market) |

代工市場從 2000 年的 ~$150 億成長至 2025 年的 ~$1,627 億，25 年 CAGR 約 10%。TSMC 市佔率在此期間從 50% 攀升至 64%——不僅市場在擴大，TSMC 佔據的份額也持續提高。

**SIA 一手數據——全球半導體總市場（含 IDM+代工+封測）**：根據 SIA（Semiconductor Industry Association）官方統計，全球半導體銷售額 2024 年達 **$6,276 億美元**（YoY +19.0%），2025 年預估達 **$7,917 億美元**（YoY +26.1%），2026 年有望突破 **$1 兆美元** 大關。其中邏輯晶片（Logic）——TSMC 核心業務所在——從 2024 年的 $2,126 億成長至 2025 年的 $3,019 億（YoY +42%），為所有產品類別中成長最快的區塊，主要受 AI 加速器與先進 GPU 需求驅動。代工市場約佔全球半導體市場的 20-22%，但 TSMC 透過 AI/HPC 的結構性成長，在這一子市場中的佔比持續擴大。（[來源：SIA Global Semiconductor Sales Report, 2025-02](https://www.semiconductors.org/global-semiconductor-sales-increase-19-0-in-2024-to-reach-627-6-billion/)；[SIA 2025 Forecast](https://www.semiconductors.org/global-semiconductor-sales-forecast-to-reach-791-7-billion-in-2025/)）

- **CAGR**：2025–2035 約 12.2%（[GM Insights](https://www.gminsights.com/industry-analysis/semiconductor-foundry-market)）；2025–2034 約 5.8–8%（[Precedence Research](https://www.precedenceresearch.com/semiconductor-foundry-market), [Fortune Business Insights](https://www.fortunebusinessinsights.com/semiconductor-foundry-market-110068)）
- **先進製程壟斷**：7nm 以下市佔超過 90%（[來源：TSMC 2024 Annual Report](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf)）——這一趨勢在先進製程尤為極端
- **AI 驅動的結構性成長**：AI/HPC 已取代智慧手機成為 TSMC 最大營收平台，2024 年 HPC 佔營收比重超過 50%，2025 Q2 達 60%

C.C. Wei 在 2025 Q3 法說中強調：「AI demand has continued to be very strong and stronger than expected three months prior.」（[來源：TSMC Q3 2025 Transcript](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf)）

在 2025 年 Fortune 全球 500 強專訪中，Wei 表示 TSMC 在 AI 時代的角色愈加關鍵：「The AI boom has sent TSMC's importance to an entirely new level.」（[來源：Fortune Asia, 2025-07-30](https://fortune.com/asia/2025/07/30/tsmc-ai-boom-cc-wei-wendell-huang-global-500/)）

Morris Chang 在 2024 年回顧產業演變時曾說：「The foundry model has proven to be one of the most successful business model innovations in the history of the semiconductor industry.」（[來源：TSMC PR](https://pr.tsmc.com/english/news/3210)）

亞太地區主導全球代工市場，2024 年佔全球市場份額約 68%（[來源：Custom Market Insights](https://www.custommarketinsights.com/report/semiconductor-foundry-market/)）。

## 1.2 市場結構與監管

**競爭格局——高度集中且持續向 TSMC 集中的寡佔市場**：

半導體代工是全球最集中的產業之一，而過去十年的趨勢更是持續向 TSMC 集中。2015 年 TSMC 的全球市佔率約為 54%，到 2024 年已攀升至 62%——這一趨勢在先進製程（7nm 以下）尤為驚人，TSMC 市佔超過 90%，幾乎壟斷。

**近十年代工市佔率演變**：

| 年份 | TSMC | Samsung | GlobalFoundries | UMC | SMIC | 其他 | 出處 |
|------|------|---------|----------------|-----|------|------|------|
| 2015 | ~54% | ~15% | ~10% | ~9% | ~4% | ~8% | [Statista](https://www.statista.com/statistics/867223/worldwide-semiconductor-foundries-by-market-share/) |
| 2018 | ~56% | ~14% | ~9% | ~8% | ~5% | ~8% | [Statista](https://www.statista.com/statistics/867223/worldwide-semiconductor-foundries-by-market-share/) |
| 2020 | ~58% | ~13% | ~7% | ~7% | ~5% | ~10% | [Counterpoint Research](https://counterpointresearch.com/en/insights/global-semiconductor-foundry-market-share) |
| 2022 | ~60% | ~12% | ~6% | ~6% | ~5% | ~11% | [Counterpoint Research](https://counterpointresearch.com/en/insights/global-semiconductor-foundry-market-share) |
| 2024 Q1 | ~62% | ~11% | ~5% | ~6% | ~5% | ~11% | [Statista](https://www.statista.com/statistics/867223/worldwide-semiconductor-foundries-by-market-share/) |

這一集中化趨勢的根源在於：先進製程的資本門檻指數級上升（一座 3nm 廠造價超過 $200 億美元），使追趕者越來越難維持投資強度；同時 AI/HPC 需求爆發優先拉動先進製程需求，TSMC 因技術與良率領先而吸走絕大多數訂單。

**Samsung Foundry——良率困境與資本退縮**：

Samsung Foundry 是 TSMC 在先進製程唯一的「名義對手」，但良率問題嚴重制約其競爭力。根據韓國媒體 Chosun Biz 報導，Samsung 3nm 製程（SF3）良率在 2024 Q2 僅約 20%，至 2025 年中提升至約 50%，仍遠低於 TSMC 3nm 製程接近 90% 的良率水準。（[來源：SamMobile, 2025](https://www.sammobile.com/news/heres-how-shockingly-bad-samsungs-3nm-yields-currently-are/)；[Design Reuse, 2025-06](https://www.design-reuse-embedded.com/news/202506089/samsung-foundry-struggles-with-3nm-yields-at-50-as-tsmc-climbs-past-90/)）

這一良率差距導致 Samsung 流失了重要客戶：Qualcomm 和 MediaTek 均已將先進製程訂單轉移至 TSMC。Samsung 甚至無法為自家旗艦手機（Galaxy S25 系列）量產 Exynos 2500 處理器，被迫全面採用高通晶片。更嚴重的是，Samsung 2025 年的晶圓廠投資預算從 2024 年的 10 兆韓元大幅削減至 5 兆韓元（約 $35 億美元），降幅達 50%。（[來源：TrendForce, 2025-01-22](https://www.trendforce.com/news/2025/01/22/news-samsung-faces-struggles-ahead-as-foundry-investment-reportedly-slashed-by-half-for-2025/)）

C.C. Wei 在 2024 Q3 法說中被問及 Samsung 良率問題時表示：「AI is real.」——暗示 AI 晶片需求的緊迫性使客戶更無法承擔良率風險，進一步鞏固了 TSMC 的地位。（[來源：TrendForce, 2024-10-17](https://www.trendforce.com/news/2024/10/17/news-tsmcs-c-c-wei-declares-no-interest-in-acquiring-intel-or-samsung-fabs-emphasizes-ai-is-real/)）

**Intel Foundry Services (IFS)——追趕者的漫長征途**：

Intel 18A 製程是 Intel 重返代工競爭的旗艦技術。截至 2025 年底，Intel 18A 的先導產品（Panther Lake AI PC 處理器與 Clearwater Forest 伺服器處理器）已完成流片與開機，正推進量產。然而 Intel 坦承，18A 的良率仍存在製程變異性問題，預計要到 2027 年才能達到業界標準水準。Intel Foundry 目標在 2027 年達到損益兩平，部分依賴 18A 與後續 14A 製程的外部客單。（[來源：IEEE Spectrum](https://spectrum.ieee.org/intel-18a)；[Tom's Hardware](https://www.tomshardware.com/tech-industry/semiconductors/intel-ceo-recognizes-its-18a-node-for-external-customers-as-18a-p-gets-inbound-interest-company-cites-increasing-yields)；[WCCFTech](https://wccftech.com/intel-foundry-breakeven-target-for-2027-now-looks-a-lot-more-real/)）

Morris Chang 在 2023 年最後一次公開演講中對競爭態勢有清晰判斷。他直言：「Samsung Electronics is a strong competitor of TSMC.」但同時也指出：「Mainland is not yet a rival, especially in terms of wafer manufacturing.」——區分了「真正的對手」與「被制裁限制的潛在參與者」。（[來源：Interconnected Blog — Morris Chang's Last Speech, 2023-04](https://interconnected.blog/morris-changs-last-speech/)）

Chang 在德州儀器時期的核心洞見——學習曲線定價（learning curve pricing）——每翻倍的累積產量能帶來固定比例的成本下降。TSMC 數十年累積的產量優勢構成了新進入者幾乎無法跨越的成本壁壘（詳見 2.4 節 5c 新進入者威脅）。

Chang 更從地緣角度解釋了台灣製造優勢的結構性本質：「Taiwan's advantages that I just talked about are America's weaknesses.」他指出：「TSMC's three manufacturing centers often have thousands of engineers whose location assignment changes but who do not have to move their family.」——台灣的地理緊湊性使工程師調度效率遠高於美國分散的廠區。他進而直言美國復興半導體製造的努力為「a very expensive exercise in futility」，並警告：「Short-term subsidies cannot make up for long-term competitive disadvantages.」（[來源：Interconnected Blog, 2023-04](https://interconnected.blog/morris-changs-last-speech/)；[Brookings Institution, 2022-04](https://www.brookings.edu/wp-content/uploads/2022/04/Vying-for-Talent-Morris-Chang-20220414.pdf)）

Wei 在 2024 Q3 法說中被問及是否有興趣收購 Intel 或 Samsung 的晶圓廠時，連續兩次果斷回答「No」，強調 TSMC 將專注自建產能而非收購。（[來源：TrendForce, 2024-10-17](https://www.trendforce.com/news/2024/10/17/news-tsmcs-c-c-wei-declares-no-interest-in-acquiring-intel-or-samsung-fabs-emphasizes-ai-is-real/)）

| 公司 | 估計市佔率（2024） | 先進製程能力 | 3nm 良率 | 備註 |
|------|-------------------|-------------|---------|------|
| TSMC | ~62% | 3nm 量產、2nm 2025量產 | ~90% | 全球龍頭，純代工模式 |
| Samsung Foundry | ~11% | 3nm GAA 量產 | ~50% | 良率問題嚴重，2025 投資砍半至 5 兆韓元 |
| Intel Foundry | ~2-3% | 18A 開發中 | N/A（開發中） | 良率預計 2027 年達標，目標 2027 年損益兩平 |
| GlobalFoundries | ~5% | 最先進 12nm | N/A | 2018 年退出先進製程競賽 |
| UMC | ~6% | 最先進 14nm | N/A | 成熟製程專家 |
| SMIC | ~5% | 7nm（受制裁限制） | N/A | 美國出口管制限制 EUV 取得 |

**來源**：[Statista](https://www.statista.com/statistics/867223/worldwide-semiconductor-foundries-by-market-share/), [Counterpoint Research](https://counterpointresearch.com/en/insights/global-semiconductor-foundry-market-share), [TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf)

### IP/EDA 上游生態系——TSMC OIP 平台與設計工具認證

TSMC 的護城河不僅在製造端，更深嵌於 **設計工具（EDA）與矽智財（IP）的生態鎖定效應**。TSMC 透過 Open Innovation Platform（OIP）建立了業界最完整的設計生態系，涵蓋 EDA 工具認證、IP 驗證、設計服務夥伴、雲端設計平台四大支柱。

**EDA Alliance 四大夥伴**：TSMC OIP 的 EDA Alliance 核心成員為 **Cadence、Synopsys、Siemens EDA、Ansys** 四家——全球 EDA 產業前四大廠商全數深度綁定 TSMC 先進製程。（[來源：TSMC OIP Ecosystem](https://www.tsmc.com/english/dedicatedFoundry/technology/oip)）

**Cadence × TSMC N2/A16 認證**：Cadence 已完成 TSMC N2（2nm）與 A16（1.6nm）製程的全流程 EDA 工具認證，涵蓋數位設計（Innovus/Genus）、客製化/類比設計（Virtuoso）、驗證（Tempus/Voltus）等完整工具鏈。Cadence 並與 TSMC 合作開發 3D-IC 設計解決方案（Integrity 3D-IC），支援 TSMC 的 3DFabric 先進封裝技術（CoWoS/SoIC/InFO）。（[來源：Cadence TSMC Collaboration](https://www.cadence.com/en_US/home/partnerships/tsmc.html)）

**Synopsys × TSMC 深度整合**：Synopsys 在 2025 年 TSMC OIP Forum 上一舉獲得 **6 項 Partner of the Year** 大獎，創歷屆紀錄，涵蓋 EDA、IP、3D-IC、雲端設計等類別。Synopsys 的 Fusion Design Platform 已通過 N2 認證，其 DesignWare IP（包括 PCIe 6.0、DDR5/LPDDR5X、UCIe 等介面 IP）為 TSMC 先進製程客戶提供經過矽驗證的 IP 元件。（[來源：Synopsys OIP 2025 Awards](https://news.synopsys.com/2025-10-28-Synopsys-Earns-a-Record-Six-TSMC-OIP-Partner-of-the-Year-Awards)）

**Arm × TSMC 架構共生**：Arm 架構在 TSMC 先進製程中佔據核心地位——Apple Silicon（A/M 系列）、Qualcomm Snapdragon、MediaTek Dimensity、AWS Graviton 等 TSMC 主要客戶的旗艦晶片均基於 Arm 架構。Arm 的 Artisan Physical IP 與 POP IP 針對 TSMC 每一代先進製程進行優化，形成「Arm 設計 + TSMC 製造」的緊密共生關係。

**Chiplets 商業化與生態延伸**：TSMC 在 2025 OIP Forum 上宣布 chiplets 設計已進入「商業現實」（commercial reality）階段，UCIe（Universal Chiplet Interconnect Express）標準生態正在成形。TSMC 為 A14（1.4nm）製程已開始向 EDA 合作夥伴釋出 PDK（Process Design Kit），預計 2025 年底完成。（[來源：TSMC 2025 OIP Forum](https://www.tsmc.com/english/dedicatedFoundry/technology/oip)）

**生態鎖定效應的投資意涵**：一旦 IC 設計公司在 TSMC 特定製程上完成設計定案（tape-out），轉換至其他代工廠意味著重新驗證整套 EDA 工具、IP、PDK——這一轉換成本以億美元計且耗時 12-18 個月。此生態鎖定效應使 TSMC 的客戶黏性遠超單純的製造良率優勢，構成深層護城河。

| EDA/IP 夥伴 | OIP 角色 | N2/A16 認證狀態 | 關鍵 IP/工具 | 來源 |
|-------------|---------|----------------|------------|------|
| Synopsys | EDA+IP | ✅ N2 認證 | Fusion Platform, DesignWare IP, 6× OIP Awards | [Synopsys](https://news.synopsys.com/2025-10-28-Synopsys-Earns-a-Record-Six-TSMC-OIP-Partner-of-the-Year-Awards) |
| Cadence | EDA+IP+3D-IC | ✅ N2/A16 認證 | Innovus, Virtuoso, Integrity 3D-IC | [Cadence](https://www.cadence.com/en_US/home/partnerships/tsmc.html) |
| Siemens EDA | EDA | ✅ 認證中 | Calibre DRC/LVS, Aprisa | [TSMC OIP](https://www.tsmc.com/english/dedicatedFoundry/technology/oip) |
| Ansys | 模擬驗證 | ✅ 認證中 | RedHawk-SC, Totem | [TSMC OIP](https://www.tsmc.com/english/dedicatedFoundry/technology/oip) |
| Arm | IP 架構 | ✅ 每代優化 | Artisan Physical IP, POP IP, CSS | [Arm](https://www.arm.com/partners/tsmc) |

### 監管與政策環境

半導體產業是全球政治博弈的戰略焦點，TSMC 身處風暴中心。以下從五大政策面向分析 TSMC 面對的監管環境，並以管理層原話佐證其應對策略。

**一、美國 CHIPS Act 與在美製造**

2022 年美國通過 CHIPS and Science Act，提供 $527 億補貼鼓勵半導體在美製造。TSMC 獲得約 $66 億直接補貼用於亞利桑那州廠（[來源：TSMC PR, 2025-03](https://pr.tsmc.com/english/news/3210)）。2025 年 3 月，TSMC 宣布將美國總投資擴大至 $1,650 億，Wei 在白宮與 Trump 共同宣布時表示：「AI is reshaping our daily lives, and semiconductor technology is the foundation for new capabilities and applications.」（[來源：TIME, 2025](https://time.com/collections/time100-ai-2025/7305839/cc-wei-ai/)）

Wei 在 Q4 2024 法說中談及與美國政府的關係時表示：「We have a very frank and open communication with the current government and with the future one also. I cannot say anything more than that.」——展現了在政治敏感議題上的審慎態度。（[來源：TSMC Q4 2024 Transcript](https://www.fool.com/earnings/call-transcripts/2025/01/16/taiwan-semiconductor-manufacturing-tsm-q4-2024-ear/)；[transcripts/CC_Wei_2024_Q4_Earnings_Call.md](transcripts/CC_Wei_2024_Q4_Earnings_Call.md)）

TSMC 對海外廠採溢價定價（詳見 2.3）。CFO Wendell Huang 則解釋成本結構：「The U.S. fab cost, it is more expensive in the U.S., mainly because of several reasons. Number one, the smaller scale, right? Now number two, the higher price in the supply chain; and number three, the very early stage of the ecosystem.」（[來源：TSMC Q4 2024 Transcript](https://www.fool.com/earnings/call-transcripts/2025/01/16/taiwan-semiconductor-manufacturing-tsm-q4-2024-ear/)）

**二、歐盟與日本半導體復興政策**

歐盟 European Chips Act（2023）投入 €430 億，TSMC 德國德勒斯登廠為旗艦項目之一。日本方面，TSMC 熊本廠（JASM 合資公司）獲日本政府約 50% 建廠補貼，2024 年已開始量產。Wei 感嘆十年前難以想像的全球化進程規模（詳見 6.2）。

**三、美國對華出口管制**

美國自 2022 年起對中國實施嚴格的半導體出口管制，限制先進製程設備與晶片出口。2024 年 11 月，美國商務部工業安全局（BIS）進一步通知 TSMC 限制 7nm 以下 AI 晶片對中國的出口，起因於 TSMC 晶片被發現出現在華為 AI 處理器中。（[來源：CNBC, 2024-10](https://www.cnbc.com/2024/10/28/trump-accuses-taiwan-of-stealing-us-chip-business-on-joe-rogan-podcast.html)；[Global Taiwan Institute, 2025-03](https://globaltaiwan.org/2025/03/how-taiwans-chip-industry-navigates-us-industrial-policy-and-export-controls/)）

這些管制導致 TSMC 中國營收佔比從 2020 年的 22% 驟降至 2024 年的 9%（[來源：Motley Fool](https://www.fool.com/research/tsmc-revenue/)）。但 Wei 在 Q3 2025 法說中表示即使失去中國市場，AI 成長仍不可阻擋：「if the China market is not available, but I still think the AI's growth will be very dramatically.」（[來源：TSMC Q3 2025 Transcript](https://www.fool.com/earnings/call-transcripts/2025/10/17/tsmc-tsm-q3-2025-earnings-call-transcript/)；[transcripts/CC_Wei_2025_Q3_Earnings_Call.md](transcripts/CC_Wei_2025_Q3_Earnings_Call.md)）

Wei 在 TIME 專訪中更透露了他對中國議題的極度謹慎：「I was not allowed to give a speech without going through my legal department…I don't make a public comment on China.」——這反映了 TSMC 在美中科技角力中的高度敏感地位。（[來源：TIME, 2024-09](https://time.com/collections/time100-ai-2024/7012769/cc-wei/)；[transcripts/CC_Wei_2024_TIME100_AI.md](transcripts/CC_Wei_2024_TIME100_AI.md)）

**四、關稅與貿易政策風險**

Trump 政府曾威脅對晶片進口課徵關稅，TSMC 在此壓力下擴大美國投資。Wei 在 2024 Q2 法說中對關稅的態度務實而淡定：「On the tariff, not that we know of. Normally, if there's an import tariff, the customers will be responsible for that, but no discussion, nothing.」（[來源：The Register, 2024-07-18](https://www.theregister.com/2024/07/18/tsmc_ceo_predicts_ai_chip/)）

但到了 2025 Q3 法說，Wei 的語氣轉為審慎：「we understand there are uncertainties and risk from the potential impact of tariff policies, especially in consumer-related and price-sensitive end market segment.」——顯示 TSMC 開始將關稅風險納入正式前瞻指引。（[來源：TSMC Q3 2025 Transcript](https://www.fool.com/earnings/call-transcripts/2025/10/17/tsmc-tsm-q3-2025-earnings-call-transcript/)；[transcripts/CC_Wei_2025_Q3_Earnings_Call.md](transcripts/CC_Wei_2025_Q3_Earnings_Call.md)）

**五、台灣能源與環境法規**

TSMC 2023 年用電約 24.78 TWh，佔台灣總用電約 **8.9%**（[來源：Statista, 2024](https://www.statista.com/statistics/1312965/tsmc-energy-consumption-by-source/)），佔台灣工業用電約 41.3%（[來源：New Lines Institute, 2025](https://newlinesinstitute.org/geo-economics/taiwans-semiconductor-sustainability-and-global-implications/)）。Greenpeace 預測 2030 年 TSMC 用電將攀升至台灣用電的 **24%**（[來源：Greenpeace East Asia, 2023](https://www.greenpeace.org/eastasia/press/7930/semiconductor-industry-electricity-consumption-to-more-than-double-by-2030-study/)）。台灣進口 97% 的能源，面臨結構性供電壓力，台電 2022-2024 年累積虧損超過 NT$3,500 億（[來源：Global Taiwan Institute, 2026](https://globaltaiwan.org/2026/02/taiwans-bumpy-road-to-energy-resilience/)）。TSMC 已承諾 2040 年 RE100（100% 再生能源），2024 年再生能源佔比約 13-14%，簽約裝置容量 4.4 GW（[來源：TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf)）。隨著先進製程能耗持續上升（N2/A16 每片晶圓能耗較 N5 增加 ~20-30%），TSMC 需在產能擴張與台灣電力供給之間取得平衡（詳見第七章環境永續分析）。

**管理層地緣政治定力——貫穿所有政策面向**

面對多重政策壓力，TSMC 管理層始終傳遞一個訊號：策略不變。Wei 面對地緣政治壓力時展現堅定：「So far, we did not change any of our original plan of expansion of our overseas fab. We continue to expand in Arizona, in Kumamoto and maybe in future in Europe. No change to our strategy.」（[來源：The Register, 2024-07-18](https://www.theregister.com/2024/07/18/tsmc_ceo_predicts_ai_chip/)）

Wei 強調客戶驅動的海外佈局：「Many customers stress the importance of TSMC's manufacturing expertise with geographic flexibility.」（[來源：TSMC PR, 2025](https://pr.tsmc.com/english/news/3210)）

TSMC 創辦人 Morris Chang 早在 2022 年便預見了全球化退潮的大趨勢。在 Brookings Institution 演講中，他直言：「Globalization is almost dead. Free trade is almost dead.」他同時也表示：「My identity has always been an American.」——這一身份的複雜性折射出 TSMC 在美中角力間的獨特地位。（[來源：Brookings Institution, 2022-04](https://www.brookings.edu/wp-content/uploads/2022/04/Vying-for-Talent-Morris-Chang-20220414.pdf)；[Andy Lin's Blog](https://www.granitefirm.com/blog/us/2024/12/28/morris-changs-controversial/)）

Chang 更曾動情地說：「I am from the United States, and my dream is to build a wafer fab in the United States.」——這句話反映了他對美國的深厚情感，也是 TSMC 美國擴張的精神基礎。（[來源：Andy Lin's Blog, 2024-12-28](https://www.granitefirm.com/blog/us/2024/12/28/morris-changs-controversial/)）

## 1.3 技術與需求趨勢

**半導體製程微縮路線圖——從摩爾定律到 AI 驅動的指數型需求**：

半導體產業自 1960 年代積體電路發明以來，遵循 Moore's Law（摩爾定律）以約每兩年電晶體密度翻倍的速度演進。TSMC 在此趨勢中扮演關鍵推手——從 1987 年的 3μm 到 2025 年的 2nm，TSMC 的製程微縮速度始終領先產業。Morris Chang 在 2023 年最後一次公開演講中回顧這段歷程時指出：「It was at first only a prediction, which might not have been true. In fact, if MOS was not invented... Moore's Law would not have been accurate.」——提醒我們摩爾定律並非物理必然，而是產業集體努力的成果，而 TSMC 是其中最關鍵的推手。（[來源：Interconnected Blog — Morris Chang's Last Speech, 2023-04](https://interconnected.blog/morris-changs-last-speech/)）

Morris Chang 在 Acquired 播客專訪中回憶 28nm 節點的戰略意義時引用莎士比亞：「There's a tide in the affairs of man, which taken at its flood leads on to fortune.」他將 28nm 比喻為「甜蜜點」：「28 is going to be the sweet spot. It's just like tennis racket—you hit the ball with a sweet spot.」——那一代製程的成功奠定了 TSMC 在智慧手機時代的絕對領先。（[來源：Acquired Podcast, 2025-01](https://podscripts.co/podcasts/acquired/tsmc-founder-morris-chang)）

Chang 在同一訪談中闡述了 R&D 預算的堅定哲學——這是 TSMC 技術領先的基石：「8%, regardless of whether there's a recession or not. And it's just 8% of revenue.」他解釋這一固定比例的初衷：「I wanted to make him at ease, you know what I mean? He doesn't have to argue, he doesn't have to request every year.」——不因景氣循環削減研發，確保製程技術在每個世代都領先。（[來源：Acquired Podcast, 2025-01](https://podscripts.co/podcasts/acquired/tsmc-founder-morris-chang)）

CFO Wendell Huang 在 2025 年受訪時指出當前研發方向：「We are focusing on 14-angstrom, 16-angstrom, and 2-nanometer process technologies.」（[來源：TechSoda, TSMC 2024 Annual Report 解析](https://techsoda.substack.com/p/explainer-tsmcs-2024-annual-report)）；他進一步確認 N2 進展：「N2 is well on track for volume production later this quarter. N2's structural profitability is better than the N3.」——這意味著新一代製程不僅技術更先進，獲利能力也更強。（[來源：App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine)）

Wei 在 2025 年法說中強調 AI 需求的指數型成長特性：「AI demand actually continue to be very strong, stronger than we thought 3 months ago. The numbers are insane.」他更揭示了一個關鍵數據點：「The number of tokens increase is exponential. Almost every 3 months, it will exponentially increase.」——AI 推理 token 數量以每三個月指數級增長，這是 TSMC 先進製程需求持續超預期的根本驅動力。（[來源：App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine)）

Wei 補充了他判斷需求真實性的方法：「Right now, we pay a lot of attention to our customers' customer. We talk with them and see how they view the AI application, and then we make a judgment about how AI is going to grow.」——TSMC 不僅與直接客戶（NVIDIA、AMD）溝通，更深入了解終端 AI 應用的需求趨勢。（[來源：App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine)）

| 年份 | TSMC 量產節點 | 關鍵里程碑 |
|------|-------------|-----------|
| 1987 | 創立（3μm） | Morris Chang 創辦純代工模式 |
| 1997 | 0.25μm | 上市 NYSE (TSM) |
| 2004 | 90nm | 應變矽技術 |
| 2011 | 28nm | 智慧手機爆發期——Chang 稱為「sweet spot」 |
| 2018 | 7nm | AI/HPC 起飛，EUV 導入 |
| 2020 | 5nm | Apple M1、A14 首發 |
| 2022 | 3nm (N3) | FinFlex 技術 |
| 2025 | 2nm (N2) | GAA (Gate-All-Around) 電晶體量產；N2 效能提升 10-15%/同功耗，或同效能降功耗 25-30% |
| 2026 | A16 (1.6nm) | Super Power Rail HPC 優化變體量產 |
| 2027E | A14 (1.4nm) | 下一代 GAA |

**製程微縮 S 曲線——電晶體密度（MTr/mm²）的世代演進**：

TSMC 的製程微縮在過去十年呈現典型的 S 型成長：早期節點（28nm→16nm）密度提升溫和，N7 導入 EUV 後密度跳升加速，N5 達到爆發期，N3/N2 進入高位成長但年增率開始收斂——反映物理極限逼近下的技術挑戰。

| 製程節點 | 量產年 | 電晶體密度（MTr/mm²） | 較前代密度提升 | 電晶體架構 | EUV 層數 | 出處 |
|----------|--------|----------------------|---------------|-----------|---------|------|
| N16 (16nm) | 2015 | ~29 | — | FinFET（首代） | 0 | [WikiChip](https://en.wikichip.org/wiki/16_nm_lithography_process) |
| N10 (10nm) | 2017 | ~52 | ~1.8x | FinFET | 0 | [WikiChip](https://en.wikichip.org/wiki/10_nm_lithography_process) |
| N7 (7nm) | 2018 | ~96.5 | ~1.85x | FinFET | 4-5 層（N7+） | [WikiChip](https://en.wikichip.org/wiki/7_nm_lithography_process); [SemiWiki](https://semiwiki.com/forum/threads/declining-density-scaling-trend-for-tsmc-nodes.20262/) |
| N5 (5nm) | 2020 | ~171.3 | ~1.78x | FinFET | 14 層 | [WikiChip Fuse](https://fuse.wikichip.org/news/3398/tsmc-details-5-nm/); [Wikipedia 5nm](https://en.wikipedia.org/wiki/5_nm_process) |
| N3E (3nm) | 2023 | ~208 | ~1.22x | FinFET（最後一代） | ~20+ 層 | [NextBigFuture](https://www.nextbigfuture.com/2025/07/samsung-versus-tsmc-versus-intel.html) |
| N3P (3nm+) | 2024 | ~224 | ~1.08x vs N3E | FinFET 優化 | ~20+ 層 | [NextBigFuture](https://www.nextbigfuture.com/2025/07/samsung-versus-tsmc-versus-intel.html) |
| N2 (2nm) | 2025 | ~313（HD cell） | ~1.50x vs N3E | **GAA Nanosheet**（首代） | 20+ 層 | [Tom's Hardware](https://www.tomshardware.com/tech-industry/intels-18a-and-tsmcs-n2-process-nodes-compared-intel-is-faster-but-tsmc-is-denser) |
| A16 (1.6nm) | 2026 | TBD | — | GAA + Super Power Rail | TBD | [TSMC](https://www.tsmc.com/english/dedicatedFoundry/technology/platform_smartphone_tech_advancedTech) |

**密度 S 曲線的關鍵拐點**：N16→N5 期間，TSMC 每個節點實現 ~1.8x 密度翻倍（接近摩爾定律的理想 2x），年均密度成長率約 35%。但 N5→N3E 密度提升驟降至 ~1.22x——SRAM 單元微縮率先觸頂，邏輯微縮也逐漸放緩。N2 的 GAA 架構（Nanosheet）帶來一次「跳板式」密度提升（HD cell 達 313 MTr/mm²，較 N3E 提升 50%），但 SemiWiki 論壇的產業分析指出，N2→A16 之間的密度提升已趨於「very little scaling」，MMP（金屬最小間距）從 N5 的 28nm 僅微縮至 N3E 的 23nm。（[來源：SemiWiki Forum](https://semiwiki.com/forum/threads/declining-density-scaling-trend-for-tsmc-nodes.20262/)）

Morris Chang 在 2023 年 MIT 演講中對製程微縮的物理基礎有深刻洞察：「It works, the learning curve, the experience curve, it works only when you have a common location. Learning is local.」——他強調密度提升不僅需要技術突破，更依賴集中化的製造學習效應，這正是 TSMC 台灣廠區密度優勢的根源。（[來源：MIT News, 2023-10-25](https://news.mit.edu/2023/morris-chang-describes-secrets-semiconductor-success-1025)；[transcripts/Morris_Chang_2023_MIT_Speech.md](transcripts/Morris_Chang_2023_MIT_Speech.md)）

TSMC 研發總監 Carlos Diaz 在 SEMI Strategic Materials Conference 上闡述了後 Nanosheet 時代的探索方向：「need to continue to push new frontiers, explore new technology」——包括 2D 過渡金屬二硫化物（TMD，如 MoS₂ 通道材料）、碳奈米管電晶體（CNT）、與石墨烯奈米帶（GNR），目標是 2030 年代維持製程演進動能。（[來源：Mark LaPedus Substack](https://marklapedus.substack.com/p/tsmcs-roadmap-and-other-takeaways)）

**FinFET→GAA 代際轉換時間軸——半導體架構的典範轉移**：

FinFET（鰭式場效電晶體）自 2011 年 Intel 首先量產以來主導了先進製程長達 14 年。TSMC 在 N16（2015 年）導入 FinFET，並將其一路延伸至 N3P（2024 年），使 FinFET 架構橫跨七個主要節點。然而，FinFET 在 3nm 以下面臨物理極限——鰭片寬度過窄導致漏電流控制困難、驅動電流不足。

TSMC 在 N2（2025 年量產）正式從 FinFET 轉向 GAA Nanosheet 架構——以多層水平奈米片取代垂直鰭片，電流通道由四面閘極環繞，實現更佳的靜電控制。N2 效能提升 10-15%（同功耗）或降功耗 25-30%（同效能），密度提升 15-20%（混合設計）或 20%+（純邏輯）。（[來源：Tom's Hardware, 2025](https://www.tomshardware.com/tech-industry/semiconductors/tsmc-begins-quietly-volume-production-of-2nm-class-chips-first-gaa-transistor-for-tsmc-claims-up-to-15-percent-improvement-at-iso-power)；[TSPA Semiconductor](https://tspasemiconductor.substack.com/p/tsmc-n3-and-n2-nodes-shaping-the)）

| 時間軸 | 事件 | 意義 |
|--------|------|------|
| 2015 | TSMC N16 FinFET 量產 | TSMC 首代 FinFET |
| 2018 | TSMC N7 + EUV 導入 | FinFET + EUV 組合，密度翻倍 |
| 2022 | Samsung 3nm GAA 首發 | 業界首個 GAA 量產，但良率僅 ~20% |
| 2023 | TSMC N3 FinFET 量產 | TSMC 選擇以成熟 FinFET 延伸至 3nm，良率 ~90% |
| 2024 | TSMC N3P FinFET 最後一代 | FinFET 架構的最終優化版本 |
| **2025 Q4** | **TSMC N2 GAA Nanosheet 量產** | **TSMC 首代 GAA——客戶 tape-out 數量為 N5 同期 2 倍** |
| 2026 | TSMC A16 GAA + Super Power Rail | 第二代 GAA，背面供電技術 |
| 2027E | TSMC A14 GAA | 第三代 GAA |

**N2 客戶採用率的 S 型加速**：TSMC 指出 N2 的客戶 tape-out（新產品設計定案）數量在量產首年已達 N5 同期的 **2 倍**，第二年更達 N5 同期的約 **4 倍**——這是 TSMC 有史以來客戶採用速度最快的製程節點，反映 AI/HPC 客戶對 GAA 架構的急迫需求。（[來源：Tom's Hardware, 2025](https://www.tomshardware.com/tech-industry/semiconductors/tsmc-begins-quietly-volume-production-of-2nm-class-chips-first-gaa-transistor-for-tsmc-claims-up-to-15-percent-improvement-at-iso-power)；[TSPA Semiconductor](https://tspasemiconductor.substack.com/p/tsmc-n3-and-n2-nodes-shaping-the)）

Wei 在 Q3 2025 法說中對 N2 家族的信心極為明確：「we believe N2, N2P, A16 and its derivatives will propel our N2 family to be another large and long-lasting node.」——他預期 N2 家族將如同 N5/N7 一樣成為長生命週期平台。（[來源：TSMC Q3 2025 Transcript](https://www.fool.com/earnings/call-transcripts/2025/10/17/tsmc-tsm-q3-2025-earnings-call-transcript/)；[transcripts/CC_Wei_2025_Q3_Earnings_Call.md](transcripts/CC_Wei_2025_Q3_Earnings_Call.md)）

Huang 確認 N2 的獲利結構優於 N3：「N2 is well on track for volume production later this quarter. N2's structural profitability is better than the N3.」——GAA 帶來的效能提升使 TSMC 能收取更高的晶圓單價（預估 >$30K），同時維持甚至提升毛利率。（[來源：App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine)）

**EUV 光刻——從實驗到主流的 S 型採用曲線**：

EUV（極紫外光刻，13.5nm 波長）從 2018 年 TSMC N7+ 的初步導入（僅 4-5 層），到 N5 的全面採用（14 層），再到 N3/N2 的 20+ 層，經歷了典型的 S 型技術採用曲線。每一代節點使用更多 EUV 層數意味著更高的設備投資（每台 ASML High-NA EUV 光刻機售價超過 $3.5 億美元），但也帶來更精細的圖案化控制與更高的電晶體密度——TSMC 在 EUV 採用的速度與規模上始終領先 Samsung 與 Intel。

Morris Chang 在自傳中回顧了 TSMC 與 ASML 的共生歷程：「TSMC and ASML were established almost at the same period, and we grew up together and treated each other as partners.」——ASML EUV 技術的成功與 TSMC 的大量採購互為因果，構成了半導體產業最重要的供應鏈共生關係之一。（[來源：TechSoda, Morris Chang 自傳解析](https://techsoda.substack.com/p/tsmc-founder-morris-changs-autobiography)）

**先進封裝——AI 時代的 S 型採用曲線（Adoption Curve）量化分析**：

AI 晶片的效能瓶頸正從製程微縮轉向先進封裝。CoWoS（Chip-on-Wafer-on-Substrate）已成為 AI 加速器（NVIDIA H100/B100/GB200、AMD MI300X、Google TPU）的標配封裝技術，其產能擴張軌跡呈現典型的 S 型採用曲線——從 2023 年的「早期採用」快速進入 2024-2026 年的「高速成長」階段：

| 時間點 | CoWoS 月產能（等效晶圓） | 年增率 | 全球年需求量 | 出處 |
|--------|------------------------|--------|------------|------|
| 2023 年底 | ~13,000 片/月 | 基期 | — | [Andy Lin's Blog](https://www.granitefirm.com/blog/us/2025/01/05/semiconductor-packaging-2/) |
| 2024 年底 | ~35,000 片/月 | ~170% | ~370,000 片/年 | [Andy Lin's Blog](https://www.granitefirm.com/blog/us/2025/01/05/semiconductor-packaging-2/); [36kr](https://eu.36kr.com/en/p/3580962946874242) |
| 2025 年底 | ~70,000-75,000 片/月 | ~100-114% | ~670,000 片/年 (+81%) | [Institutional Investor](https://www.institutionalinvestor.com/article/market-intelligence/physical-world-upgrade-2026-outlook-when-ai-spreads-cloud-edge); [36kr](https://eu.36kr.com/en/p/3580962946874242) |
| 2026E 年底 | ~90,000-140,000 片/月 | ~30-87% | ~1,000,000+ 片/年 | [Institutional Investor](https://www.institutionalinvestor.com/article/market-intelligence/physical-world-upgrade-2026-outlook-when-ai-spreads-cloud-edge); [Andy Lin's Blog](https://www.granitefirm.com/blog/us/2025/01/05/semiconductor-packaging-2/) |

TSMC 的先進封裝產能在 2023–2026 年間擴增約 7-10 倍，CAGR 超過 50%。Morgan Stanley 預估 NVIDIA 2026 年 CoWoS 需求將達 59.5 萬片（佔全球 60%），其中約 51 萬片由 TSMC 承接，主要用於下一代 Rubin 架構晶片。（[來源：36kr](https://eu.36kr.com/en/p/3580962946874242)）

**採用曲線的 S 型特徵**：CoWoS 產能年增率從 2024 年的 170% 逐步收斂至 2026 年的 30-87%，符合技術採用曲線從「快速滲透」進入「高位成長」的特徵。然而，需求端仍以 80%+ 年增率擴張，供需缺口在 2025-2026 年間持續存在——這正是 TSMC 先進封裝的定價權來源。

C.C. Wei 在 2024 Q2 法說中明確指出 CoWoS 的擴產節奏：「From last year to this year, we have more than doubled [CoWoS capacity], and I expect next year we can double it again.」（[來源：The Register, 2024-07-18](https://www.theregister.com/2024/07/18/tsmc_ceo_predicts_ai_chip/)）

Wei 更強調：「Our CoWoS capacity is very tight and remains sold out through 2025 and into 2026.」——反映客戶搶產能的緊迫性。（[來源：Fusion Worldwide, 2025](https://info.fusionww.com/blog/inside-the-ai-bottleneck-cowos-hbm-and-2-3nm-capacity-constraints-through-2027)）

Wei 在法說中還指出一項關鍵洞察：「Advanced-node wafer demand is currently about three times short of available capacity.」——先進製程的需求缺口仍然巨大，供需結構性失衡不只在封裝端，前段晶圓製造也同樣緊張。（[來源：Fusion Worldwide](https://info.fusionww.com/blog/inside-the-ai-bottleneck-cowos-hbm-and-2-3nm-capacity-constraints-through-2027)）

Wei 面對供需失衡時的態度帶有審慎樂觀：「I hope in 2025 or 2026 we can reach the balance.」——言下之意，至少在 2024-2025 年間，供不應求將是常態。（[來源：The Register, 2024-07-18](https://www.theregister.com/2024/07/18/tsmc_ceo_predicts_ai_chip/)）

CFO Huang 指出「roughly 10–20% of capex in 2025 will go into advanced packaging/test facilities」——先進封裝已從「附加服務」升級為戰略級投資方向。Huang 對 CapEx 與成長機會的正相關論述詳見 2.3。（[來源：App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine)；[LongYield Substack](https://longyield.substack.com/p/tsmc-at-the-center-of-the-ai-boom)）

**先進封裝市場規模——超越傳統封裝的歷史轉折**：

2025 年，全球先進封裝市場首次超越傳統封裝，佔比突破 51%——這是半導體封裝產業的結構性轉折。先進封裝市場規模預計從 2023 年的約 $410 億美元以 10.6% CAGR 成長至 2028 年的 $786 億美元。TSMC 在扇出型（Fan-Out）封裝市場佔有 76.7% 的市佔率，遙遙領先。（[來源：Andy Lin's Blog](https://www.granitefirm.com/blog/us/2025/01/05/semiconductor-packaging-2/)）

TSMC 的封裝營收已從 2024 Q2 的 $24 億美元增至 Q3 的 $32 億美元（季增 36%），佔整體營收的 7-9%；預計未來先進封裝佔 TSMC 營收比重將提升至約 30%。（[來源：Andy Lin's Blog](https://www.granitefirm.com/blog/us/2025/01/05/semiconductor-packaging-2/)）

**AI 推理端與 Edge AI——次波 S 型採用曲線**：

AI 產業正從「雲端訓練」單引擎轉向「雲端訓練 + 邊緣推理」雙引擎模式。Gartner 預估 AI PC 市佔率將從 2025 年的 31% 躍升至 2026 年的 55%；企業 AI agent 應用滲透率將從 2025 年的不到 5% 飆升至 2026 年的 40%。（[來源：Institutional Investor — 2026 Outlook](https://www.institutionalinvestor.com/article/market-intelligence/physical-world-upgrade-2026-outlook-when-ai-spreads-cloud-edge)）

超大規模雲端業者（hyperscaler）2026 年資本支出預估已上修至約 $6,000 億美元（年增 36%），上行情境可達 $7,000 億；GPU 與基礎設施的投資比例從 2024 年的 70:30 趨向 2026 年的 50:50，意味著 AI 推理端的基礎設施投資正在快速追趕訓練端。（[來源：Institutional Investor](https://www.institutionalinvestor.com/article/market-intelligence/physical-world-upgrade-2026-outlook-when-ai-spreads-cloud-edge)）

無論 AI 晶片路線如何演變（GPU vs. custom ASIC vs. 推理專用晶片），技術需求都指向 TSMC（詳見 2.2）。

Wei 更在 TrendForce 採訪中引述一位關鍵客戶的話形容當前需求強度：客戶描述需求為「crazy」，並表示這一趨勢「is only starting」且將「continue for several years」。Wei 自己也強調：「That's why we are still very comfortable that the demand on leading edge semiconductor is real.」——他從客戶的客戶端驗證了 AI 需求的真實性。（[來源：TrendForce, 2024-10-17](https://www.trendforce.com/news/2024/10/17/news-tsmcs-c-c-wei-declares-no-interest-in-acquiring-intel-or-samsung-fabs-emphasizes-ai-is-real/)；[App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine)）

Wei 在 Digitimes 2025 年報導中更明確宣示 AI 發展「still in early stage」——暗示 TSMC 先進製程需求的成長動能才剛開始，遠未到達 S 型曲線的頂部。（[來源：Digitimes, 2025-11-24](https://www.digitimes.com/news/a20251124VL206/taiwan-tsmc-chairman-intel-arizona.html)）

**Chiplet 與異質整合——封裝即架構**：半導體設計正從單晶片架構轉向多晶片（chiplet）異質整合。TSMC 的 SoIC（System-on-Integrated-Chips）3D 堆疊技術使不同功能的晶片（邏輯、記憶體、I/O）能垂直整合，大幅提升效能與能源效率。這一趨勢推動封裝從「成本中心」轉變為「價值中心」，TSMC 在此領域的技術領先為其創造了傳統代工之外的第二成長引擎。

TSMC 2024 年 R&D 支出年增 12%（NT$21,812M），聚焦 N2 與 A14/A16 製程開發（[來源：TechSoda](https://techsoda.substack.com/p/explainer-tsmcs-2024-annual-report)）。Wei 在封裝產能瓶頸問題上總結道：「Everything related like front-end and back-end capacity is very tight. We are working very hard to make sure that the gap will be narrow.」——前段晶圓與後段封裝同步緊張，TSMC 正全力擴產以縮小供需缺口。（[來源：App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine)）

## 1.4 地理分部與部門別營收

### 營收按地理區域分布

**七年地理營收趨勢（2018–2024）**——TSMC 營收重心從亞洲向北美劇烈傾斜，主要受 AI/HPC 客戶（NVIDIA、AMD、Broadcom）與 Apple 驅動。地理營收數據來自 TSMC 年報（20-F）與季度管理報告，原始申報文件可於 SEC EDGAR 查閱：[TSMC 2024 20-F（SEC EDGAR, 2025-04-17）](https://www.sec.gov/Archives/edgar/data/1046179/000104617925000037/tsm_20250417.htm)；[TSMC IR — SEC Filings](https://investor.tsmc.com/english/sec-filings)。

| 地區 | 2018 (NT$B) | 2020 佔比 | 2022 佔比 | 2023 (NT$B) | 2023 佔比 | 2024 佔比 | 趨勢 | 出處 |
|------|-----------|----------|----------|-----------|----------|----------|------|------|
| 北美（主要 US） | 633 | 56% | 65% | 1,409 | 65% | 70% | ↑↑ AI 驅動劇升 | [Stock Dividend Screener](https://stockdividendscreener.com/technology/semiconductor/tsmc-revenue-by-country/); [TSMC Q4 2024 Mgmt Report](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-01/2d8b2bb6fc3b5887d24ae0635f639c1cdca834f3/4Q24ManagementReport.pdf) |
| 中國 | 176 | 22% | ~12% | 267 | 12.4% | 11% | ↓ 出口管制衝擊 | 同上 |
| 日本 | ~50E | — | ~5% | 132 | ~6% | 5% | ↑ 近三倍成長（JASM） | 同上 |
| EMEA | ~80E | ~7% | ~6% | 117 | ~5% | 4% | ↓ 佔比下降 | 同上 |
| 台灣 | ~105E | — | ~7% | 150 | 7% | — | ↔ | [Stock Dividend Screener](https://stockdividendscreener.com/technology/semiconductor/tsmc-revenue-by-country/) |
| 亞太其他 | — | ~15% | — | — | — | 10% | ↓ | [TSMC Q4 2024 Mgmt Report](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-01/2d8b2bb6fc3b5887d24ae0635f639c1cdca834f3/4Q24ManagementReport.pdf) |

**關鍵觀察**：
- **北美**：2018–2023 絕對營收成長 130%（NT$633B→NT$1,409B），佔比從 ~60% 升至 70%，Q4 單季更達 76%（Apple 季節性效應）
- **中國**：絕對營收 2018→2023 仍增 50%（NT$176B→NT$267B），但佔比從 ~17% 腰斬至 11%——反映美國出口管制下 TSMC 主動合規，AI 先進製程訂單轉移至北美客戶
- **日本**：FY2021–2023 年均成長率 ~30%，受惠 JASM 熊本廠效應與日本半導體復興政策
- **區域成長率（2021–2023 年均）**：日本 ~30% > 北美 ~22% > EMEA ~20% > 台灣 ~11% > 中國 ~9%（[來源：Stock Dividend Screener](https://stockdividendscreener.com/technology/semiconductor/tsmc-revenue-by-country/)）

> **註**：部分分析來源（如 [Motley Fool](https://www.fool.com/research/tsmc-revenue/)）引用 Q4 2024 單季數據（北美 76%、中國 9%），反映 Q4 季節性 Apple 出貨高峰。上方表格以全年數據為主以呈現結構性趨勢。「E」標記為基於佔比估算值。

### 營收按平台/應用分布（2024）

| 平台 | 估計佔比 | 趨勢 | 出處 |
|------|---------|------|------|
| HPC（高效能運算） | ~51% | ↑ AI 驅動強勁成長 | [TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf) |
| 智慧手機 | ~30% | ↔ 穩定 | [TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf) |
| IoT | ~6% | ↓ 溫和復甦 | [TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf) |
| 車用 | ~5% | ↔ | [TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf) |
| DCE（數位消費電子） | ~2% | ↓ | [TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf) |
| 其他 | ~6% | - | [TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf) |

### 營收按製程技術分布（2024）

| 製程節點 | 佔營收比 | 出處 |
|----------|---------|------|
| 3nm (N3) | 18% → 23% (Q3 2025) | [Motley Fool](https://www.fool.com/research/tsmc-revenue/) |
| 5nm (N5) | ~37% | [Motley Fool](https://www.fool.com/research/tsmc-revenue/) |
| 7nm | ~14% | [TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf) |
| 先進製程（7nm 以下）合計 | 69% (2024), 70% (2025E) | [TechSoda](https://techsoda.substack.com/p/explainer-tsmcs-2024-annual-report) |
| 成熟製程 | ~31% | [TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf) |

**客戶集中度**：前 10 大客戶佔營收 76%（2024），較 2023 年的 70% 與 2022 年的 68% 持續上升。最大客戶（推估 Apple）約佔 22%，第二大（推估 NVIDIA）<12%，第三大（推估 AMD）<10%（[來源：TechSoda](https://techsoda.substack.com/p/explainer-tsmcs-2024-annual-report)）。

---

# 二、生意

## 2.1 十年財務與轉折點

TSMC 過去十二年的財務軌跡清晰勾勒出三個結構性轉折——2019 年 EUV 量產、2022 年定價權巔峰、2024 年 AI 超級週期啟動。以下為經年報與公開數據交叉驗證的完整財務紀錄。

| 年份 | 營收 (USD B) | 營收 (NT$B) | 毛利率 | 營業利益率 | 淨利 (NT$B) | EPS (NT$) | ROIC | 備註 |
|------|-------------|------------|--------|-----------|------------|-----------|------|------|
| 2014 | 24.87 | ~763 | 49.5% | 39.6% | 264 | 50.9 | ~28% | 20nm 量產 |
| 2015 | 26.36 | 843 | 49.0% | 41.6% | 306 | 59.0 | ~27% | 16nm FinFET |
| 2016 | 29.22 | 948 | 50.1% | 40.7% | 334 | 64.5 | ~28% | Apple A10 (16nm) |
| 2017 | 32.96 | 977 | 50.6% | 40.5% | 343 | 66.2 | ~27% | Apple A11 (10nm) |
| 2018 | 33.75 | 1,031 | 48.3% | 38.6% | 351 | 67.7 | ~25% | **7nm 量產** |
| 2019 | 35.57 | 1,070 | 46.0% | 36.4% | 345 | 66.6 | ~22% | **轉折：EUV 導入+5G 備貨** |
| 2020 | 47.71 | 1,340 | 53.1% | 43.7% | 518 | 100.0 | ~28% | **COVID+5G+Apple M1** 營收跳升 |
| 2021 | 57.39 | 1,587 | 51.6% | 41.0% | 592 | 114.2 | 28.7% | 全球晶片荒，產能滿載 |
| 2022 | 73.86 | 2,264 | 59.6% | 49.5% | 993 | 191.5 | 37.3% | **歷史高毛利率**，定價權極強 |
| 2023 | 70.45 | 2,162 | 54.4% | 42.6% | 852 | 164.3 | 25.2% | 庫存調整，智慧手機/PC 疲軟 |
| 2024 | 88.34 | 2,894 | 56.1% | 45.7% | 1,158 | 226.3 | 30.9% | **AI 爆發**，營收+34% YoY |
| 2025 | ~115+ | 3,809 | 59.9% | 50.8% | 1,718 | 331.3 | 41.5% | **AI 持續強勁**，營收+32%；ROIC 歷史新高 |

**來源**：營收（USD）[CompaniesMarketCap](https://companiesmarketcap.com/tsmc/revenue/)；營業利益率 [CompaniesMarketCap](https://companiesmarketcap.com/tsmc/operating-margin/)；2021-2025 NT$ 財務數據 [Stock Analysis](https://stockanalysis.com/stocks/tsm/financials/)；ROIC 2021-2025 [Stock Analysis Ratios](https://stockanalysis.com/stocks/tsm/financials/ratios/)；2014-2020 NT$ 數據 [TSMC Annual Reports](https://investor.tsmc.com/english/annual-reports)

**關鍵轉折點分析**：

**轉折一：2019-2020——EUV + 5G + 疫情三重催化**。TSMC 率先量產 EUV 製程（N7+/N5），恰逢 5G 換機潮與疫情推動的數位化需求，營收從 $35.6B 跳升至 $47.7B（+34%），開啟超級成長循環。Morris Chang 後來回顧這一時期指出：「There's a tide in the affairs of man, which taken at its flood leads on to fortune.」——TSMC 抓住了 EUV 量產的「甜蜜時機」。（[來源：Acquired Podcast, 2025-01](https://www.acquired.fm/episodes/tsmc-founder-morris-chang)）

**轉折二：2022——定價權巔峰**。全球晶片荒期間，TSMC 對先進製程大幅漲價（據報 10-20%），毛利率飆至 59.6% 歷史新高，ROIC 達 37.3%。CFO Wendell Huang 闡釋定價哲學：「Our pricing will remain strategic, not opportunistic to earn our value.」——強調 TSMC 的定價紀律：賺取價值，但不趁火打劫。（[來源：The Next Platform, 2026-01-16](https://www.nextplatform.com/compute/2026/01/16/tsmc-has-no-choice-but-to-trust-the-sunny-ai-forecasts-of-its-customers/4092173)）

Wei 在 Q4 2024 法說中進一步表示：「Even as we invest for the future growth with this higher level of CapEx spending in 2025, we remain committed to delivering profitable growth to our shareholders.」——即便資本支出大增，仍承諾股東的獲利成長。（[來源：TSMC Q4 2024 Transcript](https://investor.tsmc.com/chinese/encrypt/files/encrypt_file/reports/2025-01/84aeb15bbe33894365d33f52e027c5268ba95dcf/TSMC%204Q24%20Transcript.pdf)）

**轉折三：2023——庫存調整年**。消費電子需求疲軟導致客戶去庫存，營收 YoY -4.5%，ROIC 從 37.3% 降至 25.2%。但此年為 AI 需求爆發的起點——NVIDIA 下單量暴增，為 2024 年反彈埋下伏筆。

**轉折四：2024-2025——AI 超級週期**。AI/HPC 需求爆發帶動營收分別成長 34% 與 32%。2025 年 TSMC 營收突破 NT$3.8 兆，淨利超過 NT$1.7 兆，ROIC 躍升至 41.5% 歷史新高。Wei 在 Q4 2025 法說中指出：「We believe the AI is real. Not only real, it is starting to grow into our daily life.」他甚至坦言面對 $52-56B 的資本支出時也會緊張：「I'm also very nervous about it. You bet, because we have to invest about $52 billion to $56 billion for the capex. If we didn't do it carefully, that would be a big disaster to TSMC for sure.」——但他的結論是：「I want to make sure that my customers' demand is real. So I talked to those cloud service providers — all of them. The answer is that I'm quite satisfied with the answer. They showed me the evidence that AI really helps their businesses.」（[來源：The Next Platform, 2026-01-16](https://www.nextplatform.com/compute/2026/01/16/tsmc-has-no-choice-but-to-trust-the-sunny-ai-forecasts-of-its-customers/4092173)）

Wei 更有一句耐人尋味的話：「I also double checked their financial status — they are very rich.」——確認 hyperscaler 客戶有充足財力支撐長期投資。（[來源：The Next Platform, 2026-01-16](https://www.nextplatform.com/compute/2026/01/16/tsmc-has-no-choice-but-to-trust-the-sunny-ai-forecasts-of-its-customers/4092173)）

## 2.2 我們的業務

TSMC 的業務本質是一個「技術即服務」的平台——公司不設計晶片，而是為全球半導體設計公司提供從製程開發、光罩製作、晶圓製造到先進封裝的完整製造服務。截至 2024 年，TSMC 服務約 465 家客戶、製造超過 9,920 種產品，覆蓋從 AI 加速器到車用晶片的全應用領域。Morris Chang 在自傳中回顧創業初心時曾說：「When I founded a semiconductor company, there was only one path: to make it a world-class one.」（[來源：CommonWealth Publishing, 2024-12-02](https://english.cw.com.tw/article/article.action?id=3849)）他更點出代工模式的核心發現：「The biggest discovery was who the customers were.」——TSMC 的命運與客戶的成功完全綁定。（[來源：Interconnected Blog — Morris Chang's Last Speech, 2023-04](https://interconnected.blog/morris-changs-last-speech/)）

### HPC（高效能運算）——最大成長引擎

HPC 已超越智慧手機成為 TSMC 最大營收平台（2024 全年佔比 51%，Q2 2025 已攀升至 60%），涵蓋 AI 加速器（GPU/TPU/ASIC）、CPU、FPGA 與網路晶片。NVIDIA 的 H100/B100/GB200 系列、AMD 的 MI300X、Broadcom 的定製 AI ASIC 均由 TSMC 製造。Wei 在 Q4 2025 法說中揭示了一個關鍵成長數據：AI 加速器營收的 2024-2029 年 CAGR 預期為 54-56%，大幅高於先前 45% 的估計。（[來源：TSPA Semiconductor Substack](https://tspasemiconductor.substack.com/p/from-tsmcs-earnings-to-the-ustaiwan)）

Wei 在 Q2 2024 法說中點出 HPC 的關鍵特性：「Whether AI applications use ASICs or graphics processors, they all require very leading-edge technology and are working with TSMC.」——無論 AI 晶片路線如何演變（GPU vs. ASIC），技術要求都指向 TSMC 先進製程，使 TSMC 成為 AI 生態系的不可替代製造方。（[來源：TSMC Q2 2024 Transcript](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2024-08/5122725a56670882d777a8e8bfe0ed247cc55330/TSMC%202Q24%20Transcript.pdf)）

Wei 更強調了 TSMC 對 AI 需求真實性的驗證方法：「I spend a lot of time in the last three to four months talking to my customers and end customers' customer. I want to make sure that my customers' demand is real.」他還補充了一個耐人尋味的觀察：「they are making even more money than TSMC」——這些下游 AI 服務商的獲利能力驗證了需求的可持續性。（[來源：The Next Platform, 2026-01-16](https://www.nextplatform.com/compute/2026/01/16/tsmc-has-no-choice-but-to-trust-the-sunny-ai-forecasts-of-its-customers/4092173)；[TSPA Semiconductor](https://tspasemiconductor.substack.com/p/from-tsmcs-earnings-to-the-ustaiwan)）

Wei 在 Q3 2025 法說中揭示了一個獨特的競爭優勢來源：「As process technology complexity increases, the engagement lead time with customer is now at least 2 to 3 years in advance. Therefore, we probably get the deepest and widest look possible in the industry.」——2-3 年的客戶接洽前置期使 TSMC 對未來技術需求的能見度遠超任何競爭者。（[來源：TSMC Q3 2025 Transcript](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf)）

### 智慧手機——穩定基本盤

智慧手機平台（2024 全年佔營收 35%，[來源：TSMC Q4 2024 Management Report](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-01/2d8b2bb6fc3b5887d24ae0635f639c1cdca834f3/4Q24ManagementReport.pdf)）以 Apple 為最大客戶，iPhone 的 A 系列/M 系列晶片均由 TSMC 獨家製造。Apple 通常是 TSMC 每一代新製程的首發客戶（first adopter）——Morris Chang 在自傳第二冊中披露，2010 年 Jeff Williams 主動表達 Apple 希望 TSMC 製造 iPhone 邏輯晶片的意願，而 2011 年 Tim Cook 更告訴 Chang 不必擔心 Intel 的競爭。Chang 對此加註了他的代工哲學：「Unwilling to take the price that customers can afford means the same that they were not good at doing dedicated foundry service.」（[來源：TechSoda, Morris Chang 自傳解析](https://techsoda.substack.com/p/tsmc-founder-morris-changs-autobiography)）

MediaTek、Qualcomm 的旗艦手機晶片亦在 TSMC 生產。TSMC 2024 年報指出，3nm 製程佔營收 18%，其中「driven by smartphone and High Performance Computing applications」（[來源：TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf)）。

### IoT 與車用——長尾成長

IoT（~6%）與車用（~5%）營收佔比雖小，但代表 TSMC 在成熟製程（28nm-16nm）的穩定需求基礎。車用晶片的品質要求（零缺陷目標）與認證週期較長，構成進入障礙。Wei 在 Q3 2025 法說中強調客戶多樣性：「We have more than 500 different customers across all the end market segments.」——500+ 客戶的廣度使 TSMC 不至於過度依賴單一應用領域。（[來源：TSMC Q3 2025 Transcript](https://www.fool.com/earnings/call-transcripts/2025/10/17/tsmc-tsm-q3-2025-earnings-call-transcript/)）

### 先進封裝——新型護城河

CoWoS 與 InFO 先進封裝已成為 TSMC 差異化的關鍵，產能從 2023 年底 ~13,000 片/月擴張至 2025 年底 ~70,000-75,000 片/月（詳見 1.3 先進封裝 S 型採用曲線分析）。

TSMC 2024 年收到客戶預付款 NT$2,911 億，用於確保未來晶圓廠產能——這一數字反映了客戶對 TSMC 產能的極度渴求。CFO Huang 解釋了投資邏輯：「roughly 10-20% of capex in 2025 will go into advanced packaging/test facilities」——先進封裝已從「附加服務」升級為戰略級投資方向。（[來源：TechSoda](https://techsoda.substack.com/p/explainer-tsmcs-2024-annual-report)；[App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine)）

## 2.3 商業模式與單位經濟

### 商業模式核心——純晶圓代工的哲學與定價藝術

TSMC 的商業模式是「純晶圓代工」（pure-play foundry）——不設計自有晶片、不與客戶競爭、以技術價值定價。這一模式由 Morris Chang 在 1987 年首創，徹底改變了半導體產業分工。Chang 在自傳中闡釋了定價哲學的精髓：「What TSMC is good at is making reasonable profits out of the price that is acceptable to the customer.」——TSMC 的定價基於為客戶創造的價值，而非成本加成。（[來源：TechSoda, Morris Chang 自傳解析](https://techsoda.substack.com/p/tsmc-founder-morris-changs-autobiography)）

C.C. Wei 延續了這一哲學，並明確表示：「We price our technology based on the value we bring to customers, not just cost-plus.」這一策略使 TSMC 能在先進製程維持 55%+ 的毛利率。Wei 在 Q4 2024 法說中對海外廠的溢價定位更為直白：「Do we charge a little bit higher? Yes, we did because we have a value of geographics of flexibility, right? And you guys know Made in U.S.A is a premium product.」——客戶不僅接受溢價，還主動要求在其本國建廠。（[來源：TSMC Q4 2024 Transcript](https://www.fool.com/earnings/call-transcripts/2025/01/16/taiwan-semiconductor-manufacturing-tsm-q4-2024-ear/)；[transcripts/CC_Wei_2024_Q4_Earnings_Call.md](transcripts/CC_Wei_2024_Q4_Earnings_Call.md)）

### 晶圓定價——先進製程的指數型價值提升

TSMC 的晶圓定價隨製程節點演進呈顯著上升趨勢。據分析師估計，3nm（N3）晶圓單價約 $18,000-$20,000 美元，過去十年漲幅超過 3 倍；即將量產的 2nm（N2）晶圓預估單價將超過 $30,000 美元，較 N3 高出 50%+。（[來源：Tom's Hardware, 2025](https://www.tomshardware.com/tech-industry/tsmcs-wafer-pricing-now-usd18-000-for-a-3nm-wafer-increased-by-over-3x-in-10-years-analyst)）TSMC 2026 年規劃對 5nm 以下先進製程漲價 5-10%，CoWoS 先進封裝漲幅更達 20%。（[來源：SmBom, 2025](https://www.smbom.com/news/13847)；[TrendForce, 2025-10-08](https://www.trendforce.com/news/2025/10/08/news-tsmc-2nm-reportedly-up-10-20-far-below-rumored-50-3-7nm-to-rise-single-digit-in-2026/)）

CFO Wendell Huang 在 Q4 2025 法說中被問及 20% 漲價傳聞時回應，強調定價只是獲利六因素之一，更關鍵的是高產能利用率：「Pricing is only one element of our broader profitability... the more decisive driver of profitability is a high utilization rate supported by strong demand and disciplined capacity planning.」——這反映了 TSMC 的定價紀律：不以漲價為主要利潤驅動，而是透過技術領先與產能管理實現結構性高毛利。（[來源：TrendForce, 2026-01-15](https://www.trendforce.com/news/2026/01/15/news-tsmc-addresses-speculations-of-a-20-wafer-asp-increase-says-price-is-not-the-main-profit-driver/)）

Huang 更從長期定位毛利率下限：「Thus, even with the unfavorable foreign exchange rate, we believe a long-term gross margin of 53% and higher remains well achievable.」——53% 為結構性下限，當前 62%+ 反映 AI 超級週期的超額溢價。（[來源：TSMC Q2 2025 Transcript](https://investor.tsmc.com/chinese/encrypt/files/encrypt_file/reports/2025-07/1f4f86c935f1de837672a6973154e64b26bdae57/TSMC%202Q25%20Transcript.pdf)）

Huang 還解釋了影響毛利率的六因素框架：「There are six factors affecting the profitability. Every year, different factors play different roles.」——這六項因素為：製程 mix、產能利用率、匯率、定價、海外廠成本、折舊。（[來源：TSMC Q4 2024 Transcript](https://investor.tsmc.com/chinese/encrypt/files/encrypt_file/reports/2025-01/84aeb15bbe33894365d33f52e027c5268ba95dcf/TSMC%204Q24%20Transcript.pdf)）

### 單位經濟指標

| 指標 | 2025 | 2024 | 2023 | 2022 | 趨勢 | 出處 |
|------|------|------|------|------|------|------|
| 毛利率 | 59.9% | 56.1% | 54.4% | 59.6% | AI mix 推升 | [Stock Analysis](https://stockanalysis.com/stocks/tsm/financials/) |
| 營業利益率 | 50.8% | 45.7% | 42.6% | 49.5% | Operating leverage | [Stock Analysis](https://stockanalysis.com/stocks/tsm/financials/) |
| 淨利率 | 45.1% | 40.0% | 39.4% | 43.9% | 創歷史新高 | [Stock Analysis](https://stockanalysis.com/stocks/tsm/financials/) |
| CapEx (USD B) | ~38 | ~30 | ~28 | ~33 | 持續加碼 | [TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf) |
| R&D 佔營收比 | ~8% | ~8% | ~8.4% | ~7.8% | Morris Chang 固定 8% 紀律 | [TechSoda](https://techsoda.substack.com/p/explainer-tsmcs-2024-annual-report) |
| N3 晶圓單價 | ~$18-20K | — | — | — | 10 年漲 3 倍+ | [Tom's Hardware](https://www.tomshardware.com/tech-industry/tsmcs-wafer-pricing-now-usd18-000-for-a-3nm-wafer-increased-by-over-3x-in-10-years-analyst) |
| N2 晶圓單價（估） | >$30K | — | — | — | 較 N3 +50%+ | [Tom's Hardware](https://www.tomshardware.com/tech-industry/tsmc-may-increase-wafer-pricing-by-10-for-2025-report) |

TSMC 2024 年 R&D 支出年增 12%（NT$21,812M），G&A 與行銷支出年增 35.6%（NT$25,425M）。CFO Huang 解釋後者增長：「The increase in G&A was driven by overseas fab startup costs and employee profit sharing.」（[來源：TechSoda](https://techsoda.substack.com/p/explainer-tsmcs-2024-annual-report)）Wei 對此並不擔憂，他在 Q4 2024 法說中強調：「Even as we invest for the future growth with this higher level of CapEx spending in 2025, we remain committed to delivering profitable growth to our shareholders.」（[來源：TSMC Q4 2024 Transcript](https://investor.tsmc.com/chinese/encrypt/files/encrypt_file/reports/2025-01/84aeb15bbe33894365d33f52e027c5268ba95dcf/TSMC%204Q24%20Transcript.pdf)）

Huang 對資本支出回報的預期直白且自信：「A higher level of capital expenditures is always going to be correlated with higher growth opportunities in the following years. As long as we believe there are business opportunities, we will not hesitate to invest.」他更進一步承諾：「If we do our job right, the growth of our business should outpace the growth of the CapEx.」——即便 2026 年 CapEx 攀升至 $52-56B，營收成長仍將跑贏資本支出成長。（[來源：App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine)；[TSMC Q3 2025 Transcript](https://www.fool.com/earnings/call-transcripts/2025/10/17/tsmc-tsm-q3-2025-earnings-call-transcript/)）

Morris Chang 創立的 8% R&D 紀律是 TSMC 技術領先的制度性保障。他解釋設定固定比例的初衷：「I wanted to make him at ease, you know what I mean? He doesn't have to argue, he doesn't have to request every year.」——不因景氣循環削減研發，確保技術代代領先。（[來源：Acquired Podcast, 2025-01](https://podscripts.co/podcasts/acquired/tsmc-founder-morris-chang)）

### 收入結構與客戶集中度

2024 年平台拆分（HPC 51%、智慧手機 35%、IoT 6%、車用 5%、其他 3%）與製程拆分（先進製程≤7nm 佔 69%，其中 3nm 18%、5nm ~37%）的完整數據詳見 **1.4 節**。此處聚焦結構意涵：前 10 大客戶佔營收 76%（2024，持續上升：2023 年 70%、2022 年 68%），Apple ~22%、NVIDIA <12%、AMD <10%。（[來源：TechSoda](https://techsoda.substack.com/p/explainer-tsmcs-2024-annual-report)）

正是這種深度綁定，奠定了 TSMC 與 Apple、NVIDIA、AMD 等頂級客戶長達數十年的互信基礎（詳見 4.1 Morris Chang 人物深度）。

Wei 在 2025 Fortune 專訪中以獨特的成功衡量標準呼應了這一哲學：「It's a great encouragement to go up on the Fortune Global 500, but the best sign of our success is if our customers are on the list—or even higher than TSMC.」——客戶越成功，TSMC 的護城河越深。（[來源：Fortune Asia, 2025-07-30](https://fortune.com/asia/2025/07/30/tsmc-ai-boom-cc-wei-wendell-huang-global-500/)；[transcripts/CC_Wei_2025_Fortune_Asia.md](transcripts/CC_Wei_2025_Fortune_Asia.md)）

Wei 在 Q4 2024 法說中證實了供需失衡下的強勢地位：「We have a very tight capacity and cannot even meet customers' need.」——當產能供不應求時，是客戶主動預付現金（2024 年 NT$2,911 億）搶產能。（[來源：TSMC Q4 2024 Transcript](https://www.fool.com/earnings/call-transcripts/2025/01/16/taiwan-semiconductor-manufacturing-tsm-q4-2024-ear/)；[transcripts/CC_Wei_2024_Q4_Earnings_Call.md](transcripts/CC_Wei_2024_Q4_Earnings_Call.md)）

N2 家族將成為又一個長生命週期節點，支撐多年的營收與定價（詳見 1.3 節 N2 客戶採用率）。

## 2.4 五力與護城河

### 5a. 供應商議價能力——中等

TSMC 的關鍵供應商為半導體設備商（ASML、Applied Materials、Lam Research、Tokyo Electron）與化學材料供應商。ASML 的 EUV 光刻機是 TSMC 先進製程的獨家設備供應，具備高議價能力——全球每台 EUV 光刻機售價超過 $3.5 億美元，且僅 ASML 一家供應。然而，TSMC 作為 ASML 最大客戶（佔 ASML 營收約 30%+），雙方形成互相依賴的「共生」關係。

Morris Chang 在自傳第二冊中回顧了 TSMC 與 ASML 的長期夥伴關係：「TSMC and ASML were established almost at the same period, and we grew up together and treated each other as partners.」——這段話揭示了 TSMC 與關鍵設備商的「共同演化」策略，而非單純的買賣關係。（[來源：TechSoda, Morris Chang 自傳解析](https://techsoda.substack.com/p/tsmc-founder-morris-changs-autobiography)）

Chang 更以固定 8% 的 R&D 預算紀律（不因景氣循環削減，詳見 3.2）確保 TSMC 持續投入與供應商的聯合技術開發，形成制度性的共生保障。

Wei 在法說中亦強調：「The structural AI-related demand continues to be very strong.」——這一結構性需求使 TSMC 有能力向供應商下更大的長期訂單，進一步強化議價地位。（[來源：Fusion Worldwide, 2025](https://info.fusionww.com/blog/inside-the-ai-bottleneck-cowos-hbm-and-2-3nm-capacity-constraints-through-2027)）

TSMC 2025 年 CapEx 目標為 $380-420 億美元，其中 70% 用於先進技術——相比之下，Samsung Foundry 2025 年投資僅約 $35 億美元（砍半），TSMC 的投資規模是 Samsung 的 10 倍以上，使其在設備採購中具備絕對優先權。（[來源：TrendForce, 2025-01-22](https://www.trendforce.com/news/2025/01/22/news-samsung-faces-struggles-ahead-as-foundry-investment-reportedly-slashed-by-half-for-2025/)）

Wei 對資本支出的態度承襲了 Morris Chang 的堅定：Chang 曾為了說服董事會增加資本支出而直言：「I am still the guy responsible for the company operation. You need to let me go ahead.」——這種創辦人級的決斷力延續至今日的投資決策。（[來源：Acquired Podcast, 2025-01](https://podscripts.co/podcasts/acquired/tsmc-founder-morris-chang)）

TSMC 與供應鏈的共生關係深厚——TSMC 不僅是 ASML 最大客戶，更是 EUV 技術從開發到量產的最重要推動者（Wei 之供應鏈共生觀詳見 3.1）。

CFO Wendell Huang 從投資角度補充：「In the last three years, our capex dollars amount totaled $101 billion, but is expected to be significantly higher in the next three years.」——這一投資規模使 TSMC 在設備供應鏈中享有最優先的供貨地位與議價條件。（[來源：The Next Platform, 2026-01-16](https://www.nextplatform.com/compute/2026/01/16/tsmc-has-no-choice-but-to-trust-the-sunny-ai-forecasts-of-its-customers/4092173)；[transcripts/CC_Wei_2026_Next_Platform.md](transcripts/CC_Wei_2026_Next_Platform.md)）

### 5b. 買方議價能力——低至中等

雖然 TSMC 前 10 大客戶佔營收 76%（2024），但這些客戶（Apple、NVIDIA、AMD）對 TSMC 的先進製程幾乎沒有替代選項。Samsung 3nm 良率僅 ~50%（vs. TSMC ~90%），Intel 18A 良率預計 2027 年才達業界標準——使 TSMC 在 3nm/5nm 成為唯一可靠供應商。（[來源：Design Reuse, 2025-06](https://www.design-reuse-embedded.com/news/202506089/samsung-foundry-struggles-with-3nm-yields-at-50-as-tsmc-climbs-past-90/)）

TSMC 的「value-based pricing」策略正是基於這一不可替代性。Morris Chang 在自傳中闡釋了這一定價哲學的精髓：「Unwilling to take the price that customers can afford means the same that they were not good at doing dedicated foundry service. What TSMC is good at is making reasonable profits out of the price that is acceptable to the customer.」——這段話的核心是：TSMC 的定價基於為客戶創造的價值，而非成本加成。（[來源：TechSoda, Morris Chang 自傳解析](https://techsoda.substack.com/p/tsmc-founder-morris-changs-autobiography)）

TSMC 2024 年收到客戶預付款 NT$2,911 億，較前一年大幅增加——客戶主動預付現金以鎖定產能，反映了 TSMC 在買方關係中的極強議價地位。（[來源：TechSoda](https://techsoda.substack.com/p/explainer-tsmcs-2024-annual-report)）

Wei 將 TSMC 的成功歸功於供應鏈共生——所有人都需要 TSMC，而 TSMC 也深度依賴合作夥伴（詳見 3.1）。

Wei 在 2024 年的 SCMP 專訪中還強調：TSMC 將永遠在台灣率先採用最先進技術，之後才考慮在其他地方部署。——這一「台灣優先」策略進一步強化了客戶對 TSMC 的依賴。（[來源：SCMP, 2024](https://www.scmp.com/tech/big-tech/article/3265309/tsmcs-new-chairman-affirms-forecast-ai-fuelled-global-semiconductor-market-recovery-2024)）

供需失衡下買方的弱勢地位已由 2024 年 NT$2,911 億客戶預付款充分體現（詳見 2.3）——客戶搶產能，而非 TSMC 求訂單。TSMC 對海外廠採溢價定價，客戶不僅接受溢價，還主動要求 TSMC 在其本國建廠（詳見 2.3）。

### 5c. 新進入者威脅——極低

半導體代工是全球資本密集度最高的產業之一。一座先進製程晶圓廠造價 $150-200 億美元，從建廠到量產需 3-5 年，製程技術開發需數十年累積。TSMC 2025 年單年度 CapEx 即達 $380-420 億美元，幾乎相當於一個中型國家的年度基礎建設預算。

Intel Foundry Services 是最認真的新進入者，18A 製程已流片但良率仍需至 2027 年才達標；Intel 坦承需持續投入數百億美元才有望在 2027 年實現代工業務損益兩平。（[來源：WCCFTech](https://wccftech.com/intel-foundry-breakeven-target-for-2027-now-looks-a-lot-more-real/)）

Morris Chang 在 Acquired 播客中對競爭門檻有精闢論述。他回憶 TSMC 早期曾被多方質疑時說：「Building a world-class foundry requires decades of learning, billions of dollars, and thousands of the best engineers. You cannot do it overnight.」（[來源：Acquired Podcast, 2025-01](https://www.acquired.fm/episodes/tsmc-founder-morris-chang)）

Chang 在同一播客中更具體地談到了學習曲線的威力：他在德州儀器時期就深入研究過「learning curve pricing」（學習曲線定價）——每翻倍的累積產量能帶來固定比例的成本下降。TSMC 數十年的累積產量優勢構成了新進入者幾乎無法跨越的成本壁壘。（[來源：Acquired Podcast, 2025-01](https://podscripts.co/podcasts/acquired/tsmc-founder-morris-chang)）

Wei 在被問及是否有興趣收購 Intel 或 Samsung 的產能時，連續兩次果斷回答：「No.」——反映 TSMC 對自建產能的信心，以及對外部產能品質的保留態度。（[來源：TrendForce, 2024-10-17](https://www.trendforce.com/news/2024/10/17/news-tsmcs-c-c-wei-declares-no-interest-in-acquiring-intel-or-samsung-fabs-emphasizes-ai-is-real/)）

Wei 更指出 AI 仍「still in early stage」（[Digitimes, 2025-11-24](https://www.digitimes.com/news/a20251124VL206/taiwan-tsmc-chairman-intel-arizona.html)）——新進入者即使現在開始追趕，也趕不上已開跑的 AI 超級週期（此引言詳見 1.3）。

Wei 在 Q4 2024 法說中被問及 Intel Foundry（同時是 TSMC 客戶）時展現了微妙的競合關係認知：「They are our very good customers. I like them, and they are very important to TSMC's business also.」——Intel 在追趕 TSMC 的同時，也不得不將自家晶片交由 TSMC 代工，這本身就是進入門檻極高的最佳註腳。（[來源：TSMC Q4 2024 Transcript](https://www.fool.com/earnings/call-transcripts/2025/01/16/taiwan-semiconductor-manufacturing-tsm-q4-2024-ear/)；[transcripts/CC_Wei_2024_Q4_Earnings_Call.md](transcripts/CC_Wei_2024_Q4_Earnings_Call.md)）

CFO Wendell Huang 從成本結構解釋了為何在美建廠對新進入者更為困難：「The U.S. fab cost, it is more expensive in the U.S., mainly because of several reasons. Number one, the smaller scale, right? Now number two, the higher price in the supply chain; and number three, the very early stage of the ecosystem.」——如果連 TSMC 在美國建廠都面臨顯著成本劣勢，新進入者從零開始的難度可想而知。（[來源：TSMC Q4 2024 Transcript](https://www.fool.com/earnings/call-transcripts/2025/01/16/taiwan-semiconductor-manufacturing-tsm-q4-2024-ear/)）

### 5d. 替代品威脅——低

晶片製造目前沒有真正的替代技術。量子計算、光子計算等新興技術距離取代矽基半導體仍有數十年之遙。唯一的「替代」是客戶選擇不同代工廠（如 Samsung），但 Samsung 3nm 良率僅 ~50%（TSMC ~90%）、Intel 18A 尚未量產，使先進製程的替代選項幾乎不存在。

無論 AI 晶片技術路線如何演變，都需要 TSMC 的先進製程與封裝（詳見 2.2）。

Morris Chang 也曾觀察到，即使客戶想分散風險（「second source」），結果往往因為良率與成本差距太大而回流 TSMC：「His prediction came true. Not only did it solve NVIDIA's financial problems, it prevented bankruptcy.」——指的是 NVIDIA 在 1990 年代末期從多源採購最終集中到 TSMC 的經歷。（[來源：Acquired Podcast, 2025-01](https://podscripts.co/podcasts/acquired/tsmc-founder-morris-chang)）

TSMC 在扇出型封裝（Fan-Out）市場佔有 76.7% 的市佔率，在先進封裝的替代品威脅同樣極低。（[來源：Andy Lin's Blog](https://www.granitefirm.com/blog/us/2025/01/05/semiconductor-packaging-2/)）

Wei 在法說中還強調供需結構的持續性：「Even with significant capex, wafer output is still not enough to support AI demand.」——產能持續不足反映了客戶根本沒有「替代」的空間。（[來源：Fusion Worldwide](https://info.fusionww.com/blog/inside-the-ai-bottleneck-cowos-hbm-and-2-3nm-capacity-constraints-through-2027)）

製程世代的持續演進意味著 TSMC 的技術領先是動態且不斷拉開的——替代者在追趕 N3 時，TSMC 已進入 N2/A16 世代（詳見 1.3 節 N2 客戶採用率）。

Wei 更強調即使中國市場因出口管制而受限，AI 對先進製程的替代需求仍然壓倒性地指向 TSMC：「if the China market is not available, but I still think the AI's growth will be very dramatically.」——地緣限制不會創造替代品，只會重新分配需求到 TSMC 可服務的市場。（[來源：TSMC Q3 2025 Transcript](https://www.fool.com/earnings/call-transcripts/2025/10/17/tsmc-tsm-q3-2025-earnings-call-transcript/)）

### 5e. 同業競爭——中等但結構性有利 TSMC

TSMC 與 Samsung Foundry 的競爭是產業焦點，但過去三年的趨勢顯示這一競爭正在從「雙雄爭霸」走向「一超多弱」。Samsung 市佔率從 2020 年的 ~13% 下滑至 2024 年的 ~11%，Qualcomm 與 MediaTek 等主要客戶已從 Samsung 轉單至 TSMC。Samsung 的 IDM+代工混合模式引發客戶對智財保護的疑慮——Samsung 同時是客戶（如 Apple）的直接競爭對手。（[來源：Statista](https://www.statista.com/statistics/867223/worldwide-semiconductor-foundries-by-market-share/)；[Design Reuse, 2025-06](https://www.design-reuse-embedded.com/news/202506089/samsung-foundry-struggles-with-3nm-yields-at-50-as-tsmc-climbs-past-90/)）

TSMC 的純代工模式消除了此疑慮。Morris Chang 在自傳中回顧了這一戰略選擇的深遠影響：他在創辦之初就決定 TSMC 永遠不設計自有晶片，這一承諾建立了長達 40 年的客戶信任基礎。

正是這種從 1997 年就建立的長期信任關係，奠定了 TSMC 與全球頂尖客戶的深度綁定（詳見 4.1）。

Wei 在 Q3 2025 法說中面對 Intel Foundry 的競爭時展現了自信的競合姿態：「That competitor happened to be our customer, very good customer. So in fact, we are working with them...」——Intel 一方面試圖以 18A 製程搶回代工市場，另一方面其最先進的產品（Panther Lake、Arrow Lake）仍需要 TSMC 製造，這一矛盾關係本身就是 TSMC 競爭優勢的體現。（[來源：TSMC Q3 2025 Transcript](https://www.fool.com/earnings/call-transcripts/2025/10/17/tsmc-tsm-q3-2025-earnings-call-transcript/)；[transcripts/CC_Wei_2025_Q3_Earnings_Call.md](transcripts/CC_Wei_2025_Q3_Earnings_Call.md)）

Wei 在 2025 Fortune 專訪中以獨特的成功衡量標準詮釋了 TSMC 與客戶的共生關係：「It's a great encouragement to go up on the Fortune Global 500, but the best sign of our success is if our customers are on the list—or even higher than TSMC.」——這一觀點呼應了 Morris Chang 在 1987 年創辦 TSMC 時的核心發現：「最大的發現是客戶是誰」。客戶越成功，TSMC 的護城河越深。（[來源：Fortune Asia, 2025-07-30](https://fortune.com/asia/2025/07/30/tsmc-ai-boom-cc-wei-wendell-huang-global-500/)；[transcripts/CC_Wei_2025_Fortune_Asia.md](transcripts/CC_Wei_2025_Fortune_Asia.md)）

### 護城河總結

TSMC 擁有半導體產業中最深的護城河組合：
1. **技術護城河**：製程領先 Samsung/Intel 1-2 代（3nm 良率 90% vs. Samsung 50%），先進封裝（CoWoS/SoIC）獨步全球（Fan-Out 市佔 76.7%）
2. **規模護城河**：年 CapEx $380-420 億，是 Samsung Foundry 的 10 倍以上，競爭對手難以匹敵
3. **信任護城河**：純代工模式消除利益衝突，40 年未洩漏客戶智財；Morris Chang 曾拒絕 Jensen Huang 擔任 TSMC CEO 的邀請，也從未考慮進入晶片設計
4. **生態系護城河**：EDA 工具、IP 庫、設計服務圍繞 TSMC 製程最佳化，轉換成本極高
5. **學習曲線護城河**：數十年累積產量帶來的成本優勢，新進入者無法透過資本投入追平

## 2.5 DCF 估值

### 情境分析表

TSMC Q4 2025 法說提供了 2026 年明確指引：Q1 2026 營收 $34.6-35.8B，全年營收 USD 年增約 30%（[來源：TSMC Q4 2025 Transcript](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-01/51d09df96cd89ac19d65af39032b038dc2896a24/TSMC%204Q25%20Transcript.pdf)）。以 2025 年營收 ~$115B 為基期，合理情境 2026E 營收約 $150B（NT$4,950B）。Q4 2025 毛利率已達 62.3%，管理層指引 Q1 2026 毛利率 63-65%（[來源：TSMC Q4 2025 Earnings](https://investor.tsmc.com/english/quarterly-results/2025/q4)）。

Wei 對此成長充滿信心但保持審慎：「I spend a lot of time in the last three to four months talking to my customers and end customers' customer. I want to make sure that my customers' demand is real.」（[來源：The Next Platform, 2026-01-16](https://www.nextplatform.com/compute/2026/01/16/tsmc-has-no-choice-but-to-trust-the-sunny-ai-forecasts-of-its-customers/4092173)）

Huang 從資本效率角度指出：「If we do our job right, the growth of our business should outpace the growth of the CapEx.」他也確認：「In the last three years, our capex dollars amount totaled $101 billion, but is expected to be significantly higher in the next three years.」（[來源：The Next Platform, 2026-01-16](https://www.nextplatform.com/compute/2026/01/16/tsmc-has-no-choice-but-to-trust-the-sunny-ai-forecasts-of-its-customers/4092173)；[TSMC Q3 2025 Transcript](https://www.fool.com/earnings/call-transcripts/2025/10/17/tsmc-tsm-q3-2025-earnings-call-transcript/)）

三情境 IRR 匯總已列於文首 **IRR 模型與關鍵假設**（樂觀 ~28%／合理 ~18%／保守 ~6%），詳細假設見下方關鍵假設表。以下展開合理情境的財務預測。

### 預估損益表（合理情境）

| 項目 | 2024A | 2025A | 2026E | 2027E | 2028E |
|------|-------|-------|-------|-------|-------|
| **營收 (USD B)** | 88.3 | ~115 | 150 | 180 | 207 |
| 營收成長率 | +34% | +32% | +30% | +20% | +15% |
| 毛利 | 49.5 | 68.9 | 91.5 | 108.0 | 124.2 |
| **毛利率** | 56.1% | 59.9% | 61.0% | 60.0% | 60.0% |
| 營業費用 | 9.2 | 10.5 | 13.5 | 16.2 | 18.6 |
| **營業利益** | 40.3 | 58.4 | 78.0 | 91.8 | 105.6 |
| **營業利益率** | 45.7% | 50.8% | 52.0% | 51.0% | 51.0% |
| 稅前利潤 | 42.9 | 62.0 | 81.0 | 95.0 | 109.0 |
| 所得稅（有效稅率~14%） | 6.4 | 8.3 | 11.3 | 13.3 | 15.3 |
| **淨利 (USD B)** | 36.5 | 54.3 | 69.0 | 81.0 | 93.0 |
| **淨利率** | 40.0% | 45.1% | 46.0% | 45.0% | 44.9% |
| **稀釋 EPS (NT$)** | 226 | 331 | 439 | 510 | 580 |

**來源**：2024-2025 實際數據 [Stock Analysis](https://stockanalysis.com/stocks/tsm/financials/)；2026E 基於管理層指引 +30% YoY 與毛利率 63-65%（[TSMC Q4 2025](https://investor.tsmc.com/english/quarterly-results/2025/q4)）；2027-2028E 基於 AI 需求成長放緩假設

### 預估現金流量表（合理情境）

| 項目 | 2024A | 2025A | 2026E | 2027E | 2028E |
|------|-------|-------|-------|-------|-------|
| 營業現金流 (USD B) | ~50 | ~70 | ~85 | ~98 | ~112 |
| **CapEx** | -30 | -38 | -54 | -50 | -48 |
| **自由現金流 (FCF)** | ~20 | ~32 | ~31 | ~48 | ~64 |
| FCF Margin | 22.7% | 27.8% | 20.7% | 26.7% | 30.9% |
| 股利發放 | -5.5 | -7.0 | -9.0 | -11.0 | -13.0 |

**CapEx 說明**：2026E CapEx $52-56B 為管理層指引（[TSMC Q4 2025](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-01/51d09df96cd89ac19d65af39032b038dc2896a24/TSMC%204Q25%20Transcript.pdf)），其中 70-80% 投向先進製程、10-20% 投向先進封裝、10% 投向特殊製程。Huang 指出：「The cost of fabrication tools and the complexity of manufacturing processes have been on the rise for a long time, and it is getting more intense.」（[來源：The Next Platform, 2026-01-16](https://www.nextplatform.com/compute/2026/01/16/tsmc-has-no-choice-but-to-trust-the-sunny-ai-forecasts-of-its-customers/4092173)）

### 預估資產負債表摘要（合理情境）

| 項目 | 2024A | 2025E | 2026E |
|------|-------|-------|-------|
| 現金及約當現金 (USD B) | ~48 | ~60 | ~70 |
| 不動產/廠房/設備（淨額） | ~85 | ~105 | ~135 |
| 總資產 | ~160 | ~200 | ~245 |
| 總負債 | ~50 | ~60 | ~70 |
| 股東權益 | ~110 | ~140 | ~175 |
| 淨負債比 | 淨現金 | 淨現金 | 淨現金 |

**來源**：2024 實際數據基於 [TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf)；客戶預付款 NT$2,911 億（[TechSoda](https://techsoda.substack.com/p/explainer-tsmcs-2024-annual-report)）

### 營收拆解預估（合理情境，2026E）

| 平台 | 2024 佔比 | 2026E 佔比 | 2026E 營收 (USD B) | 成長驅動 |
|------|----------|-----------|-------------------|---------|
| HPC（AI/GPU/CPU） | 51% | 58% | 87 | NVIDIA Rubin、AMD MI400、Broadcom ASIC |
| 智慧手機 | 30% | 24% | 36 | Apple A20/M6、MediaTek 旗艦 |
| IoT | 6% | 5% | 7.5 | Edge AI 推理晶片 |
| 車用 | 5% | 6% | 9 | ADAS/自動駕駛 SoC |
| 其他（DCE+其他） | 8% | 7% | 10.5 | |
| **合計** | 100% | 100% | **150** | |

Wei 在 Q3 2025 法說中指出 AI 需求仍有巨大空間：「We have more than 500 different customers across all the end market segments.」（[來源：Motley Fool, TSMC Q3 2025 Transcript](https://www.fool.com/earnings/call-transcripts/2025/10/17/tsmc-tsm-q3-2025-earnings-call-transcript/)）

### 關鍵假設與證據

| 假設 | 合理情境值 | 證據/來源 |
|------|----------|----------|
| 2026 營收成長 | +30% | 管理層指引（[Q4 2025 法說](https://investor.tsmc.com/english/quarterly-results/2025/q4)） |
| 毛利率 | 61% | Q4 2025 已達 62.3%；海外廠稀釋 2-3pp vs. 先進製程 mix 提升 |
| CapEx | $52-56B | 管理層指引（[Q4 2025 法說](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-01/51d09df96cd89ac19d65af39032b038dc2896a24/TSMC%204Q25%20Transcript.pdf)） |
| 長期毛利率 | 53%+ | Huang：「a long-term gross margin of 53% and higher remains well achievable」（[Q2 2025 法說](https://investor.tsmc.com/chinese/encrypt/files/encrypt_file/reports/2025-07/1f4f86c935f1de837672a6973154e64b26bdae57/TSMC%202Q25%20Transcript.pdf)） |
| 海外廠利潤稀釋 | 早期 2-3pp，後期 3-4pp | 管理層指引（[Q4 2025](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-01/51d09df96cd89ac19d65af39032b038dc2896a24/TSMC%204Q25%20Transcript.pdf)） |
| WACC | 9% | 台灣地緣政治風險溢價 + 半導體週期性 |
| 終值成長率 | 3.5% | AI 長期結構性需求 |
| 有效稅率 | ~14% | 台灣科技業稅率 + 海外優惠 |

### IRR 拆分

| 回報來源 | 樂觀 | 合理 | 保守 |
|---------|------|------|------|
| 來自盈利成長的報酬 | 20% | 14% | 7% |
| 來自估值變動的報酬 | 6% | 2.5% | -2.5% |
| 股利收益率 | 1.5% | 1.5% | 1.5% |
| **預期總年化報酬** | **~28%** | **~18%** | **~6%** |

### 多指標估值——P/E + EV/EBITDA + P/FCF 三角交叉驗證

單一 P/E 估值不足以捕捉 TSMC 在 AI 超級週期中的完整價值。以下以三種估值方法交叉驗證公允價值區間，並與全球半導體同業對標。

**TSMC vs. 全球半導體同業估值對比（2026 年 3 月）**：

| 指標 | TSMC (TSM) | NVIDIA (NVDA) | AMD | ASML | Broadcom (AVGO) | 出處 |
|------|-----------|--------------|-----|------|----------------|------|
| **EV/EBITDA (TTM)** | ~20x | ~32x | ~47x | ~36x | ~42x | [Stock Analysis](https://stockanalysis.com/stocks/tsm/statistics/)；[GuruFocus](https://www.gurufocus.com/term/enterprise-value-to-ebitda/TSM) |
| **P/FCF (TTM)** | ~55x | ~44x | ~47x | ~40x | ~54x | [Stock Analysis](https://stockanalysis.com/stocks/tsm/statistics/) |
| **Forward P/E** | ~24x | ~22x | ~30x | ~40x | ~24x | [Stock Analysis](https://stockanalysis.com/stocks/tsm/statistics/)；[Yahoo Finance](https://finance.yahoo.com/quote/TSM/key-statistics/) |
| **Trailing P/E** | ~31x | ~36x | ~75x | ~46x | ~63x | 同上 |
| **EV/Revenue** | ~14x | ~23x | ~10x | ~14x | ~32x | [Stock Analysis](https://stockanalysis.com/stocks/tsm/statistics/) |
| **Market Cap** | $1.69T | — | — | — | — | [Stock Analysis](https://stockanalysis.com/stocks/tsm/statistics/) |
| **Enterprise Value** | $1.66T | — | — | — | — | 同上 |

**TSMC EV/EBITDA 歷年走勢（5 年）**：

| 年份 | EV/EBITDA | 備註 | 出處 |
|------|----------|------|------|
| 2021 | 15.2x | 全球晶片荒期間 | [GuruFocus](https://www.gurufocus.com/term/enterprise-value-to-ebitda/TSM) |
| 2022 | 7.8x | 股價修正+高 EBITDA（歷史高毛利率 59.6%） | 同上 |
| 2023 | 10.1x | 庫存調整年 | 同上 |
| 2024 | 14.9x | AI 超級週期啟動 | 同上 |
| 2025 | 18.1x | AI 爆發+ROIC 41.5% 歷史新高 | 同上 |
| **5 年均值** | **~13.2x** | — | 計算值 |
| **10 年中位數** | **~9.3x** | — | [GuruFocus](https://www.gurufocus.com/term/enterprise-value-to-ebitda/TSM) |

**三種方法估值匯總**：

| 估值方法 | 指標 | 當前值 | 5 年均值 | 同業均值 | 合理目標倍數 | 隱含公允價值 (NT$/股) | 出處 |
|---------|------|--------|---------|---------|------------|---------------------|------|
| **P/E** | Forward P/E | 24x | ~18x | ~29x（同業均） | 22-28x | 9,658-12,292 | 基於 2026E EPS NT$439 |
| **EV/EBITDA** | EV/EBITDA | 20x | 13.2x | ~39x（同業均） | 16-22x | 8,500-11,700 | 基於 2026E EBITDA ~$100B、EV→equity bridge |
| **P/FCF** | P/FCF | 55x | ~35x（估） | ~46x（同業均） | 35-50x | 7,800-11,100 | 基於 2026E FCF ~$31B（高 CapEx 年）；2028E FCF ~$64B 正常化後 P/FCF ~25x 隱含 NT$11,400 |

> **P/FCF 說明**：TSMC 當前 P/FCF（~55x）偏高，主因 2025-2026 年處於 CapEx 高峰期（$38-56B/年），壓縮 FCF。2028E CapEx 回落至 ~$48B 後，FCF 將正常化至 ~$64B，屆時 P/FCF 降至 ~25x——顯著低於 AI 同業。因此 P/FCF 估值須以正常化 FCF 為基礎，而非當前異常值。

**公允價值區間（三角交叉驗證）**：

三種方法取交集後，TSMC 公允價值區間約 **NT$9,500–11,700**，中位數約 **NT$10,500–11,000**。當前股價（~NT$1,050/ADR 換算約 NT$10,500）位於公允價值中位數附近，反映市場已合理定價基本面，但尚未完全反映 AI 超級週期的上行潛力。

### WACC 分解

| 組成項目 | 數值 | 說明 | 出處 |
|---------|------|------|------|
| 無風險利率 (Rf) | 4.3% | 美國 10 年期公債殖利率（2026-03） | [U.S. Treasury](https://www.treasury.gov/resource-center/data-chart-center/interest-rates/) |
| 股權風險溢價 (ERP) | 5.5% | Damodaran 全球 ERP 估計 | [Damodaran Online](https://pages.stern.nyu.edu/~adamodar/) |
| Beta (β) | 0.85 | TSMC ADR (TSM) 5 年月 beta；較純週期性半導體低，因代工模式分散風險 | [Yahoo Finance](https://finance.yahoo.com/quote/TSM/key-statistics/) |
| 股權成本 (Ke) | 4.3% + 5.5% × 0.85 = **9.0%** | CAPM 計算 | 計算值 |
| 台灣地緣政治風險溢價 | +0~2% | 視情境而定（現狀 ~0%，緊張 +1-2%） | 分析師慣例 |
| **WACC（合理情境）** | **9.0%** | 淨現金企業，無需債務成本調整 | 計算值 |
| **WACC（保守情境，含地緣溢價）** | **10.0-11.0%** | 納入台海風險升溫 | 計算值 |

> TSMC 為淨現金企業（2024 年底淨現金 ~$48B），負債比率極低，WACC 可近似等於股權成本。終值成長率 3.5% 反映 AI 驅動的半導體長期結構性需求成長（代工市場 2025-2035 CAGR ~12%，[GM Insights](https://www.gminsights.com/industry-analysis/semiconductor-foundry-market)），高於傳統半導體業 2-3% 假設但低於近年 AI 超級週期的 30%+ 成長率。

### 3×3 敏感度矩陣（營收成長率 vs. WACC）

以 2026E 為基準年，計算不同營收成長與 WACC 組合下的隱含每股公允價值（NT$）：

| WACC ↓ \ 2026E 營收成長 → | 25%（$144B） | 30%（$150B） | 35%（$155B） |
|---------------------------|-------------|-------------|-------------|
| **8%** | 11,200 | 12,100 | 12,800 |
| **9%**（基準） | 9,800 | **10,800** | 11,500 |
| **10%** | 8,700 | 9,600 | 10,300 |

> **矩陣解讀**：在基準假設（30% 營收成長、9% WACC）下，隱含公允價值約 NT$10,800，與 P/E 法（25x × 439 = NT$10,975）一致。若地緣風險推升 WACC 至 10%（+1% 溢價），公允價值下修至 ~NT$9,600（下行 ~11%）。若 AI 需求超預期（35% 成長）且地緣緩和（WACC 8%），上行空間達 NT$12,800（+19%）。

### P/E 估值敏感度分析

| P/E \ EPS (NT$) | 377（保守） | 439（合理） | 472（樂觀） |
|-----------------|-----------|-----------|-----------|
| 20x | 7,540 | 8,780 | 9,440 |
| 25x | 9,425 | 10,975 | 11,800 |
| 30x | 11,310 | 13,170 | 14,160 |

> **結論**：以三種估值方法交叉驗證，TSMC 公允價值區間約 **NT$9,500–11,700**，中位數 **~NT$10,800**。P/E 法（25x × 439）、EV/EBITDA 法（18-20x）與正常化 P/FCF 法（25-30x × 2028E FCF）指向一致的估值區間。合理情境三年 IRR ~18%。TSMC 的 EV/EBITDA（~20x）與 P/FCF（正常化 ~25x）均顯著低於 AI 半導體同業均值（EV/EBITDA ~39x），反映**台灣折價**（Taiwan Discount）——PEG 比率約 1.0x，較資訊科技產業（~1.9x）折價 48%（[來源：ainvest](https://www.ainvest.com/news/taiwan-semiconductor-manufacturing-tsm-geopolitical-undercurrents-driving-discount-2505/)）。風險在於台海地緣升溫壓縮 P/E 至 20x 以下；機會在於 AI 推理端爆發速度超預期推升 HPC 佔比至 60%+ 與 N2 良率超預期推升毛利率至 63%+。

---

# 三、組織

## 3.1 組織文化與激勵機制

TSMC 的組織文化深受創辦人 Morris Chang 影響，以「誠信正直」（Integrity）、「承諾」（Commitment）、「創新」（Innovation）、「客戶信任」（Customer Trust）為核心價值。這一文化體系不僅是口號，更透過具體的人才策略、激勵制度與逆勢投資得以實踐。

### 人才策略與員工規模

截至 2024 年 12 月 31 日，TSMC 全球員工總數達 **83,825 人**，較前一年增加 7,347 人（+9.6%）。公司在台灣擁有 12 座 300mm 晶圓廠、4 座 200mm 廠，加上美國、日本、中國等海外據點，是台灣最大的私人僱主之一。（[來源：TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf)；[TweakTown, 2024](https://www.tweaktown.com/news/104783/tsmc-has-24-semiconductor-fabs-under-construction-worldwide-83-825-employees-in-total/index.html)）

TSMC 的年度員工離職率維持在 **4-5%** 的低水準，遠低於全球半導體產業平均（~10-15%）。即便在 2021 年全球科技人才爭奪戰最激烈時期，TSMC 整體離職率也僅 6.8%——但新進員工離職率較高（17.6%），反映了晶圓廠高強度輪班工作的適應挑戰。（[來源：Taiwan News, 2022-07-02](https://www.taiwannews.com.tw/news/4586957)；[TSMC ESG Report](https://esg.tsmc.com/en-US/sustainability-roles/admired-employer)）

Morris Chang 對人才的重視是 TSMC 文化的基石。他曾在 Brookings 演講中強調台灣工程師的獨特優勢：「Dedicated engineers are Taiwan's advantage.」他更具體指出 TSMC 的地理優勢：「TSMC's three manufacturing centers often have thousands of engineers whose location assignment changes but who do not have to move their family.」——台灣的地理緊湊性使工程師調度效率遠高於美國分散的廠區。（[來源：Brookings Institution, 2022-04](https://www.brookings.edu/wp-content/uploads/2022/04/Vying-for-Talent-Morris-Chang-20220414.pdf)）

Chang 在 Acquired 播客中分享了一個反直覺的裁員原則，展現對人才的珍視：「People will not respect us if we lay off by performance ratings. Because it's very subjective.」他更進一步：「If you need the people back within a year, you shouldn't lay off.」——2008-2009 金融危機期間，這一哲學使 TSMC 保留了核心團隊，為後續技術爆發儲備了人才。（[來源：Acquired Podcast, 2025-01](https://www.acquired.fm/episodes/tsmc-founder-morris-chang)）

### 薪酬結構與利潤分享

TSMC 的薪酬體系由「固定薪資 + 績效獎金 + 員工分紅」三層構成，其中員工分紅（profit sharing）是最重要的激勵工具。根據 TSMC 公司章程，年度盈餘的**不低於 1%** 須撥為員工分紅，董事酬勞則不超過 0.3%。（[來源：TSMC 2024 Annual Report](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf)；[TSMC PR, 2024](https://pr.tsmc.com/english/news/3104)）

2024 年度員工分紅總額為 **NT$703 億**（約 $21 億美元），以現金發放，於 2025 年 7 月分配——這一金額反映了 TSMC 在 AI 超級週期中的歷史性獲利。相較之下，2023 年分紅約 NT$534 億，年增約 32%。（[來源：TSMC 2025 AGM Agenda](https://investor.tsmc.com/sites/ir/shareholders-meeting/2025-06-03/2025AGM_Agenda_wmn.pdf)；[SemiWiki Forum](https://semiwiki.com/forum/threads/tsmc-board-of-directors-meeting-resolutions-2024.19576/)）

CFO Huang 在年報中解釋了 G&A 支出大幅增長的原因：「The increase in G&A was driven by overseas fab startup costs and employee profit sharing.」——2024 年 G&A 年增 35.6%（NT$25,425M），其中員工分紅因淨利大增而同步上揚。（[來源：TechSoda](https://techsoda.substack.com/p/explainer-tsmcs-2024-annual-report)）

### 股權激勵——限制型股票（RSA）與 ESG 連結

TSMC 自 2022 年起實施限制型股票獎勵（Restricted Stock Awards, RSA），取代過去的認股權證。2023 年度核發 **2,960,000 股** RSA；2024 年度授權發行上限為 **4,185,000 股**（普通股）。值得注意的是，RSA 數量設有 ESG 調節機制——薪酬與人力發展委員會根據公司 ESG 成就可上下調整最多 10%，使高管激勵與永續發展目標直接掛鉤。（[來源：TSMC PR, 2024](https://pr.tsmc.com/english/news/3104)；[Abachy, 2024](https://abachy.com/news/tsmc-board-directors-approves-key-resolutions-2024-meeting)）

此外，TSMC 設有員工持股信託（Employee Stock Ownership Trust, ESOT），鼓勵員工長期持有公司股票。薪酬結構另包含津貼、現金獎金、學費補助、推薦獎金、員工購股計畫（ESPP）與退休金。（[來源：TSMC ESG Report](https://esg.tsmc.com/en-US/sustainability-roles/admired-employer)）

### 全球化文化建設——跨文化管理的挑戰與回應

隨著 TSMC 海外擴張加速（美國、日本、德國），跨文化管理成為核心挑戰。2024 年 TSMC 推出「跨文化學習計畫」（Intercultural Learning Program），圍繞跨文化意識、適應力、包容性領導等八大主題，培訓全球員工。同年推出的「tFlex 全球彈性福利計畫」為每位全職員工提供 **US$250/年** 的彈性福利點數，涵蓋醫療保險、家庭照顧、健康、發展與志工四大類別。截至 2024 年 11 月，已收到 81,828 筆申請，總額約 **NT$47 億**。（[來源：TSMC ESG Report](https://esg.tsmc.com/en-US/sustainability-roles/admired-employer)；[TSMC ESG Articles](https://esg.tsmc.com/en-US/articles/334)）

C.C. Wei 在 CommonWealth 專訪中闡述全球化願景：「Turning Taiwan's TSMC into the World's TSMC.」——這不僅是產能佈局的全球化，更需要組織文化的國際化。（[來源：CommonWealth Magazine, 2025-07-10](https://english.cw.com.tw/article/article.action?id=4215)）

Wei 在 Fortune 專訪中以謙遜的團隊觀詮釋組織力量：「The semiconductor industry has never fought alone. Our success is built on the joint efforts of our colleagues, our customers, and our suppliers.」——這一觀點既是對外部夥伴的致敬，也是對 83,000+ 員工的肯定。（[來源：Fortune Asia, 2025-07-30](https://fortune.com/asia/2025/07/30/tsmc-ai-boom-cc-wei-wendell-huang-global-500/)；[transcripts/CC_Wei_2025_Fortune_Asia.md](transcripts/CC_Wei_2025_Fortune_Asia.md)）

### 逆勢擴張案例

2023 年全球半導體景氣低迷、消費電子需求疲軟，多數同業縮減投資。TSMC 卻維持高資本支出不減（全年 CapEx ~NT$850B / ~$28B），持續建設美國亞利桑那廠、日本熊本廠。Wei 親訪所有 CSP 後確認需求真實（詳見 2.1 轉折四）。

這一逆週期投資策略確保 TSMC 在 2024 年 AI 需求爆發時擁有充足產能，營收跳升 34%。SIA（半導體產業協會）2024 年授予 Wei 與 Mark Liu（前董事長）最高榮譽——Robert N. Noyce Award，肯定兩人對全球半導體產業的卓越貢獻。（[來源：SIA](https://www.semiconductors.org/tsmcs-dr-c-c-wei-and-dr-mark-liu-to-receive-sias-highest-honor/)）

## 3.2 運營效率

**ROIC、ROE 與槓桿效率**：

TSMC 的資本回報率在半導體產業中名列前茅。2025 年 ROIC 達 41.5%——對於一家年度資本支出超過 $380 億美元的企業而言，這一水準極為罕見。

| 指標 | 2025 | 2024 | 2023 | 2022 | 2021 | 出處 |
|------|------|------|------|------|------|------|
| **ROIC** | 41.5% | 30.9% | 25.2% | 37.3% | 28.7% | [Stock Analysis Ratios](https://stockanalysis.com/stocks/tsm/financials/ratios/) |
| **ROE** | 35.2% | 29.9% | 26.7% | 39.2% | 29.7% | [Stock Analysis Ratios](https://stockanalysis.com/stocks/tsm/financials/ratios/) |
| **ROA** | 22.3% | 17.8% | 15.3% | 22.4% | 17.9% | [Stock Analysis Ratios](https://stockanalysis.com/stocks/tsm/financials/ratios/) |
| 毛利率 | 59.9% | 56.1% | 54.4% | 59.6% | 51.6% | [Stock Analysis](https://stockanalysis.com/stocks/tsm/financials/) |
| 營業利益率 | 50.8% | 45.7% | 42.6% | 49.5% | 41.0% | [Stock Analysis](https://stockanalysis.com/stocks/tsm/financials/) |
| 淨利率 | 45.1% | 40.0% | 39.4% | 43.9% | 37.3% | [Stock Analysis](https://stockanalysis.com/stocks/tsm/financials/) |

**Operating Leverage 分析**：

2021→2025 營收成長 140%（NT$1.59T→NT$3.81T），淨利成長 190%（NT$592B→NT$1,718B），顯示顯著的 operating leverage。毛利率從 51.6% 提升至 59.9%、營業利益率從 41.0% 提升至 50.8%——營收成長速度持續超過費用成長。ROIC 從 2023 年低點 25.2% 躍升至 2025 年 41.5%，反映 AI 需求爆發帶來的資本效率大幅改善。

Huang 確認長期毛利率下限 53%（詳見 2.3），當前 60%+ 的毛利率反映先進製程的超額定價能力。

Wei 從需求面解釋了 ROIC 為何持續改善：「AI demand actually continue to be very strong, it's more — more stronger than we thought 3 months ago.」「The demand on leading edge semiconductor is real.」（[來源：TSMC Q3 2025 Transcript](https://www.fool.com/earnings/call-transcripts/2025/10/17/tsmc-tsm-q3-2025-earnings-call-transcript/)）

Huang 對資本支出的回報預期直言不諱：「A higher level of CapEx is always correlated with higher growth opportunities. If we do our job right, the growth of our business should outpace the growth of the CapEx.」——意味著即便 2026 年 CapEx 達 $52-56B，ROIC 仍有望維持在 30%+。（[來源：TSMC Q3 2025 Transcript](https://www.fool.com/earnings/call-transcripts/2025/10/17/tsmc-tsm-q3-2025-earnings-call-transcript/)；[The Next Platform, 2026-01-16](https://www.nextplatform.com/compute/2026/01/16/tsmc-has-no-choice-but-to-trust-the-sunny-ai-forecasts-of-its-customers/4092173)）

Morris Chang 早年設定的 R&D 8% 紀律是資本效率的基石——固定比例的研發投入避免了短期思維對長期技術領先的侵蝕（詳見 1.3 節 Morris Chang R&D 紀律）。

**資本效率**：
- CapEx/Revenue 比率：2024 年約 34%，2025 年約 33%，2026E 約 36%——雖為資本密集型，但 41.5% 的 ROIC 證明投資高效
- 客戶預付款（NT$2,911 億/2024 年）有效降低 TSMC 的資本風險，使其在資本密集擴張中仍維持淨現金狀態（[來源：TechSoda](https://techsoda.substack.com/p/explainer-tsmcs-2024-annual-report)）
- 5 年平均 ROIC 約 30.7%，20 年平均約 27.5%——持續超越 WACC（~9%），創造巨大超額價值（[來源：Stock Analysis](https://stockanalysis.com/stocks/tsm/financials/ratios/)）

## 3.3 市場滲透率

| 市場/部門 | TSMC 市佔或滲透率 | 出處 |
|----------|-------------------|------|
| 全球晶圓代工（整體） | ~60% | [TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf) |
| 先進製程代工（7nm 以下） | >90% | [TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf) |
| AI 加速器晶片代工 | ~95%+ | 幾乎所有主要 AI 晶片（NVIDIA、AMD、Broadcom、Google TPU）均由 TSMC 製造 |
| EUV 製程產能 | >80% | TSMC 擁有全球最多 EUV 光刻機（ASML 出貨超過半數予 TSMC） |

TSMC 在日本（JASM 熊本廠）、美國（亞利桑那 3 座廠規劃）、歐洲（德國德勒斯登）的佈局代表了地理滲透率的提升，旨在服務當地客戶需求並降低地緣政治風險。

---

# 四、人

## 4.1 CEO/創業家

### Morris Chang（張忠謀）——創辦人，「半導體代工之父」

**學經歷**：Morris Chang 1931 年生於中國浙江寧波，1949 年赴美求學。他在哈佛大學就讀一年後轉學至麻省理工學院（MIT），獲得機械工程學士與碩士學位。後於史丹佛大學取得電機工程博士學位。

**早期職涯與重要拐點**：Chang 回顧自己的成長背景時說：「The early part of my life between birth and 18, the background was war, poverty, injustice.」——在戰亂中度過的童年塑造了他日後堅韌的性格。（[來源：Synergy Startup Substack](https://synergystartup.substack.com/p/tsmc-the-untold-story-of-morris-chang)；[transcripts/Morris_Chang_Early_Career_Untold_Story.md](transcripts/Morris_Chang_Early_Career_Untold_Story.md)）

1955 年，Chang 進入 Sylvania Semiconductor，開啟半導體職涯。三年後他意識到：「Sylvania wasn't going anywhere in semiconductors.」（[來源：Synergy Startup Substack](https://synergystartup.substack.com/p/tsmc-the-untold-story-of-morris-chang)）1958 年轉投德州儀器（TI），從工程師做起，歷經 25 年升至全球半導體業務副總裁。在 TI 期間，他主導了多項製程創新，深刻理解半導體製造的規模經濟與學習曲線效應。1983 年離開時，他坦言：「I left TI without any job offer, and I left because I felt that essentially I had been put out to pasture at TI.」（[來源：Synergy Startup Substack](https://synergystartup.substack.com/p/tsmc-the-untold-story-of-morris-chang)）短暫任職 General Instrument 後（「General Instrument was mainly about acquisitions, mergers...it was just very different from what I was used to at Texas Instruments.」），1985 年應台灣政府之邀回台擔任工研院院長，兩年後創辦 TSMC。

**創辦 TSMC 的決策邏輯**：1985 年 Chang 離開 TI（他形容自己被「put out to pasture」），應台灣政府之邀回台，先擔任工研院院長。1987 年他創辦 TSMC，開創「純晶圓代工」模式。Morris Chang 曾回憶：「I wanted to establish a company that would be the foundry for the world's semiconductor industry. At that time, there was no such company.」——他看到的是：隨著 IC 設計成本下降而製造成本飆升，將出現大量 fabless 設計公司需要專業代工服務。他在自傳中寫道：「When I founded a semiconductor company, there was only one path: to make it a world-class one.」（[來源：CommonWealth Publishing, 2024-12-02](https://english.cw.com.tw/article/article.action?id=3849)）

**與 Apple 的關係建立**：Chang 在自傳第二冊中披露了 TSMC 贏得 Apple 訂單的關鍵過程。2010 年 11 月 9 日，鴻海創辦人郭台銘將時任 Apple 營運長 Jeff Williams 介紹給 Chang。Williams 當場表達 Apple 希望 TSMC 製造 iPhone 邏輯晶片的意願。2011 年 4 月，Chang 赴矽谷拜訪 Tim Cook，Cook 告訴他不用擔心 Intel 的競爭：Tim Cook 的原話暗示「Intel is not good at doing dedicated foundry service.」Chang 在自傳中對此加註了自己的代工哲學：「Unwilling to take the price that customers can afford means the same that they were not good at doing dedicated foundry service. What TSMC is good at is making reasonable profits out of the price that is acceptable to the customer.」（[來源：TechSoda, Morris Chang 自傳解析](https://techsoda.substack.com/p/tsmc-founder-morris-changs-autobiography)）

Chang 在 Apple 產能分配談判中展現了他的財務紀律：「I decided that I would take half of what Apple asked for... He said, well, I think you can eliminate your dividend. Your shareholders will understand that. I said, well, no.」——即使面對最大客戶的巨大訂單，他也拒絕犧牲股東利益來換取短期成長。他也果斷拒絕了 IBM 的聯合研發提案：「IBM still consider themselves to be the senior partner in any partnership they established... We declined without having to think about it at all.」——保住 TSMC 的獨立研發路線，避免被 IBM 的合作框架綁定。（[來源：Acquired Briefing, 2025-01](https://www.acquiredbriefing.com/p/the-morris-chang-interview)；[transcripts/Morris_Chang_2025_Acquired_Briefing.md](transcripts/Morris_Chang_2025_Acquired_Briefing.md)）

**與 NVIDIA 的深厚關係與 CEO 繼任邀約**：Chang 與 Jensen Huang 的關係始於 1997 年的一封信。Huang 寄信到新竹，表示 NVIDIA 是一家有前景的小公司。Chang 的原則是：「We should never be negligent in talking to future customers, even if the customer seems very small.」TSMC 不僅接下了訂單，更派出兩名生產計畫人員駐點 NVIDIA 一個月。Chang 在自傳中甚至透露，他曾認真考慮邀請 Jensen Huang 擔任 TSMC CEO 繼任者：「Although I was quite familiar with the talent within the company, there was one person outside the company who, in terms of character, vision, professional experience, and knowledge in semiconductors—across all criteria—was worth considering as a successor for TSMC. I knew I should speak with him, and that person was Jensen Huang.」然而 Huang 婉拒了：「I spent 10 minutes explaining my deep aspirations of TSMC and how TSMC's package for CEO would be much higher than his income at that time, but he had no question and did not refuse me directly, but simply said, 'I already have a job'.」（[來源：TechSoda, Morris Chang 自傳解析](https://techsoda.substack.com/p/tsmc-founder-morris-changs-autobiography)）

**重要成就**：
- 1987 年創立 TSMC，開創純代工模式
- 帶領 TSMC 從初創到全球最大半導體公司（市值超過 $1 兆美元）
- 2005 年退休，2009 年因金融危機復出——復出後做出的一個關鍵決策是解決與 NVIDIA 的爭端。前任 CEO 只願意出價零元和解，Chang 復出後主動提出超過 $1 億美元的和解方案，Jensen Huang「within two days」就接受了。（[來源：Acquired Podcast, 2025-01](https://podscripts.co/podcasts/acquired/tsmc-founder-morris-chang)）
- 2018 年正式退休，交棒 Mark Liu（劉德音）與 C.C. Wei 雙首長制
- 2024 年底出版自傳第二冊，時隔 26 年，回顧 TSMC 1964–2018 年的完整歷程

**成功與失敗的檢討與反思**：

Chang 在多次訪談中展現了深刻的自省。他在 Acquired 播客中談到 2008-2009 金融危機時的裁員決策，分享了一個反直覺的原則：「People will not respect us if we lay off by performance ratings. Because it's very subjective.」更進一步：「If you need the people back within a year, you shouldn't lay off.」——這一人才觀使 TSMC 在危機中保留了核心團隊，為後續的 28nm/EUV 技術爆發儲備了人才。（[來源：Acquired Podcast, 2025-01](https://podscripts.co/podcasts/acquired/tsmc-founder-morris-chang)）

他在多個場合警告全球化正在衰退：「Globalization is almost dead. Free trade is almost dead.」（[來源：Brookings Institution, 2022-04](https://www.brookings.edu/wp-content/uploads/2022/04/Vying-for-Talent-Morris-Chang-20220414.pdf)）——這一判斷直接推動了 TSMC 的全球分散製造策略。

他也坦率談論自己的身份認同：「My identity has always been an American. There is nothing else.」但同時他也不諱言：「I am from the United States, and my dream is to build a wafer fab in the United States.」——這種身份的複雜性折射出 TSMC 在美中地緣政治中的獨特處境。（[來源：Andy Lin's Blog, 2024-12-28](https://www.granitefirm.com/blog/us/2024/12/28/morris-changs-controversial/)）

Chang 將 TSMC 的成功歸結為兩個核心因素：「a pioneering business model executed to perfection and relentless innovation through proprietary technologies.」（[來源：CommonWealth Publishing, 2024-12-02](https://english.cw.com.tw/article/article.action?id=3849)）

**誠信治理——Morris Chang 的不可妥協底線**：

TSMC 的誠信文化不是掛在牆上的標語，而是 Morris Chang 數十年親自執行的底線。他在 2005 年接受《遠見雜誌》專訪時明言：「TSMC's executives are refrained from being anxious for quick success… I try my best to trickle down core company value — Integrity — from the top down.」——他將「由上而下灌輸誠信」視為 CEO 最核心的責任。（[來源：Global Views Monthly / Culc Hsin Hsin Blog, 2005](https://exampleof2015.wordpress.com/2016/03/03/integrity-we-should-carry-on-throughout-all-of-our-life/)）

當被問及若高管違反誠信原則如何處理時，Chang 毫不猶豫：「If there is any executive violating this very principle, with a very heavy heart I must personally handle the situation and ask him/her to resign.」——「很沈重的心情」但「必須親自處理」，這一執行力賦予了 TSMC 誠信文化真正的威懾力。（[來源：Global Views Monthly, 2005](https://exampleof2015.wordpress.com/2016/03/03/integrity-we-should-carry-on-throughout-all-of-our-life/)）

Chang 更將 TSMC 的終極願景描述為：「It is my goal to make TSMC the pure land of maintaining the core value of the society.」——「淨土」二字折射出他對企業道德的極高自我要求，超越了一般公司治理的框架。（[來源：Global Views Monthly, 2005](https://exampleof2015.wordpress.com/2016/03/03/integrity-we-should-carry-on-throughout-all-of-our-life/)）

這一文化的制度化成果顯著：TSMC 連續 11 年（至 2025 年）在台灣證交所「公司治理評鑑」中名列前 5%；2025 年全球 77,293 名員工完成年度誠信與合規訓練，考試通過率 100%。公司設有 Ombudsmen 制度（吹哨者通道），由高階主管與稽核直接向董事會報告。（[來源：TSMC IR Corporate Governance](https://investor.tsmc.com/english/corporate-governance-officer)；[TSMC 2024 AR Ch.7](https://investor.tsmc.com/static/annualReports/2024/english/pdf/2024_tsmc_ar_e_ch7.pdf)）

---

### C.C. Wei（魏哲家）——現任董事長兼 CEO

**學經歷**：魏哲家 1953 年出生於台灣南投縣鹿谷鄉，在台中就讀台中一中。大學與碩士就讀於國立交通大學電機工程系。隨後赴美，於耶魯大學（Yale University）取得電機工程博士學位（1985 年），博士論文題目為「RF Plasma Damage in MOS Structures」，指導教授為馬佐平（Tso-Ping Ma）教授。（[來源：Wikipedia - Che-Chia Wei](https://en.wikipedia.org/wiki/Che-Chia_Wei)）

**早期職涯**：取得博士後，Wei 先後任職於德州儀器（Texas Instruments）擔任技術官員，以及意法半導體（STMicroelectronics）與特許半導體（Charter Semiconductor）擔任技術副總裁。他在多家公司累積了豐富的半導體製造與技術管理經驗。

**加入 TSMC 與晉升之路**：1998 年 2 月加入 TSMC 擔任副總裁。隨後歷任：
- 2012 年 3 月：共同營運長（Co-COO）
- 2013 年 11 月：總裁兼共同 CEO（與 Mark Liu 搭檔）
- 2018 年 6 月：CEO（Morris Chang 正式退休後接任）
- 2024 年 6 月：董事長兼 CEO（接替 Mark Liu 董事長職位）

Morris Chang 曾高度評價 Wei：「He went through all three departments—so I call him the best-prepared CEO.」——指的是 Chang 在 2009 年刻意將 Wei 從技術部門調至業務開發部門，讓他歷練技術、製造、業務三大核心領域。（[來源：Wikipedia, CommonWealth Magazine](https://en.wikipedia.org/wiki/Che-Chia_Wei)）

**重要成就**：
- 帶領 TSMC 從 2018 年營收 NT$1 兆成長至 2025 年 NT$3.8 兆（3.8 倍）
- 主導 TSMC 全球化擴張：美國亞利桑那（$1,650 億總投資）、日本熊本（JASM）、德國德勒斯登
- 2024 年 9 月，獲 Time 雜誌評選為「AI 領域百大最具影響力人物」
- 2024 年獲 SIA Robert N. Noyce Award（半導體產業最高榮譽）
（[來源：SIA](https://www.semiconductors.org/tsmcs-dr-c-c-wei-and-dr-mark-liu-to-receive-sias-highest-honor/), [Time](https://en.wikipedia.org/wiki/Che-Chia_Wei)）

**管理哲學與格局觀**：

Wei 的管理風格被描述為務實、低調但堅定——他出身南投鹿谷鄉村，始終保有接地氣、直率甚至帶些自嘲的本色。CommonWealth Magazine 在 2024 年的領導力專題中形容他擁有「unorthodox leadership style」——不同於前任的學者氣質，Wei 以坦率與幽默贏得團隊的信任。他曾坦言選擇在 TSMC 深耕的原因極為質樸：「When looking for a job, you have to choose your boss first, and I had a great boss.」——指的是 Morris Chang 對他的長期栽培。（[來源：CommonWealth Magazine, 2024-06-03](https://english.cw.com.tw/article/article.action?id=3710)；[SemiWiki — CC Wei Wiki](https://semiwiki.com/wikis/industry-wikis/dr-c-c-wei-wiki/)）

Wei 在 2025 年 CommonWealth Magazine 專訪中闡述全球化願景：「Turning Taiwan's TSMC into the World's TSMC.」——反映他在地緣政治壓力下，主動將 TSMC 從「台灣的 TSMC」轉型為「世界的 TSMC」的戰略思維。（[來源：CommonWealth Magazine, 2025-07-10](https://english.cw.com.tw/article/article.action?id=4215)）

2023 年 10 月，Wei 回到母校耶魯大學在 Yale Science Building 發表演講，對年輕人分享了他的人才觀：「The U.S. is the country with the most talented and innovative people, especially for the Ivy League student.」——但他同時也指出 TSMC 在亞利桑那建廠面臨的實際限制：美國缺乏足夠的現場半導體工程師，這正是 TSMC 選擇有較大技術人才池的 Arizona 的原因。（[來源：Yale Daily News, 2023-10-05](https://yaledailynews.com/blog/2023/10/05/taiwan-semiconductor-ceo-c-c-wei-speaks-at-the-yale-science-building/)）

面對 Trump 對台灣的政治言論，Wei 展現不受干擾的定力：「We did not change any of our original plan of expansion of our overseas fab. We continue to expand in Arizona, in Kumamoto and maybe in future in Europe. No change to our strategy.」（[來源：The Register, 2024-07-18](https://www.theregister.com/2024/07/18/tsmc_ceo_predicts_ai_chip/)）

對 AI 時代的判斷，Wei 精準指出無論 GPU 或 ASIC 路線都離不開 TSMC 先進製程（詳見 2.2）。

面對競爭，Wei 在 2026 年 1 月法說中對 Intel Foundry 的追趕保持冷靜自信：「In the development of semiconductor technology to this point, receiving investment has not helped to improve competitiveness, right?」——直言砸錢無法買到競爭力，技術領先需要時間、人才與文化的長期累積。被問及是否擔心 Intel 的進展時，他僅回答「Not worried」。（[來源：WCCFTech, 2026-01](https://wccftech.com/tsmcs-ceo-says-intel-foundry-wont-be-competitive-by-just-throwing-money/)）

**誠信與治理——延續 Chang 的底線**：Wei 在接任後明確承諾延續 TSMC 的誠信治理。他強調「no matter where TSMC conducts business in the world, it will abide by the highest standards of corporate governance, stick to the bottom line of integrity.」——這一表態不僅是對內部的宣示，更是對全球客戶的承諾：TSMC 的純代工模式意味著客戶的智財安全是公司存在的基礎。（[來源：Ventron Chip, 2024](https://www.ventronchip.com/news/tsmc-completes-leadership-handover-c.-c.-wei-takes-over-as-chairman.html)）

**成功與反思**：Wei 承接 Morris Chang 的遺產，但面臨的挑戰截然不同——地緣政治、AI 爆發、全球建廠。他在美國建廠的決策既是回應客戶與政治壓力，也是 TSMC 史上最大的管理挑戰（跨文化管理、成本控制、人才招募）。初期亞利桑那廠曾傳出文化衝突與工期延誤，Wei 需持續證明 TSMC 能在台灣以外複製其製造紀律。在 2022 年 12 月 Monte Jade Science and Technology Association 活動中，Wei 以「New Challenges in the Semiconductor Industry」為題發表演講，闡述 TSMC 面對供應鏈重組與地緣變局的策略——他坦言 CapEx 的調整（2022 年從 $420 億削減至 $360 億）背後的考量複雜，但拒絕公開披露細節，展現了他務實謹慎的一面。（[來源：Digitimes, 2022-12-22](https://www.digitimes.com/news/a20221222VL206/japan-tsmc.html&chid=12)）

### 繼任風險與板凳深度

**CEO 年齡與任期**：C.C. Wei 生於 1953 年，截至 2026 年 3 月已 72-73 歲。他於 1998 年加入 TSMC 任副總裁（任期 28 年），2018 年接任 CEO（任期 8 年），2024 年 6 月起兼任董事長——成為 TSMC 自 Morris Chang 以來首位同時擔任 Chairman & CEO 的領導人。Wei 的年齡意味著繼任議題在未來 3-5 年內將成為投資人的核心關注點。（[來源：Wikipedia — Che-Chia Wei](https://en.wikipedia.org/wiki/Che-Chia_Wei)；[TSMC Board of Directors](https://investor.tsmc.com/english/board-of-directors)）

**次世代領導人——雙 Co-COO 結構**

TSMC 於 2024 年 3 月正式任命兩位 Co-COO（共同營運長），複製了 2012-2013 年 Wei 與 Mark Liu 的「雙首長預備制」——當年兩人以 Co-COO 身份歷練，最終分別接任 CEO 與董事長。這一組織安排被 Bloomberg 與 SCMP 一致解讀為「readies succession plan」（啟動繼任計畫）。（[來源：SCMP, 2024-02-29](https://www.scmp.com/tech/big-tech/article/3253686/tsmc-promotes-two-veterans-share-coo-role-worlds-largest-contract-chipmaker-readies-succession-plan)；[Bloomberg / Yahoo Finance, 2024-02-29](https://finance.yahoo.com/news/tsmc-elevates-two-veterans-coo-085515237.html)）

**領導人一：Dr. Y.J. Mii（米玉傑）——EVP & Co-COO（R&D 路線）**

| 項目 | 內容 |
|------|------|
| 現職 | Executive Vice President & Co-Chief Operating Officer（2024 年 3 月起） |
| 負責領域 | 研發組織，主導製程技術開發（N16→N7→N5→N3→N2 及更先進節點） |
| TSMC 任期 | 1994 年加入，31 年（Fab 3 經理→2001 年轉入 R&D→2011 年 VP R&D→2016 年 SVP R&D→2024 年 EVP Co-COO） |
| 學歷 | 美國加州大學洛杉磯分校（UCLA）電機工程博士 |
| 前職 | IBM Research Centre |
| 榮譽 | 2022 年 IEEE Frederik Philips Award（表彰 R&D 管理卓越成就），全球 34 項專利 |
| 強項 | 深厚的製程研發經驗，主導了 TSMC 從 16nm 到 3nm 每一代先進節點的開發；是 TSMC 技術領先的核心推手 |
| 副手 | Dr. Kevin Zhang（SVP Business Development & Deputy Co-COO） |

（[來源：SCMP, 2024-02-29](https://www.scmp.com/tech/big-tech/article/3253686/tsmc-promotes-two-veterans-share-coo-role-worlds-largest-contract-chipmaker-readies-succession-plan)；[TSMC 2024 Annual Report](https://investor.tsmc.com/static/annualReports/2024/english/ebook/files/basic-html/page38.html)；[SEMICON China — Dr. Kevin Zhang](https://www.semiconchina.org/en/634)）

**領導人二：Y.P. Chyn（秦永沛）——EVP & Co-COO（營運路線）**

| 項目 | 內容 |
|------|------|
| 現職 | Executive Vice President & Co-Chief Operating Officer（2024 年 3 月起） |
| 負責領域 | 台灣與海外所有晶圓廠的營運與管理；共同領導海外營運辦公室（Overseas Operations Office） |
| TSMC 任期 | **1987 年創辦即加入**，39 年（TSMC 最資深現任主管之一）——1997-1998 年 Fab 1 廠長→歷任良率提升、特殊技術開發→SVP Operations→2024 年 EVP Co-COO |
| 學歷 | 國立成功大學電機工程碩士 |
| 前職 | 工研院電子所（ERSO-ITRI） |
| 強項 | 創建 TSMC「Golden Spice Modeling」方法論與 Design for Manufacturing（DFM）計畫；主導 28nm/16nm/7nm 每一代的良率爬升；39 年深耕使其對 TSMC 營運文化有無人可比的理解 |
| 副手 | Cliff Hou（SVP Europe & Asia Sales） |

（[來源：SCMP, 2024-02-29](https://www.scmp.com/tech/big-tech/article/3253686/tsmc-promotes-two-veterans-share-coo-role-worlds-largest-contract-chipmaker-readies-succession-plan)；[Taipei Times, 2024-03-01](https://www.taipeitimes.com/News/biz/archives/2024/03/01/2003814261)；[The Org — Y.P. Chyn](https://theorg.com/org/tsmc/org-chart/y-p-chyn)）

**其他關鍵高階主管**：

| 姓名 | 現職 | 背景與強項 | 出處 |
|------|------|----------|------|
| Dr. Kevin Zhang | SVP Business Development & Deputy Co-COO | 前 Intel Fellow（2005）、Intel 技術與製造集團副總裁；80+ 論文、55 項美國專利；負責全球業務策略與客戶接洽 | [SEMICON China](https://www.semiconchina.org/en/634) |
| Cliff Hou | SVP Europe & Asia Sales, Deputy Co-COO | 負責歐亞銷售與客戶關係管理 | [SCMP, 2024](https://www.scmp.com/tech/big-tech/article/3253686/tsmc-promotes-two-veterans-share-coo-role-worlds-largest-contract-chipmaker-readies-succession-plan) |
| Lora Ho | SVP Corporate Strategy Development & Sustainability | 原 SVP Human Resources，2025 年擴大職責至企業策略發展；TSMC ESG 推動核心人物 | [TrendForce, 2025-07-29](https://www.trendforce.com/news/2025/07/29/news-tsmcs-senior-executive-wei-jen-lo-retires-after-21-years-marking-leadership-transition/) |
| Wendell Huang（黃仁昭） | VP & CFO | TSMC 財務長，法說會核心發言人；定義「六因素毛利率框架」，掌握全球投資決策的財務紀律 | [TSMC IR](https://investor.tsmc.com/english/board-of-directors) |

**板凳深度評級：中高（Medium-High）**

*理由*：
1. **雙 Co-COO 結構明確啟動**：Y.J. Mii（R&D）+ Y.P. Chyn（Operations）完美覆蓋 TSMC 兩大核心能力——技術創新與製造執行——與 2012 年 Wei/Liu 雙軌制如出一轍，是經驗證有效的繼任路徑。
2. **人才梯隊完整**：Kevin Zhang（業務/客戶）、Cliff Hou（銷售）、Lora Ho（策略/ESG）、Wendell Huang（財務）構成完整的 C-suite 支撐體系。
3. **資歷深度無可匹敵**：Chyn 自 1987 年創辦即在（39 年），Mii 自 1994 年（31 年），兩人對 TSMC 文化、技術、客戶關係的理解深度極為罕見。
4. **風險因素**：(a) 近期高層流動加速——2025 年 Wei-Jen Lo（SVP 企業策略）、J.K. Lin（SVP）、Douglas Yu（VP R&D，「六騎士」之一）、Rick Cassidy（SVP，亞利桑那廠前董事長）相繼退休或離職；(b) Wei 同時兼任 Chairman & CEO，交班時程尚未公開揭露；(c) 全球化擴張需要具國際管理經驗的下一代領導人，Co-COO 二人均以台灣經歷為主。

**繼任計畫揭露狀態**：TSMC 未正式公開具體繼任時間表，但 2024 年 3 月的 Co-COO 任命被多家國際媒體（Bloomberg、SCMP、Digitimes）一致解讀為「succession move」。這一模式與 Morris Chang 2012 年培養 Wei/Liu 的做法完全一致——先以 Co-COO 歷練 2-3 年，再分別晉升。預期在 Wei 任期的最後 2-3 年（約 2027-2028）將有更明確的交棒安排浮現。（[來源：Bloomberg / Yahoo Finance, 2024-02-29](https://finance.yahoo.com/news/tsmc-elevates-two-veterans-coo-085515237.html)；[Digitimes, 2024-02-29](https://www.digitimes.com/news/a20240229PR201/tsmc-ic-manufacturing-r_d-taiwan.html)）

## 4.2 公開訪談清單

### 法說逐字稿（Earnings Call Transcripts）

| 序號 | 標題 | 日期 | 核心洞見 | 逐字稿 |
|------|------|------|---------|--------|
| 1 | [TSMC Q1 2024 Earnings Call](https://investor.tsmc.com/chinese/encrypt/files/encrypt_file/reports/2024-04/34ff75e23e53246302ce3a8d90d0423c57c6b120/TSMC%201Q24%20Transcript.pdf) | 2024-04 | 2024 年半導體復甦開始，AI 需求拉動先進製程 | PDF |
| 2 | [TSMC Q2 2024 Earnings Call](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2024-08/5122725a56670882d777a8e8bfe0ed247cc55330/TSMC%202Q24%20Transcript.pdf) | 2024-07 | AI 晶片短缺至 2025-2026、CoWoS 產能翻倍、不改全球擴張策略 | PDF |
| 3 | [TSMC Q3 2024 Earnings Call](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2024-10/b474da862d1c24b1aa0c635a9f771261d93d3154/TSMC%203Q24%20Transcript.pdf) | 2024-10 | AI 需求持續強勁，N3 佔營收提升；對 Samsung/Intel 收購果斷說 No | PDF |
| 4 | [TSMC Q4 2024 Earnings Call](https://investor.tsmc.com/chinese/encrypt/files/encrypt_file/reports/2025-01/84aeb15bbe33894365d33f52e027c5268ba95dcf/TSMC%204Q24%20Transcript.pdf) | 2025-01 | 2024 全年回顧，N2 量產準備，$165B 美國投資，A16 量產 2H 2026 | PDF |
| 5 | [TSMC Q2 2025 Earnings Call](https://investor.tsmc.com/chinese/encrypt/files/encrypt_file/reports/2025-07/1f4f86c935f1de837672a6973154e64b26bdae57/TSMC%202Q25%20Transcript.pdf) | 2025-07 | Q2 營收 $301 億美元，AI/HPC 需求持續拉動 | PDF |
| 6 | [TSMC Q3 2025 Earnings Call](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf) | 2025-10 | AI 需求超預期，3nm 佔 23%，token 數量每 3 個月指數成長 | PDF |
| 7 | [TSMC Q4 2025 Earnings Call](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-01/51d09df96cd89ac19d65af39032b038dc2896a24/TSMC%204Q25%20Transcript.pdf) | 2026-01 | 2025 全年回顧，N2 量產進度更新 | PDF |

### Morris Chang 訪談與演講

| 序號 | 標題 | 日期 | 核心洞見 | 逐字稿 |
|------|------|------|---------|--------|
| 8 | [TSMC Founder Morris Chang — Acquired Podcast](https://www.acquired.fm/episodes/tsmc-founder-morris-chang) | 2025-01 | 創業初心、NVIDIA 關係（1997 年 Jensen 來信）、28nm sweet spot、R&D 8% 哲學、資本支出董事會之爭、學習曲線定價、Jensen CEO 繼任邀約 | [transcripts/Morris_Chang_2025_Acquired_Podcast.md](transcripts/Morris_Chang_2025_Acquired_Podcast.md) |
| 9 | [Morris Chang's Last Speech — 半導體歷史與 TSMC 未來](https://interconnected.blog/morris-changs-last-speech/) | 2023-04 | 商業模式本質（「最大的發現是客戶是誰」）、台灣優勢 vs 美國劣勢、「短期補貼無法彌補長期競爭劣勢」、Samsung 是強勁對手但中國尚未構成威脅 | [transcripts/Morris_Chang_2023_Last_Speech.md](transcripts/Morris_Chang_2023_Last_Speech.md) |
| 10 | [Morris Chang — Brookings Institution & CSIS](https://www.brookings.edu/wp-content/uploads/2022/04/Vying-for-Talent-Morris-Chang-20220414.pdf) | 2022-04 | 「Globalization is almost dead. Free trade is almost dead.」美國半導體製造為「expensive exercise in futility」、身份認同 | [transcripts/Morris_Chang_2022_Brookings_CSIS.md](transcripts/Morris_Chang_2022_Brookings_CSIS.md) |
| 11 | [Morris Chang — TSMC 自傳第二冊](https://techsoda.substack.com/p/tsmc-founder-morris-changs-autobiography) | 2024-12 | Apple 關係建立（Jeff Williams→Tim Cook）、Jensen CEO 繼任邀約詳情、NVIDIA 和解「48 小時」最後通牒、ASML 共同成長、代工定價哲學 | 書籍 |
| 12 | [Morris Chang — CommonWealth 半導體論壇](https://english.cw.com.tw/article/article.action?id=3393) | 2023-03 | 台灣在全球晶片產業不可或缺、批評 friendshoring 趨勢 | — |
| 13 | [Morris Chang — Computer History Museum Oral History](https://www.computerhistory.org/collections/catalog/102658129) | 2007 | TI 25 年職涯回顧、學習曲線定價起源、半導體產業早期歷史 | CHM 檔案 |
| 14 | [Morris Chang — CommonWealth 自傳發表](https://english.cw.com.tw/article/article.action?id=3849) | 2024-12-02 | 「When I founded a semiconductor company, there was only one path: to make it a world-class one.」創業心路歷程 | — |

### C.C. Wei 訪談與公開活動

| 序號 | 標題 | 日期 | 核心洞見 | 逐字稿 |
|------|------|------|---------|--------|
| 15 | [TSMC CEO predicts AI chip shortage — The Register](https://www.theregister.com/2024/07/18/tsmc_ceo_predicts_ai_chip/) | 2024-07-18 | CoWoS 翻倍、地緣政治回應、關稅立場、「No change to our strategy」 | — |
| 16 | [The AI boom sends TSMC's importance to new level — Fortune Asia](https://fortune.com/asia/2025/07/30/tsmc-ai-boom-cc-wei-wendell-huang-global-500/) | 2025-07-30 | TSMC 在 AI 時代角色、「半導體業從未單打獨鬥」、全球 500 強 | — |
| 17 | [CC Wei: Turning Taiwan's TSMC into World's TSMC — CommonWealth](https://english.cw.com.tw/article/article.action?id=4215) | 2025-07-10 | 全球化願景轉型、管理哲學 | — |
| 18 | [TSMC $165B US Investment — White House](https://pr.tsmc.com/english/news/3210) | 2025-03 | 與 Trump 共同宣布，「AI is reshaping our daily lives」 | — |
| 19 | [SIA Robert N. Noyce Award — Wei & Liu](https://www.semiconductors.org/tsmcs-dr-c-c-wei-and-dr-mark-liu-to-receive-sias-highest-honor/) | 2024 | 半導體產業最高榮譽 | — |
| 20 | [TSMC Sports Day — Morris Chang & CC Wei](https://www.digitimes.com/news/a20241028PD200/taiwan-tsmc-morris-chang-ceo-2024.html) | 2024-10 | Wei：「等了 26 年站在這裡」、Chang：「最艱難的挑戰尚未到來」 | [transcripts/Morris_Chang_2024_Sports_Day.md](transcripts/Morris_Chang_2024_Sports_Day.md) |
| 21 | [CC Wei: US Capacity Fully Booked — TrendForce](https://www.trendforce.com/news/2025/03/06/news-tsmc-chairman-c-c-wei-u-s-capacity-fully-booked-through-2026-sparking-100b-investment/) | 2025-03-06 | 美國產能至 2026 全數預訂、需求延續至 2027 | — |
| 22 | [CC Wei: AI still in early stage — Digitimes](https://www.digitimes.com/news/a20251124VL206/taiwan-tsmc-chairman-intel-arizona.html) | 2025-11-24 | AI 發展仍處早期階段、加碼美國擴張 | — |
| 23 | [TSMC Chairman meets Japan PM Takaichi](https://japan.kantei.go.jp/104/actions/202602/05hyoukei.html) | 2026-02-05 | TSMC 日本擴張、JASM 產能擴充、台日半導體合作深化 | — |
| 24 | [CC Wei — SCMP Interview](https://www.scmp.com/tech/big-tech/article/3265309/tsmcs-new-chairman-affirms-forecast-ai-fuelled-global-semiconductor-market-recovery-2024) | 2024 | 台灣優先採用最先進技術策略、AI 驅動全球半導體復甦 | — |
| 25 | [CC Wei named TIME100 AI — Time Magazine](https://time.com/collections/time100-ai-2025/7305839/cc-wei-ai/) | 2024-09 | 「AI 領域百大最具影響力人物」、TSMC 在 AI 基礎設施的核心地位 | — |
| 26 | [CC Wei Yale Science Building Speech](https://yaledailynews.com/blog/2023/10/05/taiwan-semiconductor-ceo-c-c-wei-speaks-at-the-yale-science-building/) | 2023-10-05 | 回母校演講，美國人才觀「most talented and innovative people」、Arizona 選址邏輯、人才池限制 | — |
| 27 | [CC Wei Monte Jade — New Challenges in Semiconductor](https://www.digitimes.com/news/a20221222VL206/japan-tsmc.html&chid=12) | 2022-12 | 產業新挑戰演講、CapEx 調整邏輯、日本廠人力部署（500人赴AZ/200日本人來台中培訓） | — |
| 28 | [CC Wei on Intel — WCCFTech](https://wccftech.com/tsmcs-ceo-says-intel-foundry-wont-be-competitive-by-just-throwing-money/) | 2026-01 | 「投資無法買到競爭力」、對 Intel Foundry「Not worried」、技術需時間累積 | [transcripts/CC_Wei_2026_Intel_Not_Worried.md](transcripts/CC_Wei_2026_Intel_Not_Worried.md) |
| 29 | [CC Wei: Nvidia China Sales "Very Positive" — Fortune Asia](https://fortune.com/asia/2025/07/17/tsmc-chair-cc-wei-nvidia-sales-china-positive-news/) | 2025-07-17 | Q2 淨利 +60.7%、中國「big market」、Nvidia H20 恢復出口為「very positive news」、AI 需求「robust」 | [transcripts/CC_Wei_2025_Fortune_Nvidia_China.md](transcripts/CC_Wei_2025_Fortune_Nvidia_China.md) |
| 30 | [CC Wei: U.S. Capacity Fully Booked — TrendForce](https://www.trendforce.com/news/2025/03/06/news-tsmc-chairman-c-c-wei-u-s-capacity-fully-booked-through-2026-sparking-100b-investment/) | 2025-03-06 | 美國產能至 2026 全數預訂、$100B 追加投資、需求延續至 2027、「strategy based on customer demand」 | [transcripts/CC_Wei_2025_TrendForce_US_Fully_Booked.md](transcripts/CC_Wei_2025_TrendForce_US_Fully_Booked.md) |
| 31 | [Morris Chang — MIT Speech on Semiconductor Success](https://news.mit.edu/2023/morris-chang-describes-secrets-semiconductor-success-1025) | 2023-10-25 | 「Learning is local」、台灣人才優勢、經驗曲線理論、國家安全重要性 | [transcripts/Morris_Chang_2023_MIT_Speech.md](transcripts/Morris_Chang_2023_MIT_Speech.md) |
| 32 | [Morris Chang — The Untold Story (Early Career)](https://synergystartup.substack.com/p/tsmc-the-untold-story-of-morris-chang) | 2025 | 早年戰亂回憶「war, poverty, injustice」、Sylvania→TI→GI→TSMC 職涯軌跡 | [transcripts/Morris_Chang_Early_Career_Untold_Story.md](transcripts/Morris_Chang_Early_Career_Untold_Story.md) |
| 33 | [Morris Chang — Acquired Briefing Interview Analysis](https://www.acquiredbriefing.com/p/the-morris-chang-interview) | 2025-01 | Apple 產能談判紀律、IBM 合作案果斷拒絕、NVIDIA 和解策略、「never stop at two」規模企圖 | [transcripts/Morris_Chang_2025_Acquired_Briefing.md](transcripts/Morris_Chang_2025_Acquired_Briefing.md) |
| 34 | [Morris Chang — Computer History Museum Oral History](https://www.computerhistory.org/collections/catalog/102658129) | 2007 | TI 25 年職涯、學習曲線定價起源、半導體產業早期歷史 | [transcripts/Morris_Chang_2007_Computer_History_Museum.md](transcripts/Morris_Chang_2007_Computer_History_Museum.md) |
| 35 | [CC Wei — CEOWORLD Dual Leadership Profile](https://ceoworld.biz/2024/06/04/ceo-c-c-wei-ascends-to-dual-leadership-roles-at-tsmc/) | 2024-06-04 | 雙首長制歷史意義、2024 年 AI 驅動營收指引「up to 30% Q2 increase」 | [transcripts/CC_Wei_2024_CEOWORLD_Leadership.md](transcripts/CC_Wei_2024_CEOWORLD_Leadership.md) |
| 36 | [CC Wei — Yale Science Building Speech (Full)](https://yaledailynews.com/blog/2023/10/05/taiwan-semiconductor-ceo-c-c-wei-speaks-at-the-yale-science-building/) | 2023-10-05 | 母校演講、「most talented and innovative people」、Arizona 人才池選址邏輯 | [transcripts/CC_Wei_2023_Yale_Speech.md](transcripts/CC_Wei_2023_Yale_Speech.md) |
| 37 | [CC Wei — SIA Awards Dinner Speech: "No More Wafers"](https://www.tomshardware.com/tech-industry/semiconductors/tsmc-csays-advanced-node-capacity-falls-short-of-ai-demand) | 2025-11 | 先進製程產能仍為需求的三分之一；考慮穿「No more wafers」T 恤；強調供需失衡為結構性而非週期性 | [transcripts/CC_Wei_2025_SIA_Awards_Speech.md](transcripts/CC_Wei_2025_SIA_Awards_Speech.md) |
| 38 | [CC Wei — "I'm Also Very Nervous" on $56B CapEx (Yahoo Finance)](https://finance.yahoo.com/news/m-very-nervous-tsmc-ceo-194918758.html) | 2026-01 | 坦言面對 $52-56B CapEx「also very nervous」、親訪所有 CSP 驗證需求、「they are very rich」、需求為真實而非泡沫 | [transcripts/CC_Wei_2026_Yahoo_Nervous_CapEx.md](transcripts/CC_Wei_2026_Yahoo_Nervous_CapEx.md) |
| 39 | [TSMC Co-COO Succession Move — Bloomberg/SCMP](https://www.scmp.com/tech/big-tech/article/3253686/tsmc-promotes-two-veterans-share-coo-role-worlds-largest-contract-chipmaker-readies-succession-plan) | 2024-02-29 | Y.J. Mii + Y.P. Chyn 任命為 Co-COO；Bloomberg 解讀為「succession move」；Kevin Zhang/Cliff Hou 任副手 | [transcripts/TSMC_2024_CoCOO_Succession_Move.md](transcripts/TSMC_2024_CoCOO_Succession_Move.md) |
| 40 | [TSMC Leadership Transition: Wei-Jen Lo Retires — TrendForce](https://www.trendforce.com/news/2025/07/29/news-tsmcs-senior-executive-wei-jen-lo-retires-after-21-years-marking-leadership-transition/) | 2025-07-29 | SVP Wei-Jen Lo 退休（21 年）、Rick Cassidy/J.K. Lin/Douglas Yu 相繼離任、Lora Ho 擴大職責、領導層世代交替加速 | [transcripts/TSMC_2025_Leadership_Transition_TrendForce.md](transcripts/TSMC_2025_Leadership_Transition_TrendForce.md) |

**統計**：已收集 40 篇（法說 7 篇 + Morris Chang 訪談/演講 11 篇 + C.C. Wei 訪談/活動 20 篇 + 領導層報導 2 篇）。逐字稿已下載 28 篇至 `transcripts/` 目錄：

| 序號 | 檔案 | 來源 |
|------|------|------|
| 1 | [Morris_Chang_2025_Acquired_Podcast.md](transcripts/Morris_Chang_2025_Acquired_Podcast.md) | Acquired Podcast 2025-01 |
| 2 | [Morris_Chang_2023_Last_Speech.md](transcripts/Morris_Chang_2023_Last_Speech.md) | Interconnected Blog 2023-04 |
| 3 | [Morris_Chang_2022_Brookings_CSIS.md](transcripts/Morris_Chang_2022_Brookings_CSIS.md) | Brookings 2022-04 |
| 4 | [Morris_Chang_2024_Sports_Day.md](transcripts/Morris_Chang_2024_Sports_Day.md) | Digitimes 2024-10 |
| 5 | [Morris_Chang_2023_MIT_Speech.md](transcripts/Morris_Chang_2023_MIT_Speech.md) | MIT News 2023-10-25 |
| 6 | [Morris_Chang_Early_Career_Untold_Story.md](transcripts/Morris_Chang_Early_Career_Untold_Story.md) | Synergy Startup Substack |
| 7 | [Morris_Chang_2025_Acquired_Briefing.md](transcripts/Morris_Chang_2025_Acquired_Briefing.md) | Acquired Briefing 2025-01 |
| 8 | [Morris_Chang_2007_Computer_History_Museum.md](transcripts/Morris_Chang_2007_Computer_History_Museum.md) | Computer History Museum 2007 |
| 9 | [Morris_Chang_2024_Autobiography_Launch.md](transcripts/Morris_Chang_2024_Autobiography_Launch.md) | CommonWealth Publishing 2024-12-02 |
| 10 | [CC_Wei_2024_Q4_Earnings_Call.md](transcripts/CC_Wei_2024_Q4_Earnings_Call.md) | Motley Fool Q4 2024 Transcript |
| 11 | [CC_Wei_2025_Q3_Earnings_Call.md](transcripts/CC_Wei_2025_Q3_Earnings_Call.md) | Motley Fool Q3 2025 Transcript |
| 12 | [CC_Wei_2025_Fortune_Asia.md](transcripts/CC_Wei_2025_Fortune_Asia.md) | Fortune Asia 2025-07-30 |
| 13 | [CC_Wei_2026_Next_Platform.md](transcripts/CC_Wei_2026_Next_Platform.md) | The Next Platform 2026-01-16 |
| 14 | [CC_Wei_2024_TIME100_AI.md](transcripts/CC_Wei_2024_TIME100_AI.md) | TIME 2024-09 |
| 15 | [CC_Wei_2024_CEOWORLD_Leadership.md](transcripts/CC_Wei_2024_CEOWORLD_Leadership.md) | CEOWORLD Magazine 2024-06-04 |
| 16 | [CC_Wei_2023_Yale_Speech.md](transcripts/CC_Wei_2023_Yale_Speech.md) | Yale Daily News 2023-10-05 |
| 17 | [CC_Wei_2024_NSTC_Robots_Speech.md](transcripts/CC_Wei_2024_NSTC_Robots_Speech.md) | NSTC 演講 2024 |
| 18 | [CC_Wei_2024_Register_AI_Chip_Shortage.md](transcripts/CC_Wei_2024_Register_AI_Chip_Shortage.md) | The Register 2024-07-18 |
| 19 | [CC_Wei_2025_Digitimes_AI_Early_Stage.md](transcripts/CC_Wei_2025_Digitimes_AI_Early_Stage.md) | Digitimes 2025-11-24 |
| 20 | [CC_Wei_2025_White_House_165B.md](transcripts/CC_Wei_2025_White_House_165B.md) | TSMC PR / White House 2025-03 |
| 21 | [CC_Wei_2026_Intel_Not_Worried.md](transcripts/CC_Wei_2026_Intel_Not_Worried.md) | WCCFTech 2026-01 |
| 22 | [CC_Wei_2025_Fortune_Nvidia_China.md](transcripts/CC_Wei_2025_Fortune_Nvidia_China.md) | Fortune Asia 2025-07-17 |
| 23 | [CC_Wei_2025_TrendForce_US_Fully_Booked.md](transcripts/CC_Wei_2025_TrendForce_US_Fully_Booked.md) | TrendForce 2025-03-06 |
| 24 | [CC_Wei_2025_SIA_Awards_Speech.md](transcripts/CC_Wei_2025_SIA_Awards_Speech.md) | Tom's Hardware / SIA Awards 2025-11 |
| 25 | [CC_Wei_2026_Yahoo_Nervous_CapEx.md](transcripts/CC_Wei_2026_Yahoo_Nervous_CapEx.md) | Yahoo Finance 2026-01 |
| 26 | [TSMC_2024_CoCOO_Succession_Move.md](transcripts/TSMC_2024_CoCOO_Succession_Move.md) | SCMP / Bloomberg 2024-02-29 |
| 27 | [TSMC_2025_Leadership_Transition_TrendForce.md](transcripts/TSMC_2025_Leadership_Transition_TrendForce.md) | TrendForce 2025-07-29 |
| 28 | [CC_Wei_2024_CommonWealth_Leadership.md](transcripts/CC_Wei_2024_CommonWealth_Leadership.md) | CommonWealth Magazine 2024-06-03 |

---

# 六、地緣政治分析

## 6.1 地緣政治地位與影響——「矽盾」（Silicon Shield）論述的正反深入討論

### TSMC 對台灣經濟的系統性重要性——量化實證

TSMC 不僅是全球最大的晶片代工廠，更是台灣經濟的「脊柱」——其營收、稅收、出口與就業對台灣的貢獻規模在全球企業-國家關係中幾乎無可比擬。以下以六個維度量化 TSMC 對台灣經濟的系統性重要性，為矽盾論述提供實證基礎。

**TSMC 對台灣經濟貢獻量化（2024-2025）**：

| 指標 | 數據 | 佔台灣比重 | 說明 | 出處 |
|------|------|----------|------|------|
| **營收佔 GDP 比** | 2024 營收 $90.1B vs. 台灣 GDP ~$790B | **~11.4%**（營收/GDP 比） | 附加價值貢獻估計 **5-6%** GDP | [Taipei Times, 2025-03-10](https://www.taipeitimes.com/News/editorials/archives/2025/03/10/2003833151)；[CNBC](https://www.cnbc.com/2025/01/10/tsmc-beats-sales-estimates-as-ai-chip-boost-continues.html) |
| **出口佔比** | TSMC 佔台灣總出口 **~12%** | 半導體整體佔台灣出口 **~40%** | 廣義半導體相關佔出口 **~60%**（經濟部數據） | [Taiwan Insight, 2025-05](https://taiwaninsight.org/2025/05/12/tsmc-the-enduring-silicon-shield-of-taiwans-economy/)；[CNBC](https://www.cnbc.com/2024/01/12/taiwans-strength-in-semiconductors-could-be-its-achilles-heel-economist-says.html) |
| **企業所得稅** | 2024 全球稅款 NT$2,020 億（~$6.6B），~95% 繳於台灣 | 佔台灣企業所得稅 **15.9%** | **台灣最大企業納稅者** | [TSMC ESG Report](https://esg.tsmc.com/file/public/e-OperationsandGovernance_3.pdf)；[Digitimes, 2025-10](https://www.digitimes.com/news/a20251001PD221/tsmc-taiwan-2024-worldwide-2023.html) |
| **員工數** | 83,825 人（2024） | 佔台灣勞動力 **0.72%** | 佔全台半導體業 327,000 人的 **25.6%** | [TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf)；[GraniteFirm, 2025-05](https://www.granitefirm.com/blog/us/2025/05/05/semiconductor-to-taiwan/) |
| **半導體業佔 GDP** | 半導體產業產值 NT$4.3-4.9 兆 | **15-18%** GDP（TSIA 估 ~20% GNP） | TSMC 為產業核心，佔代工市場 60%+ | [Taipei Times](https://www.taipeitimes.com/News/editorials/archives/2025/03/10/2003833151)；[GraniteFirm](https://www.granitefirm.com/blog/us/2025/05/05/semiconductor-to-taiwan/) |
| **資本支出密度** | 2025 年 CapEx ~$38B | 相當於台灣政府年度總預算的 **~50%** | 全球最大單一企業工業投資之一 | [TSMC Q4 2025 Transcript](https://investor.tsmc.com/english/quarterly-results/2025/q4) |

**結構性含義**：TSMC 以台灣 0.72% 的勞動力創造了 11.4% 的 GDP（營收）、12% 的出口與 15.9% 的企業所得稅——這一「超濃縮」經濟貢獻使任何對台灣的軍事行動都將直接摧毀台灣的經濟核心引擎。According to The Economist，台灣半導體佔 GDP 15% 的集中度在全球主要經濟體中幾乎無可比擬——相當於沙烏地阿拉伯之於石油，但技術門檻更高、供應鏈更無可替代。（[來源：Taipei Times, 2025-03-10](https://www.taipeitimes.com/News/editorials/archives/2025/03/10/2003833151)）

According to Taiwan Insight（2025），TSMC 在台灣經濟中的角色已超越「產業龍頭」而成為「經濟基礎設施」——台灣股市中 TSMC 市值一度佔台股總市值超過 35%，使台灣資本市場的表現高度繫於 TSMC 股價，形成「TSMC 即台灣」的投資敘事。（[來源：Taiwan Insight, 2025-05](https://taiwaninsight.org/2025/05/12/tsmc-the-enduring-silicon-shield-of-taiwans-economy/)）

### 矽盾理論的核心邏輯

「矽盾」（Silicon Shield）理論認為，台灣在全球半導體供應鏈的壟斷地位構成一種經濟性威懾——任何對台灣的軍事行動都將摧毀全球晶片供應，造成攻擊者自身的經濟災難。TSMC 控制全球 60%+ 的晶圓代工產能與 92% 的先進邏輯晶片（10nm 以下）製造，使台灣成為全球經濟的「關鍵節點」。（[來源：Rhodium Group](https://rhg.com/research/taiwan-economic-disruptions/)）

上節已量化 TSMC 佔台灣 GDP ~11.4%（營收）、出口 12%、企業所得稅 15.9%——這些數據構成矽盾論述的實證基礎：攻台不僅摧毀全球晶片供應，更將癱瘓台灣 15-18% 的 GDP 與 40-60% 的出口能力。

前總統蔡英文曾將半導體主導地位定位為台灣安全的核心保障。KMT 立法院黨團總召傅崐萁則質疑：「Where is Taiwan's national security if TSMC become ASMC and the sacred mountain that protects the country is gone?」——「護國神山」一詞折射出台灣社會對 TSMC 地緣戰略角色的高度期待。（[來源：CFR — Unpacking TSMC's $100B Investment](https://www.cfr.org/articles/unpacking-tsmcs-100-billion-investment-united-states)）

### 支持矽盾有效性的論點

**論點一：經濟相互依賴構成威懾**。According to Rhodium Group, 半導體相關產業的全球營收約 $1.6 兆美元將在台灣斷供情境下面臨直接風險，波及汽車、消費電子、雲端運算、國防等所有依賴先進晶片的產業。TSMC 生產全球 35% 的汽車微控制器與 70% 的智慧手機晶片組——供應中斷將立即癱瘓全球多個產業。（[來源：Rhodium Group](https://rhg.com/research/taiwan-economic-disruptions/)）

**論點二：盟友利益綁定**。According to The Diplomat（2024 年 9 月），「Silicon Shield 2.0」的概念認為 TSMC 的海外擴張（美國亞利桑那、日本熊本、德國德勒斯登）並非削弱矽盾，而是將台灣的影響力延伸至全球北方盟友——透過深化經濟互賴，強化西方國家保衛台灣的利益基礎。（[來源：The Diplomat — Silicon Shield 2.0](https://thediplomat.com/2024/09/silicon-shield-2-0-a-taiwan-perspective/)）

**論點三：技術不可替代性的時間窗口**。即使美國成功在本土建設先進晶圓廠，要達到 TSMC 在台灣的產能規模與良率水準仍需 5-10 年。Morris Chang 直言美國復興半導體製造是「a very expensive exercise in futility」，強調「Short-term subsidies cannot make up for long-term competitive disadvantages.」（[來源：Brookings Institution, 2022-04](https://www.brookings.edu/wp-content/uploads/2022/04/Vying-for-Talent-Morris-Chang-20220414.pdf)）

**論點四：中國自身的晶片依賴**。According to CFR, 中國仍高度依賴台灣晶片作為其出口製造業的關鍵投入——攻台將瓦解中國自身的經濟引擎。（[來源：CFR — Will China's Reliance on Taiwanese Chips Prevent War?](https://www.cfr.org/blog/will-chinas-reliance-taiwanese-chips-prevent-war)）

### 質疑矽盾有效性的論點

**論點一：美國視角的根本差異**。According to Stimson Center（2025），矽盾是「台灣的詮釋，而非美國的詮釋」。對台灣而言，邏輯是：「世界依賴我們的晶片，世界就會保護我們。」但美國的核心問題不是「如何因為晶片而保護台灣」，而是「如何確保無論發生什麼都能取得晶片」——這是根本不同的風險計算。（[來源：Stimson Center, 2025](https://www.stimson.org/2025/why-taiwan-fears-america-first-risks-eroding-its-silicon-shield/)）

**論點二：海外擴張稀釋矽盾**。TSMC 美國投資總額已達 $1,650 億美元，規劃 6 座晶圓廠、2 座先進封裝廠與 1 座研發中心。Trump 聲稱此舉可將美國晶片製造佔比提升至全球 40%。台灣政府雖承諾「TSMC 將在台灣保留最先進製程」，但 Wei 表示將在美國生產「the most advanced chip on U.S. soil」——語義的模糊空間引發台灣社會疑慮。（[來源：CFR, 2025-03](https://www.cfr.org/articles/unpacking-tsmcs-100-billion-investment-united-states)）

**論點三：中國資訊戰利用**。According to MIT Technology Review（2025），中國國家支持的資訊戰將 TSMC 海外投資定位為「掏空台灣經濟命脈」，聲稱 TSMC 正將最先進技術、人才與資源轉移至美國，削弱台灣在全球供應鏈中的關鍵地位。（[來源：MIT Technology Review, 2025-08-15](https://www.technologyreview.com/2025/08/15/1121358/taiwan-silicon-shield-tsmc-china-chip-manufacturing/)）

**論點四：學術研究的挑戰**。According to ResearchGate（2025），一篇題為「Silicon Shield or Silicon Trap?」的學術論文指出，半導體主導地位可能既是「盾牌」也是「陷阱」——如果中國判斷時間不站在自己這邊（美國逐步建立本土產能），反而可能加速對台行動的時間表。（[來源：ResearchGate — Silicon Shield or Silicon Trap?](https://www.researchgate.net/publication/391522122_Silicon_Shield_or_Silicon_Trap_Taiwan's_Semiconductor_Dominance_and_the_Strategic_Calculus_of_Chinese_Military_Aggression)）

### 矽盾論述對比表

| 面向 | 支持有效性 | 質疑有效性 |
|------|----------|----------|
| 經濟威懾 | 全球 $1.6T 營收面臨風險，攻台方自損嚴重 | 中國可能判斷長期等待更不利，選擇短期承受損失 |
| 盟友保護 | TSMC 海外投資深化西方利益綁定 | 美國本土產能建立後，保護台灣的利益減弱 |
| 技術壁壘 | 追趕需 5-10 年，短期不可替代 | 時間窗口正在縮小（SMIC 7nm 量產、Intel 18A 追趕） |
| 政治意志 | 晶片斷供將引發美國國內經濟危機，迫使政治回應 | 「America First」政策可能優先考慮本土供應安全而非台灣安全 |

### 地緣政治風險對 TSMC 估值的量化影響——P/E 折扣分析

TSMC 的估值長期承受「台灣折價」（Taiwan Discount），即相較於同等成長與獲利能力的全球半導體同業，TSMC 的本益比（P/E）被系統性壓低。這一折價的根源在於台海地緣風險——投資人對台灣遭受封鎖或軍事衝突的尾部風險進行定價。

**TSMC vs. 全球半導體同業 P/E 對比（2026 年 3 月）**：

| 公司 | Forward P/E（2026E） | TTM P/E | 2026E EPS 成長率 | PEG 比率 | 備註 |
|------|---------------------|---------|-----------------|---------|------|
| **TSMC (TSM)** | ~24-25x | ~29x | +30% | ~1.0x | 台灣折價 |
| NVIDIA (NVDA) | ~35-40x | ~55-68x | +25-30% | ~1.5x | AI 龍頭溢價 |
| ASML (ASML) | ~30-35x | ~38x | +15-20% | ~1.8x | 歐洲設備壟斷 |
| AMD (AMD) | ~28-32x | ~40x | +25% | ~1.5x | AI GPU 第二名 |
| Broadcom (AVGO) | ~28-30x | ~35x | +20% | ~1.5x | 定製 ASIC 平台 |

**來源**：[Investing.com — TSM Geopolitical Discount](https://www.investing.com/analysis/tsm-ais-core-foundry-trilliondollar-valuation-and-live-geopolitical-discount-200672078)；[ainvest — TSM P/E Undercurrents](https://www.ainvest.com/news/taiwan-semiconductor-manufacturing-tsm-geopolitical-undercurrents-driving-discount-2505/)；[Simply Wall St](https://simplywall.st/stocks/us/semiconductors/nyse-tsm/taiwan-semiconductor-manufacturing/news/has-tsmcs-48-2025-surge-already-priced-in-its-ai-growth-stor)

**折價量化**：TSMC 的 PEG 比率約 1.0x，較資訊科技產業整體（~1.9x）折價約 48%。若以 NVIDIA 的 PEG（~1.5x）為 AI 基礎設施同業基準，TSMC 存在約 30-35% 的 PEG 折價。According to ainvest（2025），這一折價的主因是「92% of the world's advanced chips produced there」所帶來的供應鏈集中風險，以及中國 2027 年時間軸帶來的尾部風險——極端情境下 TSMC 股價可能下跌 60%。（[來源：ainvest, 2025-05](https://www.ainvest.com/news/taiwan-semiconductor-manufacturing-tsm-geopolitical-undercurrents-driving-discount-2505/)）

**P/E 折扣的情境分析**：

| 地緣情境 | 隱含 P/E 調整 | TSMC 合理 P/E 範圍 | 對應目標價（NT$，2026E EPS 439） | 出處/推算 |
|---------|-------------|-------------------|-------------------------------|----------|
| 持續現狀（灰色地帶施壓） | -3~5x vs. 無風險基準 | 24-27x | 10,536-11,853 | 當前市場定價 |
| 緊張升溫（封鎖威脅加劇） | -8~12x vs. 無風險基準 | 18-22x | 7,902-9,658 | 類比 2022 佩洛西訪台後回撤 |
| 「和平紅利」（兩岸關係緩和） | +2~4x vs. 當前 | 27-30x | 11,853-13,170 | TSMC 回歸 AI 同業溢價 |
| 全面衝突 | P/E 壓縮至 5-10x | 5-10x | 2,195-4,390 | 類比戰爭/制裁情境折價（Jim Cramer 引 GM 貿易戰 5x P/E） |

**投資觀點**：According to 24/7 Wall St（2026），TSMC 在 2026 年初以 38% 營收成長重新定義了地緣風險的敘事——「成長速度足以讓投資人重新計算風險/報酬比」。TSMC 2026 年股利年增 28%（每股 NT$23），亦反映管理層對獲利持續性的信心。然而，TSMC 的 P/E 能否從當前的 24-25x 向 NVIDIA 式的 35x+ 收斂，取決於台海局勢是否長期維持穩定。地緣折價是一種「活的折價」（live discount）——它不會因為 TSMC 業績好就消失，只有地緣風險本身下降才會釋放。（[來源：24/7 Wall St, 2026-02-25](https://247wallst.com/investing/2026/02/25/tsmc-raises-dividend-28-while-38-revenue-growth-reframes-the-geopolitical-risk/)；[Investing.com](https://www.investing.com/analysis/tsm-ais-core-foundry-trilliondollar-valuation-and-live-geopolitical-discount-200672078)）

## 6.2 國際關係與供應鏈風險——盟友體系分析

### 美日台三角關係

**Chip 4 聯盟**：2022 年美國提出由美國、日本、韓國、台灣組成的「Chip 4 Alliance」，旨在建立民主國家主導的半導體供應鏈安全體系。這四個經濟體合計佔全球半導體市場 82%、半導體全球價值鏈 74%、晶片設計 84%、製造設備 77%、記憶體晶片 99%。（[來源：Fortune Asia, 2024-03-28](https://fortune.com/asia/2024/03/28/chip-4-alliance-us-korea-japan-taiwan-semiconductors-china-opec-cartel-for-digital-age/)）

**TSMC 日本佈局（JASM）**：TSMC 與 Sony、Denso 合資的熊本廠（JASM）已於 2024 年開始量產，獲日本政府約 50% 建廠補貼。2026 年 2 月，Wei 拜會日本首相高市早苗，討論 TSMC 日本擴張與台日半導體合作深化。（[來源：日本首相官邸, 2026-02-05](https://japan.kantei.go.jp/104/actions/202602/05hyoukei.html)）

**美日技術繁榮協議（TPD）**：2025 年 10 月，美國與日本、韓國分別簽署「Technology Prosperity Deals」，涵蓋 AI、半導體、量子運算、生技、太空、6G 等領域的合作框架。（[來源：TechCrunch, 2025-10-29](https://techcrunch.com/2025/10/29/us-signs-collaboration-agreements-with-japan-and-south-korea-for-ai-chips-and-biotech/)）

**Quad 與 AUKUS 框架**：美日印澳「四方安全對話」（Quad）與美英澳「AUKUS」安全聯盟均將半導體供應鏈安全納入戰略議程。According to The Diplomat（2021），建立「Semi-Quad」半導體聯盟的倡議旨在透過區域盟友合作，確保供應鏈韌性並透過經濟互賴遏制侵略。（[來源：The Diplomat — Semi-Quad Alliance](https://thediplomat.com/2021/05/time-for-a-semi-quad-alliance/)）

**台灣新南向政策（New Southbound Policy+）**：台灣透過擴大與東南亞、南亞的經濟連結，結合 Quad 等區域框架，建構「以互賴嚇阻侵略」的多層次安全網。（[來源：PacForum](https://pacforum.org/publications/yl-blog-114-a-world-reliant-on-taiwans-semiconductor-industry-amid-chinese-aggression/)）

**盟友架構對 TSMC 戰略定位的具體含義**：上述多層盟友體系（Chip 4 / Quad / AUKUS / TPD）對 TSMC 產生三重戰略效應。第一，**需求鎖定**：盟友國家的半導體政策（CHIPS Act $527 億、歐盟 Chips Act €430 億、日本半導體振興 ¥3.9 兆）皆以 TSMC 為旗艦合作對象，使 TSMC 在盟友圈內獲得最優先的建廠補貼與政策支持。第二，**安全承諾的經濟化**：According to The Diplomat（2024），TSMC 在美日歐的巨額投資使這些國家在台灣安全議題上的利益更加具體——不再只是抽象的「自由與開放」承諾，而是數百億美元的直接經濟利益。第三，**技術標準制定權**：Chip 4 框架下的出口管制協調（美日荷三方光刻機出口限制）使 TSMC 所依賴的 ASML EUV 設備僅流向盟友陣營，形成技術壁壘的制度化保障。（[來源：The Diplomat — Silicon Shield 2.0](https://thediplomat.com/2024/09/silicon-shield-2-0-a-taiwan-perspective/)；[TechCrunch, 2025-10-29](https://techcrunch.com/2025/10/29/us-signs-collaboration-agreements-with-japan-and-south-korea-for-ai-chips-and-biotech/)）

Wei 在 Q4 2024 法說中對盟友策略的回應極為審慎：「We have a very frank and open communication with the current government and with the future one also. I cannot say anything more than that.」——這一措辭反映 TSMC 在盟友體系中的獨特位置：它是盟友們爭相拉攏的對象，但也必須在美中之間維持微妙平衡。（[來源：TSMC Q4 2024 Transcript](https://www.fool.com/earnings/call-transcripts/2025/01/16/taiwan-semiconductor-manufacturing-tsm-q4-2024-ear/)）

### 產業依賴度量化——哪些產業與國家最依賴 TSMC 先進製程

TSMC 的先進製程（7nm 以下）滲透至全球幾乎所有高科技產業，形成深度依賴結構。According to Hudson Institute（2025），「a significant disruption could affect $1.6 trillion, or roughly 8%, of America's annual gross domestic product」——影響規模超過 2008 年金融危機或 2020 年 COVID 封鎖。（[來源：Hudson Institute, 2025](https://www.hudson.org/technology/losing-taiwan-semiconductor-would-devastate-us-economy-riley-walters)）

According to Vision of Humanity（2025），台灣佔全球半導體製造 20%、邏輯晶片 37%、先進邏輯晶片（10nm 以下）92%。台灣與韓國合計生產 100% 的 10nm 以下半導體。（[來源：Vision of Humanity](https://www.visionofhumanity.org/the-worlds-dependency-on-taiwans-semiconductor-industry-is-increasing/)）

**按產業分類的 TSMC 先進製程依賴度**：

| 產業 | TSMC 依賴程度 | 關鍵客戶/產品 | 斷供衝擊 | 替代時程 |
|------|-------------|-------------|---------|---------|
| AI/雲端運算 | **極高**（~95%） | NVIDIA H100/B100/GB200、AMD MI300X、Google TPU、Broadcom ASIC | 全球 AI 訓練/推理能力瞬間歸零 | 5-10 年（無替代產能） |
| 智慧手機 | **極高**（~70% 晶片組） | Apple A/M 系列、Qualcomm Snapdragon、MediaTek Dimensity | 全球旗艦手機生產停擺 | 3-5 年 |
| 汽車 | **高**（~35% 微控制器） | ADAS SoC、車用 MCU | 全球汽車產量下降 30-50% | 2-3 年（成熟製程可分散） |
| 國防/航太 | **高** | 軍用 FPGA、通訊晶片、衛星元件 | 西方國家軍事系統供應鏈斷裂 | 5-10 年（認證週期長） |
| 電信/5G | **高** | 5G 基站晶片、網路交換器 | 全球 5G 部署延遲 | 3-5 年 |
| PC/伺服器 | **極高** | Intel/AMD CPU（TSMC 代工）、伺服器 GPU | 資料中心擴建停擺 | 5 年+ |

**來源**：[Hudson Institute](https://www.hudson.org/technology/losing-taiwan-semiconductor-would-devastate-us-economy-riley-walters)；[Vision of Humanity](https://www.visionofhumanity.org/the-worlds-dependency-on-taiwans-semiconductor-industry-is-increasing/)；[Rhodium Group](https://rhg.com/research/taiwan-economic-disruptions/)

**按國家/地區分類的依賴度**：

| 國家/地區 | 對 TSMC 先進製程依賴度 | 關鍵依賴面向 | 出處 |
|----------|---------------------|------------|------|
| 美國 | **最高**（TSMC 北美營收佔 70%） | Apple/NVIDIA/AMD/Broadcom 全依賴 TSMC；美國 GDP 8%（$1.6T）面臨風險 | [Hudson Institute](https://www.hudson.org/technology/losing-taiwan-semiconductor-would-devastate-us-economy-riley-walters) |
| 中國 | **高但受限**（TSMC 中國營收已降至 11%） | 出口管制前依賴度極高；華為/海思被切斷後轉向 SMIC | [Rhodium Group](https://rhg.com/research/taiwan-economic-disruptions/) |
| 日本 | **中高** | Sony 影像感測器、車用晶片；JASM 合資降低部分風險 | [TSMC Q4 2024 Mgmt Report](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-01/2d8b2bb6fc3b5887d24ae0635f639c1cdca834f3/4Q24ManagementReport.pdf) |
| 歐洲 | **中** | 車用晶片（Infineon/NXP 設計→TSMC 製造）；德勒斯登廠以成熟製程為主 | [EST Think Tank](https://esthinktank.com/2025/11/25/semiconductors-as-key-strategic-assets-navigating-global-and-european-security-challenges/) |
| 韓國 | **中** | Samsung 自有產能可部分替代，但 NVIDIA/AMD GPU 仍依賴 TSMC | [Fortune Asia](https://fortune.com/asia/2024/03/28/chip-4-alliance-us-korea-japan-taiwan-semiconductors-china-opec-cartel-for-digital-age/) |

**斷供情境建模**：According to Rhodium Group, 台灣海峽中斷將導致全球經濟損失 $2.7 兆（第一年），其中美國承受約 $1.6 兆衝擊。According to ISDP（2025），一顆晶片從設計到消費者手中可能跨越 70 個國界——台灣作為最關鍵的製造節點，其斷供將引發全球供應鏈的連鎖崩潰。（[來源：ISDP, 2025-04](https://www.isdp.eu/wp-content/uploads/2025/04/Brief-TSMC-Apr-15-2025-new.pdf)；[Vision of Humanity](https://www.visionofhumanity.org/the-worlds-dependency-on-taiwans-semiconductor-industry-is-increasing/)）

### 供應鏈集中度風險量化

| 風險面向 | 數據 | 出處 |
|---------|------|------|
| 台灣先進晶片全球佔比 | 92%（10nm 以下） | [Rhodium Group](https://rhg.com/research/taiwan-economic-disruptions/) |
| TSMC 先進製程全球佔比 | >90%（7nm 以下） | [TSMC 2024 AR](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf) |
| 全球 AI 加速器 TSMC 佔比 | ~95%+ | NVIDIA/AMD/Broadcom/Google TPU 均由 TSMC 製造 |
| 台灣年度進出口貿易額 | $9,220 億（2021） | [Rhodium Group](https://rhg.com/research/taiwan-economic-disruptions/) |
| 封鎖情境高風險貿易額 | $5,650 億（台灣附加價值貿易） | [Rhodium Group](https://rhg.com/research/taiwan-economic-disruptions/) |
| 全球受影響半導體相關營收 | ~$1.6 兆/年 | [Rhodium Group](https://rhg.com/research/taiwan-economic-disruptions/) |

### 脫鉤風險——TSMC 的地理分散策略

TSMC 的全球製造版圖擴張是對供應鏈集中風險的直接回應：

| 據點 | 投資額 | 製程 | 狀態 | 出處 |
|------|--------|------|------|------|
| 美國亞利桑那（6 座廠） | $1,650 億 | 4nm→2nm | 第一座運營中，2028-2030 全部投產 | [CFR, 2025-03](https://www.cfr.org/articles/unpacking-tsmcs-100-billion-investment-united-states) |
| 日本熊本（JASM） | ~$86 億（含政府補貼 50%） | 12/16/28nm | 2024 量產，擴產中 | [日本首相官邸](https://japan.kantei.go.jp/104/actions/202602/05hyoukei.html) |
| 德國德勒斯登（ESMC） | ~€100 億 | 28/22nm | 興建中 | [TSMC PR](https://pr.tsmc.com/english/news/3210) |
| 新加坡 | 待定 | 待定 | 規劃中 | 管理層法說提及 |

Wei 在 Fortune 專訪中感嘆這一全球化進程的不可思議：「If someone had told me 10 years ago that I'd meet two presidents in one week to discuss hundreds of billions of dollars in investments to expand our global footprint, I would have thought they were joking.」（[來源：Fortune Asia, 2025-07-30](https://fortune.com/asia/2025/07/30/tsmc-ai-boom-cc-wei-wendell-huang-global-500/)）

### 供應鏈設備與材料集中度脆弱性——ASML 之外的關鍵單點風險

TSMC 的先進製程依賴一個高度集中、以五大設備商為核心的供應鏈體系。ASML 的 EUV 壟斷已在 6.3 節詳述，此處聚焦**其他關鍵設備與特殊化學材料**的單點風險，以及制裁情境下的替代可行性。

**前段設備供應商集中度——五大寡佔**：

全球半導體前段製造設備市場由五家公司壟斷，合計佔全球市場份額約 **75-80%**。TSMC 的每一座先進晶圓廠均需整合這五家的設備方能運作：

| 設備商 | 國籍 | 核心設備 | 全球市佔（該品類） | TSMC 依賴度 | 制裁情境替代可行性 | 出處 |
|--------|------|---------|------------------|-----------|------------------|------|
| **ASML** | 荷蘭 | EUV/DUV 光刻機 | **100%**（EUV）；~80%（高端 DUV） | **極高**——N5/N3/N2 所有 EUV 層無替代 | **無替代**（中國 LDP-EUV 原型功率僅 50-100W，量產需 250W+） | [CSIS, 2025](https://www.csis.org/analysis/true-impact-allied-export-controls-us-and-chinese-semiconductor-manufacturing-equipment-industries) |
| **Applied Materials (AMAT)** | 美國 | 沉積（CVD/PVD）、蝕刻、CMP | ~20-25%（整體設備） | **高**——沉積與平坦化為每層製程必需 | 部分可由 Tokyo Electron 替代，但製程重新驗證需 6-12 個月 | [CSIS, 2025](https://www.csis.org/analysis/true-impact-allied-export-controls-us-and-chinese-semiconductor-manufacturing-equipment-industries) |
| **Tokyo Electron (TEL)** | 日本 | 蝕刻、塗佈/顯影（coater/developer）、清洗 | ~15-18%（整體設備）；塗佈/顯影 **~85%** | **高**——TEL 塗佈/顯影機與 ASML 光刻機直接串聯，更換需重新校準全線 | 替代選項極少（DNS/SCREEN 僅覆蓋部分清洗設備） | [ainvest — TEL-TSMC IP Case, 2025-08](https://www.ainvest.com/news/semiconductor-supply-chain-security-age-geopolitical-risk-lessons-tsmc-tokyo-electron-case-2508/) |
| **Lam Research** | 美國 | 蝕刻、沉積 | ~15-18%（蝕刻佔 ~50%） | **高**——先進蝕刻為 GAA Nanosheet 架構的關鍵製程 | 部分可由 TEL 替代（蝕刻），但高深寬比蝕刻（HAR etch）幾乎無替代 | [CSIS, 2025](https://www.csis.org/analysis/true-impact-allied-export-controls-us-and-chinese-semiconductor-manufacturing-equipment-industries) |
| **KLA** | 美國 | 檢測/量測 | ~55%（檢測/量測） | **高**——良率控制的核心設備，無法跳過 | 替代品（Hitachi High-Tech、ASML HMI）覆蓋部分品類但精度差距仍大 | [CSIS, 2025](https://www.csis.org/analysis/true-impact-allied-export-controls-us-and-chinese-semiconductor-manufacturing-equipment-industries) |

**來源**：[CSIS — True Impact of Allied Export Controls, 2025](https://www.csis.org/analysis/true-impact-allied-export-controls-us-and-chinese-semiconductor-manufacturing-equipment-industries)；[ainvest — TEL-TSMC Supply Chain Security, 2025-08](https://www.ainvest.com/news/semiconductor-supply-chain-security-age-geopolitical-risk-lessons-tsmc-tokyo-electron-case-2508/)

**特殊化學材料——日本壟斷的隱性瓶頸**：

半導體製造所需的特殊化學材料（光阻劑、特殊氣體、CMP 漿料、濕式蝕刻液）同樣高度集中於少數日本供應商，形成設備之外的第二層單點風險：

| 材料類別 | 關鍵供應商 | 國籍 | 市佔/集中度 | TSMC 台灣供應模式 | 制裁/斷供風險 | 出處 |
|---------|----------|------|-----------|-----------------|-------------|------|
| **EUV 光阻劑** | JSR Corporation、Tokyo Ohka Kogyo (TOK)、Shin-Etsu Chemical、Fujifilm | 日本（合計 ~90%） | 全球前 5 家佔 >50%；**日本佔全球光阻劑 ~90%** | Shin-Etsu 已在台灣雲林設廠，產能擴增 50%；JSR 在台灣亦有生產據點 | 低（日本為盟友，且已在台灣本地生產）；但**封鎖情境下進口原料仍受航運風險** | [Fountyl Tech](https://www.fountyltech.com/news/japanese-companies-monopolize-the-euv-photoresist-supply-market/)；[TrendForce, 2024-04](https://www.trendforce.com/news/2024/04/11/news-japanese-photoresist-giant-shin-etsu-chemical-rumored-to-build-a-new-plant/) |
| **高純度氣體**（NF₃、WF₆、特殊蝕刻氣體） | Linde（德）、Air Liquide（法）、大陽日酸（日） | 歐洲+日本 | 三家合計佔全球 >60% | 台灣本地有分裝/純化工廠，但**原料氣體多數進口** | 中等——封鎖情境下原料供應可能中斷 2-4 週 | 產業慣例 |
| **CMP 漿料** | Cabot Microelectronics（美）、Fujimi（日） | 美國+日本 | 兩家合計 >60% | 台灣有本地生產 | 低——盟友國供應+本地產能 | 產業慣例 |
| **矽晶圓** | 信越化學（日）、SUMCO（日）、Siltronic（德） | 日本+德國（合計 >70%） | 信越+SUMCO 佔全球 ~55% | 台灣有環球晶（GlobalWafers）為本土替代 | 低——GlobalWafers 為全球第三大，可部分替代 | [GlobalWafers IR](https://www.gw-semi.com/) |

**2025 年 8 月 Tokyo Electron-TSMC IP 洩漏事件**：According to ainvest（2025-08），一名前 Tokyo Electron 員工涉嫌竊取 TSMC 的 **2nm GAA 製程技術機密**，遭台灣國安法起訴。此案為台灣 2022 年《國家安全法》修正後首批重大案件之一，六人遭逮捕。TEL 股價因此下跌逾 4%。TSMC 隨後建立「商業秘密永續智慧管理中心」（AI 驅動的即時 IP 監控系統），反映設備供應商接觸尖端技術所帶來的 IP 安全風險。此案凸顯：**設備供應商不僅是硬體供應者，更是 TSMC 核心製程 know-how 的潛在洩漏途徑**——供應鏈安全已從「供貨穩定性」擴展至「智財保護」維度。（[來源：ainvest — TEL-TSMC IP Case, 2025-08](https://www.ainvest.com/news/semiconductor-supply-chain-security-age-geopolitical-risk-lessons-tsmc-tokyo-electron-case-2508/)；[ainvest — Geopolitical IP Risks, 2025-08](https://www.ainvest.com/news/geopolitical-ip-risks-semiconductor-supply-chain-era-investment-uncertainty-2508/)）

**制裁情境下的設備替代可行性總結**：

| 情境 | 影響範圍 | TSMC 台灣廠韌性 | 海外廠韌性 | 出處 |
|------|---------|----------------|----------|------|
| **日本加入對台設備禁運**（極低概率） | TEL 塗佈/顯影+蝕刻+Shin-Etsu 光阻劑斷供 | 台灣本地庫存可維持 3-6 個月；光阻劑有本地產能但 EUV 級別原料仍需進口 | 美國廠不受影響（AMAT/Lam 為美國企業） | 推估 |
| **美國單方面對台設備禁運**（極低概率） | AMAT+Lam+KLA 設備停止維護/供件 | 12-18 個月內蝕刻/檢測能力退化；TEL 可部分替代蝕刻但非完全互換 | 海外廠同樣受影響 | 推估 |
| **封鎖情境——海運中斷** | 所有進口設備零件+化學原料中斷 | 備件庫存 3-6 個月；化學材料（台灣本地產能+庫存）可維持 1-3 個月；**光阻劑為最先觸及瓶頸的材料** | 海外廠不受直接影響 | [Rhodium Group](https://rhg.com/research/taiwan-economic-disruptions/)；產業慣例推估 |

**對投資人的含義**：TSMC 的設備與材料供應鏈雖高度集中，但三道防線降低了實際風險：(1) **盟友體系**——五大設備商分屬美國（3 家）、日本（1 家）、荷蘭（1 家），均為台灣盟友圈成員；(2) **本地化生產**——Shin-Etsu 光阻劑、GlobalWafers 矽晶圓、特殊氣體分裝均已在台灣設廠；(3) **庫存緩衝**——TSMC 通常備有 3-6 個月關鍵零件與材料庫存。最大風險不在於個別供應商斷供，而在於**封鎖情境下的全面海運中斷**——屆時所有進口依賴同時觸及瓶頸。

### 美中科技脫鉤下客戶替代採購選項分析——NVIDIA、Apple 與 Broadcom 的「Plan B」

美中科技脫鉤加速下，TSMC 的頂級客戶正從「單一代工廠」模式逐步向「多源採購」過渡。這一趨勢對 TSMC 構成長期市佔率稀釋風險，但短期內（2026-2028）替代方案的技術成熟度仍嚴重不足，TSMC 的不可替代性在高端先進製程維度上反而持續強化。

**客戶替代採購進展一覽（截至 2026 年 3 月）**：

| 客戶 | 當前 TSMC 依賴度 | 替代代工廠 | 替代進展 | 轉移製程/產品 | 替代量佔比 | 時間表 | 出處 |
|------|-----------------|----------|---------|-------------|----------|--------|------|
| **Apple** | ~22% TSMC 營收；旗艦 A/M 系列 100% TSMC | **Intel Foundry（18A-P）** | Apple 已取得 Intel 18A-P PDK 0.9.1GA（NDA 下）；等待 PDK 1.0/1.1（2026 初） | **入門級 M 系列**（MacBook Air、iPad Air、base iPad Pro） | ~15-20%（年產 1,500-2,000 萬顆） | **2027 量產** | [Digitimes, 2025-12-01](https://www.digitimes.com/news/a20251201PD206/apple-intel-semiconductor-foundry-chips-tsmc.html)；[Gadget Hacks](https://apple.gadgethacks.com/news/intel-to-make-apple-m-series-chips-by-2027-in-shocking-deal/) |
| **Apple** | 同上 | Samsung Foundry | 持續評估中；Samsung 2nm 目標 2026 量產 | 尚未確認具體產品 | 待定 | **2027-2028**（若 Samsung 2nm 良率達標） | [Economy.ac, 2025-10](https://economy.ac/news/2025/10/202510281010) |
| **NVIDIA** | <12% TSMC 營收；旗艦 GPU 100% TSMC | **Samsung Foundry** | Samsung 為 NVIDIA NVLink Fusion 生態系製造 **Groq 3 LPU**（推理晶片）；2025 Q3 出貨 | **推理專用晶片**（非旗艦訓練 GPU） | <5%（推理晶片佔 NVIDIA 營收小部分） | **2025 已啟動** | [TrendForce, 2025-12-29](https://www.trendforce.com/news/2025/12/29/news-samsung-emerges-as-potential-second-foundry-for-nvidia-alongside-tsmc-after-groq-licensing-deal)；[TrendForce, 2025-10-14](https://www.trendforce.com/news/2025/10/14/news-nvidia-adds-samsung-foundry-to-nvlink-fusion-ecosystem-for-custom-silicon-manufacturing/) |
| **NVIDIA** | 同上 | **Intel Foundry（14A）** | NVIDIA 將下一代 **Feynman** 架構的 **I/O dies** 交由 Intel 14A 製程+EMIB 封裝製造 | **I/O dies**（非 GPU 運算核心） | ~25% Feynman 生產與封裝量 | **2027-2028** | [FinancialContent, 2026-01-28](https://www.financialcontent.com/article/tokenring-2026-1-28-nvidia-breaks-tsmc-monopoly-strategic-move-to-intel-foundry-for-future-feynman-ai-chips) |
| **Broadcom** | <10% TSMC 營收；定製 ASIC 依賴 TSMC | Samsung Foundry | Samsung 贏得 **Tesla AI6 HPC 晶片**合約（$165 億，2025-2033） | 主要服務 Tesla 而非 Broadcom 直接轉單 | N/A | 2025-2033 | [Digitimes, 2025-12](https://www.digitimes.com/news/a20251217PD225/samsung-intel-nvidia-samsung-foundry-chips.html) |

**關鍵判斷——「Plan B」的結構性限制**：

**限制一：旗艦產品仍鎖定 TSMC**。Apple 僅將入門級 M 系列（~15-20% 出貨量）交由 Intel，Pro/Max/Ultra 變體仍 100% 由 TSMC 製造。NVIDIA 僅將 I/O dies（非 GPU 運算核心）交由 Intel，旗艦 Blackwell/Rubin/Feynman 的運算核心（compute die）仍 100% 由 TSMC N3/N2 製造。這反映了一個核心事實：**在先進製程的最高端（≤3nm、最高良率、最大規模），TSMC 仍無可替代。**

**限制二：替代方案的良率與成本差距**。Samsung 2nm 目標 2026 量產，但其 3nm 良率至 2025 年中僅 ~50%（vs. TSMC ~90%），2nm 能否顯著改善存疑。Intel 18A 已開始量產但良率仍需至 2027 年才達業界標準。即使替代方案上線，客戶面臨的成本溢價（Samsung/Intel 製造成本較 TSMC 高 20-40%）與良率損失使其僅適用於對成本敏感的入門級產品。

**限制三：轉換成本極高**。According to SemiAnalysis（2025），Apple 與 TSMC 的合作深度已達「共同開發製程變體」的層級——Apple 不僅使用 TSMC 的標準製程，更與 TSMC 聯合客製化特殊製程選項。轉移至 Intel/Samsung 需從 PDK 適配、IP 遷移、設計規則重寫到良率學習曲線重跑，整個過程需 **18-24 個月**。這意味著客戶的「Plan B」在啟動後仍需 2 年才能達到量產級穩定。（[來源：SemiAnalysis — Apple-TSMC Partnership, 2025](https://newsletter.semianalysis.com/p/apple-tsmc-the-partnership-that-built)）

**對 TSMC 先進製程市佔率的量化影響估算**：

| 時間範圍 | 替代方案成熟度 | TSMC 先進製程市佔率（7nm 以下） | 市佔變化 | 關鍵假設 |
|---------|-------------|---------------------------|---------|---------|
| 2026（現況） | Intel 18A 初期量產；Samsung 3nm 良率 ~50% | **~90%** | 基準 | 替代品良率不足，僅 I/O dies/入門級晶片可轉移 |
| 2027-2028 | Intel 18A 良率達標；Apple 入門級轉單；NVIDIA I/O dies 轉 Intel | **~82-87%** | -3~8pp | Apple 入門級 ~20% 轉 Intel；NVIDIA ~25% Feynman I/O 轉 Intel |
| 2029-2030（若 Intel 18A 成功+Samsung 2nm 追上） | Intel/Samsung 在成熟先進節點形成有效競爭 | **~70-80%** | -10~20pp | Bull case for competitors；TSMC 仍主導最先進節點（A16/A14） |
| 2029-2030（若 Intel/Samsung 失敗） | 替代方案良率不達標 | **~88-92%** | ±2pp | 客戶放棄轉單計畫，回流 TSMC |

**Wei 的回應與策略定位**：面對客戶分散供應鏈的趨勢，Wei 在 2026 年 1 月法說中展現冷靜自信：「In the development of semiconductor technology to this point, receiving investment has not helped to improve competitiveness, right?」——直言資本投入無法買到技術領先。他更指出 TSMC 的核心優勢在於：「the engagement lead time with customer is now at least 2 to 3 years in advance」——2-3 年的客戶接洽前置期意味著 TSMC 對競爭者搶單動態有充足的預警時間與應對空間。（[來源：WCCFTech, 2026-01](https://wccftech.com/tsmcs-ceo-says-intel-foundry-wont-be-competitive-by-just-throwing-money/)；[TSMC Q3 2025 Transcript](https://www.fool.com/earnings/call-transcripts/2025/10/17/tsmc-tsm-q3-2025-earnings-call-transcript/)）

Morris Chang 在 Acquired 播客中對此類競爭動態有更深層的洞察：他回憶 1990 年代 NVIDIA 曾嘗試多源採購（「second source」），但最終因良率與成本差距太大而回流 TSMC。歷史可能重演——**客戶的「Plan B」往往在實踐中證明只是「Plan TSMC with extra steps」**。（[來源：Acquired Podcast, 2025-01](https://podscripts.co/podcasts/acquired/tsmc-founder-morris-chang)）

**對投資人的含義**：客戶替代採購趨勢是 TSMC 面臨的**真實但可控的長期風險**。最壞情境（Intel 18A 成功+Samsung 2nm 追上）下，TSMC 先進製程市佔可能從 90% 降至 70-80%——但這一情境需要兩家追趕者同時成功，歷史概率不高。更可能的情境是：客戶將入門級/非核心晶片分散至替代代工廠，旗艦產品仍鎖定 TSMC，使 TSMC 的 ASP（平均晶圓單價）反而因 mix 改善而提升——**失去低毛利訂單、保留高毛利訂單的結構性優化**。

## 6.3 政策/制裁/貿易風險與衝突情境量化分析

### 台海衝突概率評估

多個智庫與風險評估機構對台海衝突概率提供了不同維度的量化估計：

| 來源 | 情境 | 概率/風險等級 | 時間範圍 | 出處 |
|------|------|-------------|---------|------|
| CFR 2026 Preventive Priorities Survey | 中國加劇對台軍事/經濟/政治壓力引發嚴重危機 | **Tier I（最高）**；發生概率「even chance」（~50%） | 2026 | [CFR — Conflicts to Watch 2026](https://www.cfr.org/report/conflicts-watch-2026) |
| Recorded Future（Insikt Group） | 短期入侵 | 目前不太可能（unlikely） | 2025-2026 | [Recorded Future, 2025-02](https://assets.recordedfuture.com/insikt-report-pdfs/2025/ta-cn-2025-0212.pdf) |
| Recorded Future（Insikt Group） | 入侵風險持續上升 | 很可能持續增加（very likely to continue to increase） | 2027-2049 | [Recorded Future, 2025-02](https://assets.recordedfuture.com/insikt-report-pdfs/2025/ta-cn-2025-0212.pdf) |
| 未具名顧問機構 | 中國入侵 | 30%（未來五年） | 2025-2030 | [ASIS Online — Global Risk Forecast 2026](https://www.asisonline.org/security-management-magazine/latest-news/today-in-security/2025/december/2026-risk-factors-around-the-world/) |
| 未具名顧問機構 | 海空封鎖 | 60%（未來五年） | 2025-2030 | [ASIS Online — Global Risk Forecast 2026](https://www.asisonline.org/security-management-magazine/latest-news/today-in-security/2025/december/2026-risk-factors-around-the-world/) |
| International Crisis Group | 整體台海衝突 | 歸類為全球最受關注的地緣風險之一 | 持續 | [Crisis Group — Taiwan Strait](https://www.crisisgroup.org/asia-pacific/north-east-asia/taiwan-strait) |

**關鍵判讀**：CFR 的「even chance」評估需謹慎解讀——指的是「中國加劇壓力引發嚴重危機」而非「全面入侵」。According to Recorded Future, 短期（2025-2026）全面入侵的可能性仍低，但 2027 年後風險持續攀升。最可能的短期行動是海上與空中「隔離」（quarantine），因其動員成本低、干擾效果高。

### 衝突情境對 TSMC 的財務衝擊估算

| 情境 | 全球經濟衝擊 | TSMC 營運衝擊 | 出處 |
|------|------------|-------------|------|
| **情境一：海上隔離/封鎖** | 全球 GDP 損失 $5 兆（第一年）；$1.6 兆半導體相關營收中斷 | TSMC 台灣產能（佔 ~80%）受物流干擾，但工廠可繼續運作；營收損失估 20-40%（取決於封鎖時長與範圍） | [Rhodium Group](https://rhg.com/research/taiwan-economic-disruptions/)；[Bloomberg Economics](https://www.aei.org/articles/how-disruptive-would-a-chinese-invasion-of-taiwan-be/) |
| **情境二：全面軍事衝突** | 全球 GDP 損失 ~$10 兆（第一年） | TSMC 台灣廠區可能遭受實體損壞或完全停產；幾乎全部台灣營收（~80% 產能）面臨歸零風險 | [Bloomberg Economics / AEI](https://www.aei.org/articles/how-disruptive-would-a-chinese-invasion-of-taiwan-be/) |
| **情境三：灰色地帶施壓（現狀）** | 保險成本上升、供應鏈重組成本 | 營運不受直接影響，但客戶加速分散供應鏈需求，推動 TSMC 海外擴張成本 | [Nature Communications](https://www.nature.com/articles/s41467-025-65403-w) |

**保險與航運風險數據**：According to Nature Communications（2025），海上咽喉點地緣風險的預期貿易干擾價值估計每年 $1,920 億美元，其中台灣海峽與蘇伊士運河為主要風險來源。航運延誤、改道、保險費率上升與貿易中斷的經濟損失估計每年 $107 億美元。（[來源：Nature Communications, 2025](https://www.nature.com/articles/s41467-025-65403-w)）

**台灣能源脆弱性加劇封鎖風險**：According to Global Taiwan Institute（2026），台灣進口約 97% 的能源，封鎖情境下僅能維持約兩週的能源供應。台灣電力公司 2022-2024 年累積虧損超過 NT$3,500 億（$110.8 億美元），反映能源價格補貼的財務壓力。（[來源：Global Taiwan Institute, 2026-02](https://globaltaiwan.org/2026/02/taiwans-bumpy-road-to-energy-resilience/)）

### 中國反制風險——SMIC 追趕時程與技術差距（更新至 2026 年 3 月）

| 指標 | TSMC | SMIC | 差距 | 出處 |
|------|------|------|------|------|
| 最先進量產節點 | 2nm（N2，2025 量產） | **5nm（N+3，2025 年 12 月量產確認）** | **1.5-2 代** | [TechInsights — Kirin 9030 Analysis, 2025-12](https://www.techinsights.com/blog/smic-n3-confirmed-kirin-9030-analysis-reveals-how-close-smic-5nm)；[Bloomberg, 2025-12-11](https://www.bloomberg.com/news/articles/2025-12-11/china-s-huawei-and-smic-make-progress-with-chips-report-finds) |
| 5nm（N+3）良率 | N5 良率 >90%（量產 5 年） | **30-40%** | 良率差距 ~50pp+ | [Tom's Hardware — Kirin 9030 on SMIC N+3](https://www.tomshardware.com/tech-industry/semiconductors/huaweis-latest-mobile-is-chinas-most-advanced-process-node-to-date-despite-using-blacklisted-chipmaker-huawei-kirin-9030-mobile-soc-made-on-smic-n-3-process-but-cant-compete-with-5nm-nodes) |
| 7nm 良率 | N/A（已進入 3nm/2nm） | **60-70%**（成熟產品）；華為 Ascend 910C 約 **40%**（目標 60%） | 良率與產品成熟度差距仍大 | [TrendForce, 2026-02](https://www.trendforce.com/news/2026/02/11/news-smic-posts-record-9-3b-in-2025-sales-7nm-yields-reportedly-weigh-on-margins/)；[SemiAnalysis](https://newsletter.semianalysis.com/p/huawei-ascend-production-ramp) |
| 7nm 月產能 | N/A | **~30,000 片/月**（2025 年底）→目標 **60,000**（2026） | 規模差距巨大 | [TrendForce, 2025-08](https://www.trendforce.com/news/2025/08/29/news-smic-1h25-net-profit-rises-35-6-7nm-capacity-reportedly-to-double-in-2026/) |
| 5nm（N+3）月產能 | N5 數十萬片/月 | **~10,000 片/月**（Yole 估） | ~20-30 倍 | [Tom's Hardware](https://www.tomshardware.com/tech-industry/semiconductors/huaweis-latest-mobile-is-chinas-most-advanced-process-node-to-date-despite-using-blacklisted-chipmaker-huawei-kirin-9030-mobile-soc-made-on-smic-n-3-process-but-cant-compete-with-5nm-nodes) |
| EUV 光刻機 | 大量部署 | 受美國出口管制無法取得 | 設備封鎖 | [TrendForce](https://www.trendforce.com/news/2026/02/25/news-china-reportedly-aims-to-boost-7nm-5nm-output-fivefold-in-two-years-driven-by-smic-and-hua-hong/) |
| 中國先進產能目標 | — | 100,000 片/月（7nm+5nm，1-2 年內），2030 年再增 500,000 片 | — | [TrendForce, 2026-02](https://www.trendforce.com/news/2026/02/25/news-china-reportedly-aims-to-boost-7nm-5nm-output-fivefold-in-two-years-driven-by-smic-and-hua-hong/) |
| 5nm 成本差距 | 基準 | 較 TSMC 高 **50%+**（DUV 多重曝光） | 成本劣勢 | [WCCFTech](https://wccftech.com/smic-5nm-development-completed-in-2025/) |
| 2025 全年營收 | ~$115B | **$9.3B**（創紀錄） | ~12 倍 | [TrendForce, 2026-02](https://www.trendforce.com/news/2026/02/11/news-smic-posts-record-9-3b-in-2025-sales-7nm-yields-reportedly-weigh-on-margins/) |
| 毛利率 | 59.9%（2025） | **19.2%**（Q4 2025，因 7nm 良率拖累） | 40pp+ | [TrendForce, 2026-02](https://www.trendforce.com/news/2026/02/11/news-smic-posts-record-9-3b-in-2025-sales-7nm-yields-reportedly-weigh-on-margins/) |
| 下一代開發 | A16（1.6nm，2026 量產） | 據報已啟動 **3nm GAA R&D**，預計 2026 年 tape-out | 2-3 代 | [Design-Reuse](https://www.design-reuse.com/news/202529830-chinese-smic-achieves-5-nm-production-on-n-3-node-without-euv-tools/) |

**2025 年 12 月關鍵突破：SMIC N+3（5nm）量產確認**。TechInsights 於 2025 年 12 月拆解華為 Mate 80 Pro 搭載的 **Kirin 9030** SoC，確認其使用 SMIC N+3 製程——這是中國首次量產 5nm 級晶片，全程使用 DUV 多重圖案化技術（無 EUV）。TechInsights 評估指出，N+3 較 N+2（7nm）有「meaningful density improvements」但「remains significantly less scaled than leading commercial 5nm nodes」——換言之，SMIC 的「5nm」在電晶體密度上仍不及 TSMC N5 或 Samsung 5LPE。華為 Mate 80 系列因 Kirin 9030 供應不足，2025 年 12 月即出現缺貨。（[來源：TechInsights, 2025-12](https://www.techinsights.com/blog/smic-n3-confirmed-kirin-9030-analysis-reveals-how-close-smic-5nm)；[SCMP — Kirin 9030 Progress](https://www.scmp.com/tech/tech-war/article/3336501/huaweis-kirin-9030-processor-shows-chinas-chip-progress-despite-us-export-curbs-report)）

**SMIC 財務健康度**：SMIC 2025 全年營收 $9.3B（創紀錄），但毛利率從 Q4 2024 的 22.6% 下滑至 Q4 2025 的 **19.2%**——7nm 低良率被列為「significant profitability headwind」。Q1 2026 毛利率指引 18-20%，反映先進製程擴產的成本壓力。（[來源：TrendForce, 2026-02](https://www.trendforce.com/news/2026/02/11/news-smic-posts-record-9-3b-in-2025-sales-7nm-yields-reportedly-weigh-on-margins/)）

**中國半導體自給率現況**：According to IC Insights，中國製 IC 佔中國 IC 消費量約 **19-20%**（2025），遠低於原「中國製造 2025」70% 目標（已悄然放棄）。設備自給率方面，2024 年實際 **13.6%**，2025 年攀升至 **~35%**——在光阻剝離、清洗、蝕刻、CMP 等品類進展顯著，但光刻、量測、塗佈/顯影仍嚴重落後。（[來源：Tom's Hardware — State of China's Semiconductor Push](https://www.tomshardware.com/tech-industry/semiconductors/the-state-of-chinas-decade-long-semiconductor-push-still-a-decade-behind-despite-hundreds-of-billions-spent-and-significant-progress-examining-the-original-made-in-china-2025-initiative)；[TrendForce, 2025-02](https://www.trendforce.com/news/2025/02/14/news-chinas-semiconductor-equipment-industry-booming-self-sufficiency-to-reach-50-by-2025/)）

**中國十五五規劃（2026-2030）半導體目標**：According to The Diplomat（2026-03），中國十五五規劃已**放棄 70% 自給率硬指標**，改以「數位經濟附加價值佔 GDP 12.5%」的軟性目標取代。五大優先方向：(1) 先進邏輯製程（推動 7nm/5nm 良率與產能）；(2) 記憶體擴張（YMTC NAND/CXMT DRAM 擴產，啟動 HBM 開發）；(3) 光刻突破（國產 EUV/先進 DUV）；(4) 設備與材料本土化；(5) EDA 工具。配套資金規模高達 **$700 億**，加上 2024 年啟動的大基金三期持續注資。（[來源：The Diplomat, 2026-03](https://thediplomat.com/2026/03/chinas-5-year-plan-has-moved-beyond-the-chip-war-washington-hasnt-noticed/)；[Yole Group, 2025](https://www.yolegroup.com/strategy-insights/chinas-next-move-the-five-year-plan-that-could-reshape-semiconductors/)；[SCMP — China Chip Bosses Endorse Push](https://www.scmp.com/tech/article/3345996/chinas-chip-bosses-endorse-semiconductor-push-next-5-year-plan)）

**關鍵判斷（更新）**：SMIC 的追趕速度超過 2024 年預期——N+3（5nm）已從「開發完成」進入「量產確認」階段。然而四重結構性限制仍在：(1) 無 EUV 設備，DUV 多重曝光使良率（30-40%）與成本（+50%）劣勢顯著；(2) 5nm 月產能僅 ~10,000 片，遠不及全球需求；(3) 毛利率（19%）僅為 TSMC（60%）的三分之一，先進製程擴產反而壓縮獲利；(4) 十五五規劃放棄 70% 自給率目標本身即承認追趕的艱難。SMIC 的「足夠好」策略可滿足部分中國國內市場（華為手機/AI 晶片），但在全球先進製程市場上仍無法與 TSMC 構成有效競爭。

### 中國本土 EUV 突破的時間軸風險評估

中國在 EUV 光刻技術上的自主研發進展值得密切關注，但需嚴格區分「突破」與「量產」之間的巨大鴻溝。

**中國國產 EUV 發展里程碑**：

| 時間點 | 進展 | 技術路線 | 距量產差距 | 出處 |
|--------|------|---------|----------|------|
| 2025 Q3 | SMIC/華為合作 LDP-EUV 試產開始 | LDP（雷射誘發放電等離子體） | 功率僅 50-100W，量產需 ≥250W | [Digitimes, 2025-03](https://www.digitimes.com/news/a20250311VL200/euv-huawei-smic-2026-production.html) |
| 2025 年 12 月 | 深圳實驗室驗證國產 EUV 原型機 | LDP（非 ASML 的 LPP 路線） | 原型機階段，非生產機台 | [Global SMT Asia](https://globalsmtasia.com/chinas-euv-breakthrough-huawei-smic-reportedly-advancing-ldp-lithography-eye-3q25-trial-2026-rollout/) |
| 2026E | 首批「EUV 精修」晶片下線（目標） | LDP-EUV | 良率/產量未知 | [WCCFTech, 2025](https://wccftech.com/china-in-house-euv-machines-entering-trial-production-in-q3-2025/) |
| 2026 年 1 月 | 中國半導體設備自給率達 35% | DUV + 輔助設備為主 | EUV 自給仍為 0% | [Chronicle Journal](https://markets.chroniclejournal.com/chroniclejournal/article/tokenring-2026-1-21-china-reaches-35-semiconductor-equipment-self-sufficiency-amid-advanced-lithography-breakthroughs) |

**技術可行性評估**：

According to CSIS（2025），中國的光刻進展「project ambition but do not fundamentally alter the strategic reality」。CSIS 分析指出：(1) 中國的 e-beam 光刻（Xizhi 系統）「ill-suited for high-volume chip production required to power advanced AI systems」，因通量限制無法用於量產；(2) Shanghai Micro Electronics Equipment（SMEE）僅佔全球 i-line 市場 4%，DUV 工具仍遠落後於 ASML/Nikon；(3) 華為關聯的 SiCarrier 28nm DUV 工具仍處早期階段。CSIS 結論：EUV 能力「remain firmly out of reach despite massive state investment」。（[來源：CSIS — Breakthroughs or Boasts?, 2025](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)）

According to EE Times（2025），中國 LDP-EUV 路線選擇了與 ASML（LPP 路線）不同的技術方向，理論上設計更簡潔，但功率瓶頸（目前 50-100W vs. 量產需 250W+）、多層鏡（MLM）精度、光罩與光阻等關鍵子系統仍是重大挑戰。即使功率問題解決，從原型到量產級設備通常需 5-8 年——ASML 本身從 EUV 概念到商業化花了 20 年。（[來源：EE Times — China EUV Breakthrough](https://www.eetimes.com/china-euv-breakthrough-and-the-rise-of-the-silicon-curtain/)；[TrendForce, 2025-11](https://www.trendforce.com/news/2025/11/10/news-decoding-chinas-lithography-push-to-challenge-asml-from-sicarrier-to-alternative-euv-paths/)）

**對 TSMC 的風險評估**：

| 時間範圍 | 中國 EUV 進展對 TSMC 威脅程度 | 判斷依據 |
|---------|---------------------------|---------|
| 2026-2028 | **極低** | LDP-EUV 原型功率不足、無量產能力；SMIC 依賴 DUV 多重曝光，成本高 50%+ |
| 2028-2030 | **低** | 即使功率突破，從試產到穩定量產需 3-5 年；TSMC 屆時已進入 A14/A12 世代 |
| 2030-2035 | **中低** | 中國可能實現有限 EUV 量產，但技術仍落後 TSMC 2-3 代；「足夠好」的國產晶片主要服務中國國內市場 |

Wei 在 2026 年 1 月法說中對競爭者追趕的態度直白：「In the development of semiconductor technology to this point, receiving investment has not helped to improve competitiveness, right?」——直言砸錢無法買到競爭力，技術領先需要時間、人才與文化的長期累積。（[來源：WCCFTech, 2026-01](https://wccftech.com/tsmcs-ceo-says-intel-foundry-wont-be-competitive-by-just-throwing-money/)）

Morris Chang 早在 2023 年最後一次公開演講中即對中國的追趕做出判斷：「Mainland is not yet a rival, especially in terms of wafer manufacturing.」（[來源：Interconnected Blog, 2023-04](https://interconnected.blog/morris-changs-last-speech/)）——但他也暗示，如果中國判斷時間窗口正在關閉，風險在於其行為而非技術能力。

### 解放軍封鎖情境對 TSMC 營收衝擊估算

基於 TSMC 2025 年營收 ~$115B 與產能分布，以三種封鎖情境估算：

| 情境 | 封鎖範圍 | 持續時間 | TSMC 營收衝擊（年化） | 全球供應鏈衝擊 | 概率評估 |
|------|---------|---------|---------------------|-------------|---------|
| 部分封鎖（航運干擾） | 台灣周邊海域巡邏、部分航線封鎖 | 1-3 個月 | -15~25%（$17-29B） | 晶片交期延長 4-8 週，客戶加速轉單 | 中等（5 年內 30-40%） |
| 全面封鎖（海空隔離） | 全面禁止進出口 | 3-12 個月 | -60~80%（$69-92B） | 全球半導體供應崩潰，GDP 損失 $5T | 低（5 年內 10-20%） |
| 軍事衝突（入侵/轟炸） | 實體攻擊基礎設施 | 不確定 | 台灣產能歸零（~$92B，佔 80%） | 全球 GDP 損失 ~$10T | 極低（5 年內 <10%） |

**註**：以上為估算模型，並非精確預測。概率評估綜合 CFR、Recorded Future 與風險顧問機構的公開評估。TSMC 海外產能（美國+日本+德國）在最極端情境下可維持約 $20-30B 的年化營收，但需數年才能擴張至台灣產能規模。

### 衝突情境量化深化——全球 GDP 與產業鏈衝擊建模

According to Insurance Journal（2026），基於 Bloomberg Economics 與多家智庫的建模，台海衝突的經濟衝擊遠超此前估計：

**三層級情境量化（年化）**：

| 情境 | 全球 GDP 衝擊 | 中國 GDP | 美國 GDP | 台灣 GDP | 先進晶片供應中斷 | TSMC 產能影響 | 出處 |
|------|-------------|---------|---------|---------|----------------|-------------|------|
| **緊張升溫（灰色地帶）** | -0.2%（~$2,000 億） | -0.6% | -0.2% | -3~5% | 無直接中斷，但保險/航運成本升 | 營運不受直接影響；客戶加速分散 | [Insurance Journal, 2026-02](https://www.insurancejournal.com/news/international/2026/02/12/857770.htm) |
| **全面封鎖（海空隔離）** | **-5.3%（~$5.3 兆）** | **-8.9%** | **-3.2%** | **-12.5%** | 先進邏輯晶片 -62%，成熟晶片 -31% | 台灣產能（~80%）停擺；海外廠維持 ~$20-30B | [Insurance Journal, 2026-02](https://www.insurancejournal.com/news/international/2026/02/12/857770.htm)；[Bloomberg Economics](https://www.intellinews.com/a-chinese-invasion-of-taiwan-would-cripple-the-global-semiconductor-supply-chain-and-the-planet-387624/) |
| **全面軍事衝突（入侵）** | **-9.6%（~$10.6 兆）** | **-11%** | **-6.6%** | 經濟癱瘓 | 先進晶片接近歸零；全球智慧手機產量 -80%、汽車 -30~50% | 台灣 12 座 300mm 廠全部停擺或摧毀；ASML 遠端停用 EUV（見下節） | [Insurance Journal, 2026-02](https://www.insurancejournal.com/news/international/2026/02/12/857770.htm) |

**產業鏈連鎖效應（軍事衝突情境）**：
- **智慧手機**：全球銷量在庫存耗盡後暴跌 **80%**，Apple iPhone 銷售損失 **90%+**（[Insurance Journal, 2026](https://www.insurancejournal.com/news/international/2026/02/12/857770.htm)）
- **汽車**：台灣供應全球 **18%** 的汽車半導體需求，德國車廠面臨 **190 萬輛**（2026）產量損失（同上）
- **航運**：台灣海峽承載全球 **50%** 的貨櫃船隊通行、年 **$2.45 兆** 海運貿易（全球 20%+）；中國航運巨頭中遠海運營收損失 **63-68%**（同上）
- **AI 產業**：全球 AI 訓練/推理能力瞬間歸零，雲端基礎設施擴建停擺；TSMC 前 10 大客戶合計市值 **$14 兆**（同上）

**複合風險迴路——成長 → 脆弱性 → 地緣風險的自我強化**：

TSMC 的高速成長本身加劇了地緣風險的嚴重性，形成自我強化的風險迴路：(1) TSMC 先進製程需求成長 → 台灣用電攀升至全國 24%（2030E）→ 能源進口依存度 97% 使封鎖脆弱性加劇；(2) 全球對 TSMC 依賴度持續上升（先進邏輯 92%）→ 封鎖的全球經濟衝擊規模擴大（從 $2.7T 上修至 $10.6T）→ 中國可能判斷「遲做不如早做」而加速行動時間表；(3) TSMC 海外擴張雖分散風險，但同時稀釋矽盾效力 → 台灣戰略價值邊際遞減。這一迴路意味著：**TSMC 越成功，台灣的地緣政治風險就越高——投資人享受的成長紅利與承擔的尾部風險同步放大。**（[來源：ResearchGate — Silicon Shield or Silicon Trap?](https://www.researchgate.net/publication/391522122_Silicon_Shield_or_Silicon_Trap_Taiwan's_Semiconductor_Dominance_and_the_Strategic_Calculus_of_Chinese_Military_Aggression)；[Insurance Journal, 2026](https://www.insurancejournal.com/news/international/2026/02/12/857770.htm)）

### ASML EUV 斷供情境——設備禁運與「遠端停用」對 TSMC 先進製程的影響

**ASML 遠端停用機制（Kill Switch）**：

According to Bloomberg（2024）與多家媒體報導，荷蘭政府已要求 ASML 在出貨至 TSMC 台灣廠區的 EUV 光刻機中內建「遠端停用」（remote disable）功能——俗稱「kill switch」。此機制的設計目的是：若中國入侵台灣並試圖接管 TSMC 晶圓廠，荷蘭/美國政府可遠端停用 EUV 設備，使先進製程產線無法運作，防止中國獲得 EUV 製造能力。（[來源：Bloomberg, 2024；Tom's Hardware — ASML Kill Switch](https://www.tomshardware.com/tech-industry/semiconductors/asml-is-prepared-for-chinas-rare-earth-export-controls-finance-head-says-company-has-stock-thanks-to-long-lead-times)）

**EUV 設備維護依賴性與斷供持續時間估算**：

| 面向 | 現況 | 斷供影響 | 出處 |
|------|------|---------|------|
| EUV 維護週期 | 約每 **6 個月**需 ASML 原廠維護 | 無維護 6-12 個月後設備效能顯著退化 | [Entropy Capital — ASML Supply Chain](https://entropycapital.substack.com/p/asmls-supply-chain-bill-of-materials) |
| 備用零件庫存 | TSMC 通常備有 3-6 個月關鍵零件庫存 | 零件耗盡後 EUV 停機，影響 N7+/N5/N3/N2 所有 EUV 層 | 產業慣例推估 |
| EUV 層數依賴 | N5：14 層 EUV；N3：20+ 層；N2：20+ 層 | 任一 EUV 層失效即導致該製程無法繼續生產 | [WikiChip](https://en.wikichip.org/wiki/7_nm_lithography_process)；[Tom's Hardware](https://www.tomshardware.com/tech-industry/intels-18a-and-tsmcs-n2-process-nodes-compared-intel-is-faster-but-tsmc-is-denser) |
| 替代方案 | DUV 多重曝光（SMIC 路線） | 理論可行但需 6-12 個月重新調校製程；良率驟降至 SMIC 水準（~20-50%）；成本增加 50%+ | [WCCFTech — SMIC 5nm](https://wccftech.com/smic-5nm-development-completed-in-2025/) |

**ASML 斷供情境對 TSMC 產能的階段性影響**：

| 階段 | 時間範圍 | TSMC 先進製程產能（vs. 正常水準） | 說明 |
|------|---------|-------------------------------|------|
| 備件緩衝期 | 0-6 個月 | 80-100% | 消耗現有備件庫存，產能近乎正常 |
| 效能退化期 | 6-12 個月 | 40-70% | EUV 設備效能下降、故障率上升；部分產線被迫停機 |
| 產能崩潰期 | 12-18 個月 | 10-30% | 多數 EUV 依賴製程（N5/N3/N2）無法繼續；僅成熟製程（28nm+）維持運作 |
| 長期穩態 | 18 個月+ | <10%（先進製程）；~100%（成熟製程） | 先進製程實質停產；TSMC 可能被迫以 DUV 多重曝光維持有限的 7nm 生產 |

**對投資人的含義**：ASML EUV 斷供情境是除軍事衝突外對 TSMC 最極端的技術風險——即使台灣物理上未受攻擊，設備禁運或遠端停用仍可在 12-18 個月內癱瘓 TSMC 絕大部分先進製程產能。然而，此情境的觸發條件極為嚴苛（需荷蘭/美國政府主動啟動），且 ASML 自身高度依賴 TSMC 訂單（佔 ASML 營收 30%+），形成「互相確保破壞」的威懾均衡。

Morris Chang 在自傳中回顧 TSMC 與 ASML 的共生關係：「TSMC and ASML were established almost at the same period, and we grew up together and treated each other as partners.」——這一數十年的共生關係使單方面斷供的政治成本極高。（[來源：TechSoda, Morris Chang 自傳解析](https://techsoda.substack.com/p/tsmc-founder-morris-changs-autobiography)）

### 出口管制升級最壞情境——7nm 以下全面禁令對 TSMC 的毛利稀釋量化

**當前中國營收結構拆解**：

TSMC 2024 年中國營收佔比 **11%**（~$9.7B），但需區分**先進製程（7nm 以下）**與**成熟製程（16nm+）**的組成：

| 中國營收組成 | 估計佔中國營收比 | 估計金額（USD B） | 說明 | 出處 |
|-------------|----------------|-----------------|------|------|
| 成熟製程（16nm+）| ~60-70% | ~$5.8-6.8 | TSMC 南京廠（Fab 16）生產 16/28nm；中國 IC 設計公司成熟製程需求 | [Tom's Hardware — US allows TSMC China imports](https://www.tomshardware.com/tech-industry/semiconductors/u-s-allows-tsmc-to-import-chipmaking-equipment-to-its-china-fabs-samsung-sk-hynix-likewise-receive-go-signal-from-commerce-department) |
| 先進製程（7nm 以下）| ~30-40% | ~$2.9-3.9 | 中國 IC 設計公司（非華為）的 AI/HPC/手機晶片；已受部分出口管制限制 | [Congress.gov — CRS R48642](https://www.congress.gov/crs-product/R48642) |

**最壞情境建模：7nm 以下對華全面禁令**

| 影響面向 | 量化估算 | 推算邏輯 |
|---------|---------|---------|
| 營收損失 | ~$2.9-3.9B（佔總營收 2.5-3.4%） | 中國先進製程營收歸零 |
| 毛利稀釋 | **-0.8~1.2pp**（毛利率從 61% 降至 ~59.8-60.2%） | 先進製程毛利率高於平均（~65% vs. 整體 61%）；損失的先進製程營收對毛利率的邊際影響較大 |
| 產能重分配 | 空出的先進製程產能可在 **1-2 季**內由非中國客戶填補 | Wei 在 Q3 2025 法說：「if the China market is not available, but I still think the AI's growth will be very dramatically.」（[TSMC Q3 2025 Transcript](https://www.fool.com/earnings/call-transcripts/2025/10/17/tsmc-tsm-q3-2025-earnings-call-transcript/)）；當前先進製程供不應求（需求為產能 3 倍） |
| 淨影響（重分配後） | **-0.3~0.5pp 毛利稀釋**；營收損失可在 2 季內由其他客戶填補 | 先進製程供需缺口巨大，Wei 指出「Advanced-node wafer demand is currently about three times short of available capacity.」 |

**升級情境：全面禁止對華晶圓代工（含成熟製程）**

若美國將出口管制擴展至所有製程節點（含 16nm 以上），TSMC 中國營收全部歸零：
- 營收損失：~$9.7B（佔總營收 ~8.4%）
- 毛利稀釋：**-2~3pp**（成熟製程毛利率較低，約 45-50%，整體影響反而較溫和）
- 南京 Fab 16 面臨關閉或轉型風險
- According to TSMC Q4 2024 法說，Wei 表示：「We have a very frank and open communication with the current government and with the future one also.」——暗示 TSMC 已為政策升級預做溝通準備。（[來源：TSMC Q4 2024 Transcript](https://www.fool.com/earnings/call-transcripts/2025/01/16/taiwan-semiconductor-manufacturing-tsm-q4-2024-ear/)）

**結論**：7nm 以下全面禁令對 TSMC 的財務衝擊**可控**（毛利稀釋 <1.2pp），主因先進製程供需嚴重失衡，空出的產能可快速由非中國客戶填補。真正的風險不在於中國營收損失本身，而在於出口管制升級可能引發的地緣政治連鎖效應（中國反制措施、稀土出口限制等）。

### CFIUS 外資審查、反向 CFIUS 與台灣半導體保護機制

**CFIUS（美國外資審查委員會）對 TSMC 的影響**：

TSMC 美國亞利桑那投資為**綠地投資**（greenfield，新建產能），而非收購美國企業，因此不直接觸發 CFIUS 審查管轄權。截至 2026 年 3 月，無公開紀錄顯示 CFIUS 曾直接審查涉及 TSMC 的交易。然而，CFIUS 在半導體領域的執法史展示了美國對該產業的高度敏感：

| 案件 | 年份 | 結果 | 意義 | 出處 |
|------|------|------|------|------|
| Aixtron SE（半導體設備商） | 2016 | Obama 否決中資收購 | 設備技術不可流向中國 | [Torres Trade Law](https://www.torrestradelaw.com/posts/U.S.-Scrutiny-of-Foreign-Investment-in-the-Semiconductor-Industry:--CFIUS-Review-and-Export-Controls-Place-Deals-under-the-Microscope/238) |
| Lattice Semiconductor | 2017 | Trump 否決 Canyon Bridge $1.3B 收購 | IP 轉移風險+中國政府背景 | 同上 |
| Qualcomm（Broadcom $117B 敵意收購） | 2018 | Trump 否決 | 中國 5G 主導權風險 | 同上 |
| EMCORE/HieFo（光子晶片） | 2026-01 | Trump 下令剝離 | 磷化銦晶片可能流向中國 | [CNBC, 2026-01-03](https://www.cnbc.com/2026/01/03/trump-orders-unwind-chinese-chip-acquisition-emcore-hiefo-emcore-velocity-one-navgiation-gyro.html) |

**2024 年 CFIUS 統計**：半導體/電子零件申報案從 20 件降至 8 件（-60%），但 CFIUS 主動發起的非通知交易調查達 76 件（YoY +27%），合規現場訪查近乎翻倍至 79 次——反映「America First Investment Policy」下對半導體領域的審查從被動轉向主動。（[來源：DLA Piper — CFIUS 2024 Annual Report](https://www.dlapiper.com/en/insights/publications/2025/08/cfius-2024-annual-report)）

**「反向 CFIUS」（Reverse CFIUS）對 TSMC 供應鏈的影響**：2025 年 1 月 2 日生效的美國對外投資審查規則（Outbound Investment Screening Rule）限制美國人投資中國的半導體活動，包括先進 IC 設計、製造與封裝。此規則**不直接限制 TSMC**（台灣非受限國家），但影響 TSMC 的美國客戶與合作夥伴對中國的投資布局，間接強化了 TSMC 在非中國市場的定位。（[來源：Holland & Knight, 2025-01](https://www.hklaw.com/en/insights/publications/2025/01/outbound-investment-screening-rule-goes-into-effect)；[Skadden, 2026-01](https://www.skadden.com/insights/publications/2026/01/us-treasurys-reverse-cfius-authority)）

**CHIPS Act 附帶條件——事實上的投資管制**：TSMC 獲得 $66 億直接補貼與最高 $50 億貸款，但附帶以下限制條件：(1) **10 年內不得在中國擴展先進製程產能**；(2) 需滿足特定技術共享與勞動力發展承諾；(3) 需接受美國政府審計。這些條件雖非 CFIUS 審查，但在實質上構成了美國政府對 TSMC 全球產能布局的約束力。（[來源：CFR, 2025-03](https://www.cfr.org/articles/unpacking-tsmcs-100-billion-investment-united-states)）

**台灣自身的半導體保護機制——「N-2 規則」與國安法**

台灣建立了多層次的半導體技術保護體系：

| 機制 | 內容 | 對 TSMC 影響 | 出處 |
|------|------|-------------|------|
| **N-2 規則**（產業創新條例第 22 條） | TSMC 海外部署的製程技術須落後台灣最先進節點**至少兩代**（此前為 N-1） | 若台灣領先節點為 1.4nm，海外最多部署 1.6nm+ | [Taiwan News, 2025](https://taiwannews.com.tw/news/6267804)；[Tom's Hardware](https://www.tomshardware.com/tech-industry/semiconductors/taiwan-considers-tsmc-export-ban-that-would-prevent-manufacturing-its-newest-chip-nodes-in-u-s-limit-exports-to-two-generations-behind-leading-edge-nodes-could-slow-down-u-s-expansion) |
| **國家安全法修正（2022）** | 32 項「國家核心關鍵技術」列為保護對象（含 sub-14nm 製程、先進封裝、AI 晶片設計） | 未經授權存取/使用/揭露者面臨刑事處罰 | [Law.Asia](https://law.asia/taiwan-semiconductor-export-controls/)；[ASIL, 2025](https://www.asil.org/insights/volume/29/issue/15) |
| **中資投資限制** | 中國投資者禁止擔任台灣公司 CEO；「核心技術」產業的中國投資視為國安威脅 | 防堵中資透過投資取得 TSMC 技術 | [U.S. State Dept — 2025 Investment Climate: Taiwan](https://www.state.gov/reports/2025-investment-climate-statements/taiwan) |
| **首案執法（2025-08）** | 前 TSMC 工程師涉嫌加入日本設備商後竊取 **2nm GAA 製程機密**，遭台灣國安法起訴 | 台灣首批國安法半導體案件之一（與 6.2 TEL-TSMC IP 案呼應） | [ainvest, 2025-08](https://www.ainvest.com/news/semiconductor-supply-chain-security-age-geopolitical-risk-lessons-tsmc-tokyo-electron-case-2508/) |

**N-2 規則的戰略張力**：According to Taipei Times（2025-01），台灣經濟部於 2025 年 1 月放寬部分限制，允許 TSMC 就 2nm 美國投資進行討論——但任何實際投資仍需監管批准。這一規則在保護台灣「矽盾」的同時，也與美國 CHIPS Act 要求 TSMC 在美部署先進製程的壓力形成結構性張力。TSMC 亞利桑那 Fab 2 目標 N3 製程（2028 量產），在 N-2 規則下仍屬合規（落後 N2 一代、落後 A16 兩代），但若美國要求部署 N2 級製程，將觸及 N-2 規則的紅線。（[來源：Taipei Times, 2025-01-11](https://www.taipeitimes.com/News/biz/archives/2025/01/11/2003829992)；[CNBC — US-Taiwan Chip Deal and Silicon Shield](https://www.cnbc.com/2026/01/19/us-taiwan-chip-deal-silicon-shield-tsmc-trump-tapei-ai-semiconductor-supply-chain.html)）

**對投資人的含義**：CFIUS 對 TSMC 的直接風險極低（台灣非受限國家，投資為綠地性質），但 CHIPS Act 條件與台灣 N-2 規則形成「雙向約束」——美國要求 TSMC 在美部署先進製程（以換取補貼），台灣要求 TSMC 將最先進技術留在本土（以維護矽盾）。TSMC 需在兩者間精確平衡，任何一方不滿都可能觸發政策升級風險。

### 台灣民主治理作為護城河的分析

台灣的民主制度構成 TSMC 營運環境的隱性護城河。According to The Diplomat（2024），台灣的法治環境、智慧財產權保護與資訊透明度是 TSMC 贏得全球客戶信任的制度性基礎——客戶願意將價值數十億美元的晶片設計交付 TSMC 製造，前提是台灣的法律體系能保障其智財安全。這一「制度護城河」在威權體制下不可複製——SMIC 在中國的運營環境使全球客戶對智財保護的信心天然不足。

According to Stimson Center（2025），台灣的民主治理亦影響美國的保衛意願——美國國內政治論述中，「保衛民主台灣」的道德論述為軍事介入提供了政治正當性，這是「保衛晶片供應」的純經濟論述所不能替代的。（[來源：Stimson Center, 2025](https://www.stimson.org/2025/why-taiwan-fears-america-first-risks-eroding-its-silicon-shield/)；[The Diplomat — Silicon Shield 2.0](https://thediplomat.com/2024/09/silicon-shield-2-0-a-taiwan-perspective/)）

However, 民主治理也帶來政策不確定性：台灣 2024 年總統大選後的政黨輪替可能改變兩岸政策基調；能源政策（退核）受到選舉政治影響，可能無法最優化 TSMC 的電力需求；國防預算分配受立法院黨派博弈影響。

---

# 七、環境永續分析

## 7.1 能源與資源消耗

### 電力消耗——絕對數值、佔比與成長軌跡

TSMC 是台灣最大的單一用電戶，也是全球用電量最大的半導體公司之一。According to Statista（2024），TSMC 2023 年總電力消耗約 **24.78 TWh**（24,780 GWh），佔台灣全國用電約 **8.9%**。（[來源：Statista — TSMC Energy Consumption 2023](https://www.statista.com/statistics/1312965/tsmc-energy-consumption-by-source/)）According to New Lines Institute（2025），TSMC 佔台灣工業用電的 **41.3%**（以工業部門 63,242 GWh 計算）。（[來源：New Lines Institute](https://newlinesinstitute.org/geo-economics/taiwans-semiconductor-sustainability-and-global-implications/)）

According to Global Taiwan Institute（2026），TSMC 佔台灣整體能源消耗約 **10%**，半導體產業整體佔工業用電超過一半，先進製程製造消耗該產業近一半的能源供應。（[來源：Global Taiwan Institute, 2026-02](https://globaltaiwan.org/2026/02/taiwans-bumpy-road-to-energy-resilience/)）

**電力消耗歷年趨勢與 2030 預測**：

| 年份 | TSMC 電力消耗（TWh） | 佔台灣用電比 | 再生能源佔比 | 再生能源用量（GWh） | 備註 | 出處 |
|------|---------------------|------------|------------|-------------------|------|------|
| 2021 | ~20 | ~7.2% | 9% | ~1,800 | Greenpeace 基準年 | [Greenpeace East Asia, 2023](https://www.greenpeace.org/eastasia/press/7930/semiconductor-industry-electricity-consumption-to-more-than-double-by-2030-study/) |
| 2023 | **24.78** | **8.9%** | ~10% | 1,490 | 碳排約 1,142 萬噸 CO₂e | [Statista](https://www.statista.com/statistics/1312965/tsmc-energy-consumption-by-source/)；[New Lines Institute](https://newlinesinstitute.org/geo-economics/taiwans-semiconductor-sustainability-and-global-implications/) |
| 2024 | ~27-28（估） | ~9-10% | **13-14%** | 3,610 | 1,177 項節能措施，節省 810 GWh | [TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf)；[SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/361249-tsmcs-tsmc-2024-sustainability-report-pioneering-a-greener-semiconductor-future/) |
| 2030E | **~53（267% of 2021）** | **~24%** | 60%（目標） | ~31,800（目標） | Greenpeace 預測成長 267%；相當於 580 萬人口用電 | [Greenpeace East Asia](https://www.greenpeace.org/eastasia/press/7930/semiconductor-industry-electricity-consumption-to-more-than-double-by-2030-study/)；[DCD, 2025](https://www.datacenterdynamics.com/en/news/tsmc-could-account-for-24-of-taiwans-electricity-consumption-by-2030/) |

According to Greenpeace East Asia（2023），TSMC 的電力消耗預計到 2030 年將達到 2021 年水準的 **267%**，是所有受研究半導體製造商中增幅最大的。屆時 TSMC 用電量將相當於 **580 萬人口**（約台灣四分之一人口）的用電需求。Greenpeace 批評指出，TSMC 2021 年再生能源僅佔總能源使用的 9%，「遠低於其最大競爭對手的再生能源使用率」，並呼籲 TSMC 將 RE100 目標從 2040 年提前至 2030 年，以匹配其主要客戶 Apple 與 Microsoft 的氣候承諾。（[來源：Greenpeace East Asia, 2023-08](https://www.greenpeace.org/eastasia/press/7930/semiconductor-industry-electricity-consumption-to-more-than-double-by-2030-study/)）

However, According to CommonWealth Magazine（2024），TSMC 預計 2030 年用電量將相當於「三座核電反應爐」的發電量——這一比喻凸顯了台灣在退核政策下面臨的能源供給壓力。（[來源：CommonWealth Magazine, 2024-08-28](https://english.cw.com.tw/article/article.action?id=3766)）

**再生能源採購結構**：TSMC 2024 年簽約再生能源總裝置容量達 **4.4 GW**，主要透過：(1) 企業購電協議（CPPA）與台灣太陽能/離岸風電開發商簽訂長期合約；(2) 國際再生能源憑證（I-RECs）採購；(3) 開創性的 **20 年聯合採購協議**——以 20,000 GWh 再生能源聯合採購量為供應商與 TSMC 子公司鎖定穩定價格。全球辦公室與海外據點已實現 **100% 再生能源**，但台灣廠區因產能規模龐大，再生能源滲透率仍受限。（[來源：TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf)；[SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/361249-tsmcs-tsmc-2024-sustainability-report-pioneering-a-greener-semiconductor-future/)）

**結構性挑戰**：台灣的發電集中在南部，但主要用電在北部，造成顯著的輸電效率問題。台灣能源進口依存度高達 **97%**，台灣電力公司（Taipower）截至 2025 年 7 月底累積虧損達 **NT$4,179 億**（$132 億美元），遠超此前報導的 NT$3,500 億——反映電價補貼的財務窟窿持續擴大。目前住宅平均電價 NT$2.77/kWh，仍低於供電成本 NT$3.80/kWh，缺口由政府補貼填補。（[來源：Focus Taiwan, 2025-09-19](https://focustaiwan.tw/business/202509190017)；[Global Taiwan Institute, 2026-02](https://globaltaiwan.org/2026/02/taiwans-bumpy-road-to-energy-resilience/)）

### 先進製程能耗攀升與電價上漲對 TSMC 毛利率的敏感度分析

**N2/A16 製程能耗增加量化**：先進製程的每片晶圓能耗隨節點微縮而顯著上升。TSMC 內部數據顯示 N2/A16 每片晶圓能耗較 N5 增加約 **20-30%**，主要原因包括：(1) EUV 光刻層數從 N5 的 14 層增至 N2 的 20+ 層，每台 EUV 光刻機功率消耗約 **1 MW**；(2) GAA Nanosheet 架構的蝕刻與沉積步驟增加；(3) A16 的背面供電（Super Power Rail）增加額外製程複雜度。According to 產業分析，半導體廠的能源成本佔製造廠營運成本的 **~30%**，為繼折舊之後的第二大成本項目。（[來源：Tom's Hardware, 2025](https://www.tomshardware.com/tech-industry/tsmcs-2nm-n2-process-node-enters-production-this-year-a16-and-n2p-arriving-next-year)；[TrendForce, 2024-10-18](https://www.trendforce.com/news/2024/10/18/news-tsmc-reports-highest-electricity-price-in-taiwan-affecting-next-years-gross-margin/)）

**台灣電價連年飆升對 TSMC 的累積衝擊**：

According to TrendForce（2024-10），TSMC 披露其台灣廠區的電價在近年已**翻倍**，為 TSMC 全球所有據點中電價最高的地區。台灣工業電價歷次調漲如下：

| 調漲時間 | 漲幅 | 累積效應 | 出處 |
|---------|------|---------|------|
| 2022 年 | +15% | 基期 | [TrendForce, 2024-10-18](https://www.trendforce.com/news/2024/10/18/news-tsmc-reports-highest-electricity-price-in-taiwan-affecting-next-years-gross-margin/) |
| 2023 年 | +17% | 累計 ~+35% | 同上 |
| 2024 年上半年 | +25% | 累計 ~+68% | 同上 |
| 2024 年 10 月 | +14% | 累計 ~**+92%**（近乎翻倍） | 同上 |
| 2025 年 10 月 | 工業電價凍漲（NT$4.27/kWh） | 暫緩 | [Focus Taiwan, 2025-09-19](https://focustaiwan.tw/business/202509190017)；[Taipei Times, 2025-09-20](https://www.taipeitimes.com/News/front/archives/2025/09/20/2003844112) |

**毛利率敏感度分析**：

According to TrendForce（2024-10），TSMC 管理層在 2024 Q3 法說中確認，電價上漲對次年毛利率的影響**至少 1 個百分點**。以此為基礎，結合先進製程能耗增加，建構完整敏感度模型：

| 影響因素 | 毛利率影響（估計） | 時間範圍 | 推算邏輯 | 出處 |
|---------|-----------------|---------|---------|------|
| 電價翻倍（2022-2024 累計） | **-1.0~1.5pp** | 已發生 | 管理層確認「至少 1%」；能源佔營運成本 ~30%，電價翻倍→成本增 ~15%→毛利率稀釋 ~1-1.5pp | [TrendForce, 2024-10-18](https://www.trendforce.com/news/2024/10/18/news-tsmc-reports-highest-electricity-price-in-taiwan-affecting-next-years-gross-margin/) |
| N2/A16 每片能耗增加 20-30% | **-0.3~0.5pp**（增量） | 2025-2027 | N2/A16 營收佔比 2026E ~10-15%→能耗增加 25% × 佔比 12.5% × 能源成本佔比 30% ≈ 毛利率邊際影響 ~0.3-0.5pp | 基於產業數據推算 |
| 未來電價再漲 10%（若 Taipower 繼續虧損） | **-0.3~0.5pp**（增量） | 2026-2027 | Taipower 虧損 NT$4,179 億仍需填補；立法院未通過補貼案→電價上調壓力持續 | [Focus Taiwan, 2025-09](https://focustaiwan.tw/business/202509190017) |
| **合計電力成本對毛利率的潛在壓力** | **-1.6~2.5pp** | 2025-2027 | 包含已發生的電價翻倍+先進製程能耗增加+未來電價風險 | 綜合推算 |

**對沖因素**：(1) TSMC 2024 年實施 1,177 項節能措施，年節省 810 GWh（約節省 NT$34.6 億，以 NT$4.27/kWh 計）；(2) 先進製程晶圓單價從 N3 的 $18-20K 提升至 N2 的 >$30K（+50%），能耗增加 20-30% 的成本可被更高的 ASP 吸收；(3) Huang 確認長期毛利率下限 53%（當前 62%+），意味著 2-2.5pp 的能源成本壓力在結構性毛利率擴張面前仍屬可控。

**結論**：電價翻倍與先進製程能耗攀升合計對 TSMC 毛利率構成 **~2pp** 的結構性壓力，但被先進製程 mix 提升（ASP +50%）與節能措施部分對沖。真正的風險不在於正常電價調整，而在於 Taipower 虧損 NT$4,179 億若引發**一次性大幅補漲**（如 30%+），可能在單一季度對毛利率造成 1pp+ 的超預期衝擊——According to Tom's Hardware（2024），「超級用電戶」曾面臨高達 **30%** 的單次漲幅威脅。（[來源：Tom's Hardware — Taiwan Electricity Price Hikes](https://www.tomshardware.com/tech-industry/impending-taiwan-electricity-price-hikes-to-impact-tsmc-other-chipmakers)）

### 水資源——日用量、年度消耗與回收體系

半導體製造對超純水（UPW）的需求極高——每片晶圓需使用數千公升純水進行清洗、蝕刻與化學製程。TSMC 作為全球最大的晶片製造商，其用水規模在台灣引發持續關注。According to Taiwan Insight（2025），TSMC 目前日用水量已從 2021 年旱災時的 ~20,000 噸暴增至 **~150,000 噸/日**——4 年內增長 **650%**，反映 N5/N3 產能擴張對水資源的指數級需求。

**用水量化數據**：

| 指標 | 數據 | 出處 |
|------|------|------|
| 日用水量（2024） | **~150,000 噸/日**（約等於一座 43.5 萬人口城市的日用水） | [Taiwan Insight, 2025-11](https://taiwaninsight.org/2025/11/05/water-nexus-can-semiconductors-and-sustainability-coexist-in-taiwan/) |
| 日用水量（2021 旱災時） | ~20,000 噸/日（相當於 58,000 人口城市） | [Fortune, 2021-06-12](https://fortune.com/2021/06/12/chip-shortage-taiwan-drought-tsmc-water-usage/) |
| 年用水量（估算） | **~54,750,000 噸/年**（150,000 噸 x 365 天） | 基於日用水量推算 |
| 半導體業佔台灣用水比 | ~10%（農業 70%、民生 20%） | [Fortune, 2021-06-12](https://fortune.com/2021/06/12/chip-shortage-taiwan-drought-tsmc-water-usage/) |
| 淡水取用佔比 | 96.6% 來自天然淡水 | [Taiwan Insight, 2025-11](https://taiwaninsight.org/2025/11/05/water-nexus-can-semiconductors-and-sustainability-coexist-in-taiwan/) |
| 回收/再生水佔比 | 3.2%（2024） | [Taiwan Insight, 2025-11](https://taiwaninsight.org/2025/11/05/water-nexus-can-semiconductors-and-sustainability-coexist-in-taiwan/) |
| 2024 年廢水回收量 | **超過 1.4 億立方公尺**（140 百萬噸） | [TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf) |
| 2019 年製造用水回收率 | 87%（目標每滴水使用 3.5 次） | [Fortune, 2021-06-12](https://fortune.com/2021/06/12/chip-shortage-taiwan-drought-tsmc-water-usage/) |
| 南科再生水廠產能（2026 目標） | 36,000 噸/日（可滿足當地需求 60%） | [TSMC ESG — Water Stewardship](https://esg.tsmc.com/file/public/e-APractitionerofGreenPower_2.pdf) |
| 單位用水削減目標 | 年降 2.7% | [TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf) |
| 再生水系統目標 | 2040 年 100% 回收 | [SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/361249-tsmcs-tsmc-2024-sustainability-report-pioneering-a-greener-semiconductor-future/) |

**台灣水壓力指數與產能衝擊量化**：

台灣雖然年均降雨量為全球平均的 **2.6 倍**（~2,500mm），但 WRI Aqueduct 水風險評估將台灣西部平原（TSMC 主要廠區所在地）列為 **Medium-High（3-4/5）水壓力**等級，主因為：(1) 水庫容量有限（泥沙淤積導致有效庫容持續下降）；(2) 降雨季節性極度不均（5-9 月佔全年 80%）；(3) 工業與農業用水競爭加劇。（[來源：WRI Aqueduct — Taiwan Water Risk](https://www.wri.org/aqueduct)；[PMC — Climate change induced water stress, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC10826299/)）

According to Taiwan Insight（2025），2021 年旱災期間 TSMC 產出受影響程度約 **~10%**——雖未造成全面停產，但水罐車調度、限水措施與農業休耕補貼的社會成本極高。以 TSMC 2021 年營收 NT$1.59 兆推算，10% 產出影響對應潛在營收損失約 **NT$1,590 億**（$50 億美元）。S&P Global Ratings（2024）進一步將 TSMC 的水風險定位為**信用風險因素**：「氣候變遷正成為信用風險」，指出 RCP 8.5 情境下台灣西部平原 2050 年前乾旱頻率可能從每 10 年 2 次增至 **每 10 年 3-4 次**，降雨變異性增加 15-25%。（[來源：Taiwan Insight, 2025-11](https://taiwaninsight.org/2025/11/05/water-nexus-can-semiconductors-and-sustainability-coexist-in-taiwan/)；[S&P Global Ratings, 2024-02-26](https://www.spglobal.com/ratings/en/regulatory/article/240226-sustainability-insights-tsmc-and-water-a-case-study-of-how-climate-is-becoming-a-credit-risk-factor-s12992283)；[PMC, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC10826299/)）

**Fab 20 廢水創新**：2024 年，TSMC 在 Fab 20 Phase 1（5nm/3nm 廠）部署「氨氮廢水分流系統」，實現排放廢水導電度降低 **40%**、化學藥劑使用減少 **30%**。此外，TSMC 開發了 PFAS（全氟/多氟烷基物質）吸附過濾技術，達到平均 **95% PFAS 去除率**——此為半導體產業面臨的新興環境監管焦點。（[來源：Taiwan Insight, 2025-11](https://taiwaninsight.org/2025/11/05/water-nexus-can-semiconductors-and-sustainability-coexist-in-taiwan/)；[TSMC ESG — Water Stewardship](https://esg.tsmc.com/file/public/e-APractitionerofGreenPower_2.pdf)）

### 土地佔用

TSMC 在台灣擁有 **12 座 300mm 晶圓廠**與 **4 座 200mm 廠**，主要分布於新竹科學園區、台中科學園區與台南科學園區。全球製造據點加上美國亞利桑那、日本熊本與德國德勒斯登的在建廠區，TSMC 目前有 **24 座半導體廠**處於運營或興建中。（[來源：TweakTown, 2024](https://www.tweaktown.com/news/104783/tsmc-has-24-semiconductor-fabs-under-construction-worldwide-83-825-employees-in-total/index.html)）亞利桑那廠區佔地約 **1,100 英畝**（~445 公頃），規劃 6 座晶圓廠、2 座先進封裝廠與 1 座研發中心。（[來源：CFR, 2025-03](https://www.cfr.org/articles/unpacking-tsmcs-100-billion-investment-united-states)）

## 7.2 環境爭議與 ESG 評級

### ESG 第三方評級——多維度評估

| 評級機構/框架 | 評級/排名 | 說明 | 出處 |
|-------------|----------|------|------|
| **MSCI ESG Rating** | **AAA**（最高等級） | MSCI 7 級制（CCC→AAA）最高級，MSCI ACWI ESG Leaders Index 成分股 | [TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf)；[SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/361249-tsmcs-tsmc-2024-sustainability-report-pioneering-a-greener-semiconductor-future/) |
| **Sustainalytics ESG Risk** | **Low Risk**（12-15 分區間） | 曝險等級：Medium；管理能力：Strong——意味著 TSMC 有效管理其所面臨的 ESG 風險。在全球半導體業排名前 10%。Sustainalytics 評估涵蓋碳排、水資源、供應鏈勞動條件等 | [Sustainalytics — TSMC ESG Risk Rating](https://www.sustainalytics.com/esg-rating/taiwan-semiconductor-manufacturing-co-ltd/1008103058)；[TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf) |
| **DJSI（道瓊永續指數）** | **連續 24 年入選** | 全球唯一連續入選 DJSI World 的半導體公司 | [TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf) |
| **CDP 氣候變遷 & 水安全** | **Leadership 等級**（A/A-） | TSMC 長期參與 CDP Climate Change 與 Water Security 雙問卷披露，連續多年獲 Leadership 等級評分；2024 年全球僅 2% 企業獲 A 評級 | [CDP — A List 2024](https://www.cdp.net/en/press-releases/cdp-a-list-2024)；[TSMC ESG](https://esg.tsmc.com/en-US)；[TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf) |
| **FTSE4Good 系列指數** | **入選**（All-World + Emerging + TIP Taiwan ESG） | TSMC 同時入選 FTSE4Good All-World Index、FTSE4Good Emerging Index 與 FTSE4Good TIP Taiwan ESG Index 三大指數，為台灣半導體業唯一同時入選三項 FTSE4Good 指數的企業 | [TSMC 2024 Annual Report Ch.7](https://investor.tsmc.com/static/annualReports/2024/english/pdf/2024_tsmc_ar_e_ch7.pdf)；[LSEG — FTSE4Good Index Series](https://www.lseg.com/en/ftse-russell/indices/ftse4good) |
| **台灣公司治理評鑑** | **連續 11 年前 5%** | 台灣證交所年度評鑑最高等級 | [TSMC IR — Corporate Governance](https://investor.tsmc.com/english/corporate-governance-officer) |
| **報告框架** | TCFD / TNFD / SASB / AA1000 | 同時遵循四大國際永續報告框架 | [TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf) |
| **供應商審計覆蓋率** | **100%** | 所有供應商完成年度 ESG 審計 | [TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf) |
| **員工合規訓練** | 77,293 人完成（100% 通過率） | 年度誠信與合規訓練 | [TSMC 2024 Annual Report Ch.7](https://investor.tsmc.com/static/annualReports/2024/english/pdf/2024_tsmc_ar_e_ch7.pdf) |

**ESG 投資觀點**：TSMC 在 ESG 評級體系中表現突出——MSCI AAA 是半導體業最高評級之一，DJSI 連續 24 年入選更是業界紀錄。然而，According to Greenpeace East Asia（2023），TSMC 在再生能源佔比上仍落後於主要競爭對手與客戶（Apple 已實現全球營運 100% 再生能源），且「largely escaped scrutiny in the climate debate despite their reliance on coal and other fossil fuels」。這一批評指出 ESG 評級可能未充分反映 TSMC 對台灣高碳電網的實際依賴。（[來源：Greenpeace East Asia, 2023-08](https://www.greenpeace.org/eastasia/press/7930/semiconductor-industry-electricity-consumption-to-more-than-double-by-2030-study/)）

### 環境績效指標（2024 年）

| 指標 | 2024 年表現 | 出處 |
|------|-----------|------|
| 廢棄物回收率 | **97%** | [SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/361249-tsmcs-tsmc-2024-sustainability-report-pioneering-a-greener-semiconductor-future/) |
| 揮發性有機化合物（VOC）減量 | **99%** | [SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/361249-tsmcs-tsmc-2024-sustainability-report-pioneering-a-greener-semiconductor-future/) |
| 含氟溫室氣體（F-GHG）減量 | **96%** | [SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/361249-tsmcs-tsmc-2024-sustainability-report-pioneering-a-greener-semiconductor-future/) |
| 廢棄物轉化為資源 | 9,400 公噸 | [SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/361249-tsmcs-tsmc-2024-sustainability-report-pioneering-a-greener-semiconductor-future/) |
| PFAS 去除率 | **95%**（吸附過濾技術） | [TSMC ESG — Water Stewardship](https://esg.tsmc.com/file/public/e-APractitionerofGreenPower_2.pdf) |
| 高效晶片全球節能貢獻 | **1,042 億 kWh**（等同減排 4,400 萬噸 CO₂） | [SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/361249-tsmcs-tsmc-2024-sustainability-report-pioneering-a-greener-semiconductor-future/) |
| 社會影響 | NT$24.41 億投入 171 項計畫，惠及 139 萬人 | [TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf) |

### 環境爭議紀錄——2021 台灣大旱「晶片優先供水」事件

**事件背景**：2021 年，台灣經歷 **56 年來最嚴重旱災**——2020 年 6 月至 2021 年 5 月間降雨量僅為年平均的三分之一，無颱風登陸為 1950 年代以來首次。台灣雖然平均降雨量為全球平均的 **2.6 倍**，但水庫容量有限、季節性分布極度不均。曾文水庫（台灣最大水庫之一）蓄水率一度降至 **11%**，供應新竹科學園區的主要水庫降至歷史低位。（[來源：Fortune, 2021-06-12](https://fortune.com/2021/06/12/chip-shortage-taiwan-drought-tsmc-water-usage/)；[NPR, 2023-04-19](https://www.npr.org/sections/goatsandsoda/2023/04/19/1170425349/epic-drought-in-taiwan-pits-farmers-against-high-tech-factories-for-water)）

**政府供水優先決策與農業衝擊**：

According to NPR（2023），台灣政府在旱災期間實質上將半導體製造業的供水置於農業之上——南部農民**連續三年被禁止種植水稻**，政府以補貼換取農民休耕以保留用水給晶片工廠。水資源管理專家 Gene You 批評政府的立場實質上是：「what you need we will give you, because the economy needs you」——以經濟需求為由優先供水給晶片業，而非平衡管理水資源。（[來源：NPR, 2023-04-19](https://www.npr.org/sections/goatsandsoda/2023/04/19/1170425349/epic-drought-in-taiwan-pits-farmers-against-high-tech-factories-for-water)）

According to The Diplomat（2024），旱災期間南部最嚴重受災地區實施每週兩天限水，夜間民用水壓降低。農民楊寬偉表示降雨不足導致蟲害增加，需加大農藥使用量，進而殺死授粉蜜蜂，形成生態惡性循環。農民團體負責人張美雪指出，水稻種植「鎖住土壤水分並穩定地溫」，休耕反而加劇乾旱的土地退化效應。農民楊寬偉更直言：「A country needs to rely on its own food supply. It is a form of security.」——將糧食安全與晶片安全並列。（[來源：NPR, 2023-04-19](https://www.npr.org/sections/goatsandsoda/2023/04/19/1170425349/epic-drought-in-taiwan-pits-farmers-against-high-tech-factories-for-water)；[The Diplomat, 2024-09](https://thediplomat.com/2024/09/how-water-scarcity-threatens-taiwans-semiconductor-industry/)）

**TSMC 的應對措施**：

TSMC 在 2021 年旱災期間動用 **水罐車從南部較濕潤地區運水**至北部廠區維持生產。TSMC 官方聲明表示「there is no impact on production, and we are monitoring the water supply situation closely」。然而，According to Fortune（2021），TSMC 當時的日用水量約 **20,000 噸**（相當於 58,000 人口城市的用水需求），且 2015 至 2019 年間市政供水量已增加 **71%**——反映產能擴張帶來的用水需求快速攀升。旱災後 TSMC 於 2021 年開始興建自有水回收廠，並承諾減少 10% 用水量。（[來源：Fortune, 2021-06-12](https://fortune.com/2021/06/12/chip-shortage-taiwan-drought-tsmc-water-usage/)）

**S&P Global Ratings（2024）**進一步將 TSMC 的水風險定位為信用風險因素：「氣候變遷正成為信用風險」，指出台灣水資源的脆弱性可能影響 TSMC 的長期營運穩定性與信用評估。（[來源：S&P Global Ratings, 2024-02-26](https://www.spglobal.com/ratings/en/regulatory/article/240226-sustainability-insights-tsmc-and-water-a-case-study-of-how-climate-is-becoming-a-credit-risk-factor-s12992283)）

**嘉義-雲林跨縣水資源爭議**：According to Taipei Times（2024），TSMC 計畫在嘉義科學園區建廠，需從雲林湖山水庫調水供應，引發雲林縣居民強烈反彈——湖山水庫原為供應雲林農業與民生用水而建，跨縣調水被視為「犧牲農業保半導體」的政策延續。ScienceDirect（2024）一篇針對台灣半導體產業水治理機制的研究指出，台灣現行水資源分配框架缺乏跨縣協調機制，TSMC 等超級用水戶的進駐往往依賴政治協商而非制度化的水權交易，使水資源分配爭議反覆發生。（[來源：Taipei Times, 2024-03-28](https://www.taipeitimes.com/News/editorials/archives/2024/03/28/2003815567)；[ScienceDirect — Tailor-made water governance for Taiwan's semiconductor industry, 2024](https://www.sciencedirect.com/science/article/pii/S2212371724000143)）

**日本熊本廠（JASM）地下水與 PFAS 爭議**：TSMC 海外擴張同樣面臨水資源爭議。According to The Japan Times（2025-12），TSMC 熊本第一廠每日抽取地下水 **7,500 噸**，兩座廠合計 2028 年需水量預計達 **800 萬噸/年**，約佔當地年地下水供應量的 **~5%**。熊本（人口約 100 萬）高度依賴地下水供應農業與民生，當地居民對地下水位下降與污染表達擔憂。種植水稻 60 年的菊陽町農民前田幸一（78 歲）表示：「Even if (the TSMC side) says that the water is clean, I would not drink it.」更關鍵的是，TSMC 熊本廠使用全氟/多氟烷基物質（PFAS，俗稱「永久化學物質」），雖經活性碳處理，但難以完全去除。自 2023 年 8 月起，熊本縣政府對 TSMC 排放口與下游河川進行水質檢測——結果顯示 PFAS 曾一度升高，但仍低於美國與德國飲用水標準，目前已回降並穩定。（[來源：The Japan Times, 2025-12-26](https://www.japantimes.co.jp/business/2025/12/26/companies/tsmc-kumamoto-plant-groundwater-concerns/)；[Nikkei Asia — Water pressure: TSMC tackles groundwater worries in Kumamoto](https://asia.nikkei.com/business/technology/water-pressure-tsmc-others-tackle-groundwater-worries-in-kumamoto)；[Taiwan News, 2024-08-20](https://taiwannews.com.tw/news/5922149)）

**後續水爭議與持續性風險**：According to PMC/Nature（2024），一項研究以 TSMC 為案例分析氣候變遷誘發的水壓力對半導體供應鏈的風險，指出台灣西部平原（TSMC 主要廠區所在）在 RCP 8.5 情境下，2050 年前降雨變異性將增加 15-25%，乾旱頻率可能從每 10 年 2 次增至每 10 年 3-4 次。（[來源：PMC — Climate change induced water stress and semiconductor supply chain risk, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC10826299/)）

## 7.3 氣候風險與轉型

### 碳排路徑——Scope 1/2/3 排放數據與 SBTi 承諾

**溫室氣體排放概況——2024 年 Scope 1/2/3 具體噸數**：

According to TSMC 2024 Sustainability Report 與 Tracenable ESG 數據庫，TSMC 2024 年溫室氣體總排放量達 **22,723,966 tCO₂e**（2,272 萬噸），較 2023 年的 20,676,817 tCO₂e **增加 9.89%**——反映先進製程產能擴張（N3 量產爬坡）帶來的排放增長。（[來源：Tracenable — TSMC GHG Emissions 2024](https://tracenable.com/ghg/taiwan-semiconductor-manufacturing-company-limited)；[TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf)）

| 排放範疇 | 2024 年排放量（tCO₂e） | 佔比 | 主要來源 | YoY 趨勢 | 出處 |
|---------|----------------------|------|---------|---------|------|
| **Scope 1**（直接排放） | **1,825,872** | 8.0% | 含氟溫室氣體（PFCs/SF₆）、製程化學反應、緊急發電機；已實現 96% F-GHG 減量 | +~10% | [Tracenable](https://tracenable.com/ghg/taiwan-semiconductor-manufacturing-company-limited)；[SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/361249-tsmcs-tsmc-2024-sustainability-report-pioneering-a-greener-semiconductor-future/) |
| **Scope 2 Market-based**（間接排放——電力） | **10,957,397** | 48.2% | 台灣電網（高碳結構：煤炭 31.75%+天然氣 23.73%）；為 TSMC 最大碳排來源 | +~8% | [Tracenable](https://tracenable.com/ghg/taiwan-semiconductor-manufacturing-company-limited)；[Global Taiwan Institute, 2026](https://globaltaiwan.org/2026/02/taiwans-bumpy-road-to-energy-resilience/) |
| **Scope 2 Location-based** | **12,674,921** | — | Market-based 與 Location-based 差異反映 TSMC 再生能源憑證（I-RECs）的抵銷效果：~170 萬噸 | — | [Tracenable](https://tracenable.com/ghg/taiwan-semiconductor-manufacturing-company-limited) |
| **Scope 3**（價值鏈排放） | **8,223,173** | 36.2% | 設備製造、化學品供應、物流運輸；2024 年啟動供應商碳減排補貼 | +~12% | [Tracenable](https://tracenable.com/ghg/taiwan-semiconductor-manufacturing-company-limited)；[TSMC PR — SBTi](https://pr.tsmc.com/english/news/3227) |
| **合計（Scope 1+2 Market+3）** | **22,723,966** | 100% | 相當於 **~5 座台中火力發電機組**年排放量 | **+9.89%** | [Tracenable](https://tracenable.com/ghg/taiwan-semiconductor-manufacturing-company-limited) |

**碳排強度分析**：儘管總排放量隨產能增長持續攀升，TSMC 的**單位營收碳排強度**呈下降趨勢——2024 年營收 NT$2.89 兆，碳排強度約 7.86 tCO₂e/百萬NT$，較 2023 年（營收 NT$2.16 兆，碳排 2,068 萬噸，強度 9.57 tCO₂e/百萬NT$）**改善約 18%**。這反映先進製程的高附加價值在一定程度上抵銷了能耗增長。

**SBTi 承諾與碳減排里程碑——目標 vs 實際進度**：

TSMC 於 2024 年正式承諾遵循科學基礎減碳倡議（SBTi）企業淨零標準，以 **2025 年為基準年**，設定 Scope 1/2/3 絕對減量目標，目標在未來十年內達成。（[來源：TSMC PR — SBTi, 2024](https://pr.tsmc.com/english/news/3227)）

| 里程碑 | 目標年份 | 目標值 | 2024 實際 | 差距/進度 | 出處 |
|--------|---------|--------|----------|----------|------|
| **碳排達峰** | 2025 | 絕對排放開始下降 | 2,272 萬噸（+9.89% YoY，仍在增長） | **尚未達峰**——N3 量產+N2 建設推動排放持續增長 | [TSMC PR — SBTi](https://pr.tsmc.com/english/news/3227)；[Tracenable](https://tracenable.com/ghg/taiwan-semiconductor-manufacturing-company-limited) |
| **碳排降至 2020 年水準** | 2030 | ~1,500 萬噸（2020 年水準估計） | 2,272 萬噸 | 需在 6 年內減排 **~34%**，挑戰極大 | [TSMC PR — SBTi](https://pr.tsmc.com/english/news/3227) |
| **RE60（60% 再生能源）** | 2030 | 60% | **13-14%** | 距目標差 **4.3 倍**；需在 6 年內增加 ~46pp | [TSMC ESG](https://esg.tsmc.com/en-US/file/public/e-APractitionerofGreenPower_1.pdf) |
| **RE100（100% 再生能源）** | 2040 | 100% | 13-14%；簽約 4.4 GW | 從 2050 提前至 2040；全球辦公室已 100%，台灣廠區為瓶頸 | [SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/361249-tsmcs-tsmc-2024-sustainability-report-pioneering-a-greener-semiconductor-future/) |
| **淨零排放** | 2050 | Scope 1/2/3 淨零 | — | 長期目標，涵蓋全價值鏈 | [TSMC ESG](https://esg.tsmc.com/en-US/file/public/e-APractitionerofGreenPower_1.pdf) |

**關鍵落差**：2024 年碳排仍在增長（+9.89%），距 2025 年「達峰」目標僅剩 1 年，達峰可能性極低——除非 2025 年再生能源採購量大幅跳升或產能擴張放緩。RE60 目標（2030 年 60%）與當前 13-14% 之間的 ~46pp 缺口是 TSMC ESG 最大的可信度挑戰。

**Scope 3 供應鏈減碳創新**：TSMC 2024 年推出兩項開創性措施：(1) 台灣一階原材料供應商**碳減排設備升級補貼**，預計減排 45 萬噸；(2) **GREEN Agreement**——涵蓋 90% 原材料排放者的綠色協議，要求供應商設定並執行碳減排計畫。此外，TSMC 開創 **20 年再生能源聯合採購協議**（20,000 GWh），為供應商與 TSMC 子公司鎖定穩定的綠電價格，降低中小供應商的再生能源採購門檻。（[來源：TSMC PR — SBTi](https://pr.tsmc.com/english/news/3227)；[SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/361249-tsmcs-tsmc-2024-sustainability-report-pioneering-a-greener-semiconductor-future/)）

### 氣候實體風險——颱風、地震與極端氣候對台灣廠區的衝擊

**颱風風險**：台灣平均每年遭受 3-4 個颱風侵襲。TSMC 廠區均位於台灣西部沿海平原，雖非直接臨海但仍面臨強風、暴雨與洪水風險。2024 年 7 月凱米颱風（Typhoon Gaemi）造成台灣中南部嚴重水災，但 TSMC 報告稱未對產能造成重大影響——反映其廠區防災設計的有效性。然而，隨著氣候變遷加劇，颱風強度預計將增加，極端降雨事件頻率上升。

**地震風險**：台灣位於環太平洋地震帶，地震頻繁。2024 年 4 月花蓮 7.2 級地震造成 TSMC 部分廠區短暫停電，但公司在數小時內即恢復正常運作——TSMC 廠區設計採用最高等級抗震標準，關鍵設備配有自動防震系統（automatic seismic isolation）。歷史上 1999 年 921 大地震（7.3 級）曾導致新竹科學園區停電數日，此後 TSMC 大幅強化了廠區的電力備援與結構抗震能力。

**氣候轉型成本估算**：

| 成本項目 | 估算規模 | 占營收/淨利比 | 說明 | 出處 |
|---------|---------|-------------|------|------|
| **再生能源採購溢價**（2024→2030：13%→60%） | **~NT$300-500 億/年**（營收的 ~1%） | 佔營收 ~1%；佔淨利 ~2-3% | TSMC TCFD 揭露：轉型風險財務影響（含節能設備、再生能源溢價、RE 憑證、碳權）合計約佔營收 **~1%**。關鍵合約：與 Ørsted 簽訂全球最大再生能源 CPPA——**20 年期固定價格合約**，包買大彰化 2b&4 離岸風場全部 **920 MW** 產出（2025/2026 商轉）。2024 年新增簽約 1 GW 離岸風電 CPPA；台灣 CPPA 綠電交易量 2025 年已達 **2.49 TWh**（YoY +30%）。需在 6 年內將再生能源從 14% 提升至 60%（+46pp），相當於從 ~3.6 TWh 增至 ~32 TWh——增量 ~28 TWh 主要需透過新增 CPPA（離岸風電+大型太陽能）與 I-RECs 採購覆蓋 | [TSMC ESG — TCFD](https://esg.tsmc.com/en-US/sustainable-management/tcnfd-disclosure)；[Ørsted-TSMC CPPA](https://orsted.com/company-announcement-list/2020/08/2059053)；[IEEE Spectrum — TSMC Clean Energy](https://spectrum.ieee.org/taiwan-semiconductor)；[TSMC PR — RE100](https://pr.tsmc.com/english/news/3067) |
| **Ørsted 大彰化 CPPA 年化成本**（含） | ~NT$80-120 億/年（估） | 已含上列 | 920 MW 離岸風場年發電量約 3.5-4 TWh；以台灣離岸風電 CPPA 均價 ~NT$5-6/kWh 計（含再生能源溢價），年成本約 NT$175-240 億——但部分為替代既有台電購電，增量溢價約 NT$80-120 億 | [Ørsted — Greater Changhua 2b&4](https://orsted.com/en/media/news/2023/03/20230331658411)；[Digitimes — Ørsted powers up TSMC-exclusive wind farm, 2025-07](https://www.digitimes.com/news/a20250723VL214/taiwan-offshore-wind-electricity-tsmc.html) |
| **供應商碳減排補貼** | 未公開（首批目標減排 45 萬噸） | 微量 | 設備升級補貼 + GREEN Agreement + 20 年聯合採購 20,000 GWh | [TSMC PR — SBTi](https://pr.tsmc.com/english/news/3227) |
| **廠區防災與氣候適應** | 已納入常規 CapEx | N/A | 抗震設計、防洪設施、電力備援均為標準建設成本 | — |
| **碳費/碳定價風險** | 台灣 2025 年碳費制度啟動（NT$300/噸起） | <0.5%（以 1,142 萬噸 x NT$300 = NT$34.3 億估算） | 初期費率低（NT$300/噸），但歐盟 CBAM 漸進實施與台灣 2030 年碳費上調預期（NT$500-1,000/噸）可能使成本倍增至 NT$57-114 億 | [台灣環境部碳費制度](https://ghg.moenv.gov.tw/) |
| **RE100 達成路徑總成本（2024→2040）** | **累計 NT$5,000-8,000 億**（16 年） | 年化約 NT$310-500 億（佔營收 <1%） | 從 14% → 100% 需覆蓋額外 ~50 TWh（以 2030E 用電 53 TWh 為基準）；假設綠電溢價 NT$2-3/kWh，年增量成本 NT$100-150 億；加上 CPPA 固定成本、碳費遞增與節能設備投資 | 綜合推算 |

**相對於 TSMC 2025 年淨利 NT$1.72 兆，上述氣候轉型成本年化合計約佔營收 ~1%、淨利 ~2-3%。** According to TSMC TCFD 揭露，轉型風險的財務影響（含節能/碳減設備、再生能源溢價、RE 憑證、碳權採購）估計結果約為營收的 **1%**——此一數據由 TSMC 自行揭露，但**未經第三方獨立驗證**，且未涵蓋 2030 年後碳費上調與離岸風電 CPPA 價格波動的上行風險。（[來源：TSMC ESG — TCFD Disclosure](https://esg.tsmc.com/en-US/sustainable-management/tcnfd-disclosure)；[ainvest — Taiwan Energy Transition Risks, 2025-08](https://www.ainvest.com/news/navigating-taiwan-energy-transition-risks-opportunities-tech-semiconductor-sectors-2508/)）

**「淨正面」能源效益聲稱須標注為公司自報**：TSMC 宣稱其高效晶片 2030 年將實現每消耗 1 kWh 生產用電、在全球節省 6.39 kWh 的「淨正面」效益。然而，此一數據基於 TSMC 自行定義的方法論與邊界假設，**未經第三方生命週期分析（LCA）獨立驗證**。According to Greenpeace East Asia（2023），TSMC 不應以下游產品的間接節能效益來抵銷其在台灣高碳電網中的直接排放責任——Greenpeace 具體訴求包括：(1) 將 RE100 目標從 2040 年提前至 **2030 年**以匹配客戶（Apple、Microsoft）承諾；(2) 停止購買「品質存疑」的國際再生能源憑證（I-RECs）以替代實際綠電採購；(3) 公開揭露完整的 Scope 3 供應鏈碳排數據與減量計畫。（[來源：Greenpeace East Asia, 2023-08](https://www.greenpeace.org/eastasia/press/7930/semiconductor-industry-electricity-consumption-to-more-than-double-by-2030-study/)；[TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf)）

**投資觀點——「淨正面」能源效益論述**：TSMC 向 ESG 投資人傳達的核心論述是：其高效晶片在全球範圍內創造的節能效益遠超自身能耗。According to TSMC 2024 Sustainability Report，2024 年 TSMC 生產的高效晶片在全球節省 **1,042 億 kWh**，等同減排 **4,400 萬噸 CO₂**。到 2030 年，每消耗 1 kWh 生產用電，預計可在全球節省 **6.39 kWh**——「淨正面」倍率為 6.39x。（[來源：TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf)；[SemiWiki](https://semiwiki.com/semiconductor-manufacturers/tsmc/361249-tsmcs-tsmc-2024-sustainability-report-pioneering-a-greener-semiconductor-future/)）

However, Greenpeace 對此論述持保留態度，認為 TSMC 不應以下游產品的節能效益來抵銷自身在台灣高碳電網中的實際排放責任，尤其是 TSMC 的再生能源佔比（13-14%）仍遠低於其 RE100 目標與客戶期望。（[來源：Greenpeace East Asia, 2023](https://www.greenpeace.org/eastasia/press/7930/semiconductor-industry-electricity-consumption-to-more-than-double-by-2030-study/)）

### 台灣能源轉型風險——高碳電網的結構性制約

台灣 2024 年能源結構高度依賴化石燃料：石油 35.87%、煤炭 31.75%、天然氣 23.73%、太陽能 2.91%、核能 2.38%、風電與水力合計 3%。核電佔比隨退核政策持續下降（2025 年最後一座核電廠除役）。（[來源：Global Taiwan Institute, 2026](https://globaltaiwan.org/2026/02/taiwans-bumpy-road-to-energy-resilience/)）

這一高碳能源結構意味著：即使 TSMC 大量採購再生能源，其 Scope 2（電力間接排放）的實際減碳效果取決於台灣整體電網的綠化速度。台灣 2030 年再生能源目標為 20%（全國），而 TSMC 自身目標為 60%——兩者之間的差距需透過大規模 CPPA 與 I-RECs 採購來彌補，成本與供給可行性均存在不確定性。

**台灣能源進口脆弱性**：台灣進口 **97%** 的能源，在封鎖情境下僅能維持約兩週的能源供應。According to Global Taiwan Institute（2026），台灣因液化天然氣（LNG）接收站擴建緩慢、太陽能/風力用地受限、核電除役等因素，電力供應的結構性短缺風險在 2030 年前將持續加劇——這不僅是 TSMC 的營運風險，也是其所有台灣廠區（佔 ~80% 產能）的系統性風險。（[來源：Global Taiwan Institute, 2026-02](https://globaltaiwan.org/2026/02/taiwans-bumpy-road-to-energy-resilience/)）

---

# 八、正反論辯

## 8.1 Bull Case（投資論點）

> 致空方：以下每個論點附有可證偽指標（falsifiable metric）。若您的空頭論點成立，這些指標將率先惡化——請逐一檢驗。

---

### Bull #1：AI 超級週期處於早期第三局，TSMC 是唯一不可繞過的瓶頸

**核心數據**：

- TSMC AI 加速器相關營收（含 GPU/ASIC/HBM controller）2024 年佔總營收 ~15%，2025 年躍升至 ~30%，2026E 預估達 ~40%。AI/HPC 平台 2025 Q2 已佔營收 60%。（[來源：App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine)；[TSMC Q4 2025 法說](https://investor.tsmc.com/english/quarterly-results/2025/q4)）
- 全球 hyperscaler CapEx 2026E 上修至 ~$6,000 億（YoY +36%），其中 AI 相關佔比超過 50%。Microsoft、Google、Amazon、Meta 四大 CSP 2025 年 CapEx 合計已超過 $2,500 億，較 2023 年翻倍。（[來源：The Next Platform, 2026-01-16](https://www.nextplatform.com/compute/2026/01/16/tsmc-has-no-choice-but-to-trust-the-sunny-ai-forecasts-of-its-customers/4092173)）
- AI 推理 token 消耗量每三個月呈指數級增長——OpenAI 2024 年報告其 API 每日 token 處理量較 2023 年增長超過 10 倍。推理端需求增速已超過訓練端。（[來源：Semianalysis, 2025](https://www.semianalysis.com/)）
- Wei 親訪所有 CSP 客戶後確認需求真實（詳見 2.1 轉折四）。

**為何不可替代**：NVIDIA（GPU）、Broadcom（custom ASIC）、AMD、Apple、Qualcomm——全球前五大 AI 晶片設計公司**全部**使用 TSMC 先進製程。沒有任何一家有可行的 Plan B。NVIDIA 的 Blackwell B200/B300 全數由 TSMC N4P/N3E 製造；Broadcom 為 Google（TPU）、Meta（MTIA）代工的 custom ASIC 同樣全在 TSMC（詳見 2.2）。

**可證偽指標**：若 AI CapEx 增速放緩至 <10% YoY，或 TSMC HPC 營收佔比回落至 <40%，此論點弱化。

---

### Bull #2：技術護城河持續擴大——競爭者不是在追趕，而是在掉隊

**良率差距是鐵證**：

| 製程 | TSMC 良率 | Samsung 良率 | 差距 | 來源 |
|------|----------|-------------|------|------|
| 3nm（2025 中） | ~90% | ~50% | 40pp | [Design Reuse, 2025-06](https://www.design-reuse-embedded.com/news/202506089/samsung-foundry-struggles-with-3nm-yields-at-50-as-tsmc-climbs-past-90/) |
| 2nm（N2） | 2025 Q4 量產 | 2027E（SF2） | 2 年落後 | [IEEE Spectrum](https://spectrum.ieee.org/intel-18a) |

- Samsung 2025 年晶圓廠投資腰斬至 5 兆韓元（~$35 億），較 2024 年 10 兆砍半——這不是「暫時調整」，而是資本退縮的訊號。Samsung 連自家 Galaxy S25 都無法量產 Exynos 2500，被迫全面外購高通晶片。（[來源：TrendForce, 2025-01-22](https://www.trendforce.com/news/2025/01/22/news-samsung-faces-struggles-ahead-as-foundry-investment-reportedly-slashed-by-half-for-2025/)；[SamMobile, 2025](https://www.sammobile.com/news/heres-how-shockingly-bad-samsungs-3nm-yields-currently-are/)）
- Intel 18A 良率預計 2027 年才達業界標準；Intel Foundry 目標 2027 年損益兩平，但至今仍為巨額虧損部門（2024 年營業虧損 ~$70 億）。（[來源：Tom's Hardware](https://www.tomshardware.com/tech-industry/semiconductors/intel-ceo-recognizes-its-18a-node-for-external-customers-as-18a-p-gets-inbound-interest-company-cites-increasing-yields)；[WCCFTech](https://wccftech.com/intel-foundry-breakeven-target-for-2027-now-looks-a-lot-more-real/)）
- SMIC 受美國出口管制無法取得 EUV 設備，5nm 成本較 TSMC 高 50%+ 且良率顯著落後。（[來源：Counterpoint Research](https://counterpointresearch.com/en/insights/global-semiconductor-foundry-market-share)）

**N2 量產確認利潤更優**：CFO Huang 確認：「N2 is well on track for volume production later this quarter. N2's structural profitability is better than the N3.」——每一代新製程，TSMC 不僅技術領先更拉大，**利潤也更高**。（[來源：App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine)）

Morris Chang 曾強調建造世界級代工廠需數十年學習與數十億美元投入——學習曲線定價形成幾乎不可跨越的成本壁壘（詳見 2.4 節 5c）。

**可證偽指標**：若 Samsung 3nm 良率在 6 個月內達 80%+，或 Intel 18A 在 2026 年前取得大額外部訂單（>$10B），此論點弱化。

---

### Bull #3：史無前例的定價權——從代工商進化為壟斷型平台

**毛利率創歷史新高且仍在攀升**：

| 季度 | 毛利率 | 淨利率 | 備註 |
|------|--------|--------|------|
| Q4 2024 | 59.0% | 42.8% | 先進製程佔比 70% |
| Q4 2025 | 62.3% | 46.2% | 全年毛利率 60.3% |
| Q1 2026E | 63-65% | ~48% | 管理層指引（歷史新高） |

- **晶圓定價飆升**：N5 晶圓 ~$16K → N3 晶圓 $18-20K → N2 晶圓預估 >$30K（+50%）。過去 10 年晶圓均價漲幅超過 3 倍。（[來源：Tom's Hardware](https://www.tomshardware.com/tech-industry/tsmcs-wafer-pricing-now-usd18-000-for-a-3nm-wafer-increased-by-over-3x-in-10-years-analyst)）
- **2026 年再漲價**：先進製程漲幅 5-10%，CoWoS 先進封裝漲幅 20%——客戶照單全收，因為沒有替代方案。（[來源：TSMC Q4 2025 法說](https://investor.tsmc.com/english/quarterly-results/2025/q4)）
- **長期毛利率下限 53%**：CFO Huang 明確設定，但實際已連續 4 季超過 58%，市場共識正上修至 55-60% 的「新常態」。（[來源：TSMC Q4 2025 Transcript](https://investor.tsmc.com/english/quarterly-results/2025/q4)）
- **ROIC 41.5%（2025 年）**為歷史新高——對於一家年 CapEx $50B+ 的重資產公司，這一回報率令人震驚。（[來源：App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine)）
- **海外廠溢價定價**：TSMC 對海外廠採溢價定價，地緣風險分散不是成本負擔，而是**漲價理由**（詳見 2.3）。

**定價權的本質**：當你的客戶（Apple、NVIDIA、Broadcom）毛利率 60-75%，而你是其唯一供應商，你的漲價空間幾乎無限——直到晶圓成本開始影響終端產品售價。目前 TSMC 晶圓成本佔客戶終端產品 BOM 僅 5-15%，漲價彈性極大。

**可證偽指標**：若毛利率連續 2 季低於 55%，或主要客戶（Apple/NVIDIA）將 >20% 先進製程訂單轉移至競爭對手，此論點失效。

---

### Bull #4：先進封裝（CoWoS/SoIC）開闢第二成長曲線，TAM 倍增

**封裝不再是低附加值後端，而是 AI 晶片的瓶頸與利潤中心**：

- CoWoS 產能 2023-2026 年擴增 ~7-10 倍，仍供不應求。Wei 在 2024 Q2 法說表示：「From last year to this year, we have more than doubled」CoWoS 產能，且「I hope in 2025 or 2026 we can reach the balance」——意味著至少到 2026 年供需仍緊張。（[來源：The Register, 2024-07-18](https://www.theregister.com/2024/07/18/tsmc_ceo_predicts_ai_chip/)）
- 2025 年先進封裝營收首次超越傳統封裝（佔比 51%+），TSMC Fan-Out 市佔 76.7%——在封裝領域的壟斷程度甚至高於晶圓代工。（[來源：Andy Lin's Blog](https://www.granitefirm.com/blog/us/2025/01/05/semiconductor-packaging-2/)）
- 封裝營收佔比預計從 2024 年的 7-9% 提升至 2028 年的 ~30%。CapEx 的 10-20% 已投向先進封裝。（[來源：App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine)）
- **SoIC（3D 堆疊）是下一代殺手應用**：將多個 chiplet 垂直堆疊，實現更高頻寬與更低功耗。NVIDIA 的 Blackwell 系列與 Apple 未來 M 系列晶片均規劃採用 SoIC 技術。（[來源：TSMC 2024 Annual Report](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf)）

**為何這對空方是壞消息**：先進封裝使 TSMC 從「單純代工」進化為「系統級整合平台」。客戶不僅依賴 TSMC 的晶圓製造，還依賴其封裝技術——**鎖定效應（lock-in）加倍**。即使假設有朝一日某競爭者追上晶圓代工良率，他們仍無法提供 TSMC 的封裝生態系。

**可證偽指標**：若 CoWoS 產能利用率降至 <80%，或 2026 年封裝營收佔比未能突破 15%，此論點需下修。

---

### Bull #5：全球化佈局將地緣政治折價轉化為戰略溢價

**空方最常引用的論點是台海風險——但 TSMC 正在系統性地消解這一風險**：

- **美國**：$1,650 億總投資（三座晶圓廠 + 先進封裝），獲 $66 億 CHIPS Act 補貼。亞利桑那廠 N4P 已量產，良率達台灣水準。2025 年 3 月 Wei 在白宮與 Trump 共同宣布擴張。（[來源：TIME, 2025](https://time.com/collections/time100-ai-2025/7305839/cc-wei-ai/)；[TSMC PR, 2025-03](https://pr.tsmc.com/english/news/3210)）
- **日本**：熊本 JASM 廠 2024 年量產，第二廠建設中，獲日本政府 ~50% 補貼。（[來源：Fortune Asia, 2025-07-30](https://fortune.com/asia/2025/07/30/tsmc-ai-boom-cc-wei-wendell-huang-global-500/)）
- **歐洲**：德國德勒斯登 ESMC 廠（與 Bosch/Infineon/NXP 合資），受歐盟 European Chips Act €430 億支持。
- **新加坡**：已宣布新廠計畫，進一步分散亞洲產能。
- **客戶用錢投票**：客戶主動預付 NT$2,911 億（~$90 億）搶產能——這是客戶對 TSMC 不可替代性的最直接證明。（[來源：TSMC Q4 2024 Transcript](https://www.fool.com/earnings/call-transcripts/2025/01/16/taiwan-semiconductor-manufacturing-tsm-q4-2024-ear/)）

Wei 感嘆全球化進程的戲劇性——十年前難以想像的雙元首會面與千億投資已成現實（詳見 6.2）。

**戰略邏輯**：當 TSMC 在美國、日本、歐洲均有先進產能，它不再是「台灣公司」而是「全球關鍵基礎設施」。任何國家攻擊台灣即等同於攻擊所有主要經濟體的晶片供應鏈——這是威懾，不是弱點。TSMC 的全球化使其成為各國政府**保護而非制裁**的對象。

**可證偽指標**：若亞利桑那廠良率長期落後台灣 >10pp，或海外廠毛利率拖累公司整體毛利率低於 55%，此論點需修正。

---

### Bull #6：財務體質為全球半導體之冠——同時高成長、高利潤、高回報

| 指標 | 2024 | 2025 | 2026E | 來源 |
|------|------|------|-------|------|
| 營收（USD B） | 88.3 | 115 | 150（管理層指引 +30%） | [TSMC Q4 2025 法說](https://investor.tsmc.com/english/quarterly-results/2025/q4) |
| 毛利率 | 56.1% | 60.3% | 61-63% | [TSMC Q4 2025 法說](https://investor.tsmc.com/english/quarterly-results/2025/q4) |
| 淨利率 | 40.4% | 43.8% | 46-48% | 同上 |
| ROIC | 32% | 41.5% | ~40%+ | [App Economy Insights, 2025](https://www.appeconomyinsights.com/p/tsmc-ai-megatrend-engine) |
| 自由現金流（USD B） | ~17 | ~25 | ~30+ | 推算（營收 × FCF margin ~20%） |
| CapEx（USD B） | 30 | 38 | 52-56（管理層指引） | [TSMC Q4 2025 法說](https://investor.tsmc.com/english/quarterly-results/2025/q4) |

- **營收成長 +30%（2026E）**——對於一家年營收 $1,150 億的公司，這個成長率在全球大型科技公司中幾乎無人能比。（管理層指引，非分析師猜測）
- **淨現金部位**：TSMC 持有 ~$600 億現金，幾乎零淨負債，融資成本極低。（[來源：TSMC 2024 Annual Report](https://investor.tsmc.com/sites/ir/annual-report/2024/2024%20Annual%20Report_E.pdf)）
- **CapEx 自我資金化**：$52-56B 的年度 CapEx 幾乎全部由營運現金流覆蓋，無需大量舉債——這在資本密集產業中極為罕見。

**對比其他「壟斷型平台」公司**：

| 公司 | 2025 營收成長 | 毛利率 | ROIC | P/E（Forward） |
|------|-------------|--------|------|---------------|
| TSMC | +34% | 60.3% | 41.5% | ~23x |
| NVIDIA | +55% | 75% | ~90% | ~30x |
| ASML | +10% | 51% | ~35% | ~28x |
| Apple | +5% | 46% | ~55% | ~30x |

TSMC 的成長率僅次於 NVIDIA，但估值（Forward P/E ~23x）卻是這一組中最低的——市場對地緣風險的過度折價，正是多頭的入場機會。

**可證偽指標**：若 2026 年營收成長 <15%（遠低於管理層 +30% 指引），或毛利率跌破 55%，財務論點需全面下修。

---

### Bull #7：2-3 年客戶接洽前置期提供全產業最強需求能見度

**這是一個被嚴重低估的結構性優勢**：

Wei 在 Q3 2025 法說揭示：「As process technology complexity increases, the engagement lead time with customer is now at least 2 to 3 years in advance. Therefore, we probably get the deepest and widest look possible in the industry.」（[來源：TSMC Q3 2025 Transcript](https://www.fool.com/earnings/call-transcripts/2025/10/17/tsmc-tsm-q3-2025-earnings-call-transcript/)）

**這意味著什麼**：

1. **TSMC 今天已經知道 2027-2028 年的需求輪廓**——客戶的 N2/A16 設計已進入 tape-out 排程。當管理層說「AI demand has continued to be very strong and stronger than expected three months prior」，這不是猜測，而是基於**已簽約的設計案（design starts）**。（[來源：TSMC Q3 2025 Transcript](https://www.fool.com/earnings/call-transcripts/2025/10/17/tsmc-tsm-q3-2025-earnings-call-transcript/)）
2. **$52-56B CapEx 是需求驗證後的投資，不是賭注**——TSMC 的 CapEx 決策基於客戶已承諾（且部分已預付）的產能需求。客戶預付 NT$2,911 億是真金白銀的承諾。
3. **分析師永遠無法比 TSMC 更早看到需求轉折**——任何賣方報告都是基於公開數據的猜測，而 TSMC 手握最機密的設計案資訊。當 Wei 說「still in early stage」，這是全產業最具信息優勢的人的判斷。

**可證偽指標**：若 TSMC 季度營收連續 miss 管理層指引（連續 2 季低於指引下限），表明能見度優勢已失效。

---

### Bull #8：FTSE4Good ESG 指數連續 7 年入選——機構資金結構性流入

TSMC 自 2018 年起連續 7 年入選 FTSE4Good Index（All-World 與 Emerging Market 雙系列），ESG 評分穩定位於半導體產業前 10%。（[來源：TSMC ESG 官網](https://esg.tsmc.com/en-US/update/greenManufacturing/caseStudy/31)；[FTSE Russell](https://www.ftserussell.com/products/indices/ftse4good)）

- TSMC 同時入選 DJSI 世界指數（連續 24 年）、MSCI ESG 評級 AA、CDP 氣候變遷 Leadership Band。（[來源：TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf)）
- 全球 ESG 管理資產（AUM）2025 年預估超過 $40 兆，ESG 指數追蹤基金被動配置 TSMC 的資金量持續增加。
- 2024 年 RE100 進度：再生能源佔比 13-14%，簽約裝置容量 4.4 GW，目標 2040 年 100%。（[來源：TSMC 2024 Sustainability Report](https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf)）

**對空方的意義**：ESG 資金具有「黏性」——一旦 TSMC 被納入 ESG 指數，被動型 ESG 基金被動持有，不會因短期波動拋售。這為股價提供結構性支撐，增加空方的借券成本與做空難度。

**可證偽指標**：若 TSMC 被移出 FTSE4Good 或 DJSI，或 ESG 評級降至 BBB 以下，此論點失效。

---

### 綜合論點——致做空者的最終質問

做空 TSMC，你需要同時相信以下**所有**命題：

1. AI CapEx 即將見頂（反駁：hyperscaler 2026 CapEx 仍在上修 +36%）
2. 競爭者將追上 TSMC 良率（反駁：Samsung 差距 40pp 且投資砍半、Intel 目標 2027 年損益兩平）
3. 毛利率將均值回歸（反駁：N2 結構性利潤更優、漲價權持續、海外廠溢價定價）
4. 台海衝突將實際發生（反駁：$1,650 億美國投資使 TSMC 成為美國戰略資產）
5. 客戶將找到替代方案（反駁：全球前 5 大 AI 晶片公司 100% 依賴 TSMC，無 Plan B）
6. 23x Forward P/E 對年成長 30%+ 的壟斷型公司已過高（反駁：PEG ~0.8x，為同儕最低）

**只要上述任何一項不成立，做空 TSMC 就是在逆風飛行。而所有六項同時成立的概率，接近於零。**

## 8.2 Bear Case——最強空頭論點

**Bear #1：台海地緣風險是無法對沖的尾部風險**
CFR 將台海危機列為 2026 年 Tier I 風險（最高級別），概率「even chance」。封鎖情境下全球 GDP 損失 ~$5 兆，TSMC 營收損失 60-80%。台灣進口 97% 能源，封鎖下僅能維持兩週。一間顧問機構估計五年內封鎖概率 60%。即使短期入侵概率低，地緣風險溢價壓縮 P/E 倍數。（[來源：CFR — Conflicts to Watch 2026](https://www.cfr.org/report/conflicts-watch-2026)；[Rhodium Group](https://rhg.com/research/taiwan-economic-disruptions/)）

**Bear #2：海外建廠成本將長期稀釋獲利能力**
美國廠成本較台灣高 30-50%（規模小、供應鏈價格高、生態系不成熟）。$1,650 億美國投資為 TSMC 史上最大資本承諾。管理層承認早期稀釋 2-3pp，後期 3-4pp。亞利桑那廠初期曾傳出文化衝突與工期延誤。Huang 坦承：「The U.S. fab cost, it is more expensive in the U.S., mainly because of several reasons.」——三大劣勢（規模、供應鏈、生態系）短期無法解決。（[來源：TSMC Q4 2024 Transcript](https://www.fool.com/earnings/call-transcripts/2025/01/16/taiwan-semiconductor-manufacturing-tsm-q4-2024-ear/)）

**Bear #3：客戶集中度持續升高，大客戶風險上升**
前 10 大客戶佔營收從 2022 年 68% 升至 2024 年 76%。Apple 約 22%、NVIDIA <12%。如果 Apple 或 NVIDIA 營收放緩、晶片設計轉向（如 Apple 自研更多元件）、或任何大客戶轉單（Samsung/Intel 良率追上），TSMC 營收將顯著承壓。TSMC 的純代工模式意味著它無法自創終端需求。（[來源：TechSoda](https://techsoda.substack.com/p/explainer-tsmcs-2024-annual-report)）

**Bear #4：AI CapEx 週期可能過熱，泡沫風險存在**
Hyperscaler 2026 年 CapEx 預估 ~$6,000 億，但 AI 商業化回報尚未明確。Wei 自己也承認「I'm also very nervous about it...If we didn't do it carefully, that would be a big disaster to TSMC.」歷史上半導體產業每 3-4 年經歷一次庫存調整週期（2023 年即為一例）。如果 AI 投資放緩類似 2000 年 dot-com 泡沫或 2023 年消費電子低迷，TSMC 的 $52-56B CapEx 承諾將面臨產能利用率下降風險。（[來源：The Next Platform, 2026-01-16](https://www.nextplatform.com/compute/2026/01/16/tsmc-has-no-choice-but-to-trust-the-sunny-ai-forecasts-of-its-customers/4092173)）

**Bear #5：中國 SMIC 追趕加速，長期壟斷地位可能鬆動**
SMIC 7nm 產能 2026 年翻倍，5nm 已完成開發。中國目標 1-2 年內將先進產能從 <20,000 片/月增至 100,000 片/月，2030 年再增 500,000 片。中國「十五五規劃」將先進邏輯製程列為重點攻關方向。YMTC 已建立全國產設備試生產線。雖然良率與成本仍劣，但「足夠好」的國產替代可能侵蝕 TSMC 在中國國內市場的潛在份額。（[來源：TrendForce, 2026-02](https://www.trendforce.com/news/2026/02/25/news-china-reportedly-aims-to-boost-7nm-5nm-output-fivefold-in-two-years-driven-by-smic-and-hua-hong/)；[Yole Group, 2025](https://www.yolegroup.com/strategy-insights/chinas-next-move-the-five-year-plan-that-could-reshape-semiconductors/)）

**Bear #6：環境與能源瓶頸可能制約台灣擴產**
TSMC 2023 年用電 24.78 TWh，佔台灣用電 8.9%，Greenpeace 預測 2030 年將攀升至台灣用電 24%（267% of 2021 levels）。台灣進口 97% 能源、電網南北失衡、台電累計虧損 NT$3,500 億。RE100 目標（2040）需將再生能源從 13-14%（2024）提升至 100%，但台灣地理面積限制太陽能/風力擴張。2021 年 56 年最嚴重旱災迫使農民休耕以保半導體供水，S&P 已將水風險列為 TSMC 信用風險因素。如果台灣電力/水資源供應無法跟上 TSMC 擴產需求，可能被迫將更多產能外移。（[來源：Greenpeace East Asia, 2023](https://www.greenpeace.org/eastasia/press/7930/semiconductor-industry-electricity-consumption-to-more-than-double-by-2030-study/)；[Global Taiwan Institute, 2026](https://globaltaiwan.org/2026/02/taiwans-bumpy-road-to-energy-resilience/)；[S&P Global, 2024](https://www.spglobal.com/ratings/en/regulatory/article/240226-sustainability-insights-tsmc-and-water-a-case-study-of-how-climate-is-becoming-a-credit-risk-factor-s12992283)）

## 8.3 關鍵爭議與數據對比

| 爭議焦點 | 多頭觀點 | 空頭觀點 | 關鍵數據 |
|---------|---------|---------|---------|
| **AI 需求持續性** | AI 推理 token 每 3 個月指數增長，「still in early stage」 | Hyperscaler CapEx $6,000 億可能過熱，商業化回報不明 | AI 加速器 CAGR 54-56%（2024-2029E）vs. 歷史週期性調整每 3-4 年一次 |
| **地緣風險定價** | 海外擴張創造溢價定價機會，$1,650 億美國投資綁定美國利益 | CFR 列台海危機為 Tier I 風險，封鎖概率 60%（5 年） | 封鎖情境 TSMC 營收損失 60-80% vs. 海外產能僅佔 ~20% |
| **矽盾效力** | 全球 $1.6T 營收依賴台灣晶片，攻台方自損嚴重 | 美國本土產能建設削弱保護台灣的利益基礎 | TSMC 台灣產能佔比 ~80%（2025）→預估 ~60-65%（2030） |
| **海外廠獲利** | 溢價定價（「Made in USA is premium」）+政府補貼 | 成本高 30-50%、稀釋毛利 2-4pp | 美國廠 $1,650 億 vs. 補貼 $66 億（回收率 4%） |
| **SMIC 追趕** | 無 EUV、良率差、成本高 50%、規模太小 | 7nm 量產、5nm 已開發、中國國家意志推動 | SMIC 7nm <20K 片/月 vs. TSMC 先進製程數十萬片/月 |
| **環境瓶頸** | 每 kWh 生產在全球節省 6.39 kWh（淨正面 6.39x）；MSCI AAA、DJSI 24 年 | 2023 年用電 24.78 TWh（台灣 8.9%），2030E 佔 24%；97% 進口能源；2021 旱災迫使農民休耕 | RE100 目標 2040（2024 年 13-14%）；日用水 15 萬噸；碳排 1,142 萬噸/年；S&P 列水為信用風險 |
| **估值合理性** | 2025 ROIC 41.5%、淨利率 45%，技術壟斷溢價合理 | 25x P/E 已反映樂觀預期，地緣折價應更大 | 合理情境 3 年 IRR ~18% vs. 保守情境僅 ~6% |

### IRR 與風險概率矛盾的和解——概率加權預期報酬

合理情境 IRR ~18% 與封鎖概率 60%（5 年內）之間存在明顯矛盾：若高概率尾部風險成真，實際報酬將遠低於預期。以下以概率加權框架和解此矛盾：

**概率加權 IRR 模型**：

| 情境 | 3 年 IRR | 概率權重 | 加權 IRR | 假設 |
|------|---------|---------|---------|------|
| **Bull（AI 超預期+地緣緩和）** | +28% | 25% | +7.0% | AI CAGR 54-56% 實現；封鎖未發生；P/E 回升至 28-30x |
| **Base（現狀延續）** | +18% | 50% | +9.0% | 管理層指引實現；灰色地帶施壓持續但未升級；P/E 維持 24-25x |
| **Bear（地緣升溫/AI 放緩）** | +6% | 20% | +1.2% | AI CapEx 週期調整；封鎖威脅升溫壓縮 P/E 至 18-20x |
| **Tail（封鎖/衝突）** | **-40~-60%** | 5% | **-2.0~-3.0%** | 部分封鎖或軍事衝突；P/E 壓縮至 5-10x |
| **概率加權預期 3 年年化報酬** | | **100%** | **~14.2~15.2%** | |

**矛盾和解**：概率加權後的預期年化報酬 ~14-15% 仍具吸引力（優於全球股市長期平均 ~10%），但**尾部風險的非對稱性**是關鍵——5% 概率的 -40~-60% 損失無法被正常情境的收益完全補償。投資人需自行判斷：(1) 是否接受 5% 的「災難性損失」概率換取 95% 情境下的 ~16-18% IRR；(2) 個人投資組合中 TSMC 的倉位是否大到尾部風險會造成不可承受的損失。

**模型敏感度**：若將尾部概率從 5% 上調至 10%（反映更悲觀的地緣判斷），概率加權 IRR 降至 ~11-12%；若下調至 2%（反映地緣緩和），概率加權 IRR 升至 ~16-17%。

## 8.4 投資論點失效條件（What Would Change Our Mind?）

以下 7 個觸發條件涵蓋**競爭、需求、地緣政治、財務、技術、環境**六大領域。任何一項觸發即需重新評估 TSMC 的投資論點。

**觸發條件 1（競爭——Intel 18A 突破）**：
若 Intel 18A 製程良率達 **80%+** 且量產月產能突破 **20,000 片**（2026H2 前），TSMC 先進製程市占可能由 90% 降至 **70-75%**，P/E 合理倍數需下修 2-3x。
- **監測來源**：Intel 季度法說（[Intel IR](https://www.intc.com/investor-relations)）、TechInsights 製程拆解報告、客戶公開轉單聲明
- **影響**：Bull case 中「競爭者差距不減反增」論點失效

**觸發條件 2（需求——AI CapEx 週期反轉）**：
若全球 hyperscaler 合計 CapEx 在任何連續兩季 **QoQ 下降 >15%**，或 NVIDIA 資料中心營收 **YoY 負成長**（2026Q4 前），則 AI 超級週期可能進入調整期。
- **監測來源**：NVIDIA/AMD/Broadcom 季度財報；Google/Microsoft/Amazon/Meta CapEx 指引（各公司 IR 頁面）
- **影響**：TSMC 2026E 營收成長 +30% 假設面臨下修風險；$52-56B CapEx 承諾可能導致產能利用率下降 → 毛利率跌破 53% 長期下限

**觸發條件 3（地緣政治——台海軍事行動）**：
若解放軍對台灣實施 **持續 72 小時以上的海空封鎖**（非演習性質），或 **對台灣基礎設施發射飛彈**，則 TSMC 股價可能瞬間下跌 **30-60%**，所有估值模型失效。
- **監測來源**：CFR Preventive Priorities Survey（[CFR 年度報告](https://www.cfr.org/report/conflicts-watch-2026)）、Recorded Future Insikt Group 季度評估、美國國防部年度中國軍力報告（[DOD China Report](https://www.defense.gov/))
- **影響**：投資論點全面失效；觸發後 12 個月內不應重新建倉

**觸發條件 4（財務——毛利率結構性破位）**：
若 TSMC 連續 **兩個季度**毛利率低於 **53%**（Huang 定義的長期下限），且管理層無法歸因於一次性因素（如匯率劇烈波動），則定價權或成本控制可能出現結構性惡化。
- **監測來源**：TSMC 季度法說（[TSMC IR](https://investor.tsmc.com/english/quarterly-results)）、管理層毛利率指引
- **影響**：ROIC 可能從 40%+ 降至 20% 區間；估值需從「AI 溢價」模型切換至「傳統半導體週期」模型（P/E 15-18x）

**觸發條件 5（技術——N2/A16 良率嚴重延遲）**：
若 N2 製程在量產首年（2025Q4-2026Q4）良率未達 **70%**（vs. N3 首年 ~80%），或 A16 量產時程延遲超過 **6 個月**（從 2026H2 延至 2027H1+），則 TSMC 的「每一代領先」論點受損。
- **監測來源**：TSMC 法說中 N2 營收佔比趨勢（目標 2026 全年 >10%）；客戶 tape-out 數量追蹤；TechInsights/SemiAnalysis 良率分析
- **影響**：客戶可能延遲從 N3 遷移至 N2，壓縮 TSMC 的 ASP 提升空間；Samsung GAA 若同時追上（SF2 良率 >70%），將首次形成同代競爭

**觸發條件 6（地緣政治——ASML EUV 設備對台限制）**：
若荷蘭或美國政府以任何形式限制 ASML **對台灣新增 EUV 設備出貨**（非遠端停用，而是禁止新機出貨），TSMC 在台灣的產能擴張將面臨天花板。
- **監測來源**：荷蘭出口管制政策更新（[Dutch Government Export Controls](https://www.government.nl/topics/export-controls-of-strategic-goods)）；ASML 季度法說（[ASML IR](https://www.asml.com/en/investors)）
- **影響**：TSMC 台灣先進製程產能增長停滯；海外廠（美國、日本）成為唯一擴張路徑，毛利率稀釋加劇

**觸發條件 7（環境——台灣電力/水資源危機）**：
若台灣在 2027 年前再次發生 **持續 3 個月以上的限電或限水**（影響 TSMC 廠區產能利用率降至 **<90%**），則 TSMC 在台灣的產能擴張可行性將被根本質疑。
- **監測來源**：台灣電力公司備轉容量率（[台電公開資訊](https://www.taipower.com.tw/)）；水利署水庫蓄水率；TSMC ESG 報告水資源數據（[TSMC ESG](https://esg.tsmc.com/en-US)）
- **影響**：加速產能外移至海外（成本更高）；S&P 可能下調 TSMC 信用評等展望

**觸發條件匯總矩陣**：

| 觸發條件 | 領域 | 門檻值 | 時間框架 | 監測頻率 | 當前狀態 |
|---------|------|--------|---------|---------|---------|
| Intel 18A 良率 ≥80% + 量產 ≥20K 片/月 | 競爭 | 80% 良率 + 20K WPM | 2026H2 前 | 季度 | 未觸發（良率預計 2027 達標） |
| Hyperscaler CapEx 連續兩季 QoQ -15%+ | 需求 | -15% QoQ（兩季） | 2026Q4 前 | 季度 | 未觸發（2026 CapEx 上修至 $6,000 億） |
| 台海持續 72 小時+ 海空封鎖 | 地緣政治 | 非演習封鎖 >72hr | 持續監測 | 即時 | 未觸發（灰色地帶施壓中） |
| TSMC 毛利率連續兩季 <53% | 財務 | <53%（兩季） | 持續監測 | 季度 | 未觸發（Q4 2025：62.3%） |
| N2 首年良率 <70% 或 A16 延遲 >6 個月 | 技術 | <70% / >6 月延遲 | 2026Q4 前 | 季度 | 未觸發（N2 量產進度正常） |
| ASML 對台 EUV 新機出貨限制 | 地緣政治 | 任何形式限制 | 持續監測 | 季度 | 未觸發（台灣仍為 ASML 最大客戶） |
| 台灣限電/限水 >3 個月影響產能 <90% | 環境 | 產能利用率 <90% | 2027 前 | 月度 | 未觸發（2024 無重大能源危機） |

