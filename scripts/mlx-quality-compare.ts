/**
 * MLX vs Claude quality comparison for scoreDimension().
 * Runs one dimension against TSM report with both backends and prints a side-by-side diff.
 *
 * Usage:
 *   npx tsx scripts/mlx-quality-compare.ts [dimension]
 *   dimension defaults to 論點 (smallest content, fastest compare)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chat } from '../src/llm.js';
import { MODELS, SCORER_THINKING_BUDGET, LOCAL_MODEL } from '../src/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Dimension prompts (copied from scorer) ──

const DIMENSION_PROMPTS: Record<string, string> = {
  環境: `你是投資研究品質評審。請評估以下**環境**分析的品質。

## 評分標準（滿分 12 分）
### TAM趨勢 (0-3): 市場規模+CAGR+預測出處
### 市場結構 (0-3): 競爭格局+集中度+護城河
### 監管政策 (0-3): 政策風險+法規趨勢
### 技術趨勢 (0-3): 技術週期+顛覆風險

## 輸出格式（純 JSON）
{"TAM趨勢": 數字, "市場結構": 數字, "監管政策": 數字, "技術趨勢": 數字, "total": 數字, "evidence": ["..."], "gaps": ["..."]}`,

  論點: `你是投資研究品質評審。請評估以下研究報告的**投資論點品質**。

## 評分標準（滿分 9 分）
### 非共識觀點 / Variant Perception (0-3)
0 = 無明確投資論點; 1 = buy/sell建議但無差異化; 2 = 識別出市場可能錯誤但論據不充分; 3 = 清晰variant perception：市場共識X，我們認為Y因為Z
### 內部一致性 (0-3)
0 = 明顯矛盾; 1 = 部分一致有1-2個矛盾; 2 = 大致一致偶有小矛盾; 3 = 完全一致邏輯鏈完整
### 可行動性 (0-3)
0 = 無結論; 1 = buy/sell但無價格目標; 2 = 有價格目標+部分催化劑; 3 = 明確buy/sell/hold+價格目標+時間框架+≥3催化劑+風險觸發

## 輸出格式（純 JSON）
{"非共識觀點": 數字, "內部一致性": 數字, "可行動性": 數字, "total": 數字, "evidence": ["..."], "gaps": ["..."]}`,

  人: `你是投資研究品質評審。請評估以下**人**（管理層）分析的品質。

## 評分標準（滿分 12 分）
### CEO格局觀與商業哲學 (0-4): 哲學敘事+引言+出處
### 繼任風險與板凳深度 (0-4): 次世代領導人剖析+計畫揭露
### 道德操守與價值創造 (0-4): 具體案例+出處+財務連結

## 輸出格式（純 JSON）
{"格局觀哲學": 數字, "繼任風險": 數字, "道德操守": 數字, "total": 數字, "evidence": ["..."], "gaps": ["..."]}`,

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
};

// ── Section extraction (matches scorer logic) ──

const SECTION_MAP: Record<string, string[]> = {
  環境: ['1.1', '1.2', '1.3', '1.4'],
  生意: ['2.1', '2.2', '2.3', '2.4', '2.5'],
  組織: ['3.1', '3.2', '3.3'],
  人: ['4.1', '4.2'],
  論點: ['2.5', '8.1', '8.2', '8.3', '8.4'],
};

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

// ── Scorer call ──

interface ScoreResult {
  raw: string | null;
  parsed: Record<string, any> | null;
  durationMs: number;
  costUsd: number;
  error?: string;
}

async function runScore(
  dimension: string,
  sectionContent: string,
  ticker: string,
  backend: 'claude' | 'mlx',
): Promise<ScoreResult> {
  const systemPrompt = DIMENSION_PROMPTS[dimension];
  const userMessage = `請評分以下 ${ticker} 研究報告的「${dimension}」維度：\n\n${sectionContent}`;

  const t0 = Date.now();
  try {
    const response = await chat(
      systemPrompt,
      [{ role: 'user', content: userMessage }],
      backend === 'mlx'
        ? { maxTokens: 2048, backend: 'mlx' }
        : { model: MODELS.CLAUDE, maxTokens: 4096, thinkingBudget: SCORER_THINKING_BUDGET },
    );

    const durationMs = Date.now() - t0;
    const raw = response.content;
    if (!raw) return { raw: null, parsed: null, durationMs, costUsd: response.usage.costUsd, error: 'empty response' };

    let jsonStr = raw.trim();
    const fence = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
    if (fence) jsonStr = fence[1].trim();
    const start = jsonStr.indexOf('{');
    if (start === -1) return { raw, parsed: null, durationMs, costUsd: response.usage.costUsd, error: 'no JSON object' };

    let depth = 0, end = -1;
    for (let i = start; i < jsonStr.length; i++) {
      if (jsonStr[i] === '{') depth++;
      else if (jsonStr[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) return { raw, parsed: null, durationMs, costUsd: response.usage.costUsd, error: 'unclosed JSON' };

    const parsed = JSON.parse(jsonStr.slice(start, end + 1));
    return { raw, parsed, durationMs, costUsd: response.usage.costUsd };
  } catch (err: any) {
    return { raw: null, parsed: null, durationMs: Date.now() - t0, costUsd: 0, error: err.message };
  }
}

// ── Median helper ──

function median(nums: number[]): number {
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
}

// ── Run N calls, return all totals + per-call results ──

async function runN(
  dimension: string,
  sectionContent: string,
  ticker: string,
  backend: 'claude' | 'mlx',
  n: number,
): Promise<{ totals: number[]; calls: ScoreResult[] }> {
  const calls: ScoreResult[] = [];
  for (let i = 0; i < n; i++) {
    process.stdout.write(`  call ${i + 1}/${n}...`);
    const r = await runScore(dimension, sectionContent, ticker, backend);
    const t = r.parsed?.total as number ?? NaN;
    console.log(` total=${isNaN(t) ? 'ERR' : t}  ${(r.durationMs/1000).toFixed(1)}s`);
    calls.push(r);
  }
  return { totals: calls.map(c => c.parsed?.total as number ?? NaN).filter(n => !isNaN(n)), calls };
}

// ── Main ──

const RUNS = 3; // match SCORER_NUM_CALLS in production
const DIMS_TO_TEST = ['生意', '組織'] as const;
const ticker = 'TSM';

const reportPath = path.join(ROOT, 'data', 'companies', ticker, `${ticker}_Initial_MAX.md`);
if (!fs.existsSync(reportPath)) { console.error(`Report not found: ${reportPath}`); process.exit(1); }
const content = fs.readFileSync(reportPath, 'utf-8');

const argDim = process.argv[2] as string | undefined;
const dims = argDim ? [argDim] : DIMS_TO_TEST;

console.log(`\n=== MLX vs Claude — ${RUNS}×median bake-off | ticker: ${ticker} ===`);
console.log(`MLX model: ${LOCAL_MODEL}`);
console.log(`Dimensions: ${dims.join(', ')}\n`);

const summary: Array<{ dim: string; claudeMedian: number; mlxMedian: number; gap: number }> = [];

for (const dim of dims) {
  const sectionContent = extractSection(content, SECTION_MAP[dim] ?? []);
  console.log(`\n──── ${dim} (${sectionContent.length} chars) ────`);

  console.log(`▶ Claude ×${RUNS}:`);
  const claudeRuns = await runN(dim, sectionContent, ticker, 'claude', RUNS);
  const claudeMedian = median(claudeRuns.totals);

  console.log(`▶ MLX ×${RUNS}:`);
  const mlxRuns = await runN(dim, sectionContent, ticker, 'mlx', RUNS);
  const mlxMedian = median(mlxRuns.totals);

  const gap = mlxMedian - claudeMedian;
  const sign = gap > 0 ? '+' : '';
  console.log(`\n  Claude totals: [${claudeRuns.totals.join(', ')}] → median=${claudeMedian}`);
  console.log(`  MLX    totals: [${mlxRuns.totals.join(', ')}] → median=${mlxMedian}`);
  console.log(`  Δ (MLX - Claude): ${sign}${gap}`);

  // Show worst disagreement call from Claude vs best MLX (the rubric fidelity check)
  const lastClaude = claudeRuns.calls[claudeRuns.calls.length - 1];
  const lastMlx = mlxRuns.calls[mlxRuns.calls.length - 1];
  console.log(`\n  Last Claude gaps:`);
  (lastClaude.parsed?.gaps as string[] ?? []).forEach(g => console.log(`    • ${g}`));
  console.log(`  Last MLX gaps:`);
  (lastMlx.parsed?.gaps as string[] ?? []).forEach(g => console.log(`    • ${g}`));

  summary.push({ dim, claudeMedian, mlxMedian, gap });
}

// ── Final summary ──

console.log('\n\n═════════════════════════════════════════════════════════════');
console.log('SUMMARY — median-of-3 per backend');
console.log('─────────────────────────────────────────────────────────────');
console.log(`${'Dim'.padEnd(8)} ${'Claude'.padEnd(10)} ${'MLX'.padEnd(10)} ${'Δ'.padEnd(8)} Decision`);
console.log('─'.repeat(55));
for (const r of summary) {
  const dec = Math.abs(r.gap) <= 1 ? 'within noise'
    : r.gap > 1 ? 'MLX inflates'
    : 'MLX deflates';
  console.log(`${r.dim.padEnd(8)} ${String(r.claudeMedian).padEnd(10)} ${String(r.mlxMedian).padEnd(10)} ${String((r.gap > 0 ? '+' : '') + r.gap).padEnd(8)} ${dec}`);
}
const avgGap = summary.reduce((s, r) => s + r.gap, 0) / summary.length;
console.log(`\nAvg gap: ${avgGap > 0 ? '+' : ''}${avgGap.toFixed(1)}`);
console.log(Math.abs(avgGap) <= 1
  ? '→ VERDICT: MLX calibrated — safe to route scoreDimension() to MLX'
  : Math.abs(avgGap) <= 2
  ? '→ VERDICT: Borderline — consider hybrid (MLX scout, Claude confirm near threshold)'
  : '→ VERDICT: MLX not calibrated — keep Claude for scoreDimension()');
