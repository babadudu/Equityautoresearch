/**
 * Initial MAX Scorer — v2 (Scorer Reliability + Rubric Reform)
 *
 * Two-channel scoring: structural (heuristic, 0-37) + quality (LLM, 0-60).
 * 5 dimensions: 環境(18), 生意(30), 組織(17), 人(20), 論點(15).
 * Per-dimension LLM calls × 3 with median for variance reduction.
 * Reference-anchored pairwise calibration vs FUTU report.
 *
 * Usage (standalone):
 *   npx tsx src/initial-max-scorer.ts --ticker FUTU
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chat } from './llm.js';
import {
  MODELS, NADIRCLAW_MODELS, SCORER_NUM_CALLS, STRUCTURAL_MAX, QUALITY_MAX,
  PASS_THRESHOLD, STRUCTURAL_PASS_MIN, QUALITY_PASS_MIN,
  SCORER_THINKING_BUDGET, SCORER_MAX_RETRIES,
} from './config.js';
import { hashRubricSet } from './rubric-versions.js';
import { appendScoringEvent, type ScoringEvent } from './scoring-store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

/** 主檔必備子節（1.1～4.2），每節皆須有實質內容才達標 */
const REQUIRED_SECTIONS = ['1.1', '1.2', '1.3', '1.4', '2.1', '2.2', '2.3', '2.4', '2.5', '3.1', '3.2', '3.3', '4.1', '4.2'];
const MIN_SECTION_CHARS = 80;

// ── New dimension weights (Phase 2.1) ──
const WEIGHTS = { 環境: 18, 生意: 30, 組織: 17, 人: 20, 論點: 15 } as const;
type Dimension = keyof typeof WEIGHTS;
const ALL_DIMENSIONS: Dimension[] = ['環境', '生意', '組織', '人', '論點'];

// ── Types ──

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
  論點: DimensionScore;
  structural: number;
  quality: number;
  total: number;
  passThreshold: boolean;
  round: number;
  rubricVersion?: string;
  scorerStatus?: 'full' | 'llm_partial_failure';
  scorerPartialFailure?: boolean;
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

function readMainFile(ticker: string): string {
  const mainPath = path.join(getCompanyDir(ticker), `${ticker}_Initial_MAX.md`);
  return fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf-8') : '';
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

  const transcriptsDir = path.join(dir, 'transcripts');
  if (fs.existsSync(transcriptsDir)) {
    const transcriptFiles = fs.readdirSync(transcriptsDir).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
    collected.push(`\n\n=== TRANSCRIPTS INDEX (${transcriptFiles.length} files downloaded) ===\n${transcriptFiles.join('\n')}`);
  }

  return collected.join('');
}

/** 檢查主檔是否每個必備子節（1.1～4.2）皆有實質內容 */
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

// ── Section extraction per dimension (Phase 1.2) ──

function extractSectionContent(mainContent: string, sectionIds: string[]): string {
  const extracted: string[] = [];
  for (const id of sectionIds) {
    const re = new RegExp(`^##\\s*${id.replace('.', '\\.')}\\b.*$`, 'm');
    const match = mainContent.match(re);
    if (!match || match.index == null) continue;
    const sectionStart = match.index!;
    const after = mainContent.slice(sectionStart + match[0].length);
    const nextHeading = after.match(/\n##\s/m);
    const sectionEnd = nextHeading && nextHeading.index != null
      ? sectionStart + match[0].length + nextHeading.index
      : mainContent.length;
    extracted.push(mainContent.slice(sectionStart, sectionEnd));
  }
  return extracted.join('\n\n');
}

function extractDimensionContent(mainContent: string, dimension: Dimension): string {
  const sectionMap: Record<Dimension, string[]> = {
    環境: ['1.1', '1.2', '1.3', '1.4'],
    生意: ['2.1', '2.2', '2.3', '2.4', '2.5'],
    組織: ['3.1', '3.2', '3.3'],
    人: ['4.1', '4.2'],
    論點: ['2.5', '8.1', '8.2', '8.3', '8.4'],
  };

  let content = extractSectionContent(mainContent, sectionMap[dimension]);

  // For 生意, also include executive summary
  if (dimension === '生意') {
    const execMatch = mainContent.match(/^#\s+Executive Summary[\s\S]*?(?=\n#\s)/m);
    if (execMatch) content = execMatch[0].slice(0, 3000) + '\n\n' + content;
  }

  // For 人, include interview table if present
  if (dimension === '人') {
    const interviewMatch = mainContent.match(/訪談.*\|[\s\S]*?\n\n/m);
    if (interviewMatch) content += '\n\n' + interviewMatch[0];
  }

  // Cap at ~20K chars per dimension (the key variance reducer)
  return content.slice(0, 20000);
}

// ══════════════════════════════════════════════════════════════
// CHANNEL A: Structural Completeness (heuristic, deterministic)
// Max 37 points (8+6+6+6+4+4+3, minus up to 3 consistency deductions)
// ══════════════════════════════════════════════════════════════

interface StructuralResult {
  score: number;
  breakdown: Record<string, number>;
  details: string[];
}

function scoreStructural(ticker: string): StructuralResult {
  const dir = getCompanyDir(ticker);
  const mainPath = path.join(dir, `${ticker}_Initial_MAX.md`);
  const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf-8') : '';
  const breakdown: Record<string, number> = {};
  const details: string[] = [];

  if (!mainContent) {
    return { score: 0, breakdown: {}, details: ['No main file found'] };
  }

  // 1. Section coverage (0-8): all 14 sections present with ≥80 chars
  const { allCovered, missing } = checkAllSectionsCovered(mainContent);
  const coveredCount = REQUIRED_SECTIONS.length - missing.length;
  breakdown['sections_covered'] = allCovered ? 8 : Math.floor((coveredCount / REQUIRED_SECTIONS.length) * 6);
  if (missing.length > 0) details.push(`Missing sections: ${missing.join(', ')}`);

  // 2. DCF structural elements (0-6): WACC + scenarios + sensitivity
  let dcfScore = 0;
  const section25 = mainContent.match(/##\s*2\.5[\s\S]*?(?=\n#\s|\n##\s[^2]|$)/);
  if (section25) {
    if (/WACC|加權平均|折現率/i.test(section25[0])) dcfScore += 1;
    const scenarioCount = (section25[0].match(/樂觀|保守|合理|optimistic|conservative|base case/gi) ?? []).length;
    if (scenarioCount >= 2) dcfScore += 1;
    if (/sensitivity|敏感度/i.test(section25[0])) dcfScore += 1;
    // Multi-method
    const hasEV = /EV\/EBITDA|EV.EBITDA/i.test(section25[0]);
    const hasPFCF = /P\/FCF|price.to.free.cash/i.test(section25[0]);
    const hasPE = /P\/E|本益比/i.test(section25[0]);
    if ([hasEV, hasPFCF, hasPE].filter(Boolean).length >= 2) dcfScore += 2;
    else if ([hasEV, hasPFCF, hasPE].filter(Boolean).length >= 1) dcfScore += 1;
    // Fair value stated
    if (/公允價值|fair value|目標價|price target/i.test(section25[0])) dcfScore += 1;
  } else {
    details.push('Section 2.5 (DCF) not found');
  }
  breakdown['dcf_structure'] = Math.min(dcfScore, 6);

  // 3. Interview count (0-6): concave scoring
  const transcriptsDir = path.join(dir, 'transcripts');
  let interviewCount = 0;
  if (fs.existsSync(transcriptsDir)) {
    interviewCount = fs.readdirSync(transcriptsDir).filter(f => f.endsWith('.md') || f.endsWith('.txt')).length;
  }
  // Concave: 0→0, 10→4, 15→5, 20→5.5, 25+→6
  let interviewScore: number;
  if (interviewCount === 0) interviewScore = 0;
  else if (interviewCount <= 10) interviewScore = Math.floor((interviewCount / 10) * 4);
  else if (interviewCount <= 15) interviewScore = 4 + Math.floor(((interviewCount - 10) / 5));
  else if (interviewCount <= 25) interviewScore = 5 + Math.floor(((interviewCount - 15) / 10));
  else interviewScore = 6;
  breakdown['interview_count'] = Math.min(interviewScore, 6);
  details.push(`Interviews: ${interviewCount}`);

  // 4. URL citation count (0-6): concave
  const urlCount = (mainContent.match(/https?:\/\//g) ?? []).length;
  let urlScore: number;
  if (urlCount < 10) urlScore = 0;
  else if (urlCount < 20) urlScore = 2;
  else if (urlCount < 40) urlScore = 3;
  else if (urlCount < 60) urlScore = 4;
  else if (urlCount < 100) urlScore = 5;
  else urlScore = 6;
  breakdown['url_citations'] = urlScore;
  details.push(`URLs: ${urlCount}`);

  // 5. Quote count with proper formatting (0-4)
  const directQuotes = (mainContent.match(/「[^」]{10,}」|"[^"]{10,}"|『[^』]{10,}』/g) ?? []);
  let quoteScore: number;
  if (directQuotes.length < 10) quoteScore = 0;
  else if (directQuotes.length < 20) quoteScore = 1;
  else if (directQuotes.length < 30) quoteScore = 2;
  else if (directQuotes.length < 40) quoteScore = 3;
  else quoteScore = 4;
  breakdown['quotes'] = quoteScore;
  details.push(`Direct quotes: ${directQuotes.length}`);

  // 6. Financial table years covered (0-4)
  const yearMatches = mainContent.match(/20\d\d/g) ?? [];
  const uniqueYears = new Set(yearMatches).size;
  let yearsScore = 0;
  if (uniqueYears >= 10) yearsScore = 4;
  else if (uniqueYears >= 7) yearsScore = 3;
  else if (uniqueYears >= 5) yearsScore = 2;
  else if (uniqueYears >= 3) yearsScore = 1;
  breakdown['financial_years'] = yearsScore;

  // 7. Five Forces presence (0-3)
  const hasFiveForces = /五力|Five Forces|5a|5b|5c|5d|5e|護城河|moat/i.test(mainContent);
  breakdown['five_forces'] = hasFiveForces ? 3 : 0;

  // 8. Internal consistency checks (Phase 2.4) — deductions (0 to -3)
  const consistencyIssues = checkInternalConsistency(ticker, mainContent);
  breakdown['consistency_deduction'] = -Math.min(consistencyIssues.length, 3);
  if (consistencyIssues.length > 0) details.push(`Consistency issues: ${consistencyIssues.join('; ')}`);

  const total = Math.max(0, Math.min(STRUCTURAL_MAX,
    Object.values(breakdown).reduce((a, b) => a + b, 0)
  ));

  return { score: total, breakdown, details };
}

// ── Internal consistency checks (Phase 2.4) ──

function checkInternalConsistency(ticker: string, mainContent: string): string[] {
  const issues: string[] = [];

  // 1. DCF WACC matches stated WACC in assumptions
  const section25 = mainContent.match(/##\s*2\.5[\s\S]*?(?=\n#\s|\n##\s[^2]|$)/);
  if (section25) {
    const waccMatches = section25[0].match(/WACC[^0-9]*(\d+\.?\d*)%/gi) ?? [];
    const waccValues = waccMatches.map(m => parseFloat(m.match(/(\d+\.?\d*)/)?.[1] ?? '0'));
    const uniqueWaccs = [...new Set(waccValues.filter(v => v > 0))];
    if (uniqueWaccs.length > 1) {
      issues.push(`Inconsistent WACC values: ${uniqueWaccs.join('%, ')}%`);
    }

    // 2. Terminal growth < WACC
    const termMatch = section25[0].match(/terminal.*growth[^0-9]*(\d+\.?\d*)%/i) ?? section25[0].match(/終端.*成長[^0-9]*(\d+\.?\d*)%/i);
    if (termMatch && uniqueWaccs.length > 0) {
      const termGrowth = parseFloat(termMatch[1]);
      if (termGrowth >= uniqueWaccs[0]) {
        issues.push(`Terminal growth (${termGrowth}%) >= WACC (${uniqueWaccs[0]}%)`);
      }
    }

    // 3. WACC in reasonable range
    if (uniqueWaccs.length > 0 && (uniqueWaccs[0] < 8 || uniqueWaccs[0] > 14)) {
      issues.push(`WACC (${uniqueWaccs[0]}%) outside 8-14% range`);
    }
  }

  // 4. Interview count matches actual files
  const transcriptsDir = path.join(getCompanyDir(ticker), 'transcripts');
  if (fs.existsSync(transcriptsDir)) {
    const actualFiles = fs.readdirSync(transcriptsDir).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
    const mentionedMatch = mainContent.match(/(\d+)\s*(?:篇|則|interviews?|transcripts?)/i);
    if (mentionedMatch) {
      const mentioned = parseInt(mentionedMatch[1]);
      if (Math.abs(mentioned - actualFiles.length) > 3) {
        issues.push(`Report claims ${mentioned} interviews but ${actualFiles.length} files in transcripts/`);
      }
    }
  }

  // 5. Geographic revenue sums check (±5% tolerance)
  const geoTable = mainContent.match(/地理.*營收[\s\S]*?\|[\s\S]*?\n\n/m);
  if (geoTable) {
    const numbers = geoTable[0].match(/[\d,]+\.?\d*/g)?.map(n => parseFloat(n.replace(/,/g, ''))) ?? [];
    if (numbers.length >= 3) {
      const maxNum = Math.max(...numbers);
      const sumOfRest = numbers.filter(n => n !== maxNum).reduce((a, b) => a + b, 0);
      if (sumOfRest > 0 && Math.abs(sumOfRest - maxNum) / maxNum > 0.05) {
        // Only flag if the max number looks like a total (similar magnitude to sum)
        if (sumOfRest / maxNum > 0.5 && sumOfRest / maxNum < 2) {
          issues.push(`Geographic revenue components may not sum to total (sum: ${sumOfRest.toFixed(0)}, total: ${maxNum.toFixed(0)})`);
        }
      }
    }
  }

  return issues;
}

// ══════════════════════════════════════════════════════════════
// CHANNEL B: Analytical Quality (LLM, 3-call median)
// Max 60 points — from 5 dimensions
// ══════════════════════════════════════════════════════════════

// ── Dimension-specific anchored rubric prompts (Phase 1.4) ──

const DIMENSION_PROMPTS: Record<Dimension, string> = {
  環境: `你是投資研究品質評審。請評估以下**環境**（產業與市場）分析的品質。

## 評分標準（滿分 12 分，對應環境維度 LLM 部分）

### TAM 與產業趨勢 (0-3)
0 = 完全未提及
1 = 僅提及（例："TAM is large"）
2 = 有數據但無出處（例："TAM $500B"）
3 = 多源佐證+時間序列（例：3個不同來源的TAM估計，含成長率拆分+URL）

### 市場結構分析 (0-3)
0 = 完全未提及
1 = 提及「競爭激烈」等泛泛描述
2 = 有市佔率數據+主要玩家（例："Top 3 players hold 70%"）
3 = 集中度分析+進入障礙+歷史演變（例：HHI 趨勢、護城河量化）

### 監管/政策環境 (0-3)
0 = 完全未提及
1 = 僅列法規名稱
2 = 法規+影響分析（例："CHIPS Act provides $52B, benefiting X"）
3 = 監管矩陣：機會+風險+時間軸+管理層引言對政策的回應

### 技術與需求趨勢 (0-3)
0 = 完全未提及
1 = 僅列趨勢名稱
2 = 趨勢+數據支撐
3 = 採用曲線+需求拆分+技術演進路線圖

## 評分方法
1. 列出每個子標準的**具體證據**（直接引用報告原文）
2. 引用**出處**（報告中的 URL 或來源）
3. 對照上述錨點，判斷最接近的等級
4. 給出分數

## 輸出格式（純 JSON，不加 code fence）
{"TAM趨勢": 數字, "市場結構": 數字, "監管政策": 數字, "技術趨勢": 數字, "total": 數字, "evidence": ["..."], "gaps": ["..."]}`,

  生意: `你是投資研究品質評審。請評估以下**生意**（商業模式與財務）分析的品質。

## 評分標準（滿分 18 分）

### 財務歷史完整度 (0-5)
0 = 無財務數據
1 = <5年數據、僅營收
2 = 5-7年、含基本損益
3 = 8-10年、含毛利/營業利益/EPS、轉折點說明
4 = 10+年完整表格+出處URL
5 = 10+年+轉折點深度敘事+管理層引言佐證

### 商業模式深度 (0-5)
0 = 未描述
1 = 泛泛描述（"SaaS model"）
2 = 收入拆分+基本模式說明
3 = 收入拆分+unit economics+管理層引言（10+則）
4 = 上述+策略引言涵蓋≥3個時期+出處URL
5 = 綜合分析：底層驅動+策略演進+交叉驗證

### 競爭護城河 (0-5)
0 = 未分析
1 = 僅列護城河類型
2 = Five Forces 部分完成（3/5）
3 = Five Forces 5a-5e 完整+管理層引言佐證
4 = 上述+護城河量化（轉換成本/規模效應/品牌溢價數據）
5 = 五力完整+內部邏輯一致+管理層引言佐證護城河觀點

### DCF 估值品質 (0-3)
0 = 無 DCF/估值
1 = 僅 P/E 或單一方法
2 = ≥2方法+WACC+情境表（但缺敏感度或 IRR）
3 = ≥3方法+WACC分解+三情境+IRR+3×3敏感度+合理性檢查

## 輸出格式（純 JSON）
{"財務歷史": 數字, "商業模式": 數字, "五力分析": 數字, "DCF投資論文": 數字, "total": 數字, "evidence": ["..."], "gaps": ["..."]}`,

  組織: `你是投資研究品質評審。請評估以下**組織**（結構與運營）分析的品質。

## 評分標準（滿分 12 分）

### 地理/業務分部 (0-4)
0 = 未提及
1 = 僅列主要市場
2 = 有數據但無出處（例："北美佔60%"）
3 = 含年報/法說出處+URL+多年數據
4 = 多年分部數據+出處URL+趨勢分析+管理層引言佐證

### 組織文化與激勵 (0-4)
0 = 未提及
1 = 泛泛描述（"創新文化"）
2 = 有具體機制（股權激勵計畫說明）
3 = 機制+案例+管理層引言
4 = 機制+案例+逆勢擴張決策+人才策略+出處

### 運營效率 (0-4)
0 = 未提及
1 = 提及利潤率
2 = ROIC 計算或 Operating Leverage 分析
3 = ROIC 多年趨勢+同業比較+出處
4 = ROIC+OL+費用率拆解+效率改善驅動因素分析

## 輸出格式（純 JSON）
{"地理分部": 數字, "組織文化": 數字, "運營效率": 數字, "total": 數字, "evidence": ["..."], "gaps": ["..."]}`,

  人: `你是投資研究品質評審。請評估以下**人**（管理層）分析的品質。

## 評分標準（滿分 12 分）

### CEO格局觀與商業哲學 (0-4)
0 = 未提及
1 = 僅列 CEO 姓名與背景
2 = 有哲學描述但無引言佐證
3 = 多年敘事+引言（5+則）+出處+拐點分析
4 = 從學經歷起完整敘事+每時期引言+成功失敗反思+第一性原理邏輯

### 繼任風險與板凳深度 (0-4)
0 = 完全未提及
1 = 僅提 CEO 年齡
2 = CEO年齡+任期+籠統繼任描述
3 = CEO 年齡+≥2位次世代領導人剖析（背景、強項）+板凳評級
4 = 上述+繼任計畫揭露+歷史繼任案例+出處

### 道德操守與價值創造 (0-4)
0 = 未提及
1 = 泛泛描述（"誠信經營"）
2 = 有具體案例
3 = 多個案例+出處+管理層引言
4 = 價值觀驅動決策+長期案例+與財務表現連結

## 輸出格式（純 JSON）
{"格局觀哲學": 數字, "繼任風險": 數字, "道德操守": 數字, "total": 數字, "evidence": ["..."], "gaps": ["..."]}`,

  論點: `你是投資研究品質評審。請評估以下研究報告的**投資論點品質**。

## 評分標準（滿分 9 分 — LLM 部分）

### 非共識觀點 / Variant Perception (0-3)
0 = 無明確投資論點
1 = 有 buy/sell 建議但無差異化觀點
2 = 識別出市場可能錯誤之處，但論據不充分
3 = 清晰的 variant perception：市場共識是X，我們認為Y因為Z（有數據+邏輯鏈）

### 內部一致性 (0-3)
0 = 明顯矛盾（如 DCF 假設與財務預測不一致）
1 = 部分一致，有 1-2 個矛盾
2 = 大致一致，偶有小矛盾
3 = 完全一致：DCF假設↔財務預測↔TAM分析↔競爭地位 形成完整邏輯鏈

### 可行動性 (0-3)
0 = 無結論
1 = 有 buy/sell 但無價格目標或時間框架
2 = 有價格目標+部分催化劑
3 = 明確 buy/sell/hold + 價格目標 + 時間框架 + ≥3個催化劑 + 風險觸發條件

## 輸出格式（純 JSON）
{"非共識觀點": 數字, "內部一致性": 數字, "可行動性": 數字, "total": 數字, "evidence": ["..."], "gaps": ["..."]}`,
};

// Quality score mapping: LLM raw → quality points (normalized to 60 total)
// Raw totals: 環境 12 + 生意 18 + 組織 12 + 人 12 + 論點 9 = 63 raw max
const RAW_MAX = 63;

// Canonical key names per dimension — maps LLM output to expected keys
const CANONICAL_CRITERIA_KEYS: Record<Dimension, string[]> = {
  環境: ['TAM趨勢', '市場結構', '監管政策', '技術趨勢'],
  生意: ['財務歷史', '商業模式', '五力分析', 'DCF投資論文'],
  組織: ['組織執行力', '地理分部', '運營效率'],
  人: ['格局觀哲學', '繼任風險', '道德操守'],
  論點: ['非共識觀點', '內部一致性', '可行動性'],
};

/** Find the canonical key that best matches a returned key (prefix match) */
function findCanonicalKey(returnedKey: string, canonicalKeys: string[]): string {
  // Exact match first
  if (canonicalKeys.includes(returnedKey)) return returnedKey;
  // Prefix match: if returned key starts with or is a prefix of a canonical key
  for (const ck of canonicalKeys) {
    if (ck.startsWith(returnedKey) || returnedKey.startsWith(ck)) return ck;
  }
  // Substring match: if returned key is contained in a canonical key or vice versa
  for (const ck of canonicalKeys) {
    if (ck.includes(returnedKey) || returnedKey.includes(ck)) return ck;
  }
  return returnedKey; // fallback to original
}

/** Call LLM for one dimension, return sub-criteria scores */
async function scoreDimension(
  dimension: Dimension,
  sectionContent: string,
  ticker: string,
  model: string,
): Promise<{ subCriteria: Record<string, number>; total: number; gaps: string[] } | null> {
  if (sectionContent.trim().length < 50) {
    return { subCriteria: {}, total: 0, gaps: [`${dimension}: 內容不足，無法評分`] };
  }

  const systemPrompt = DIMENSION_PROMPTS[dimension];
  const userMessage = `請評分以下 ${ticker} 研究報告的「${dimension}」維度：

${sectionContent}`;

  try {
    const response = await chat(
      systemPrompt,
      [{ role: 'user', content: userMessage }],
      { model, maxTokens: 4096, thinkingBudget: SCORER_THINKING_BUDGET },
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
    const { total, evidence, gaps, ...subCriteria } = parsed;

    // Normalize keys to canonical names (LLM may return abbreviations)
    const canonicalKeys = CANONICAL_CRITERIA_KEYS[dimension];
    const normalized: Record<string, number> = {};
    if (canonicalKeys) {
      for (const [key, val] of Object.entries(subCriteria)) {
        if (typeof val !== 'number') continue;
        const canonical = findCanonicalKey(key, canonicalKeys);
        normalized[canonical] = val;
      }
    } else {
      for (const [key, val] of Object.entries(subCriteria)) {
        if (typeof val === 'number') normalized[key] = val;
      }
    }

    const computedTotal = Object.values(normalized).reduce((a, b) => a + b, 0);

    return {
      subCriteria: normalized,
      total: typeof total === 'number' ? total : computedTotal,
      gaps: Array.isArray(gaps) ? gaps : [],
    };
  } catch (err: any) {
    console.error(`  [scorer] ${dimension} LLM error: ${err.message}`);
    return null;
  }
}

/** Take median of N numbers */
function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/** Calculate variance of numbers */
function variance(nums: number[]): number {
  if (nums.length < 2) return 0;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  return nums.reduce((a, b) => a + (b - mean) ** 2, 0) / (nums.length - 1);
}

/** Phase 1.2: Score all dimensions with 3-call median */
async function llmScoreStructured(
  ticker: string,
  mainContent: string,
  model: string = MODELS.CLAUDE,
): Promise<{
  dimensions: Record<Dimension, { score: number; criteria: Record<string, number>; gaps: string[] }>;
  rawCalls: ScoringEvent['rawCalls'];
  totalRaw: number;
  totalVariance: number;
  perDimensionVariance: Record<string, number>;
  scorerPartialFailure: boolean;
} | null> {
  const dimensions: Record<string, { score: number; criteria: Record<string, number>; gaps: string[] }> = {};
  const rawCalls: ScoringEvent['rawCalls'] = [];
  const perDimensionVariance: Record<string, number> = {};
  let anySuccess = false;
  let scorerPartialFailure = false;

  for (const dim of ALL_DIMENSIONS) {
    const sectionContent = extractDimensionContent(mainContent, dim);
    const callResults: Array<{ subCriteria: Record<string, number>; total: number; gaps: string[] }> = [];

    // 3 calls per dimension with retry on failure (max SCORER_MAX_RETRIES per call)
    for (let i = 0; i < SCORER_NUM_CALLS; i++) {
      let result: Awaited<ReturnType<typeof scoreDimension>> = null;
      for (let retry = 0; retry <= SCORER_MAX_RETRIES; retry++) {
        result = await scoreDimension(dim, sectionContent, ticker, model);
        if (result) break;
        if (retry < SCORER_MAX_RETRIES) {
          console.log(`  [scorer] ${dim} call ${i} failed, retry ${retry + 1}/${SCORER_MAX_RETRIES}...`);
        }
      }
      if (result) {
        callResults.push(result);
        rawCalls.push({ dimension: dim, callIndex: i, subCriteria: result.subCriteria, total: result.total });
      }
    }

    // Require ≥2 valid calls; flag partial failure if only 1
    if (callResults.length === 0) {
      dimensions[dim] = { score: 0, criteria: {}, gaps: [`${dim}: LLM 評分失敗`] };
      perDimensionVariance[dim] = 0;
      continue;
    }
    if (callResults.length < 2) {
      scorerPartialFailure = true;
      console.log(`  [scorer] ⚠ ${dim}: only ${callResults.length} valid call(s) — flagging scorer_partial_failure`);
    }

    anySuccess = true;

    // Take median per sub-criterion
    const allKeys = new Set(callResults.flatMap(r => Object.keys(r.subCriteria)));
    const medianCriteria: Record<string, number> = {};
    for (const key of allKeys) {
      const values = callResults.map(r => r.subCriteria[key] ?? 0);
      medianCriteria[key] = median(values);
    }
    const medianTotal = Object.values(medianCriteria).reduce((a, b) => a + b, 0);

    // Collect all gaps (deduplicated)
    const allGaps = [...new Set(callResults.flatMap(r => r.gaps))];

    // Variance tracking
    const totals = callResults.map(r => r.total);
    perDimensionVariance[dim] = variance(totals);

    dimensions[dim] = { score: medianTotal, criteria: medianCriteria, gaps: allGaps };
    console.log(`  [scorer] ${dim}: ${medianTotal} (calls: ${totals.join(',')} var: ${perDimensionVariance[dim].toFixed(2)})`);
  }

  if (!anySuccess) return null;

  const totalRaw = Object.values(dimensions).reduce((a, d) => a + d.score, 0);
  const totalVariance = Object.values(perDimensionVariance).reduce((a, b) => a + b, 0);

  return {
    dimensions: dimensions as Record<Dimension, { score: number; criteria: Record<string, number>; gaps: string[] }>,
    rawCalls,
    totalRaw,
    totalVariance,
    perDimensionVariance,
    scorerPartialFailure,
  };
}

// ── Phase 1.5: Reference-anchored pairwise calibration ──

const FUTU_REFERENCE_PATH = path.join(PROJECT_ROOT, 'data', 'companies', 'FUTU', 'FUTU_Initial_MAX.md');

async function pairwiseCalibrate(
  dimension: Dimension,
  candidateContent: string,
  candidateScore: number,
  maxScore: number,
  model: string,
  futuContent: string,
  futuRefScore: number,
): Promise<number> {
  const refContent = extractDimensionContent(futuContent, dimension).slice(0, 10000);
  if (refContent.length < 100) return 0;

  const refScore = futuRefScore;

  const prompt = `比較兩份研究報告在「${dimension}」維度的品質。

## 參考報告（已評 ${refScore}/${maxScore}）：
${refContent.slice(0, 5000)}

## 候選報告（rubric 評分 ${candidateScore}/${maxScore}）：
${candidateContent.slice(0, 5000)}

## 問題
候選報告的「${dimension}」分析相比參考報告如何？
- 明顯較弱 → -1
- 略弱 → 0
- 大致相當 → 0
- 略強 → 0
- 明顯較強 → +1

輸出純 JSON：{"comparison": "weaker|similar|stronger", "adjustment": -1或0或1, "reason": "..."}`;

  try {
    const response = await chat(
      '你是投資研究品質校準員。比較候選報告與參考報告的品質差異。',
      [{ role: 'user', content: prompt }],
      { model, maxTokens: 1024, thinkingBudget: SCORER_THINKING_BUDGET, backend: 'nadirclaw', ...(NADIRCLAW_MODELS.ECO ? { model: NADIRCLAW_MODELS.ECO } : {}) },
    );

    if (!response.content) return 0;
    let jsonStr = response.content.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    const start = jsonStr.indexOf('{');
    if (start === -1) return 0;
    let depth = 0, end = -1;
    for (let i = start; i < jsonStr.length; i++) {
      if (jsonStr[i] === '{') depth++;
      else if (jsonStr[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) return 0;

    const parsed = JSON.parse(jsonStr.slice(start, end + 1));
    const adj = parsed.adjustment ?? 0;
    return Math.max(-1, Math.min(1, adj));
  } catch {
    return 0;
  }
}

// ── Gap builder ──

function buildGapsJson(score: InitialMaxScore, round: number, ticker?: string): InitialMaxGaps {
  const gaps: GapItem[] = [];
  let priority = 1;

  // 論點維度 (15pts) — new dimension
  if ((score.論點.criteria?.['非共識觀點'] ?? 0) < 2) {
    gaps.push({ dimension: '論點', item: '非共識觀點/Variant Perception', current: score.論點.criteria?.['非共識觀點'] ?? 0, target: '3分', shortfall: 3 - (score.論點.criteria?.['非共識觀點'] ?? 0), priority: priority++ });
  }
  if ((score.論點.criteria?.['內部一致性'] ?? 0) < 2) {
    gaps.push({ dimension: '論點', item: 'DCF假設與財務預測內部一致性', current: score.論點.criteria?.['內部一致性'] ?? 0, target: '3分', shortfall: 3 - (score.論點.criteria?.['內部一致性'] ?? 0), priority: priority++ });
  }
  if ((score.論點.criteria?.['可行動性'] ?? 0) < 2) {
    gaps.push({ dimension: '論點', item: '投資結論可行動性（價格目標+催化劑+時間框架）', current: score.論點.criteria?.['可行動性'] ?? 0, target: '3分', shortfall: 3 - (score.論點.criteria?.['可行動性'] ?? 0), priority: priority++ });
  }

  // 人維度 (20pts)
  if ((score.人.criteria?.['格局觀哲學'] ?? 0) < 3) {
    gaps.push({ dimension: '人', item: 'CEO格局觀與商業哲學', current: score.人.criteria?.['格局觀哲學'] ?? 0, target: '4分', shortfall: 4 - (score.人.criteria?.['格局觀哲學'] ?? 0), priority: priority++ });
  }
  if ((score.人.criteria?.['繼任風險'] ?? 0) < 3) {
    gaps.push({ dimension: '人', item: '繼任風險：CEO年齡、≥2位次世代領導人、板凳深度評級', current: score.人.criteria?.['繼任風險'] ?? 0, target: '4分', shortfall: 4 - (score.人.criteria?.['繼任風險'] ?? 0), priority: priority++ });
  }

  // 生意維度 (30pts)
  if ((score.生意.criteria?.['財務歷史'] ?? 0) < 4) {
    gaps.push({ dimension: '生意', item: '財務歷史完整度', current: score.生意.criteria?.['財務歷史'] ?? 0, target: '5分', shortfall: 5 - (score.生意.criteria?.['財務歷史'] ?? 0), priority: priority++ });
  }
  if ((score.生意.criteria?.['商業模式'] ?? 0) < 4) {
    gaps.push({ dimension: '生意', item: '商業模式深度（CEO引言涵蓋≥3時期+策略演進）', current: score.生意.criteria?.['商業模式'] ?? 0, target: '5分', shortfall: 5 - (score.生意.criteria?.['商業模式'] ?? 0), priority: priority++ });
  }
  if ((score.生意.criteria?.['五力分析'] ?? 0) < 4) {
    gaps.push({ dimension: '生意', item: '五力分析+護城河量化', current: score.生意.criteria?.['五力分析'] ?? 0, target: '5分', shortfall: 5 - (score.生意.criteria?.['五力分析'] ?? 0), priority: priority++ });
  }
  if ((score.生意.criteria?.['DCF投資論文'] ?? 0) < 2) {
    gaps.push({ dimension: '生意', item: 'DCF模型+三情境+IRR拆分+敏感度矩陣', current: score.生意.criteria?.['DCF投資論文'] ?? 0, target: '3分', shortfall: 3 - (score.生意.criteria?.['DCF投資論文'] ?? 0), priority: priority++ });
  }

  // 組織維度 (17pts)
  if ((score.組織.criteria?.['地理分部'] ?? 0) < 3) {
    gaps.push({ dimension: '組織', item: '地理/業務分部收入(年報出處+URL)', current: score.組織.criteria?.['地理分部'] ?? 0, target: '4分', shortfall: 4 - (score.組織.criteria?.['地理分部'] ?? 0), priority: priority++ });
  }
  if ((score.組織.criteria?.['運營效率'] ?? 0) < 3) {
    gaps.push({ dimension: '組織', item: 'ROIC趨勢/Operating Leverage', current: score.組織.criteria?.['運營效率'] ?? 0, target: '4分', shortfall: 4 - (score.組織.criteria?.['運營效率'] ?? 0), priority: priority++ });
  }

  // 環境維度 (18pts)
  if (score.環境.score < 14) {
    for (const gap of score.環境.gaps) {
      gaps.push({ dimension: '環境', item: gap, current: 0, target: '完整', shortfall: 18 - score.環境.score, priority: priority++ });
    }
    if (score.環境.gaps.length === 0) {
      gaps.push({ dimension: '環境', item: '需補充市場結構/監管/技術趨勢分析', current: score.環境.score, target: '18', shortfall: 18 - score.環境.score, priority: priority++ });
    }
  }

  // Sort by shortfall descending
  gaps.sort((a, b) => b.shortfall - a.shortfall);
  gaps.forEach((g, i) => { g.priority = i + 1; });

  return { round, score: score.total, gaps };
}

// ══════════════════════════════════════════════════════════════
// Main exported function: scoreCompanyResearch
// ══════════════════════════════════════════════════════════════

export async function scoreCompanyResearch(
  ticker: string,
  round = 0,
  model: string = MODELS.CLAUDE,
): Promise<{ score: InitialMaxScore; gaps: InitialMaxGaps }> {
  const reportContent = readResearchFiles(ticker);
  const mainContent = readMainFile(ticker);
  const dir = getCompanyDir(ticker);

  // Compute rubric version hash
  const rubricVersion = hashRubricSet(DIMENSION_PROMPTS);

  if (reportContent.trim().length < 100) {
    console.log(`[scorer] No research files found for ${ticker}, using zero score`);
    const emptyDim: DimensionScore = { score: 0, max: 0, gaps: ['無研究資料'] };
    const score: InitialMaxScore = {
      環境: { ...emptyDim, max: WEIGHTS.環境 },
      生意: { ...emptyDim, max: WEIGHTS.生意 },
      組織: { ...emptyDim, max: WEIGHTS.組織 },
      人: { ...emptyDim, max: WEIGHTS.人 },
      論點: { ...emptyDim, max: WEIGHTS.論點 },
      structural: 0, quality: 0, total: 0,
      passThreshold: false, round, rubricVersion,
    };
    return { score, gaps: buildGapsJson(score, round, ticker) };
  }

  // ── Channel A: Structural score (deterministic) ──
  const structural = scoreStructural(ticker);
  console.log(`[scorer] Structural: ${structural.score}/${STRUCTURAL_MAX} (${Object.entries(structural.breakdown).map(([k, v]) => `${k}:${v}`).join(' ')})`);

  // ── Channel B: Quality score (LLM, 3-call median) ──
  let qualityScore = 0;
  let scorerStatus: InitialMaxScore['scorerStatus'] = 'full';
  let dimensionResults: Record<Dimension, { score: number; criteria: Record<string, number>; gaps: string[] }> | null = null;
  let rawCalls: ScoringEvent['rawCalls'] = [];
  let perDimensionVariance: Record<string, number> = {};
  let totalVariance = 0;
  let pairwiseAdjustments: Record<string, number> = {};

  if (structural.score < 10) {
    // Very incomplete report — skip LLM
    console.log(`[scorer] Structural < 10, skipping LLM scorer`);
    scorerStatus = 'llm_partial_failure';
  } else {
    console.log(`[scorer] Running structured LLM scorer (${model}) for ${ticker}...`);
    const llmResult = await llmScoreStructured(ticker, mainContent, model);

    if (llmResult) {
      dimensionResults = llmResult.dimensions;
      rawCalls = llmResult.rawCalls;
      totalVariance = llmResult.totalVariance;
      perDimensionVariance = llmResult.perDimensionVariance;
      if (llmResult.scorerPartialFailure) scorerStatus = 'llm_partial_failure';

      // Phase 1.5: Pairwise calibration — read FUTU reference once
      console.log(`[scorer] Running pairwise calibration...`);
      const futuContent = fs.existsSync(FUTU_REFERENCE_PATH)
        ? fs.readFileSync(FUTU_REFERENCE_PATH, 'utf-8')
        : '';
      const rawMaxMap: Record<Dimension, number> = { 環境: 12, 生意: 18, 組織: 12, 人: 12, 論點: 9 };
      for (const dim of ALL_DIMENSIONS) {
        if (!futuContent) break;
        const dimContent = extractDimensionContent(mainContent, dim);
        const futuRefScore = Math.round(rawMaxMap[dim] * 0.85);
        const adj = await pairwiseCalibrate(dim, dimContent, dimensionResults[dim].score, rawMaxMap[dim], model, futuContent, futuRefScore);
        if (adj !== 0) {
          // Apply adjustment as additive term on dimension total, not by mutating sub-criteria
          dimensionResults[dim].score = Math.max(0, dimensionResults[dim].score + adj);
          pairwiseAdjustments[dim] = adj;
          console.log(`  [calibrate] ${dim}: adjustment ${adj > 0 ? '+' : ''}${adj}`);
        }
      }

      // Normalize raw LLM total (63 max) → quality score (60 max)
      const totalRaw = Object.values(dimensionResults).reduce((a, d) => a + d.score, 0);
      qualityScore = Math.round((totalRaw / RAW_MAX) * QUALITY_MAX);
      console.log(`[scorer] Quality: ${qualityScore}/${QUALITY_MAX} (raw: ${totalRaw}/${RAW_MAX})`);
    } else {
      console.log('[scorer] LLM scorer failed — using structural only');
      scorerStatus = 'llm_partial_failure';
    }
  }

  // ── Combined score ──
  const total = structural.score + qualityScore;
  const passThreshold =
    structural.score >= STRUCTURAL_PASS_MIN &&
    qualityScore >= QUALITY_PASS_MIN &&
    total >= PASS_THRESHOLD;

  // Map LLM dimension scores → weighted dimension scores for the output
  function mapDimensionScore(dim: Dimension): DimensionScore {
    const max = WEIGHTS[dim];
    if (!dimensionResults || !dimensionResults[dim]) {
      return { score: 0, max, gaps: [`${dim}: 未評分`] };
    }
    const rawMaxMap: Record<Dimension, number> = { 環境: 12, 生意: 18, 組織: 12, 人: 12, 論點: 9 };
    const rawMax = rawMaxMap[dim];
    const rawScore = dimensionResults[dim].score;
    // Scale raw → weighted
    const scaledScore = Math.round((rawScore / rawMax) * max);
    return {
      score: scaledScore,
      max,
      criteria: dimensionResults[dim].criteria,
      gaps: dimensionResults[dim].gaps,
    };
  }

  // Section coverage check
  const sectionCoverage = checkAllSectionsCovered(mainContent);
  const sectionGaps = sectionCoverage.missing.length > 0
    ? [`子節未全覆蓋：${sectionCoverage.missing.join('、')} 須有實質內容`]
    : [];

  const score: InitialMaxScore = {
    環境: mapDimensionScore('環境'),
    生意: mapDimensionScore('生意'),
    組織: mapDimensionScore('組織'),
    人: mapDimensionScore('人'),
    論點: mapDimensionScore('論點'),
    structural: structural.score,
    quality: qualityScore,
    total,
    passThreshold,
    round,
    rubricVersion,
    scorerStatus,
    scorerPartialFailure: scorerStatus === 'llm_partial_failure',
  };

  // Add section coverage gaps to 環境 (since it's the first dimension)
  if (sectionGaps.length > 0) {
    score.環境.gaps = [...score.環境.gaps, ...sectionGaps];
    score.passThreshold = false;
  }

  console.log(`[scorer] Combined: ${total}/100 (structural:${structural.score} quality:${qualityScore}) pass:${score.passThreshold}`);

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

  // Append to scoring history (Phase 3.1)
  try {
    const event: ScoringEvent = {
      ticker,
      round,
      timestamp: new Date().toISOString(),
      rubricVersion,
      model,
      rawCalls,
      finalScore: {
        環境: score.環境.score,
        生意: score.生意.score,
        組織: score.組織.score,
        人: score.人.score,
        論點: score.論點.score,
        structural: structural.score,
        quality: qualityScore,
        total,
      },
      pairwiseAdjustments: Object.keys(pairwiseAdjustments).length > 0 ? pairwiseAdjustments : undefined,
      variance: {
        perDimension: perDimensionVariance,
        total: totalVariance,
      },
      consistencyChecks: {
        passed: structural.details.filter(d => !d.startsWith('Consistency')).length,
        failed: structural.details.filter(d => d.startsWith('Consistency')).length,
        details: structural.details,
      },
      costUsd: 0, // filled by caller if needed
      reportLengthChars: mainContent.length,
    };
    appendScoringEvent(event);
  } catch (err: any) {
    console.error(`[scorer] Failed to append scoring event: ${err.message}`);
  }

  return { score, gaps };
}

// ══════════════════════════════════════════════════════════════
// Extended scoring (geopolitical, sustainability, contrarian)
// ══════════════════════════════════════════════════════════════

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

### 八、正反論辯 (15分)
- 8.1 Bull Case（投資多頭論點，有數據支撐）：0-4分
- 8.2 Bear Case（投資空頭論點，有數據支撐）：0-4分
- 8.3 關鍵爭議與數據對比（雙方論點並列，數據互相對照）：0-4分
- 8.4 投資論點失效條件（What Would Change Our Mind?）：≥5 個具體、可證偽、有時限的觸發條件，各含指標+門檻值+時間框架+監測來源+對論點影響；須涵蓋競爭、需求、地緣政治、財務、技術五領域。若僅列模糊條件（無數值門檻或時間框架）最多 2 分：0-3分

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
  "contrarian": {"score": 數字, "max": 15, "criteria": {"Bull Case": 數字, "Bear Case": 數字, "數據對比": 數字, "論點失效條件": 數字}, "gaps": ["缺口"]},
  "extendedTotal": 數字
}`;

async function llmExtendedScore(
  ticker: string,
  reportContent: string,
  model: string = MODELS.CLAUDE,
): Promise<ExtendedScore | null> {
  const emptyCoreScore: InitialMaxScore = {
    環境: { score: 0, max: WEIGHTS.環境, gaps: [] },
    生意: { score: 0, max: WEIGHTS.生意, gaps: [] },
    組織: { score: 0, max: WEIGHTS.組織, gaps: [] },
    人: { score: 0, max: WEIGHTS.人, gaps: [] },
    論點: { score: 0, max: WEIGHTS.論點, gaps: [] },
    structural: 0, quality: 0, total: 0, passThreshold: false, round: 0,
  };

  try {
    const response = await chat(
      EXTENDED_SCORER_PROMPT,
      [{ role: 'user', content: `請評分以下 ${ticker} 的延伸分析：\n\n${reportContent.slice(0, 80000)}` }],
      { model, maxTokens: 4096, thinkingBudget: SCORER_THINKING_BUDGET },
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
      core: emptyCoreScore,
      geopolitical: { score: parsed.geopolitical?.score ?? 0, max: 15, criteria: parsed.geopolitical?.criteria, gaps: parsed.geopolitical?.gaps ?? [] },
      sustainability: { score: parsed.sustainability?.score ?? 0, max: 15, criteria: parsed.sustainability?.criteria, gaps: parsed.sustainability?.gaps ?? [] },
      contrarian: { score: Math.min(parsed.contrarian?.score ?? 0, 15), max: 15, criteria: parsed.contrarian?.criteria, gaps: parsed.contrarian?.gaps ?? [] },
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
  if (/8\.4|失效條件|What Would Change|falsif|change our mind/i.test(mainContent)) con += 3;
  if (/門檻|threshold|within.*month|within.*quarter|監測|monitor/i.test(mainContent)) con += 2;

  return { geopolitical: Math.min(geo, 15), sustainability: Math.min(sus, 15), contrarian: Math.min(con, 15) };
}

export async function scoreExtendedResearch(
  ticker: string,
  round = 0,
  model: string = MODELS.CLAUDE,
): Promise<ExtendedScore> {
  const dir = getCompanyDir(ticker);
  const mainFile = path.join(dir, `${ticker}_Initial_MAX.md`);
  const mainContent = fs.existsSync(mainFile) ? fs.readFileSync(mainFile, 'utf-8') : '';

  if (mainContent.length < 100) {
    const emptyDim: DimensionScore = { score: 0, max: 15, gaps: ['無延伸分析內容'] };
    return {
      core: {
        環境: { score: 0, max: WEIGHTS.環境, gaps: [] },
        生意: { score: 0, max: WEIGHTS.生意, gaps: [] },
        組織: { score: 0, max: WEIGHTS.組織, gaps: [] },
        人: { score: 0, max: WEIGHTS.人, gaps: [] },
        論點: { score: 0, max: WEIGHTS.論點, gaps: [] },
        structural: 0, quality: 0, total: 0, passThreshold: false, round,
      },
      geopolitical: emptyDim, sustainability: emptyDim, contrarian: emptyDim, extendedTotal: 0,
    };
  }

  console.log(`[scorer] Running extended LLM scorer (${model}) for ${ticker}...`);
  const llmResult = await llmExtendedScore(ticker, mainContent, model);

  if (llmResult) {
    const extTotal = (llmResult.geopolitical?.score ?? 0) + (llmResult.sustainability?.score ?? 0) + (llmResult.contrarian?.score ?? 0);
    llmResult.extendedTotal = extTotal;
    console.log(`[scorer] Extended score: ${extTotal}/45 (geo:${llmResult.geopolitical?.score ?? 0} sus:${llmResult.sustainability?.score ?? 0} con:${llmResult.contrarian?.score ?? 0})`);
    return llmResult;
  }

  console.log('[scorer] Extended LLM failed, using heuristic fallback');
  const h = heuristicExtendedScore(mainContent);
  const emptyCoreScore: InitialMaxScore = {
    環境: { score: 0, max: WEIGHTS.環境, gaps: [] },
    生意: { score: 0, max: WEIGHTS.生意, gaps: [] },
    組織: { score: 0, max: WEIGHTS.組織, gaps: [] },
    人: { score: 0, max: WEIGHTS.人, gaps: [] },
    論點: { score: 0, max: WEIGHTS.論點, gaps: [] },
    structural: 0, quality: 0, total: 0, passThreshold: false, round,
  };
  return {
    core: emptyCoreScore,
    geopolitical: { score: h.geopolitical, max: 15, gaps: h.geopolitical < 10 ? ['需補充地緣政治分析'] : [] },
    sustainability: { score: h.sustainability, max: 15, gaps: h.sustainability < 10 ? ['需補充環境永續分析'] : [] },
    contrarian: { score: h.contrarian, max: 15, gaps: h.contrarian < 10 ? ['需補充正反論辯與投資論點失效條件(8.4)'] : [] },
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

  const model = args.model ?? MODELS.CLAUDE;
  const round = parseInt(args.round ?? '0', 10);

  const { score } = await scoreCompanyResearch(ticker.toUpperCase(), round, model);

  console.log('\n╔══════════════════════════════════════╗');
  console.log(`║  Initial MAX Score: ${ticker.padEnd(6)} ${String(score.total).padStart(3)}/100        ║`);
  console.log('╚══════════════════════════════════════╝');
  console.log(`  Structural: ${score.structural}/${STRUCTURAL_MAX}`);
  console.log(`  Quality:    ${score.quality}/${QUALITY_MAX}`);
  console.log(`  環境 (${WEIGHTS.環境}pts): ${score.環境.score}`);
  console.log(`  生意 (${WEIGHTS.生意}pts): ${score.生意.score}`);
  console.log(`  組織 (${WEIGHTS.組織}pts): ${score.組織.score}`);
  console.log(`  人   (${WEIGHTS.人}pts): ${score.人.score}`);
  console.log(`  論點 (${WEIGHTS.論點}pts): ${score.論點.score}`);
  console.log(`  達標 (≥${PASS_THRESHOLD}): ${score.passThreshold ? '✓ YES' : '✗ NO'}`);
  if (score.rubricVersion) console.log(`  Rubric: ${score.rubricVersion}`);
  if (score.環境.gaps.length) console.log('\n環境缺口:', score.環境.gaps.join('; '));
  if (score.生意.gaps.length) console.log('生意缺口:', score.生意.gaps.join('; '));
  if (score.組織.gaps.length) console.log('組織缺口:', score.組織.gaps.join('; '));
  if (score.人.gaps.length) console.log('人缺口:', score.人.gaps.join('; '));
  if (score.論點.gaps.length) console.log('論點缺口:', score.論點.gaps.join('; '));
}

const _entry = process.argv[1] ?? '';
if (_entry.includes('initial-max-scorer')) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
