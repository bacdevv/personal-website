# Testing report

Test date: 2026-10-09 (Asia/Ho_Chi_Minh). Environment: Linux, Node 24.19.0, pnpm 11.25.0. The project declares Node >=22.12 and pins 22.16.0 for deployment; the actual test runner used Node 24.

## Verified locally

| Area | Executed check | Outcome |
| --- | --- | --- |
| Type safety | `pnpm check`, also part of `pnpm build` | Pass: zero errors and warnings |
| Static build | `pnpm build` | Pass: 28 HTML pages, 11 searchable content pages |
| Navigation/assets | `pnpm test:static` scans all generated HTML, route targets and local assets | Pass: no missing local targets |
| Metadata | Every generated HTML document checked for title, description, canonical; JSON-LD parsed | Pass |
| Syndication | Required RSS, sitemap index, robots and Cloudflare files checked | Pass |
| Search fragment cleanup | Seed obsolete public Pagefind fragment; rebuild; assert absent in both output and development copy | Pass |
| Draft safety | Draft/future sentinel fixtures scanned across HTML/XML/JSON/text; routes asserted absent | Pass |
| CMS content compatibility | `pnpm test:cms` builds CMS-shaped Markdown with timezone ISO dates, empty updated date, Unicode, tags and code | Pass |
| Publish/edit/draft cycle | Temporary published fixtures appear in routes/RSS, then edited drafts disappear from routes/RSS/sitemap | Pass |
| Pagination | Three temporary published posts plus four demo posts produce `/blog/2` | Pass |
| Uploaded image | Temporary PNG generates responsive WebP, dimensions and srcset in rendered Markdown | Pass |
| Responsive pages | Chromium/Playwright: 10 routes each at 1440×1000 and 390×1000 | All 20 returned HTTP 200; no horizontal overflow |
| Automated accessibility | axe-core WCAG 2 A/AA and 2.1 AA on those 20 route/viewport combinations | Zero violations in final run |
| Theme | Switch theme, reload, inspect persisted state | Pass |
| Code copying | Real clipboard write permission and button feedback | Pass: “Copied” |
| Math | Rendered KaTeX elements in PCA learning note | Pass |
| Search | Search “query” in built Pagefind index | Returns relevant results |
| JavaScript runtime | Collect Playwright `pageerror` events while navigating | None in final run |
| Visual review | Desktop and mobile home screenshots, article and dark-mode captures | Reviewed for clipping, spacing and readability |

Raw browser evidence is in `docs/testing/browser-smoke.json`. Pagefind tokenizes search queries and can return matches for an individual word (e.g. “draft” in a published code sample). The isolation criterion is the absence of unpublished URLs and bodies, not zero fuzzy matches for a phrase containing common words.

The browser harness used a minimal local HTTP server serving the real `dist` folder. The environment could not expose a preview server between isolated shell sessions, so server and browser were run in the same process scope. No hosted server performance is inferred from this.

## Preview/indexing policy

The default build is noindex. It emits robots `Disallow: /`, a robots meta directive and Cloudflare `X-Robots-Tag` headers. A production-mode local build uses `SITE_INDEXABLE=true` and `SITE_URL=http://localhost:4321` solely for Lighthouse/SEO checks. A build with `CF_PAGES_BRANCH=preview-check` and `SITE_INDEXABLE=true` was executed; metadata, robots and headers all remained noindex. The delivery build is restored to the safe default.

## Source handoff and account access

GitHub repository metadata was readable, but the attempted initial file write returned HTTP 403 `Resource not accessible by integration`. No source files were uploaded to the target repository. The delivered ZIP contains all source and reports; README gives safe local Git upload commands.

## Not executed / requires account access

- Pages CMS GitHub OAuth, its graphical editor interaction, actual hosted create/delete commits and image uploads.
- Cloudflare account connection, Git webhook auto-deployment, preview protection, custom DNS, HTTPS certificate and canonical-host redirects.
- Real-device Safari/Firefox testing, manual screen-reader testing, and a full WCAG conformance audit.
- Production Lighthouse, WebPageTest, and field Core Web Vitals/INP. Local Lighthouse evidence is separate.

Automated accessibility passing is useful evidence, not a full accessibility certification. CMS serialization tests validate the site-side contract, not the hosted OAuth service. These account-level checks are explicit launch steps rather than claimed successes.

## Reproduce

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm test:static
pnpm test:cms
pnpm build
```

`test:cms` creates temporary content and cleans its sources up even on failure. Rebuild afterward to regenerate an output that matches the restored source. Never run it alongside another build or against an active deployment.
