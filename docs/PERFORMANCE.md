# Performance report

Measured on 2026-10-09. These are **real local mobile Lighthouse runs against the generated static site**, not Cloudflare production measurements or guaranteed future scores.

## Conditions

- Lighthouse 13.5.0; headless Chromium 153.0.8010.0 on Linux.
- Mobile viewport 412×823, device scale 1.75; Lighthouse simulated mobile throttling.
- RTT 150 ms, throughput 1638.4 Kbps, CPU slowdown 4× (full settings recorded in raw JSON).
- Local HTTP server, loopback origin `http://localhost:4321`; `SITE_INDEXABLE=true` for SEO testing. No CDN compression/cache behavior is inferred from this server.
- One valid recorded run per route, not a statistical median. A few initial runs lacked Chrome screenshot traces and could not produce a performance score; those were rerun after browser warmup. Null scores were not treated as zero or fabricated into successful results.
- Header accessible name and project heading order were fixed before the final applicable measurements.

## Recorded results

| Route | Performance | Accessibility | SEO | LCP | CLS | TBT | Evidence |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `/` | 100 | 100 | 100 | 1.05 s | 0 | 0 ms | [HTML report](performance/lighthouse-home.html) |
| `/blog` | 100 | 100 | 100 | 1.05 s | 0 | 0 ms | [HTML report](performance/lighthouse-blog.html) |
| `/blog/static-first` | 100 | 100 | 100 | 1.50 s | 0 | 0 ms | [HTML report](performance/lighthouse-blog-static-first.html) |
| `/projects` | 100 | 100 | 100 | 1.05 s | 0 | 0 ms | [HTML report](performance/lighthouse-projects.html) |
| `/notes` | 100 | 100 | 100 | 1.05 s | 0 | 0 ms | [HTML report](performance/lighthouse-notes.html) |

Best Practices scored 100 on all five recorded routes. All five meet the requested lab score targets in this environment. Full Lighthouse JSON and standalone HTML reports are in `docs/performance/`.

**INP is not measured here.** TBT is a lab metric, not a substitute for real-user INP. Real-world LCP/CLS/INP require production observation, devices and traffic. WebPageTest and production Lighthouse were not run because no production deployment exists yet.

## Generated page asset sizes

KiB means 1024 bytes. CSS and JavaScript columns show raw / gzip bytes for unique referenced files plus inline application JavaScript. JSON-LD is excluded from JavaScript execution size. Gzip is an offline size calculation, not a claim that the local server compressed responses.

| Route | HTML KiB | CSS raw / gzip KiB | Application JS raw / gzip KiB |
| --- | ---: | ---: | ---: |
| `/` | 10.2 | 54.6 / 10.5 | 1.3 / 0.6 |
| `/blog` | 20.6 | 54.6 / 10.5 | 1.3 / 0.6 |
| `/blog/static-first` | 21.4 | 84.2 / 18.6 | 2.0 / 0.8 |
| `/projects` | 7.1 | 54.6 / 10.5 | 1.3 / 0.6 |
| `/notes` | 7.4 | 54.6 / 10.5 | 1.3 / 0.6 |

Pagefind's UI and search index are loaded only on `/search`; the normal homepage and articles do not import them. Search's on-demand bundle must be considered separately from ordinary article budgets. KaTeX is rendered at build time; its local CSS/font assets are used for mathematical content. No third-party font requests, application framework hydration, or analytics scripts are required.

Initial budgets for ordinary non-search pages: application JS ≤6 KiB raw; CSS ≤120 KiB raw / 25 KiB gzip; zero render-blocking third-party scripts. See the table for actual sizes. The main remaining CSS optimization opportunity is splitting math styling more finely for articles without equations. The valid scores already meet the target; future content/images can change that.

## Production follow-up

1. Deploy with the real canonical `SITE_URL` and production indexing enabled only when ready.
2. Run mobile Lighthouse on home, blog listing, article, projects and notes, three times each; report median and range.
3. Confirm Cloudflare compression, immutable caching for hashed `_astro` assets, and correct preview noindex headers.
4. Test on a real phone and a slower network. Collect field Core Web Vitals when traffic is sufficient.
5. Repeat after adding real hero/project images or third-party widgets.

Example command after installing Lighthouse and Chrome locally:

```bash
npx lighthouse https://YOUR-DOMAIN/ --only-categories=performance,accessibility,best-practices,seo --output=html --output=json --output-path=./home-audit
```

Do not report these local results as production measurements. Default/preview builds intentionally have noindex and therefore should not be expected to score 100 for indexability.
