# SEO / GEO Release Evidence

Release: Website-Starter-Standard alignment  
Date: 2026-10-07  
Branch: `seo/website-standard-geo-20261007`

## Scope

This release aligns the existing production SEO/GEO implementation with the mandatory rules in `chenmu2024/Website-Starter-Standard` without changing protected GSC winner titles/H1/canonicals or the active experiment ownership model.

Implemented:
- project-specific intent/indexation/entity/crawler/source plan
- machine-readable primary-source registry in `seo/source-registry.json`
- stable Organization and WebSite JSON-LD entity IDs
- sitewide entity graph emitted in prerendered HTML
- WebApplication schemas connected to the stable site entities
- About, Contact, and BlogPosting entity relationships normalized
- deterministic validation for site-identity schema in generated HTML
- explicit separation between search crawl/index policy and AI training/product crawler policy

Not added:
- no duplicate AI-only pages
- no invented AI schema
- no new AI-only markup; the pre-existing `llms.txt` files are kept only as optional interoperability metadata and are explicitly not treated as a Google requirement
- no hreflang because the production site is Spanish-only
- no fabricated SEO metrics

## GSC protection

The accepted baseline remains `seo/gsc-baseline-2026-10-07.json`. Protected winners and active experiments remain frozen unless newer evidence, correctness, accessibility, security, or broken functionality justifies a change.

## L1 evidence

The merged Website-Starter-Standard release passed GitHub Actions Quality run **#446** (workflow run `37556704115`) on main commit `7497904a03f6a50f0e7f40b105c20187cf24b313`.

The successful workflow covered the repository's deterministic release chain, including dependency audit, content/SEO-GEO governance validation, TypeScript, production build/prerender, generated metadata/schema checks, performance budgets, and mobile browser smoke coverage.

## Production follow-up

After merge/deployment:
- verify production `robots.txt` and `sitemap.xml`
- inspect raw HTML for `#organization` and `#website` JSON-LD
- confirm key canonical pages remain unchanged
- continue the existing GSC observation window before further title/H1 experiments


## GEO extractability increment — 2026-10-07

Scope:
- added reusable "Respuesta rápida" blocks with explicit output, assumptions and limitations
- covered the advanced editor, lettering creator, aesthetic Unicode converter, font pairing, color palettes, practice sheets and four specialized SEO landing routes
- corrected unsupported or overbroad compatibility, popularity, engagement and tattoo claims
- linked the aesthetic Unicode converter to the Unicode Standard as its primary technical reference
- kept protected GSC winners and active CTR experiment titles/H1/canonicals unchanged
- required the answer/limitation blocks to exist in prerendered raw HTML

Evidence:
- GitHub Actions Quality run **#449** passed on implementation commit `d7243535c80ba755c56c7c12ebf991ea7fc3a292`.
- The successful run covered content validation, TypeScript, production build/prerender, metadata/schema validation, performance budgets and mobile browser smoke checks.
