# SEO / GEO Project Brief — Generador de Lettering

Updated: 2026-10-07  
Production site: https://generadordelettering.org  
Canonical standard: chenmu2024/Website-Starter-Standard

## 1. Site goal and constraints

Generador de Lettering is a Spanish-language utility site for digital lettering, Unicode text conversion, social-profile naming, and related guides.

Operating constraints:
- Preserve proven search-intent ownership and the GSC experiment baseline in `seo/gsc-baseline-2026-10-07.json`.
- Do not replace approved production keywords merely because another phrase appears easier.
- Do not invent Volume, KD, CPC, SERP, traffic, backlink, or AI-visibility data.
- Prefer static/edge delivery and zero-recurring-cost infrastructure where practical.
- GEO work extends normal SEO; no duplicate AI-only pages or invented AI markup.

## 2. Primary intent ownership

| Intent | Canonical destination | Status |
|---|---|---|
| generador de lettering / lettering online | `/` | active GSC experiment; freeze title/H1 until new evidence |
| creador de lettering con plantillas | `/herramientas/creador-de-lettering` | distinct creation/preset intent |
| editor de lettering avanzado | `/editor` | advanced canvas/editor intent |
| conversor de letras / copiar y pegar | `/herramientas/conversor-texto` | active GSC experiment |
| letras bonitas aesthetic | `/herramientas/conversor-letras-bonitas` | aesthetic conversion intent |
| letras y símbolos para Free Fire | `/herramientas/letras-free-fire` | protected GSC winner |
| generador de nombres para Free Fire | `/herramientas/generador-de-nombres-para-free-fire` | name-generation intent |
| letras para TikTok | `/herramientas/letras-tiktok` | protected GSC winner |
| generador de nombres para Instagram | `/herramientas/generador-de-nombres-para-instagram` | protected GSC winner |
| letras azules / cuadradas | `/herramientas/letras-azules` | protected GSC winner |
| informational Free Fire name ideas | `/blog/mejores-nombres-insanos-free-fire` | active GSC experiment |

The remaining tool, guide, and SEO landing routes keep their existing specialized intents. Do not create a second indexable page for a mere keyword variant of the same intent.

## 3. Indexation and canonical policy

- Public production routes in `public/sitemap.xml` are indexable and self-canonical.
- Generated static HTML must contain title, description, robots, canonical, H1, primary content, important internal links, and applicable structured data.
- The generated 404 is `noindex, follow` and must not enter the sitemap.
- Sitemap URLs must be canonical, indexable destinations only.
- URL policy is extensionless with no trailing slash except the homepage.
- Parameter/facet pages are not part of the indexable architecture.

## 4. Internal-link architecture

Primary hubs:
- Homepage: brand/lettering hub and high-value utility entry points.
- `/herramientas`: tool hub.
- `/blog`: editorial hub.

Rules:
- Tool pages link to the true parent hub and semantically related tools.
- Blog posts link to the tools that perform the next useful action.
- Free Fire letters/symbols, Free Fire name generation, and informational name ideas remain distinct.
- Protected GSC winners must remain crawlable from sitewide or hub navigation.
- Random or mechanically exact-match related links are prohibited.

## 5. GEO / AI-search answer plan

Important pages should:
- State the direct utility or answer early, before generic marketing.
- Keep self-contained explanations for Unicode behavior, tool limits, privacy behavior, and compatibility caveats.
- Use question headings, examples, and tables only where they improve comprehension.
- Explain tool input/output assumptions and platform-dependent limitations.
- Keep original value in the interactive tools; do not create duplicate answer-only versions for AI systems.
- Use stable Organization/WebSite entity IDs across structured data.

No special Google AI markup is required. The existing `/llms.txt` and `/llms-full.txt` files are retained only as optional interoperability summaries for non-Google systems; they are not treated as Google indexing or ranking requirements.

## 6. Evidence and source registry

| Claim/topic | Source of truth | Refresh trigger |
|---|---|---|
| current GSC clicks/impressions/CTR/position | `seo/gsc-baseline-2026-10-07.json` from user-provided GSC screenshots | next accepted GSC review |
| configured converter style count | `src/pages/ConversorTexto.tsx` and deterministic CI validation | style-array change |
| tool behavior / browser-local conversion | implementation source and browser smoke tests | implementation change |
| Unicode Regional Indicator semantics | `seo/source-registry.json` → Unicode Consortium latest names list | when Unicode-specific claims materially change |
| external platform acceptance/limits | visible cautious wording; no hard guarantee without first-party evidence | platform behavior change or new sourced claim |

Claims about TikTok, Instagram, Free Fire, browsers, or third-party compatibility must be phrased as platform-dependent unless supported by current first-party documentation.

## 7. Entity map

| Entity | Type | Stable ID / URL |
|---|---|---|
| Generador de Lettering | Organization | `https://generadordelettering.org/#organization` |
| Generador de Lettering website | WebSite | `https://generadordelettering.org/#website` |
| About page | AboutPage | `https://generadordelettering.org/sobre-nosotros` |
| Contact page | ContactPage | `https://generadordelettering.org/contacto` |
| Individual tools | WebApplication where truthful | self-canonical page URL |

Site identity is implemented centrally in `src/seo/siteEntities.ts`.

## 8. Structured-data plan

- Sitewide identity: Organization + WebSite with stable `@id` relationships.
- Tool pages: WebApplication only when the visible page is an actual interactive application.
- Article pages: BlogPosting with publisher/author connected to the stable Organization entity.
- BreadcrumbList: only when it matches visible information architecture.
- FAQPage: may describe visible FAQ content; do not promise a Google FAQ rich result.
- AboutPage / ContactPage: only on the corresponding visible pages.

Schema is not used as a generic GEO hack.

## 9. International SEO

Current site is Spanish-only. hreflang is N/A until a genuinely localized additional language/region is launched with market-specific keyword validation. Do not mechanically translate approved Spanish keywords.

## 10. Programmatic SEO

The small set of specialized SEO landing pages is allowed only while each route has standalone, materially specialized value. No mass expansion is approved. Any future batch must pass intent differentiation, content uniqueness, sitemap, internal-link, and sampled quality gates before indexation.

## 11. Search and AI crawler policy

- Googlebot/Bing/search crawlers: public site remains crawlable.
- Existing robots policy allows the public site and separately names GPTBot, ClaudeBot, and PerplexityBot; those directives are an owner/product-crawler policy, not an SEO requirement.
- No instruction may describe Google-Extended as a Search ranking/indexing control.
- No new training/product crawler restriction or permission is inferred from SEO needs; owner policy should control future changes.

## 12. Release verification

L1 deterministic checks:
- `npm run validate`
- TypeScript check
- production build + prerender
- generated HTML metadata/schema validation
- sitemap/canonical coverage
- mobile browser smoke test

L2 for major releases:
- L1 plus responsive/visual QA, lab CWV review, raw-HTML parity, content/schema review, production URL verification.

L3:
- use real GSC/field data after enough time has passed; compare against the accepted GSC baseline before changing protected winners or active experiments.
