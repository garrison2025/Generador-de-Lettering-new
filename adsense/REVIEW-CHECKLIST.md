# AdSense site-quality review — GeneradorDeLettering.org

Date: 2026-10-07. Scope: code repository and publicly accessible pages. This checklist is **not** a Google policy finding or a guarantee of approval.

## Current status

As of 2026-10-08, the site owner reported that Google AdSense shows the site as **Ready** and ads.txt as **Authorized**. The site is now intentionally moving to **AdSense-only** monetization.

## Why the previous low-value result was plausible

The site has real original web tools and search traffic, but at the earlier audit time the following issues were visible:
- The owner's earlier AdSense **low-value content** rejections predated installation of Monetag and Adsterra. Their presence is **not** evidence that these networks caused the rejection. Advert placements may still warrant independent UX/policy review.
- Only five technical blog articles supported a site with a much larger number of tool/landing pages. The problem is **not** an official minimum article count: each content page must offer substantial original value.
- Some home-page claims were generic or unverified (such as "most-used tools" or "unique experience").
- Every blog card's topic label came from its array index, so several posts appeared incorrectly under "Gaming".
- AdSense verification was not exposed as a static `google-adsense-account` meta tag for non-consenting reviewers (the old script loaded only after opt-in and interaction). The site previously displayed an `ads.txt not found` status (last updated 2026-08-29) although the file is publicly reachable by 2026-10-07; recheck status in AdSense after recrawl.

## Implemented in this change

- Keep the static Google AdSense account meta, official async AdSense script and authorized `ads.txt`.
- Remove the legacy Monetag vignette and Adsterra social-bar integration at the owner's request after AdSense approval.
- Remove the obsolete local banner that existed only to gate those third-party ad loaders; use Google-compatible privacy/consent tooling for AdSense where required.
- Publish three authored, practical, tutorial-style resources: a Unicode compatibility experiment with a live codepoint inspector, a reproducible three-style image-design exercise, and a seven-session lettering worksheet/practice plan. The tutorials contain original illustrative assets, concrete examples and meaningful limitations.
- Label blog posts by actual subject, not by accidental visual array position.
- Improve the homepage's helpful navigation and replace unsupported popularity/superlative language.
- Include original guides in the sitemap and relevant internal navigation.

## Specialized landing-page originality check (2026-10-07)

Four low-traffic visual-editor landing pages previously rendered the same embedded editor with broadly
similar instructions. That is a plausible **thin / insufficiently differentiated content** risk, not
proof of Google's internal review decision. Their actual GSC performance for the last settled 28 days
was: Gothic 16 clicks / 399 impressions, Cursive 40 / 564, Tattoo 29 / 770, Instagram visual-editor 0 / 26.

In this release, each of those four existing URLs now includes **three distinct, editable starting
designs** (12 total). Every example has a specific use case, an explanation of why the design uses
those choices, and an objective check to make before export. Clicking an example applies its
font, text, colors and effects to the **real editor** above it. The existing SEO titles/H1/canonicals
and the GSC winner pages were not modified.

Audit follow-up: verify samples work on a small phone and offer genuinely useful outcomes. Do
not claim 12 examples or a specific article count automatically satisfies AdSense; continue
checking the quality, honesty and usefulness of the whole site.

## Required checks before requesting another review

1. **Deploy & fetch:** verify the new production commit was deployed; open the homepage, three new articles, the Unicode inspector, every main tool, `/robots.txt` and `/ads.txt` on mobile and desktop. Production issues cannot be inferred from passing GitHub tests alone.
2. **AdSense verification:** in AdSense > Sites, verify this exact domain and the chosen verification method. The static tag `google-adsense-account` and `ads.txt` must show the publisher ID of your OWN account. In AdSense click Verify / Check for updates as needed.
3. **AdSense consent:** if monetizing traffic in the EEA, UK and Switzerland, set up and test a **Google-certified TCF CMP** (e.g. via AdSense Privacy & messaging) before serving personalized ads there. The site's simple local consent banner is **not** a substitute for an approved CMP. Do not claim full regulatory compliance without validating your setup.
4. **Advertising vendors:** Google AdSense is now the only configured advertising network. Do not re-add Monetag, Adsterra or another ad loader unless the owner explicitly decides to change the monetization strategy.
5. **Audience trust:** verify `contacto@generadordelettering.org` is an actual monitored inbox. The contact form opens the visitor's own mail application; it is not a server-side form. Ensure content attribution, identity and privacy claims are accurate; do not invent personal author credentials, addresses or business certifications.
6. **Quality review:** manually open each indexable route and ask if it delivers the specific tool/tutorial promised. Avoid blank templates, scraped text, repetitive near-duplicate articles, SEO keyword stuffing or pages intended only to show ads. Preserve the current well-performing page Title/H1/Canonical experiments.
7. **Image & asset rights:** original educational SVG diagrams are generated in this repository. Review ownership/licensing of all other images, template assets and web fonts before implying they may be republished commercially.
8. **Crawl checks:** keep the site publicly accessible without a login, allow Mediapartners-Google and Google-Display-Ads-Bot, and review GSC indexation / errors. Do not request repeated reviews before Google can crawl changed content.
9. **Review decision:** submit a new AdSense review only after the above are done and earlier rejection's detailed policy text has been checked. Google can still reject for sitewide quality reasons; there is no published approval guarantee or fixed required article count.

## Official references

- [Make sure your site's pages are ready for AdSense](https://support.google.com/adsense/answer/7299563)
- [What to do when your site isn't ready to show ads](https://support.google.com/adsense/answer/12176698)
- [AdSense policy — site behavior and ad placement](https://support.google.com/adsense/answer/48182)
- [Google Publisher Policies — low-value and no-content screens](https://support.google.com/publisherpolicies/answer/11112688)
- [Connect your site to AdSense](https://support.google.com/adsense/answer/7584263)
- [AdSense CMP requirements](https://support.google.com/adsense/answer/13554116)

## Validation

Track GitHub Actions Quality workflow result for this PR. CI can prove code constraints and browser smoke performance; **it cannot make AdSense approval decisions**.
