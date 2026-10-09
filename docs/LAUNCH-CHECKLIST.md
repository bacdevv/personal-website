# Remaining manual actions

- [ ] Upload the delivered ZIP source to GitHub (the integration returned HTTP 403; see README commands).
- [ ] Confirm the displayed name, biography, skills and university in `src/site.ts`.
- [ ] Supply email/LinkedIn as desired; add the real CV and set its path.
- [ ] Replace or remove labeled demonstration content and project placeholders.
- [ ] Authorize Pages CMS for `bacdevv/personal-website`.
- [ ] In the hosted CMS, create → draft → publish → edit → delete a disposable test article. Verify GitHub commits and media uploads.
- [ ] Connect the GitHub repository to Cloudflare Pages with production branch `main`, `pnpm build`, output `dist`.
- [ ] Set the real `SITE_URL`, Node/pnpm versions and environment-specific `SITE_INDEXABLE` values.
- [ ] Verify a successful deployment, public route, search result, RSS and sitemap after CMS publishing.
- [ ] Confirm preview noindex headers and metadata; use Cloudflare Access if privacy is required.
- [ ] Optional: verify current GitHub Student domain eligibility and renewal fees.
- [ ] Optional: configure custom domain/DNS, wait for HTTPS, and test canonical host redirects.
- [ ] Run Lighthouse on the real production origin; collect field Core Web Vitals when traffic is sufficient.
- [ ] Enable production indexing only after replacing placeholders and confirming the canonical domain.

No paid backend is needed. OAuth, domain ownership and account connection cannot be substituted with configuration files.
