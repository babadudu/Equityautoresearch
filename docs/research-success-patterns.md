# Research Success Patterns

This note distills the CDNS 90/100 run, the WM analyst-verification fix, and the recent operational changes into repeatable patterns for Initial MAX research.

## Compared Runs

| Ticker | Path | Final Score | What Worked | Remaining Lesson |
|--------|------|-------------|-------------|------------------|
| CDNS | `data/companies/CDNS/CDNS_Initial_MAX.md` | 90/100 after 5 gap-fill rounds + polish | Quantified gaps were filled one at a time: HHI, sensitivity matrix, TAM verticals, probability-weighted IRR, explicit HOLD/BUY/SELL triggers, 10 transcripts. | Report still passed with a WACC consistency warning, so pass threshold is not the same as analyst-ready. |
| WM | `data/companies/WM/WM_Initial_MAX.md` | 88/100 after analyst verification | Fresh price, latest quarter, rating math, DCF method consistency, segment net/gross cleanup, and forward verification triggers were added. | Scorer can pass a report that is financially stale unless a human/standard checks current market data and rating logic. |

## Pattern 1: Score Gains Come From Measurable Inserts

High-impact additions are compact and checkable:

- HHI or market-share concentration math.
- TAM by vertical or waste stream, not only total TAM.
- Explicit latest-quarter actuals and guidance bridge.
- 3x3 sensitivity matrix.
- DCF fair value vs current market cap comparison.
- Probability-weighted Bull/Base/Bear expected return.
- Explicit `BUY`, `HOLD`, or `SELL` plus price triggers.
- Interview/transcript count that matches local files.

Low-impact additions are generic paragraphs, repeated moat language, and unsupported management summaries.

## Pattern 2: The Scorer Rewards Structure Before Nuance

Before asking for deeper research, make sure the structural gates are already clean:

| Gate | Target |
|------|--------|
| Sections | All 1.1-4.2 present, plus front IRR, Executive Summary, KEY QUESTION, Scorecard |
| Transcripts | At least 10 local transcript/interview files, referenced in 4.2 |
| URLs | Clickable links for all newly added data and quotes |
| Quotes | Direct quotes distributed across business, organization, and people |
| DCF | WACC decomposition, scenarios, sensitivity, fair-value/current-price reconciliation |
| Consistency | No stale price, no interview-count mismatch, no WACC parsing conflict |

CDNS climbed from 76 to 90 mostly by closing these gates in sequence.

## Pattern 3: Pass Threshold Is Not Enough

`passThreshold: true` means the report passes the rubric. It does not guarantee the investment conclusion is usable.

Always run a separate analyst verification on:

- Current stock price and timestamp.
- Latest quarter and latest guidance.
- Shares, cash, debt, and net debt.
- Rating math vs current price.
- Dividend yield and corporate-action wording.
- FCFF vs FCFE debt treatment.
- Segment table gross/net labeling.

This is why WM changed from stale `HOLD at ~$245` to `BUY / ACCUMULATE below $225` after price and Q1 2026 refresh.

## Pattern 4: Polish Is A Real Scoring Step

In the current runner, the polish round appears as round 16 in history. CDNS moved from 88 to 90 through polish. Do not stop immediately at the first threshold pass if the report is near a higher-quality band and there are no unresolved factual blockers.

## Pattern 5: MLX Is Good For Closed-Vocab Scoring, Less Good For Open-Ended Research

Observed behavior:

- MLX Qwen3.6-35B is stable for rubric scoring: CDNS and WM dimensions scored with zero variance.
- MLX is useful for structured classification, JSON scoring, and repeated dimension calls.
- Complex gap-fill still benefits from stronger tool-use models when source gathering, rewriting, and file edits are required.

Operational rule:

| Task | Preferred Route |
|------|-----------------|
| Rubric scoring | MLX local |
| Pairwise/closed-vocab checks | MLX local |
| Gap-fill research with source discovery | Gemini or Claude tool-capable route |
| Final prose polish | Claude route unless MLX is explicitly validated for that mode |

## Pattern 6: Successful Gap-Fill Is A Queue Of Small Repairs

A productive gap-fill round should state exactly what it changed. CDNS examples that moved the score:

- Added 10 transcript files to clear interview mismatch.
- Added WACC decomposition and sensitivity matrix.
- Added export-control EPS impact and compliance cost.
- Added HHI and switching-cost quantification.
- Added AI vs non-AI revenue mix and computational biology estimates.
- Added probability-weighted scenario table and explicit HOLD rating.

WM examples:

- Added analyst verification snapshot.
- Replaced stale segment table with FY2025/Q1 2026 net revenue by segment.
- Corrected Stericycle synergy target.
- Added DCF-to-target bridge.
- Added forward verification triggers.

## Standard Next-Run Checklist

Before starting a new holding:

1. Confirm ticker task exists in vault and status is clear.
2. Start report with the required front flow.
3. Pull latest quarter, latest guidance, current price, shares, cash, debt, and dividend.
4. Create or save at least 10 transcript/interview files early.
5. Build DCF with method labels: FCFF or FCFE.
6. Add Bull/Base/Bear probability-weighted expected return on the first draft.
7. Use explicit rating language: `BUY`, `HOLD`, or `SELL`.
8. Run scorer; fill only the top 3-5 measurable gaps per round.
9. Let polish run after threshold pass.
10. Run analyst verification before marking the task done.

## Automation Opportunities

The next code improvements should automate these checks:

- Fail or warn when report price date is older than latest trading date available.
- Fail or warn when latest quarter is absent but a newer earnings release exists.
- Parse rating section and verify target/current-price math.
- Distinguish FCFF and FCFE in DCF and detect double subtraction of debt.
- Treat WACC sensitivity table values as scenario inputs, not inconsistent WACC errors.
- Add a `research_success_summary` artifact after every completed run: score path, rounds, remaining warnings, and analyst-verification status.
- Generated company reports are ignored by `.gitignore` (`data/companies/*/`), so commits may record scoring/log artifacts without the actual report. If a report needs durable review, export or explicitly force-add the final memo.
