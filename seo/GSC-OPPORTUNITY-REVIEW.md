# GSC Query × Page growth review — 2026-10-07

Project: Generador de Lettering (generadordelettering.org)  
SEO/GEO standard: `Website-Starter-Standard`  
Evidence baseline: `seo/gsc-baseline-2026-10-07.json`

## Evidence already available

Historical three-month GSC screenshot supplied by the site owner: approximately **36,600 clicks**, **626,000 impressions**, **5.8% CTR**, **6.7 average position**.

These are **property-level and page-level aggregates, not complete joined query × page × device × country rows**. In particular, they do not identify which keywords rank 11–30.

| Page | 3-month impressions | Clicks | CTR | Current status |
| --- | ---: | ---: | ---: | --- |
| `/herramientas/letras-free-fire` | 220,972 | 12,094 | 5.47% | protected winner |
| `/herramientas/letras-tiktok` | 123,104 | 7,439 | 6.04% | protected winner |
| `/herramientas/generador-de-nombres-para-instagram` | 57,718 | 4,628 | 8.02% | protected winner |
| `/herramientas/letras-azules` | 28,813 | 4,566 | 15.85% | protected winner |
| `/herramientas/conversor-texto` | 47,761 | 902 | 1.89% | active title/H1 experiment |
| `/` | 56,152 | 2,611 | 4.65% | active title/H1 experiment |
| `/blog/mejores-nombres-insanos-free-fire` | 7,087 | 123 | 1.74% | active title/H1 experiment |
| `/herramientas/generador-de-nombres-para-free-fire` | 9,055 | 377 | 4.16% | review with joined queries before changing |

Relevant whole-property query aggregates include `generador de nombres para free fire`, `lettering online`, `generador de lettering`, `letras azules copiar y pegar`, `lettering`, `lettering generator`, `crear nombres para free fire` and `simbolos para free fire`. **Do not assign these queries to one specific URL without joined GSC evidence.**

## Required fresh data

Using the connected GSC analysis integration, request a report for `generadordelettering.org` containing:

- Google Search Console **Query × Page** joined dimensions.
- The last completed **28-day** period and the **preceding 28 days** as a comparison.
- Clicks, impressions, CTR and average position per query/page pair.
- Breakdown by country (especially MX, ES, AR, CO) and device (mobile/desktop) where the source supports it.
- Exclude current-day partial data, property aggregation masquerading as page-ranking data, and unverified KD/Volume estimates.

Do not conflate a query-summary CSV with a joined query/page report: the former lacks landing-page ownership. Do not sum filtered/unfiltered exports together.

## Deterministic local review

For an authorized *joined* Query × Page CSV with columns:
`Query,Page,Clicks,Impressions,Position` (Spanish labels supported):

```bash
npm run gsc:opportunities -- ./gsc-query-page.csv --output ./gsc-opportunities.json
```

The script is dependency-free, runs locally and does not send the CSV to any server. CSV is deliberately an input format: exporting query and page separately will **not** work.

This report is a **research backlog**, not a ranking or traffic prediction:

- **Near Top 10:** weighted mean position >10 and <=30, at least 50 query/page impressions.
- **Top 10 / CTR review:** weighted mean position <=10 and CTR <2% on at least 100 impressions. CTR alone never establishes poor title quality; segment by ranking, device, country, search appearance and intent first.
- **Possible overlap:** two or more URLs each take >=20% of at least 100 impressions for a single query. This is not proof of cannibalization; compare search intent, URL ranking history, and each page's clicks.
- **Protection policy:** `protect` and `observe` rows are for evidence-only review until a newer accepted GSC analysis justifies SEO tag changes.

Scoring is an internal sorting heuristic; it is not KD, search volume, forecast visits or expected uplift.

## Decision / change-control policy

1. Inspect the top *new evidence-supported* query/page pairs in positions 11–30, prioritizing non-protected routes and clear page-intent mismatches.
2. Prefer useful on-page examples, truthful direct answers and semantically relevant links over repeated keyword insertion.
3. Do not create a competing landing page solely because another keyword variant appears in GSC.
4. For high-impression low-CTR cases, first check country, device, average position and branded/non-branded mix.
5. Keep the four protected winner URLs' Title/H1/Canonical unchanged; keep the three active experiments unchanged until the observed 14-day window and re-crawl have been assessed.
6. Compare **matched durations, matching filters**, and where possible daily query/page trends. The old **3-month** baseline is contextual and cannot be compared directly to a **14/28-day** outcome as a before/after experiment.
7. After an approved update, record the decision, affected route, supporting query/page evidence, PR, and re-evaluation date here.

## Next decision record

Pending: current joined GSC Query × Page performance data with positions. **No pages have been re-targeted and no ranking uplift is claimed by this audit.**
