/**
 * Initial MAX Scorer
 *
 * 使用 google/gemini-3.1-pro-preview 對公司研究報告打分（張磊四維框架，100分）。
 * 提供 LLM 打分 + heuristic fallback。
 *
 * Usage (standalone):
 *   npx tsx src/initial-max-scorer.ts --ticker FUTU
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chat } from './llm.js';
import { MODELS } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const PASS_TOTAL = 95;
const MIN_環境 = 16;
const MIN_生意 = 30;
const MIN_組織 = 16;
const MIN_人 = 20;

/** 主檔必備子節（1.1～4.2），每節皆須有實質內容才達標 */
const REQUIRED_SECTIONS = ['1.1', '1.2', '1.3', '1.4', '2.1', '2.2', '2.3', '2.4', '2.5', '3.1', '3.2', '3.3', '4.1', '4.2'];
const MIN_SECTION_CHARS = 80;

export interface DimensionScore {
  score: number;
  max: number;
  criteria?: Record<string, number>;
  gaps: string[];
}

export interface InitialMaxScore {
  環境: DimensionScore;
  生意: DimensionScore;
  組織: DimensionScore;
  人: DimensionScore;
  total: number;
  passThreshold: boolean;
  round: number;
}

interface GapItem {
  dimension: string;
  item: string;
  current: number | string;
  target: string;
  shortfall: number;
  priority: number;
}

export interface InitialMaxGaps {
  round: number;
  score: number;
  gaps: GapItem[];
}

export interface ExtendedScore {
  core: InitialMaxScore;
  geopolitical?: DimensionScore;
  sustainability?: DimensionScore;
  contrarian?: DimensionScore;
  extendedTotal: number;
}

const EXTENDED_SECTIONS = ['6.1', '6.2', '6.3', '7.1', '7.2', '7.3', '8.1', '8.2', '8.3', '8.4'];

// ── File reading helpers ──

function getCompanyDir(ticker: string): string {
  return path.join(PROJECT_ROOT, 'data', 'companies', ticker);
}

function readResearchFiles(ticker: string): string {
  const dir = getCompanyDir(ticker);
  if (!fs.existsSync(dir)) return '';

  const targetFiles = [
    `${ticker}_Initial_MAX.md`,
    `${ticker}_Super_Initial_*.md`,
    `${ticker}_Initial_*.md`,
    'initial_financial.md',
    'initial_business_model.md',
    'initial_market_size.md',
    'initial_management.md',
    'initial_products_services.md',
    'initial_competition.md',
    'super_initial_section_*.md',
    'super_initial_five_forces_*.md',
    `dcf_valuation_*.md`,
  ];

  const collected: string[] = [];
  const allFiles = fs.readdirSync(dir);

  for (const pattern of targetFiles) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    for (const f of allFiles) {
      if (regex.test(f)) {
        const fullPath = path.join(dir, f);
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          collected.push(`\n\n=== ${f} ===\n${content.slice(0, 15000)}`);
        } catch {}
      }
    }
  }

  // Also check transcripts directory for interview count
  const transcriptsDir = path.join(dir, 'transcripts');
  if (fs.existsSync(transcriptsDir)) {
    const transcriptFiles = fs.readdirSync(transcriptsDir).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
    collected.push(`\n\n=== TRANSCRIPTS INDEX (${transcriptFiles.length} files downloaded) ===\n${transcriptFiles.join('\n')}`);
  }

  return collected.join('');
}

/** 檢查主檔是否每個必備子節（1.1～4.2）皆有實質內容；缺節或僅「待補充」視為未覆蓋。 */
function checkAllSectionsCovered(mainContent: string): { allCovered: boolean; missing: string[] } {
  const missing: string[] = [];
  for (const id of REQUIRED_SECTIONS) {
    const re = new RegExp(`^##\\s*${id.replace('.', '\\.')}\\b.*$`, 'm');
    const match = mainContent.match(re);
    if (!match || match.index == null) {
      missing.push(id);
      continue;
    }
    const sectionStart = match.index! + match[0].length;
    const after = mainContent.slice(sectionStart);
    const nextHeading = after.match(/\n##\s/m);
    const sectionEnd = nextHeading && nextHeading.index != null ? sectionStart + nextHeading.index : mainContent.length;
    const body = mainContent.slice(sectionStart, sectionEnd).replace(/\s+/g, ' ').trim();
    if (body.length < MIN_SECTION_CHARS || /^待補充\s*$/i.test(body)) missing.push(id);
  }
  return { allCovered: missing.length === 0, missing };
}

// ── Heuristic fallback scorer ──

/** 從單一主檔 {TICKER}_Initial_MAX.md 內文評分。 */
function scoreFromMainFile(content: string): { 環境: number; 生意: number; 組織: number; 人: number } {
  let 環境 = 0;
  if (/\d+[BMT]|\d+億|TAM|addressable market/i.test(content)) 環境 += 5;
  if (/市占|market share|concentration|consolidat|競爭|competition/i.test(content)) 環境 += 5;
  if (/regulat|監管|法規|policy|政策/i.test(content)) 環境 += 5;
  if (/trend|趨勢|adoption|AI|cloud|技術/i.test(content)) 環境 += 3;

  let 生意 = 0;
  const yearMatches = content.match(/20\d\d/g) ?? [];
  生意 += Math.min(new Set(yearMatches).size, 10);
  // Count actual quoted passages (「...」 or "..." or 『...』 with 10+ chars inside)
  const directQuotes = (content.match(/「[^」]{10,}」|"[^"]{10,}"|『[^』]{10,}』/g) ?? []);
  生意 += Math.min(directQuotes.length, 10);
  if (/五力|Five Forces|5a|5b|5c|5d|5e|護城河|moat/i.test(content)) 生意 += 10;
  // DCF + multi-metric valuation: structural checks (0-5)
  const hasDCFKeyword = /DCF|IRR|dcf_config|情境.*估值/i.test(content);
  const hasWACC = /WACC|加權平均|折現率|discount rate/i.test(content);
  const scenarioCount = (content.match(/樂觀|保守|合理|optimistic|conservative|base case/gi) ?? []).length;
  let dcfSub = 0;
  if (hasWACC) dcfSub += 1;
  if (scenarioCount >= 2) dcfSub += 1;
  // Check for ≥2 valuation methods beyond P/E (EV/EBITDA, P/FCF)
  const hasEVEBITDA = /EV\/EBITDA|EV.EBITDA|企業價值.*EBITDA/i.test(content);
  const hasPFCF = /P\/FCF|price.to.free.cash|本益比.*自由現金/i.test(content);
  if (hasEVEBITDA || hasPFCF) dcfSub += 1;
  // Count distinct numbers in section 2.5 (structural depth)
  const section25Match = content.match(/##\s*2\.5[\s\S]*?(?=\n#\s|\n##\s[^2]|$)/);
  if (section25Match) {
    const nums = section25Match[0].match(/\d+\.?\d*/g) ?? [];
    if (nums.length >= 20) dcfSub += 1;
  }
  // Fair value range stated
  if (/公允價值|fair value|目標價|price target|合理估值/i.test(content)) dcfSub += 1;
  // DCF sanity bounds: WACC 8-14%, terminal growth < WACC
  const waccMatch = section25Match?.[0]?.match(/WACC[^0-9]*(\d+\.?\d*)%/i);
  if (waccMatch) {
    const wacc = parseFloat(waccMatch[1]);
    if (wacc < 8 || wacc > 14) dcfSub = Math.max(dcfSub - 1, 0);
  }
  const termMatch = section25Match?.[0]?.match(/terminal.*growth[^0-9]*(\d+\.?\d*)%/i);
  const termMatchCN = section25Match?.[0]?.match(/終端.*成長[^0-9]*(\d+\.?\d*)%/i);
  const termGrowth = parseFloat((termMatch ?? termMatchCN)?.[1] ?? '0');
  if (waccMatch && termGrowth > 0 && termGrowth >= parseFloat(waccMatch[1])) dcfSub = Math.max(dcfSub - 1, 0);
  生意 += Math.min(dcfSub, 5);
  生意 = Math.min(生意, 35);

  // CEO quote minimum: framework requires ≥25 direct quotes
  const ceoQuoteMatches = content.match(/「[^」]{15,}」|"[^"]{15,}"/g) ?? [];
  if (ceoQuoteMatches.length < 25) 生意 = Math.min(生意, 20);

  let 組織 = 0;
  if (/來源|source|10-K|20-F|法說|earnings call/i.test(content)) 組織 += 4;
  if (/\|.*\|.*\|/.test(content) && /region|地區|市場|segment|部門|營收/i.test(content)) 組織 += 4;
  if (/penetrat|滲透率|market share|市占/i.test(content)) 組織 += 2;
  if (/ROIC|return on invested|operating leverage|費用率/i.test(content)) 組織 += 6;
  if (/culture|文化|incentive|激勵|talent|人才/i.test(content)) 組織 += 4;
  組織 = Math.min(組織, 20);

  let 人 = 0;
  const urlCount = (content.match(/https?:\/\//g) ?? []).length;
  人 += Math.min(Math.floor((urlCount / 25) * 10), 10);
  if (/philosophy|哲學|第一性原理|first principle|vision|格局|故事線/i.test(content)) 人 += 5;
  // Succession risk check
  const hasSuccession = /繼任|succession|板凳深度|bench depth|next.gen.*leader|SVP|EVP/i.test(content);
  const hasCEOAge = /CEO.*\d{2}.*歲|CEO.*age.*\d{2}|chairman.*\d{2}.*歲|任期.*\d+.*年/i.test(content);
  if (hasSuccession && hasCEOAge) 人 += 5;
  else if (hasSuccession || hasCEOAge) 人 += 2;
  if (/integrity|誠信|value|創造價值|moral|責任/i.test(content)) 人 += 3;
  人 = Math.min(人, 25);
  return { 環境, 生意, 組織, 人 };
}

function heuristicScore(ticker: string): InitialMaxScore {
  const dir = getCompanyDir(ticker);
  const allFiles = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const mainFile = path.join(dir, `${ticker}_Initial_MAX.md`);

  let 環境Score = 0;
  let 生意Score = 0;
  let 組織Score = 0;
  let 人Score = 0;

  if (fs.existsSync(mainFile)) {
    const mainContent = fs.readFileSync(mainFile, 'utf-8');
    const fromMain = scoreFromMainFile(mainContent);
    環境Score = fromMain.環境;
    生意Score = fromMain.生意;
    組織Score = fromMain.組織;
    人Score = fromMain.人;
  }

  const transcriptsDir = path.join(dir, 'transcripts');
  if (fs.existsSync(transcriptsDir)) {
    const count = fs.readdirSync(transcriptsDir).length;
    人Score = Math.min(25, 人Score + Math.min(Math.floor((count / 25) * 10), 10));
  }

  if (!fs.existsSync(mainFile)) {
    const marketFile = path.join(dir, 'initial_market_size.md');
    const finFile = path.join(dir, 'initial_financial.md');
    const bizFile = path.join(dir, 'initial_business_model.md');
    const mgmtFile = path.join(dir, 'initial_management.md');
    let 組織ScoreScattered = 0;
    let 人ScoreScattered = 0;
    if (fs.existsSync(marketFile)) {
      const c = fs.readFileSync(marketFile, 'utf-8');
      if (/\d+[BMT]|\d+億/.test(c)) 環境Score += 5;
      if (/市占|market share|concentration|consolidat/i.test(c)) 環境Score += 5;
      if (/regulat|監管|法規|policy|政策/i.test(c)) 環境Score += 5;
      if (/trend|趨勢|adoption|AI|cloud/i.test(c)) 環境Score += 3;
    }
    if (fs.existsSync(finFile)) {
      const c = fs.readFileSync(finFile, 'utf-8');
      生意Score += Math.min((c.match(/20\d\d/g) ?? []).length, 10);
    }
    if (fs.existsSync(bizFile)) {
      const c = fs.readFileSync(bizFile, 'utf-8');
      生意Score += Math.min(Math.floor(((c.match(/"|「|『/g) ?? []).length) / 4), 10);
    }
    生意Score += Math.min(allFiles.filter(f => /five_forces|5[a-e]_/i.test(f)).length * 2, 10);
    if (allFiles.some(f => f.startsWith('dcf_valuation') || f === 'dcf_config.json')) 生意Score += 5;
    生意Score = Math.min(生意Score, 35);
    if (fs.existsSync(marketFile)) {
      const c = fs.readFileSync(marketFile, 'utf-8');
      if (/來源|source|10-K|20-F|法說/i.test(c)) 組織ScoreScattered += 4;
      if (/\|.*\|.*\|/.test(c) && /region|地區|市場/i.test(c)) 組織ScoreScattered += 4;
      if (/penetrat|滲透率|市占/i.test(c)) 組織ScoreScattered += 2;
    }
    if (fs.existsSync(mgmtFile)) {
      const c = fs.readFileSync(mgmtFile, 'utf-8');
      if (/ROIC|operating leverage|費用率/i.test(c)) 組織ScoreScattered += 6;
      if (/culture|文化|incentive|激勵|talent|人才/i.test(c)) 組織ScoreScattered += 4;
      const urlCount = (c.match(/https?:\/\//g) ?? []).length;
      人ScoreScattered += Math.min(Math.floor((urlCount / 25) * 15), 15);
      if (/philosophy|哲學|第一性原理|vision|格局/i.test(c)) 人ScoreScattered += 5;
      if (/integrity|誠信|value|創造價值|moral|責任/i.test(c)) 人ScoreScattered += 3;
    }
    if (fs.existsSync(transcriptsDir)) {
      人ScoreScattered += Math.min(Math.floor((fs.readdirSync(transcriptsDir).length / 25) * 10), 10);
    }
    組織Score = Math.min(組織ScoreScattered, 20);
    人Score = Math.min(人ScoreScattered, 25);
  }

  let total = Math.min(環境Score + 生意Score + 組織Score + 人Score, 100);

  // URL citation floor: reports with <20 URLs lack sufficient sourcing
  if (fs.existsSync(mainFile)) {
    const mainContentForUrls = fs.readFileSync(mainFile, 'utf-8');
    const totalUrlCount = (mainContentForUrls.match(/https?:\/\//g) ?? []).length;
    if (totalUrlCount < 20) total = Math.min(total, 60);
  }

  let hasDCF = false;
  if (fs.existsSync(mainFile)) {
    const mainContent = fs.readFileSync(mainFile, 'utf-8');
    hasDCF = /2\.5|DCF|情境.*估值|dcf_config|IRR.*拆分|三情境|樂觀.*保守/i.test(mainContent);
  } else {
    hasDCF = allFiles.some(f => f.startsWith('dcf_valuation') || f === 'dcf_config.json');
  }

  let sectionCoverage = { allCovered: true as boolean, missing: [] as string[] };
  if (fs.existsSync(mainFile)) {
    const mainContent = fs.readFileSync(mainFile, 'utf-8');
    sectionCoverage = checkAllSectionsCovered(mainContent);
  }

  const passThreshold =
    total >= PASS_TOTAL &&
    環境Score >= MIN_環境 &&
    生意Score >= MIN_生意 &&
    組織Score >= MIN_組織 &&
    人Score >= MIN_人 &&
    hasDCF &&
    sectionCoverage.allCovered;

  const sectionGap = sectionCoverage.missing.length ? [`子節未全覆蓋：${sectionCoverage.missing.join('、')} 須有實質內容`] : [];

  return {
    環境: { score: 環境Score, max: 20, gaps: [...(環境Score < MIN_環境 ? ['需補充市場結構/監管資料'] : []), ...sectionGap] },
    生意: { score: 生意Score, max: 35, gaps: 生意Score < MIN_生意 || !hasDCF ? ['需補充財務歷史/≥25 CEO引言/五力/2.5 DCF估值(必達)'] : [] },
    組織: { score: 組織Score, max: 20, gaps: 組織Score < MIN_組織 ? ['需補充地理分部(含出處)/ROIC分析'] : [] },
    人: { score: 人Score, max: 25, gaps: 人Score < MIN_人 ? ['需補充訪談≥25篇並下載逐字稿'] : [] },
    total,
    passThreshold,
    round: 0,
  };
}

// ── LLM scorer ──

const SCORER_SYSTEM_PROMPT = `你是一位專業的投資研究品質評審。請根據張磊（高瓴資本）「環境→生意→組織→人」投資研究框架，對以下公司研究報告進行**嚴格**評分。

**達標條件（須全部滿足）**：總分 ≥ **95 分**，且各維度達最低分：環境≥16、生意≥30、組織≥16、人≥20；**缺「2.5 DCF 估值」小節（情境表/三表/IRR 或 dcf_config）則生意維度不得達標**（DCF 為必達項）。**每個子節（1.1～4.2）皆須有實質內容**，缺一則不達標。
**內容深度**：**環境**須從**該產業的起源或現代形態起點**論述（例如廣告業從現代廣告誕生開始）；**4.1 CEO/創業家**須從**學經歷**開始，含**重要拐點、重要成就、每個時期的訪談**、**成功與失敗的檢討與反思**；不足者扣分。

## 評分框架（100分）

### 一、環境 (20分，最低 16 才達標)
- TAM & 產業成長趨勢（有數字+出處）：0-5分
- 市場結構（集中化/碎片化分析）：0-5分
- 監管/政策環境（主要法規風險+機會）：0-5分
- 技術與需求趨勢（採用曲線/需求轉變論述）：0-5分

### 二、生意 (35分，最低 30 才達標；**2.5 DCF 為必達**)
- 財務歷史完整度（≥10年表格，含毛利/營業利益/EPS，轉折點說明）：0-10分
- 商業模式深度（收入拆分+unit economics+**≥25個CEO直引言**，每則須引號+出處+日期）：0-10分
- 競爭護城河（Five Forces 5a-5e 全齊+技術差異段落+CEO護城河引言）：0-10分
- **多指標估值+DCF（2.5 小節必達）**：**≥3 種估值方法**（P/E + EV/EBITDA + P/FCF 為最低要求），若僅使用單一估值方法（如只有 P/E），該項最多 2 分。須含 WACC 分解（Rf+ERP×β+地緣溢價）+ 三情境表 + IRR拆分 + 3×3敏感度矩陣（營收成長 vs WACC），缺 WACC 分解或敏感度矩陣者不得滿分：0-5分
- **數值合理性檢查**：WACC 應在 8-14% 區間（含地緣溢價），若超出須有明確理由；終端成長率必須 < WACC；P/E 倍數應在 10-40x 除非有產業特殊理由。違反且無說明者扣分。

### 三、組織 (20分，最低 16 才達標)
- 地理/業務分部收入（來自年報/法說逐字稿，**含明確出處頁碼/日期**，無出處不計分）：0-8分
- 組織文化與激勵機制（人才策略+股權激勵+逆勢擴張案例）：0-6分
- 運營效率（ROIC趨勢計算/Operating Leverage分析）：0-6分

### 四、人 (25分，最低 20 才達標)
- CEO格局觀與商業哲學（多年敘事，第一性原理決策邏輯）：0-5分
- **繼任風險與板凳深度**：CEO 年齡與任期是否明確標示；是否剖析 ≥2 位次世代領導人（SVP/EVP 級：背景、任期、強項）；板凳深度評級（高/中/低+理由）；繼任計畫揭露狀態。若 CEO 年齡未提及且無繼任人剖析，扣分：0-5分
- 道德操守與價值創造驅動力（具體案例佐證，非泛泛描述）：0-5分
- 公開訪談**≥25篇**+逐字稿已下載至transcripts/：0-10分 [計算公式：min(訪談數/25, 1.0)×10]

## 嚴格扣分規則（必遵）
- **無出處的數字一律不計分**：TAM、市占、營收、地理分部等未標年報/法說出處則該項扣分。
- **出處應可驗證**：在通常可取得公開連結的情境下（年報、法說、新聞、訪談），若僅寫來源名稱或檔名而**無 \`http(s)\` 連結**，該條出處從嚴扣分；已附可點擊連結者從寬。
- **每個子點（1.1～4.1）須至少 5 則管理層直接引述**（引號「…」或 "…" + 出處+日期）；不足 5 則或為間接描述者，扣該維度分。
- **CEO 引言**：僅計**直接引述**（有引號包住）；間接描述、轉述、無出處者不計入則數且扣分。
- **訪談**：只計有實際 URL 的條目；滿分門檻為 ≥25 篇。
- 從嚴給分：可給可不給時給較低分；缺關鍵元素明顯扣分。

## 輸出格式

請輸出純 JSON（不加 code fence，不加其他文字）：
{
  "環境": {
    "score": 數字,
    "max": 20,
    "criteria": {"TAM趨勢": 數字, "市場結構": 數字, "監管政策": 數字, "技術趨勢": 數字},
    "gaps": ["具體缺口描述1", "具體缺口描述2"]
  },
  "生意": {
    "score": 數字,
    "max": 35,
    "criteria": {"財務歷史": 數字, "商業模式": 數字, "五力分析": 數字, "DCF投資論文": 數字},
    "gaps": ["具體缺口描述"]
  },
  "組織": {
    "score": 數字,
    "max": 20,
    "criteria": {"地理分部": 數字, "組織文化": 數字, "運營效率": 數字},
    "gaps": ["具體缺口描述"]
  },
  "人": {
    "score": 數字,
    "max": 25,
    "criteria": {"格局觀哲學": 數字, "繼任風險": 數字, "道德操守": 數字, "訪談逐字稿": 數字},
    "gaps": ["具體缺口描述"]
  },
  "total": 數字
}`;

async function llmScore(
  ticker: string,
  reportContent: string,
  model: string = MODELS.SCORING,
): Promise<InitialMaxScore | null> {
  const userMessage = `請評分以下 ${ticker} 的研究報告：

${reportContent.slice(0, 80000)}`;

  try {
    const response = await chat(
      SCORER_SYSTEM_PROMPT,
      [{ role: 'user', content: userMessage }],
      { model, maxTokens: 4096 },
    );

    if (!response.content) return null;

    let jsonStr = response.content.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();

    // Find outermost JSON object
    const start = jsonStr.indexOf('{');
    if (start === -1) return null;
    let depth = 0;
    let end = -1;
    for (let i = start; i < jsonStr.length; i++) {
      if (jsonStr[i] === '{') depth++;
      else if (jsonStr[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) return null;

    const parsed = JSON.parse(jsonStr.slice(start, end + 1));
    const total = parsed.total ?? (
      (parsed['環境']?.score ?? 0) +
      (parsed['生意']?.score ?? 0) +
      (parsed['組織']?.score ?? 0) +
      (parsed['人']?.score ?? 0)
    );

    const 環境 = parsed['環境']?.score ?? 0;
    const 生意 = parsed['生意']?.score ?? 0;
    const 組織 = parsed['組織']?.score ?? 0;
    const 人 = parsed['人']?.score ?? 0;
    const passThreshold =
      total >= PASS_TOTAL &&
      環境 >= MIN_環境 &&
      生意 >= MIN_生意 &&
      組織 >= MIN_組織 &&
      人 >= MIN_人;

    return {
      環境: { score: 環境, max: 20, criteria: parsed['環境']?.criteria, gaps: parsed['環境']?.gaps ?? [] },
      生意: { score: 生意, max: 35, criteria: parsed['生意']?.criteria, gaps: parsed['生意']?.gaps ?? [] },
      組織: { score: 組織, max: 20, criteria: parsed['組織']?.criteria, gaps: parsed['組織']?.gaps ?? [] },
      人: { score: 人, max: 25, criteria: parsed['人']?.criteria, gaps: parsed['人']?.gaps ?? [] },
      total,
      passThreshold,
      round: 0,
    };
  } catch (err: any) {
    console.error('LLM scorer error:', err.message);
    return null;
  }
}

// ── Gap builder ──

function buildGapsJson(score: InitialMaxScore, round: number, ticker?: string): InitialMaxGaps {
  const gaps: GapItem[] = [];
  let priority = 1;

  // 人維度 (25pts) — 高回報缺口
  const 人訪談Score = score.人.criteria?.['訪談逐字稿'] ?? Math.floor(score.人.score * 0.6);
  if (人訪談Score < 15) {
    const currentInterviews = Math.floor((人訪談Score / 15) * 25);
    gaps.push({
      dimension: '人', item: '訪談篇數+逐字稿',
      current: currentInterviews, target: '≥25篇並下載逐字稿',
      shortfall: Math.max(0, 25 - currentInterviews), priority: priority++,
    });
  }
  if ((score.人.criteria?.['格局觀哲學'] ?? 0) < 4) {
    gaps.push({ dimension: '人', item: 'CEO格局觀與商業哲學', current: score.人.criteria?.['格局觀哲學'] ?? 0, target: '5分', shortfall: 5 - (score.人.criteria?.['格局觀哲學'] ?? 0), priority: priority++ });
  }
  // Succession risk gap
  if ((score.人.criteria?.['繼任風險'] ?? 0) < 3) {
    gaps.push({ dimension: '人', item: '繼任風險：CEO 年齡、≥2 位次世代領導人、板凳深度評級', current: score.人.criteria?.['繼任風險'] ?? 0, target: '5分', shortfall: 5 - (score.人.criteria?.['繼任風險'] ?? 0), priority: priority++ });
  }

  // 生意維度 (35pts)
  if ((score.生意.criteria?.['財務歷史'] ?? 0) < 8) {
    gaps.push({ dimension: '生意', item: '財務歷史完整度', current: score.生意.criteria?.['財務歷史'] ?? 0, target: '10分（≥10年表格）', shortfall: 10 - (score.生意.criteria?.['財務歷史'] ?? 0), priority: priority++ });
  }
  if ((score.生意.criteria?.['商業模式'] ?? 0) < 8) {
    gaps.push({ dimension: '生意', item: '商業模式深度(≥25個CEO直引言)', current: score.生意.criteria?.['商業模式'] ?? 0, target: '10分', shortfall: 10 - (score.生意.criteria?.['商業模式'] ?? 0), priority: priority++ });
  }
  if ((score.生意.criteria?.['五力分析'] ?? 0) < 8) {
    gaps.push({ dimension: '生意', item: '五力分析完整度', current: score.生意.criteria?.['五力分析'] ?? 0, target: '10分', shortfall: 10 - (score.生意.criteria?.['五力分析'] ?? 0), priority: priority++ });
  }
  if ((score.生意.criteria?.['DCF投資論文'] ?? 0) < 4) {
    gaps.push({ dimension: '生意', item: 'DCF模型+三情境+IRR拆分', current: score.生意.criteria?.['DCF投資論文'] ?? 0, target: '5分', shortfall: 5 - (score.生意.criteria?.['DCF投資論文'] ?? 0), priority: priority++ });
  }
  // Multi-metric valuation gap: check if only one method used
  if ((score.生意.criteria?.['DCF投資論文'] ?? 0) < 5) {
    gaps.push({ dimension: '生意', item: '多指標估值：須含 EV/EBITDA 和 P/FCF（不能只有 P/E）', current: score.生意.criteria?.['DCF投資論文'] ?? 0, target: '5分', shortfall: 2, priority: priority++ });
  }
  // DCF sanity bounds gap: check WACC and terminal growth directly from report
  if (ticker) {
    const mainPath = path.join(getCompanyDir(ticker), `${ticker}_Initial_MAX.md`);
    if (fs.existsSync(mainPath)) {
      const content = fs.readFileSync(mainPath, 'utf-8');
      const sec25 = content.match(/##\s*2\.5[\s\S]*?(?=\n#\s|\n##\s[^2]|$)/);
      if (sec25) {
        const wm = sec25[0].match(/WACC[^0-9]*(\d+\.?\d*)%/i);
        const tm = sec25[0].match(/terminal.*growth[^0-9]*(\d+\.?\d*)%/i) ?? sec25[0].match(/終端.*成長[^0-9]*(\d+\.?\d*)%/i);
        const waccVal = wm ? parseFloat(wm[1]) : null;
        const termVal = tm ? parseFloat(tm[1]) : null;
        const waccOob = waccVal !== null && (waccVal < 8 || waccVal > 14);
        const termInvalid = waccVal !== null && termVal !== null && termVal >= waccVal;
        if (waccOob || termInvalid) {
          gaps.push({ dimension: '生意', item: 'DCF 數值合理性：WACC 須在 8-14%，終端成長率 < WACC', current: `WACC:${waccVal ?? '?'}% term:${termVal ?? '?'}%`, target: '合理區間', shortfall: 1, priority: priority++ });
        }
      }
    }
  }

  // 組織維度 (20pts)
  if ((score.組織.criteria?.['地理分部'] ?? 0) < 6) {
    gaps.push({ dimension: '組織', item: '地理/業務分部收入(年報出處)', current: score.組織.criteria?.['地理分部'] ?? 0, target: '8分', shortfall: 8 - (score.組織.criteria?.['地理分部'] ?? 0), priority: priority++ });
  }
  if ((score.組織.criteria?.['運營效率'] ?? 0) < 4) {
    gaps.push({ dimension: '組織', item: 'ROIC趨勢/Operating Leverage', current: score.組織.criteria?.['運營效率'] ?? 0, target: '6分', shortfall: 6 - (score.組織.criteria?.['運營效率'] ?? 0), priority: priority++ });
  }

  // 環境維度 (20pts)
  if (score.環境.score < 16) {
    for (const gap of score.環境.gaps) {
      gaps.push({ dimension: '環境', item: gap, current: 0, target: '完整', shortfall: 20 - score.環境.score, priority: priority++ });
    }
  }

  // Sort by shortfall descending
  gaps.sort((a, b) => b.shortfall - a.shortfall);
  gaps.forEach((g, i) => { g.priority = i + 1; });

  return { round, score: score.total, gaps };
}

// ── Main exported function ──

export async function scoreCompanyResearch(
  ticker: string,
  round = 0,
  model: string = MODELS.SCORING,
): Promise<{ score: InitialMaxScore; gaps: InitialMaxGaps }> {
  const reportContent = readResearchFiles(ticker);
  const dir = getCompanyDir(ticker);

  let score: InitialMaxScore;

  if (reportContent.trim().length < 100) {
    console.log(`[scorer] No research files found for ${ticker}, using zero score`);
    score = {
      環境: { score: 0, max: 20, gaps: ['無研究資料'] },
      生意: { score: 0, max: 35, gaps: ['無研究資料'] },
      組織: { score: 0, max: 20, gaps: ['無研究資料'] },
      人: { score: 0, max: 25, gaps: ['無研究資料'] },
      total: 0,
      passThreshold: false,
      round,
    };
  } else {
    // Hybrid scoring: heuristic first as gate, then LLM if worthwhile
    const heuristic = heuristicScore(ticker);
    console.log(`[scorer] Heuristic score: ${heuristic.total}/100 (環境:${heuristic.環境.score} 生意:${heuristic.生意.score} 組織:${heuristic.組織.score} 人:${heuristic.人.score})`);

    if (heuristic.total < 50) {
      // Low-quality report: skip expensive LLM call
      console.log(`[scorer] Heuristic < 50, skipping LLM (not worth the cost)`);
      score = { ...heuristic, round };
    } else {
      // Worth scoring with LLM — it's authoritative when available
      console.log(`[scorer] Running LLM scorer (${model}) for ${ticker}...`);
      const llmResult = await llmScore(ticker, reportContent, model);

      if (llmResult) {
        score = { ...llmResult, round };
        const mainFile = path.join(dir, `${ticker}_Initial_MAX.md`);
        if (fs.existsSync(mainFile)) {
          const sectionCoverage = checkAllSectionsCovered(fs.readFileSync(mainFile, 'utf-8'));
          if (!sectionCoverage.allCovered) {
            score.passThreshold = false;
            score.環境.gaps = [...score.環境.gaps, `子節未全覆蓋：${sectionCoverage.missing.join('、')} 須有實質內容`];
          }
        }
        console.log(`[scorer] LLM score: ${score.total}/100 (環境:${score.環境.score} 生意:${score.生意.score} 組織:${score.組織.score} 人:${score.人.score})`);
      } else {
        // LLM failed, fall back to heuristic
        console.log('[scorer] LLM failed, using heuristic fallback');
        score = { ...heuristic, round };
      }
    }
  }

  const gaps = buildGapsJson(score, round, ticker);

  // Write score and gaps files
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `initial_max_score_${round}.json`),
    JSON.stringify(score, null, 2),
  );
  fs.writeFileSync(
    path.join(dir, `initial_max_gaps_${round}.json`),
    JSON.stringify(gaps, null, 2),
  );

  return { score, gaps };
}

// ── Extended scoring (geopolitical, sustainability, contrarian) ──

const EXTENDED_SCORER_PROMPT = `你是一位專業的研究品質評審。請對以下公司研究報告的**延伸分析**（地緣政治、環境永續、正反論辯）進行評分。

## 評分框架（45分）

### 六、地緣政治分析 (15分)
- 6.1 地緣政治地位與影響（公司對所在國/地區的戰略重要性）：0-5分
- 6.2 國際關係與供應鏈風險（盟友關係、供應鏈依賴、脫鉤風險）：0-5分
- 6.3 政策/制裁/貿易風險（CHIPS Act、出口管制、關稅等）：0-5分

### 七、環境永續分析 (15分)
- 7.1 能源與資源消耗（電力、水、土地等數據+出處）：0-5分
- 7.2 環境爭議與ESG（爭議事件、ESG評級、環保團體立場）：0-5分
- 7.3 氣候風險與轉型（碳排路徑、再生能源承諾、轉型成本）：0-5分

### 八、正反論辯 (20分)
- 8.1 Bull Case（投資多頭論點，有數據支撐）：0-5分
- 8.2 Bear Case（投資空頭論點，有數據支撐）：0-5分
- 8.3 關鍵爭議與數據對比（雙方論點並列，數據互相對照）：0-5分
- 8.4 投資論點失效條件（What Would Change Our Mind?）：≥5 個具體、可證偽、有時限的觸發條件，各含指標+門檻值+時間框架+監測來源+對論點影響；須涵蓋競爭、需求、地緣政治、財務、技術五領域。若僅列模糊條件（無數值門檻或時間框架）最多 2 分：0-5分

## 評分規則
- **無出處不計分**：所有數字必須有可驗證來源
- **平衡性**：正反論辯必須兩方論點強度對等，非刻意偏頗
- **時效性**：數據應盡量使用近 2 年內的資料，除非描述歷史趨勢
- **深度**：每個子節至少 2 段論述+數據，非僅條列

## 輸出格式
純 JSON（不加 code fence）：
{
  "geopolitical": {"score": 數字, "max": 15, "criteria": {"地緣地位": 數字, "國際關係": 數字, "政策風險": 數字}, "gaps": ["缺口"]},
  "sustainability": {"score": 數字, "max": 15, "criteria": {"能源消耗": 數字, "環境爭議": 數字, "氣候轉型": 數字}, "gaps": ["缺口"]},
  "contrarian": {"score": 數字, "max": 20, "criteria": {"Bull Case": 數字, "Bear Case": 數字, "數據對比": 數字, "論點失效條件": 數字}, "gaps": ["缺口"]},
  "extendedTotal": 數字
}`;

async function llmExtendedScore(
  ticker: string,
  reportContent: string,
  model: string = MODELS.SCORING,
): Promise<ExtendedScore | null> {
  const dummyCore: InitialMaxScore = {
    環境: { score: 0, max: 20, gaps: [] }, 生意: { score: 0, max: 35, gaps: [] },
    組織: { score: 0, max: 20, gaps: [] }, 人: { score: 0, max: 25, gaps: [] },
    total: 0, passThreshold: false, round: 0,
  };

  try {
    const response = await chat(
      EXTENDED_SCORER_PROMPT,
      [{ role: 'user', content: `請評分以下 ${ticker} 的延伸分析：\n\n${reportContent.slice(0, 80000)}` }],
      { model, maxTokens: 4096 },
    );
    if (!response.content) return null;

    let jsonStr = response.content.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    const start = jsonStr.indexOf('{');
    if (start === -1) return null;
    let depth = 0, end = -1;
    for (let i = start; i < jsonStr.length; i++) {
      if (jsonStr[i] === '{') depth++;
      else if (jsonStr[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) return null;

    const parsed = JSON.parse(jsonStr.slice(start, end + 1));
    return {
      core: dummyCore,
      geopolitical: { score: parsed.geopolitical?.score ?? 0, max: 15, criteria: parsed.geopolitical?.criteria, gaps: parsed.geopolitical?.gaps ?? [] },
      sustainability: { score: parsed.sustainability?.score ?? 0, max: 15, criteria: parsed.sustainability?.criteria, gaps: parsed.sustainability?.gaps ?? [] },
      contrarian: { score: parsed.contrarian?.score ?? 0, max: 20, criteria: parsed.contrarian?.criteria, gaps: parsed.contrarian?.gaps ?? [] },
      extendedTotal: parsed.extendedTotal ?? ((parsed.geopolitical?.score ?? 0) + (parsed.sustainability?.score ?? 0) + (parsed.contrarian?.score ?? 0)),
    };
  } catch (err: any) {
    console.error('Extended LLM scorer error:', err.message);
    return null;
  }
}

function heuristicExtendedScore(mainContent: string): { geopolitical: number; sustainability: number; contrarian: number } {
  let geo = 0;
  if (/geopolit|地緣|silicon shield|矽盾/i.test(mainContent)) geo += 2;
  if (/sanction|制裁|tariff|關稅|export control|出口管制/i.test(mainContent)) geo += 2;
  if (/supply chain|供應鏈|CHIPS Act|chip act|晶片法/i.test(mainContent)) geo += 1;

  let sus = 0;
  if (/electricity|電力|water.*usage|用水|能源消耗/i.test(mainContent)) sus += 2;
  if (/ESG|carbon|碳排|emission|排放/i.test(mainContent)) sus += 2;
  if (/renewable|再生能源|sustainability|永續|climate/i.test(mainContent)) sus += 1;

  let con = 0;
  if (/bull case|多頭|投資論點/i.test(mainContent)) con += 2;
  if (/bear case|空頭|反面論點/i.test(mainContent)) con += 2;
  if (/爭議|debate|兩方|both sides|pro.*con/i.test(mainContent)) con += 1;
  // 8.4 falsifiable triggers
  if (/8\.4|失效條件|What Would Change|falsif|change our mind/i.test(mainContent)) con += 3;
  if (/門檻|threshold|within.*month|within.*quarter|監測|monitor/i.test(mainContent)) con += 2;

  return { geopolitical: Math.min(geo, 15), sustainability: Math.min(sus, 15), contrarian: Math.min(con, 20) };
}

export async function scoreExtendedResearch(
  ticker: string,
  round = 0,
  model: string = MODELS.SCORING,
): Promise<ExtendedScore> {
  const dir = getCompanyDir(ticker);
  const mainFile = path.join(dir, `${ticker}_Initial_MAX.md`);
  const mainContent = fs.existsSync(mainFile) ? fs.readFileSync(mainFile, 'utf-8') : '';

  if (mainContent.length < 100) {
    const emptyDim: DimensionScore = { score: 0, max: 15, gaps: ['無延伸分析內容'] };
    return {
      core: { 環境: { score: 0, max: 20, gaps: [] }, 生意: { score: 0, max: 35, gaps: [] }, 組織: { score: 0, max: 20, gaps: [] }, 人: { score: 0, max: 25, gaps: [] }, total: 0, passThreshold: false, round },
      geopolitical: emptyDim, sustainability: emptyDim, contrarian: emptyDim, extendedTotal: 0,
    };
  }

  console.log(`[scorer] Running extended LLM scorer (${model}) for ${ticker}...`);
  const llmResult = await llmExtendedScore(ticker, mainContent, model);

  if (llmResult) {
    console.log(`[scorer] Extended score: ${llmResult.extendedTotal}/45 (geo:${llmResult.geopolitical?.score} sus:${llmResult.sustainability?.score} con:${llmResult.contrarian?.score})`);
    return llmResult;
  }

  console.log('[scorer] Extended LLM failed, using heuristic fallback');
  const h = heuristicExtendedScore(mainContent);
  return {
    core: { 環境: { score: 0, max: 20, gaps: [] }, 生意: { score: 0, max: 35, gaps: [] }, 組織: { score: 0, max: 20, gaps: [] }, 人: { score: 0, max: 25, gaps: [] }, total: 0, passThreshold: false, round },
    geopolitical: { score: h.geopolitical, max: 15, gaps: h.geopolitical < 10 ? ['需補充地緣政治分析'] : [] },
    sustainability: { score: h.sustainability, max: 15, gaps: h.sustainability < 10 ? ['需補充環境永續分析'] : [] },
    contrarian: { score: h.contrarian, max: 20, gaps: h.contrarian < 15 ? ['需補充正反論辯與投資論點失效條件(8.4)'] : [] },
    extendedTotal: h.geopolitical + h.sustainability + h.contrarian,
  };
}

// ── CLI entry point ──

async function main() {
  const args: Record<string, string> = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const val = process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[++i] : 'true';
      args[key] = val;
    }
  }

  const ticker = args.ticker ?? args.t;
  if (!ticker) {
    console.error('Usage: npx tsx src/initial-max-scorer.ts --ticker FUTU');
    process.exit(1);
  }

  const model = args.model ?? MODELS.SCORING;
  const round = parseInt(args.round ?? '0', 10);

  const { score } = await scoreCompanyResearch(ticker.toUpperCase(), round, model);

  console.log('\n╔══════════════════════════════════════╗');
  console.log(`║  Initial MAX Score: ${ticker.padEnd(6)} ${String(score.total).padStart(3)}/100        ║`);
  console.log('╚══════════════════════════════════════╝');
  console.log(`  環境 (20pts): ${score.環境.score}`);
  console.log(`  生意 (35pts): ${score.生意.score}`);
  console.log(`  組織 (20pts): ${score.組織.score}`);
  console.log(`  人   (25pts): ${score.人.score}`);
  console.log(`  達標 (≥95 且各維度達標): ${score.passThreshold ? '✓ YES' : '✗ NO'}`);
  if (score.環境.gaps.length) console.log('\n環境缺口:', score.環境.gaps.join('; '));
  if (score.生意.gaps.length) console.log('生意缺口:', score.生意.gaps.join('; '));
  if (score.組織.gaps.length) console.log('組織缺口:', score.組織.gaps.join('; '));
  if (score.人.gaps.length) console.log('人缺口:', score.人.gaps.join('; '));
}

const _entry = process.argv[1] ?? '';
if (_entry.includes('initial-max-scorer')) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
