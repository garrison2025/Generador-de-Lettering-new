# SEO / GEO Release Evidence

Release: Website-Starter-Standard alignment  
Date: 2026-10-07  
Branch: `seo/website-standard-geo-20261007`

## Scope

This release aligns the existing production SEO/GEO implementation with the mandatory rules in `chenmu2024/Website-Starter-Standard` without changing protected GSC winner titles/H1/canonicals or the active experiment ownership model.

Implemented:
- project-specific intent/indexation/entity/crawler/source plan
- stable Organization and WebSite JSON-LD entity IDs
- sitewide entity graph emitted in prerendered HTML
- WebApplication schemas connected to the stable site entities
- About, Contact, and BlogPosting entity relationships normalized
- deterministic validation for site-identity schema in generated HTML
- explicit separation between search crawl/index policy and AI training/product crawler policy

Not added:
- no duplicate AI-only pages
- no invented AI schema
- no `llms.txt` because no interoperability requirement was identified
- no hreflang because the production site is Spanish-only
- no fabricated SEO metrics

## GSC protection

The accepted baseline remains `seo/gsc-baseline-2026-10-07.json`. Protected winners and active experiments remain frozen unless newer evidence, correctness, accessibility, security, or broken functionality justifies a change.

## L1 evidence

Pending the PR Quality workflow. Record the successful run ID and commit SHA here after the branch passes all deterministic checks.

## Production follow-up

After merge/deployment:
- verify production `robots.txt` and `sitemap.xml`
- inspect raw HTML for `#organization` and `#website` JSON-LD
- confirm key canonical pages remain unchanged
- continue the existing GSC observation window before further title/H1 experiments
