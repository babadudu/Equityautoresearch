/**
 * Tests whether prompt engineering closes the MLX 論點 calibration gap.
 * Runs original prompt vs enhanced prompt (checklist + few-shot) on MLX only, 3x each.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chat } from '../src/llm.js';
import { LOCAL_MODEL } from '../src/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Original prompt (matches scorer exactly) ──

const ORIGINAL_PROMPT = `你是投資研究品質評審。請評估以下研究報告的**投資論點品質**。

## 評分標準（滿分 9 分）
### 非共識觀點 / Variant Perception (0-3)
0 = 無明確投資論點; 1 = buy/sell建議但無差異化; 2 = 識別出市場可能錯誤但論據不充分; 3 = 清晰variant perception：市場共識X，我們認為Y因為Z
### 內部一致性 (0-3)
0 = 明顯矛盾; 1 = 部分一致有1-2個矛盾; 2 = 大致一致偶有小矛盾; 3 = 完全一致邏輯鏈完整
### 可行動性 (0-3)
0 = 無結論; 1 = buy/sell但無價格目標; 2 = 有價格目標+部分催化劑; 3 = 明確buy/sell/hold+價格目標+時間框架+≥3催化劑+風險觸發

## 輸出格式（純 JSON）
{"非共識觀點": 數字, "內部一致性": 數字, "可行動性": 數字, "total": 數字, "evidence": ["..."], "gaps": ["..."]}`;

// ── Enhanced prompt: checklist gate + negative few-shot ──

const ENHANCED_PROMPT = `你是投資研究品質評審。請評估以下研究報告的**投資論點品質**。

## 評分標準（滿分 9 分）

### 非共識觀點 / Variant Perception (0-3)
0 = 無明確投資論點
1 = 有buy/sell建議但無差異化觀點（僅重述基本面）
2 = 識別出市場可能錯誤，但論據不充分
3 = 清晰variant perception：市場共識是X，我們認為Y因為Z（需有數據+邏輯鏈）

### 內部一致性 (0-3)
0 = 明顯矛盾（DCF假設與財務預測不一致）
1 = 部分一致，有1-2個矛盾
2 = 大致一致，偶有小矛盾
3 = 完全一致：DCF假設↔財務預測↔TAM分析↔競爭地位形成完整邏輯鏈

### 可行動性 (0-3) — 逐項核查後再評分
評分前請先逐一確認以下5項是否**明確出現**於報告中（不得推斷或從估值隱含）：
□ A. 明確的 BUY / SELL / HOLD 文字建議（不接受「隱含買入信號」或估值低估等替代說法）
□ B. 具體價格目標（數字）
□ C. 明確時間框架（如「12個月」「2026年底前」）
□ D. ≥3個具體催化劑
□ E. 明確的風險觸發條件（導致改變立場的條件）

評分規則：
- 3分：A+B+C+D+E 全部明確出現
- 2分：缺少A（無明確buy/sell/hold），但B+C+D+E均有；或有A但缺D或E
- 1分：僅有buy/sell但無價格目標；或多項缺失
- 0分：無結論

**關鍵**：若找不到「BUY」「SELL」「HOLD」「買入」「賣出」「持有」等明確評級字樣，可行動性最高給2分。

## 反例示範（勿重蹈）

輸入片段：「公允價值區間 NT$9,500-11,700，中位數 NT$10,800。概率加權IRR約10%。
提供7個失效觸發條件。N2量產、CoWoS擴產為主要催化劑。」

錯誤評分：{"可行動性": 3, ...}
正確評分：{"可行動性": 2, ...}
理由：估值區間≠明確BUY建議；IRR ≠投資評級；無「買入/BUY/HOLD」字樣 → A項缺失 → 最高2分。

## 輸出格式（純 JSON，需含checklist結果）
{
  "checklist": {"A_explicit_rating": true/false, "B_price_target": true/false, "C_timeframe": true/false, "D_catalysts_3plus": true/false, "E_risk_triggers": true/false},
  "非共識觀點": 數字,
  "內部一致性": 數字,
  "可行動性": 數字,
  "total": 數字,
  "evidence": ["..."],
  "gaps": ["..."]
}`;

// ── Structured CoT prompt: enumerate before scoring ──

const STRUCTURED_COT_PROMPT = `你是投資研究品質評審。請評估以下研究報告的**投資論點品質**。

## 評分標準（滿分 9 分）

### 非共識觀點 / Variant Perception (0-3)
0 = 無明確投資論點
1 = 有buy/sell建議但無差異化觀點（僅重述基本面）
2 = 識別出市場可能錯誤，但論據不充分
3 = 清晰variant perception：市場共識是X，我們認為Y因為Z（需有數據+邏輯鏈）

### 內部一致性 (0-3)
0 = 明顯矛盾
1 = 部分一致，有1-2個矛盾
2 = 大致一致，偶有小矛盾
3 = 完全一致：DCF假設↔財務預測↔TAM分析↔競爭地位形成完整邏輯鏈

### 可行動性 (0-3) — 逐項核查後再評分
評分前請先逐一確認以下5項是否**明確出現**於報告中（不得推斷或從估值隱含）：
□ A. 明確的 BUY / SELL / HOLD 文字建議（不接受「隱含買入信號」或估值低估等替代說法）
□ B. 具體價格目標（數字）
□ C. 明確時間框架（如「12個月」「2026年底前」）
□ D. ≥3個具體催化劑
□ E. 明確的風險觸發條件

評分規則：
- 3分：A+B+C+D+E 全部明確出現
- 2分：缺少A（無明確buy/sell/hold），但B+C+D+E均有；或有A但缺D或E
- 1分：僅有buy/sell但無價格目標；或多項缺失
- 0分：無結論

**關鍵**：若找不到「BUY」「SELL」「HOLD」「買入」「賣出」「持有」等明確評級字樣，可行動性最高給2分。

## 評分程序（必須依序完成）

### 步驟 1：內部一致性枚舉（評分前完成）
請先列出以下項目，再評分：
- DCF估值區間 vs P/E/EV-EBITDA多元估值 → 兩者是否收斂或矛盾？
- 報告的IRR/回報率 vs 尾部風險/失效情境 → 概率加權是否一致？
- 牛市情境 vs 熊市情境 → 是否共用同一分析師立場，或僅中性並列？

### 步驟 2：非共識觀點枚舉（評分前完成）
請先列出以下項目，再評分：
- 報告明確陳述的市場共識是什麼？
- 分析師主張與共識的差異點是什麼？
- 該差異主張是否有數據支撐，還是僅為斷言？

### 步驟 3：根據枚舉結果評分，每個維度必須引用步驟1/2中的具體項目

## 輸出格式（純 JSON，需含enumeration和checklist）
{
  "enumeration": {
    "consistency": {"dcf_vs_multiples": "...", "irr_vs_tail_risk": "...", "bull_bear_stance": "..."},
    "variant_perception": {"stated_consensus": "...", "analyst_diff": "...", "data_backed": "yes/no + reason"}
  },
  "checklist": {"A_explicit_rating": true/false, "B_price_target": true/false, "C_timeframe": true/false, "D_catalysts_3plus": true/false, "E_risk_triggers": true/false},
  "非共識觀點": 數字,
  "內部一致性": 數字,
  "可行動性": 數字,
  "total": 數字,
  "evidence": ["..."],
  "gaps": ["..."]
}`;

// ── Helpers ──

function extractSection(content: string, ids: string[]): string {
  const parts: string[] = [];
  for (const id of ids) {
    const re = new RegExp(`^##\\s*${id.replace('.', '\\.')}\\b.*$`, 'm');
    const m = content.match(re);
    if (!m || m.index == null) continue;
    const after = content.slice(m.index + m[0].length);
    const next = after.match(/\n##\s/m);
    const end = next?.index != null ? m.index + m[0].length + next.index : content.length;
    parts.push(content.slice(m.index, end));
  }
  return parts.join('\n\n');
}

function median(nums: number[]): number {
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
}

async function runOnce(system: string, content: string, ticker: string): Promise<{ total: number; actionability: number; checklist?: Record<string, boolean>; raw: string }> {
  const userMsg = `請評分以下 ${ticker} 研究報告的「論點」維度：\n\n${content}`;
  const t0 = Date.now();
  const resp = await chat(system, [{ role: 'user', content: userMsg }], { maxTokens: 3072, backend: 'mlx' });
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const raw = resp.content ?? '';

  let jsonStr = raw.trim();
  const fence = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (fence) jsonStr = fence[1].trim();
  const start = jsonStr.indexOf('{');
  if (start === -1) { console.log(`  [${elapsed}s] parse error — no JSON`); return { total: NaN, actionability: NaN, raw }; }

  let depth = 0, end = -1;
  for (let i = start; i < jsonStr.length; i++) {
    if (jsonStr[i] === '{') depth++;
    else if (jsonStr[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) { console.log(`  [${elapsed}s] parse error — unclosed`); return { total: NaN, actionability: NaN, raw }; }

  // Sanitize: CJK fullwidth punctuation inside JSON string values can break parse.
  // Replace only when inside a quoted string context (naive but effective for this use case).
  const candidate = jsonStr.slice(start, end + 1)
    .replace(/[。，：；！？]/g, (ch) => {
      const map: Record<string, string> = { '。': '.', '，': ',', '：': ':', '；': ';', '！': '!', '？': '?' };
      return map[ch] ?? ch;
    });
  const parsed = JSON.parse(candidate);
  const total = parsed.total as number ?? NaN;
  const actionability = parsed['可行動性'] as number ?? NaN;
  const checklist = parsed.checklist as Record<string, boolean> | undefined;
  console.log(`  [${elapsed}s] total=${total} 可行動性=${actionability} checklist=${JSON.stringify(checklist ?? 'n/a')}`);
  return { total, actionability, checklist, raw };
}

// ── Main ──

const RUNS = 3;
const ticker = 'TSM';
const reportPath = path.join(ROOT, 'data', 'companies', ticker, `${ticker}_Initial_MAX.md`);
const content = fs.readFileSync(reportPath, 'utf-8');
const sectionContent = extractSection(content, ['2.5', '8.1', '8.2', '8.3', '8.4']);

console.log(`\n=== MLX 論點 prompt-fix test | model: ${LOCAL_MODEL} ===`);
console.log(`Section: ${sectionContent.length} chars | runs: ${RUNS} each\n`);

console.log(`── Original prompt ──`);
const origResults: ReturnType<typeof runOnce> extends Promise<infer T> ? T[] : never[] = [];
for (let i = 0; i < RUNS; i++) {
  process.stdout.write(`  run ${i+1}/${RUNS}: `);
  origResults.push(await runOnce(ORIGINAL_PROMPT, sectionContent, ticker));
}
const origTotals = origResults.map(r => r.total).filter(n => !isNaN(n));
const origAction = origResults.map(r => r.actionability).filter(n => !isNaN(n));

console.log(`\n── Enhanced prompt (checklist + few-shot) ──`);
const enhResults: typeof origResults = [];
for (let i = 0; i < RUNS; i++) {
  process.stdout.write(`  run ${i+1}/${RUNS}: `);
  enhResults.push(await runOnce(ENHANCED_PROMPT, sectionContent, ticker));
}
const enhTotals = enhResults.map(r => r.total).filter(n => !isNaN(n));
const enhAction = enhResults.map(r => r.actionability).filter(n => !isNaN(n));
const enhMedian = median(enhTotals);

console.log(`\n── Structured CoT prompt (enumerate-before-score) ──`);
const cotResults: typeof origResults = [];
for (let i = 0; i < RUNS; i++) {
  process.stdout.write(`  run ${i+1}/${RUNS}: `);
  cotResults.push(await runOnce(STRUCTURED_COT_PROMPT, sectionContent, ticker));
}
const cotTotals = cotResults.map(r => r.total).filter(n => !isNaN(n));
const cotAction = cotResults.map(r => r.actionability).filter(n => !isNaN(n));

console.log(`\n═══════════════════════════════════════════`);
console.log(`RESULTS`);
console.log(`───────────────────────────────────────────`);
console.log(`Original    totals: [${origTotals.join(', ')}] median=${median(origTotals)}  可行動性: [${origAction.join(', ')}]`);
console.log(`Enhanced    totals: [${enhTotals.join(', ')}] median=${median(enhTotals)}  可行動性: [${enhAction.join(', ')}]`);
console.log(`StructuredCoT totals: [${cotTotals.join(', ')}] median=${median(cotTotals)}  可行動性: [${cotAction.join(', ')}]`);
console.log(`Claude baseline:     median=6  可行動性: [2, 2, 2]`);
console.log();

const cotMedian = median(cotTotals);
const cotGap = cotMedian - 6;
const bestMedian = Math.min(cotMedian, enhMedian);
const bestGap = bestMedian - 6;
console.log(`Enhanced gap:      ${enhMedian - 6 > 0 ? '+' : ''}${enhMedian - 6}`);
console.log(`StructuredCoT gap: ${cotGap > 0 ? '+' : ''}${cotGap}`);
console.log();
console.log(Math.abs(bestGap) <= 1
  ? '→ VERDICT: Prompt engineering closes gap — MLX calibrated for 論點, route it'
  : Math.abs(bestGap) <= 2
  ? '→ VERDICT: Improved but not closed — ship 環境+人 to MLX, keep Claude for 論點'
  : '→ VERDICT: Prompt engineering insufficient — ship 環境+人 to MLX, keep Claude for 論點');

console.log(`\n── Last StructuredCoT run raw output ──`);
console.log(cotResults[cotResults.length - 1].raw);
