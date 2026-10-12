# Specialized profile tools — 2026-10-12

## Scope

Four browser-only tools, no API, database, paid service or new production dependency:

| Route | Distinct function |
| --- | --- |
| `/herramientas/simbolos-para-free-fire` | Six searchable symbol categories, accent-insensitive search, ordered multi-symbol selection, editable combination and six nickname frames. |
| `/herramientas/letras-pequenas-para-free-fire` | Independently editable nickname and small-text label, superscript letters/digits or Small Caps, five mixed layouts. |
| `/herramientas/descripcion-free-fire` | Ten original signatures across five styles, editable raw text, cursor insertion, six-digit color-tag simulation, editable length reference and copy including codes. |
| `/aesthetic-bio-maker` | English local template engine generates three different complete bios from name, occupation and interests, with four moods, individual line editing, decorative insertion and two profile previews. |

Existing `/herramientas/letras-free-fire` links to all three specialized tools. Existing Instagram names tool links to the Bio Maker. New pages link back to the main tools. Their original copy, keywords and tool behavior remain intact. Following the user's navigation request, the desktop tools dropdown, mobile menu and `/herramientas` directory also link all four tools; the directory's existing ItemList schema includes them automatically. Homepage source, AdSense head script, account metadata and `ads.txt` are unchanged.

All four routes are lazy loaded, registered in SSR, included in the sitemap and prerendered with independent titles, descriptions, H1s and self-referencing canonicals. Bio Maker has English document and content language; Spanish shared navigation is retained.

The symbol library's visible category headings explicitly cover `Símbolos de corona para Free Fire`, `Corazón para Free Fire`, `Símbolos insanos para Free Fire` and `Signos para Free Fire: figuras especiales`. Search includes these headings with accent normalization. These remain categories on one canonical page, not separate URLs. Existing primary-keyword titles, H1s and descriptions for all four tools are preserved. The desktop dropdown scrolls within short viewports so every old and new link remains reachable.

## Conditional-page intent gate

Evidence collected 2026-10-12 using TinyFish public search, `location=MX`, no language filter, page 0. This is a country-targeted provider snapshot, not an independently measured Google Mexico rank report. Volumes/KD are user-supplied Semrush estimates and were not remeasured.

### Aesthetic Bio Maker — approved

Query: `aesthetic bio maker`. Ten results, predominantly English titles/snippets and tool/template intent. Examples in returned order:

1. <https://cuteinternet.com/aesthetic-bio>
2. <https://mx.pinterest.com/pin/35747390788460441/>
3. <https://aestheticbiomaker.com/>
4. <https://cute-symbol.com/zh/bio-maker>
5. <https://play.google.com/store/apps/details?id=com.joylee.aestheticbiomaker&hl=en>
6. <https://www.instagram.com/popular/cute-bio-generator/>
7. <https://emojicombos.com/aesthetic-bio-template>
8. <https://aestheticcombos.com/bio-generator/>
9. <https://postlinkapp.com/tools/instagram-bio-generator>
10. <https://adaptlypost.com/free-tools/ai-aesthetic-bio>

Also inspected the supplied reference <https://aestheticbiomaker.net/>. Existing repository Instagram Bio UI lets users enter four lines, transform the name's font and copy fixed templates. The new page generates three distinct wordings from structured details; it does not duplicate that converter. Use the English URL only; no duplicate Spanish URL or unsupported hreflang alternate is added.

### Personalized handwriting worksheet — deferred

Query: `ejercicios para mejorar la letra`. Eight returned results: two YouTube tutorials, two Pinterest collections, a practice booklet PDF and three instructional/resource articles. No direct personalized generator was returned in this snapshot. Leading sources:

- <https://www.youtube.com/shorts/K15D48FJvvQ>
- <https://www.capgeox.org/uploads/1/3/1/9/131934518/cuadernillo-para-mejorar-la-letra.pdf>
- <https://mariamorales.net/2021/10/06/24-ejercicios-para-mejorar-tu-letra-y-lettering-parte-1/>
- <https://www.guiainfantil.com/articulos/educacion/escritura/como-mejorar-la-mala-letra-de-los-ninos/>
- <https://www.educaciontrespuntocero.com/recursos/recursos-caligrafia-infantil-primaria/>

Inference: the supplied head query primarily asks for teaching/practice material; it has not passed the requested online-tool gate. Do not create the route, add links or claim PDF export testing. Reconsider with evidence for a generator-specific query and a confirmed target. Existing fixed practice sheets remain unchanged.

`letra s cursiva`, `letra hawaiana`, female/clan/duo nicknames and invisible-space tools are not created. No other owned domains were supplied for cross-domain comparison.

## Verification

- TypeScript, content validation, production build and build-output performance/SEO validation.
- Five new logic tests (Spanish accents and emoji, superscript digits, malformed color tags, empty/partial details, three distinct bios per mood, symbol-category integrity) and four existing GSC tests.
- Mobile browser smoke script extended for actual clipboard reads, ordered symbols, small-text styles, color preview, raw-code copying, HTML-as-text safety, bio editing/generation, empty input and SPA language restoration. Existing full-route, editor, converters and AdSense checks retained.
- Additional browser check for clipboard-denial feedback, mobile first-screen controls, static English language, canonical/H1 and generated noindex 404 artifact.
- No production dependency additions. Portable build cleanup replaces the existing shell-only `rm` with Node's built-in filesystem operation.

Compatibility caveat: previews are illustrative; neither Unicode acceptance nor color rendering is guaranteed across game versions. Length counters report code points and UTF-16 units, and the signature reference limit is explicitly user-editable rather than presented as an official game limit.
