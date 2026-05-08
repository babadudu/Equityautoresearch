# Financial Analyst Verification Standard

This standard applies before any `{TICKER}_Initial_MAX.md` report is marked complete, especially when the report drives a BUY/HOLD/SELL recommendation.

## 1. Freshness Gate

Every completed report must state:

| Required field | Standard |
|----------------|----------|
| Research date | Absolute date, not "today" |
| Market price | Price, timestamp/date, and source |
| Market cap / EV inputs | Shares, cash, debt, net debt, and source |
| Latest quarter | Most recent reported quarter included if released before research date |
| Guidance | Latest company guidance included if management has updated it |

Failure condition: if the latest reported quarter is missing or the price is stale, the investment rating is provisional.

## 2. Primary-Source Hierarchy

Use this order for facts:

1. Company filings, earnings releases, proxy statements, investor presentations.
2. Exchange/SEC data and audited annual reports.
3. Earnings call transcripts, preferably company-hosted or reputable transcript provider.
4. Reputable market data providers for current quote and consensus estimates.
5. Secondary research only for TAM, industry context, or triangulation.

All valuation drivers, segment data, debt/share counts, dividends, and guidance must cite a clickable primary or market-data source.

## 3. Investment Action Gate

The report must reconcile:

| Item | Required check |
|------|----------------|
| Current price vs target | Upside/downside calculated from current price |
| Dividend yield | Current annual dividend divided by current price |
| Hurdle rate | Total return compared with the stated IRR hurdle |
| Rating language | BUY/HOLD/SELL must match the current-price math |
| Portfolio context | Existing position treatment separated from new-money recommendation |

Use "upside to target" unless intrinsic value exceeds current price with a defensible discount. Do not call upside a "margin of safety" when the DCF is below market price.

## 4. DCF Method Consistency

DCF must state whether it uses FCFF or FCFE.

| Method | Discount rate | Debt treatment |
|--------|---------------|----------------|
| FCFF / unlevered FCF | WACC | Subtract net debt from enterprise value |
| FCFE / levered FCF | Cost of equity | Do not subtract net debt again |

Failure condition: subtracting net debt after using an FCF line that already deducts interest.

## 5. Segment Data Gate

Segment tables must state whether revenue is gross, intercompany, or net. For WM-style disclosures, prefer net operating revenue for segment share and cite the company summary data table.

## 6. Corporate-Action Language

Dividend, buyback, split, and index-status language must be exact.

Example: a 23-year dividend increase streak is not a Dividend Aristocrat claim if the relevant convention requires 25 years.

## 7. Analyst Verification Log

Each completed report should include a compact verification snapshot near the top:

| Field | Example |
|-------|---------|
| Last price checked | `$222, May 7, 2026` |
| Latest quarter included | `Q1 2026, released Apr 28, 2026` |
| Latest guidance included | `FY2026 revenue/EBITDA/FCF` |
| Model issues fixed | `FCFF/FCFE debt treatment corrected` |
| Residual risks | `Strict DCF below market; multiple-driven thesis` |

This log is the observability surface for the report: a reviewer should see what was verified, what changed, and what remains assumption-driven without reading the entire file.

## 8. Completion Standard

A report is complete only when:

- The top flow is `IRR Model & Key Assumptions` -> `Executive Summary` -> `KEY QUESTION` -> `Scorecard` -> four-dimension body.
- Latest quarter and guidance are included.
- Rating math matches current price.
- DCF method is internally consistent.
- Segment data cites primary sources and labels gross/net treatment.
- All known high-impact factual corrections are reflected in the memo, not only in a separate review note.
