# AdSense site-quality review — GeneradorDeLettering.org

Date: 2026-10-07. Scope: code repository and publicly accessible pages. This checklist is **not** a Google policy finding or a guarantee of approval.

## Why the previous result is plausible

The site has real original web tools and search traffic, but at audit time the following issues were visible:
- `index.html` loaded **Monetag vignette** and **Adsterra social-bar** scripts after cookie consent; those formats can obscure original content or interfere with navigation depending on what they show. Such behavior carries avoidable policy and user-experience risk.
- Only five technical blog articles supported a site with a much larger number of tool/landing pages. The problem is **not** an official minimum article count: each content page must offer substantial original value.
- Some home-page claims were generic or unverified (such as "most-used tools" or "unique experience").
- Every blog card's topic label came from its array index, so several posts appeared incorrectly under "Gaming".
- AdSense verification was not exposed as a static `google-adsense-account` meta tag for non-consenting reviewers (the old script loaded only after opt-in and interaction).

## Implemented in this change

- Remove third-party vignette/social-bar loaders and their advertising metadata; retain Google AdSense publisher verification and `ads.txt`.
- Maintain opt-in behavior for the AdSense advertising script; never silently force ad cookies for site review.
- Update consent and privacy explanations to match the implementation.
- Publish three authored, practical, tutorial-style resources: a Unicode compatibility experiment with a live codepoint inspector, a reproducible three-style image-design exercise, and a seven-session lettering worksheet/practice plan. The tutorials contain original illustrative assets, concrete examples and meaningful limitations.
- Label blog posts by actual subject, not by accidental visual array position.
- Improve the homepage's helpful navigation and replace unsupported popularity/superlative language.
- Include original guides in the sitemap and relevant internal navigation.

## Required checks before requesting another review

1. **Deploy & fetch:** verify the new production commit was deployed; open the homepage, three new articles, the Unicode inspector, every main tool, `/robots.txt` and `/ads.txt` on mobile and desktop. Production issues cannot be inferred from passing GitHub tests alone.
2. **AdSense verification:** in AdSense > Sites, verify this exact domain and the chosen verification method. The static tag `google-adsense-account` and `ads.txt` must show the publisher ID of your OWN account. In AdSense click Verify / Check for updates as needed.
3. **AdSense consent:** if monetizing traffic in the EEA, UK and Switzerland, set up and test a **Google-certified TCF CMP** (e.g. via AdSense Privacy & messaging) before serving personalized ads there. The site's simple local consent banner is **not** a substitute for an approved CMP. Do not claim full regulatory compliance without validating your setup.
4. **Competing ad networks:** temporarily disabled. Do **not** re-enable pop-unders, deceptive navigation, social bars or other intrusive overlays; monitor each third-party provider before making any future monetization changes.
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
