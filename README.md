# Bac's personal website

A static developer portfolio, technical blog, learning notebook, and research journal built **from the official AstroPaper v6.1.0 release**. See [upstream provenance](docs/UPSTREAM.md). No database, paid API, account database, SSR adapter, or application backend is required.

Target repository: https://github.com/bacdevv/personal-website

**Source handoff:** This ZIP is the repaired source snapshot. It contains no `.git` history, build cache, `dist` or dependency folders. Copy its contents into your existing repository after backing up local changes.

**Deployment status:** This package has not been deployed. Run the validation commands before committing and letting your existing Cloudflare Pages integration deploy it.

## Start locally

Install Node.js **22.16+** (22 LTS recommended) and pnpm **11.25.0**.

```bash
cd personal-website
npm install -g pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm build
pnpm dev
```

Open http://localhost:4321. Building once creates the Pagefind index. Rebuild after editing content to refresh search; ordinary pages update automatically during development.

```bash
pnpm check        # Astro / TypeScript validation
pnpm build        # image processing, checks, static generation, Pagefind, headers
pnpm test:static  # routes, links, metadata, JSON-LD, unpublished-content isolation
pnpm preview     # serve the production output on port 4321
```

The build output is `dist/`. `pnpm build` uses cross-platform Node scripts, not Unix-only copy commands. The upstream compatible versions are locked in `pnpm-lock.yaml`; use `--frozen-lockfile` for reproducibility.

## Apply this repaired ZIP to your existing repository

1. Make a backup of your current `personal-website` folder (or make a Git commit of existing changes).
2. Extract the ZIP into a temporary folder. It contains a top-level `personal-website/` directory.
3. Copy the extracted **files and folders inside `personal-website`** into your existing repository of the same name, replacing matching source files. **Keep the existing `.git` directory on your computer** (it is intentionally not included in this ZIP).
4. Remove old generated `.astro/` and `dist/` directories if they exist (they will regenerate).
5. Run `pnpm.cmd install --frozen-lockfile`, then `pnpm.cmd build`, then `pnpm.cmd test:static`.
6. Inspect `git diff`, commit, and `git push origin main` only after these checks pass.

## Fonts and layout — Inter + Fira Code Retina

- **All interface text, headings and long-form notes:** Inter, self-hosted by Astro at build time.
- **Code, terminals and numerical labels:** Fira Code variable font at **450** weight (Retina), self-hosted by Astro.
- Only these two font families are configured in `astro.config.ts`. The font variables are selected in `src/styles/theme.css` and used in `src/styles/portfolio.css`.
- The enlarged Linear Algebra live demos and sticky learning sidebar are configured in `src/styles/study-reader.css`.
- You do not need SF/Apple font binaries, SF font scripts or locally generated font files.

## Pages and features

| Route | Purpose |
| --- | --- |
| `/` | Portfolio introduction, projects, writing, research and notes |
| `/about` | Configurable biography, interests, skills, and CV |
| `/projects`, `/projects/<id>` | Project listings and Markdown case studies |
| `/blog`, `/blog/2`, `/blog/<id>` | Paginated writing and articles |
| `/tags`, `/tags/<tag>` | Topic filters |
| `/notes`, `/notes/<id>` | Subject navigation and learning notes |
| `/research`, `/research/<id>` | Explicitly labeled research states |
| `/contact` | GitHub, email and optional LinkedIn |
| `/search` | On-demand local Pagefind search |
| `/archives`, `/rss.xml`, `/sitemap-index.xml` | Archive, syndication and sitemap |

Pagination routes appear only when there are more than six published posts. The old `/posts` URLs redirect on Cloudflare Pages. Code is highlighted with Shiki; copying, accessible theme switching, heading links, TOC, previous/next and related articles are included. KaTeX renders formulas during the build. All regular navigation uses native links.

## Personalize before launching

1. Edit `src/site.ts`: name, handle, intro/biography, academic details, interests, skills, GitHub, email, LinkedIn and CV path. Confirm your displayed name and skills. The initial name **Bac** comes from the supplied GitHub handle and is editable.
2. Add your real CV at `public/cv.pdf` and set `profile.cv` to `/cv.pdf`. Until then the UI explicitly says “CV · coming soon”; no fake CV is supplied.
3. Add an email to enable the `mailto:` link. University and location are deliberately unset.
4. Edit `astro-paper.config.ts` for site title, description, social sharing and pagination.
5. Change theme tokens in `src/styles/theme.css` for colors and radius. Current light/dark accents use muted green.
6. Replace demo posts/projects with verified personal work. All examples are labeled. No outcomes, employment, publications or benchmark gains are invented.
7. Replace `public/default-og.png` if desired. It is a local 1200×630 social card. Replace `public/favicon.svg` for the site mark.

UI is English; article content supports Vietnamese and English Unicode. The content and UI strings are separate, with AstroPaper's existing i18n utilities retained. No extra multi-language routing is imposed.

## Pages CMS: write without creating Markdown manually

1. Push this repository to GitHub (already provided URL above).
2. Visit https://app.pagescms.org and sign in with **your GitHub account**.
3. Authorize/install Pages CMS for **bacdevv/personal-website**, with the minimum repository scope you need.
4. Open that repository and the `main` branch. The root `.pages.yml` supplies the editor.
5. Choose **Blog posts (Markdown)** → create a post. Enter title, SEO description, publication datetime, tags and body. Upload an image through the editor if needed.
6. Keep **draft = true** to save a draft. New entries default to drafts.
7. To publish, choose a current/past date, set **draft = false**, and save.
8. Check the commit on GitHub. Then check Cloudflare's deployment log. A saved GitHub commit is **not yet a live post**; it becomes live only after a successful production build.
9. Open `/blog/<filename-without-extension>`, search for a phrase from the body, and verify RSS/sitemap.
10. Edit and save to update a post. Delete through CMS to remove the file; the next successful deployment removes the page. Add a redirect if an old public URL should remain useful.

Projects, learning notes and research entries also have graphical editors. The filename is the stable content identifier/slug. Avoid renaming published files; title edits should not change their filename. Dates use ISO 8601 with timezone; Astro coerces CMS strings into valid Date objects. Optional updated dates may be empty. Invalid required metadata stops the build instead of silently publishing broken content.

### Markdown versus MDX

Normal `.md` files live directly in `src/content/posts/` and use the rich-text editor. Complex `.mdx` files belong in `src/content/posts/mdx/` and use the separate **MDX — source editor only** entry. That entry deliberately has no structured fields or WYSIWYG body conversion. Keep imports, components and code intact. You can also use GitHub's source editor or a local editor. The sample MDX is a draft and does not ship as a public route.

KaTeX uses `$...$` and `$$...$$` in Markdown. If a rich-text editor changes custom syntax, use its source mode or GitHub source editing. Review the resulting commit before publishing technical content.

### Drafts and scheduling

Drafts and future posts are excluded from generated routes, public listings, search, RSS and sitemap. Merely hiding a link is not the mechanism. Publication filtering also applies in development. To privately preview a draft, use a branch and temporarily set its draft flag false; preview builds remain noindex. Do not merge that change until ready.

Future posts become available on the **next build after their date**, not on a running timer. Trigger a Cloudflare deployment at the desired time if you need scheduled publication.

Git-based drafts are not secrets in a **public repository**. Keep confidential notes outside this repo, or use a private repository and restrict preview access with Cloudflare Access. `noindex` is a crawler directive, not authentication.

### Images

CMS uploads are stored in `public/uploads` and referenced as `/uploads/...`. The build generates responsive WebP variants, dimensions, `srcset` and lazy loading for Markdown body images. Upload filenames are sanitized. Never upload secrets or oversized originals; originals remain downloadable in `public/uploads`.

Project covers support local image metadata or CMS upload paths. For custom MDX figures, use `src/components/Figure.astro` with an imported asset and a caption. Set `priority` for a genuine LCP image. Pure Markdown captions can use adjacent italic text; MDX figures provide semantic `<figcaption>`.

## Deploy to Cloudflare Pages — static Git integration

1. Sign in to https://dash.cloudflare.com. Open **Workers & Pages → Create → Pages → Connect to Git** (the dashboard may label this “Import an existing Git repository”). Choose Pages, not a Worker.
2. Authorize GitHub for `bacdevv/personal-website` and select the repository.
3. Set production branch **main** and root directory **/** (repository root).
4. Set framework preset **Astro**, build command **`pnpm build`**, output directory **`dist`**.
5. Set Node version **22.16.0** (`NODE_VERSION`) and pnpm **11.25.0** (`PNPM_VERSION`). The repository also pins them through `.node-version` and `packageManager`.
6. Initially set `SITE_INDEXABLE=false`. Deploy and copy the assigned `https://<project>.pages.dev` address. Do not guess the address from the repository name.
7. Set `SITE_URL` to that exact HTTPS URL and redeploy. Check canonical tags, social cards, sitemap and RSS.
8. Replace placeholder information, verify the site, then set **production** `SITE_INDEXABLE=true` and rebuild.
9. For **preview** environment variables set `SITE_INDEXABLE=false`, retaining the canonical production `SITE_URL`. The build also checks `CF_PAGES_BRANCH !== main` and emits both noindex metadata and an `X-Robots-Tag` header. Preview URLs therefore do not become alternate canonical sites.
10. Push a small article update to `main` and confirm automatic production deployment. A branch/PR should create a separate preview. No SSR adapter or Worker runtime is needed.

If the build environment doesn't enable pnpm automatically, use **`npm install -g pnpm@11.25.0 && pnpm install --frozen-lockfile && pnpm build`** as the build command. This is a build-time fallback, not a paid backend.

`SITE_URL` is mandatory before public indexing. Without it the fallback is `https://example.com`, and the site remains noindex. For local domain testing copy `.env.example` to `.env` and edit it; never commit `.env`.

### Custom domain, DNS, HTTPS and canonical redirects

1. Optional: check your current eligibility and domain offers at https://education.github.com/pack. Offers and renewal pricing change; no free domain is assumed. A `pages.dev` address needs no purchased domain.
2. Register your chosen domain. Review renewal pricing before accepting any promotion.
3. In the Pages project choose **Custom domains → Set up a custom domain** and follow Cloudflare's instructions. For an apex domain Cloudflare may require adding the zone and changing nameservers. For an externally managed subdomain use the CNAME target Cloudflare supplies.
4. Wait for the domain and TLS certificate to become active. Verify HTTPS before switching `SITE_URL`.
5. Set production `SITE_URL=https://your-canonical-domain` and rebuild. Sitemap, RSS, OG and canonical URLs use that one origin.
6. Configure a Cloudflare Redirect Rule to permanently redirect the noncanonical hostname (`www` versus apex) to the chosen host, preserving path and query. For the production `pages.dev` alias, use the Pages/Cloudflare redirect controls or a host-specific `_redirects` rule once the exact hostname is known. Do not redirect branch preview hosts blindly.
7. Test HTTP→HTTPS, alternate-host→canonical-host, a nested article URL, and query preservation. Submit the sitemap to Search Console if desired.

No deployment credentials or access tokens belong in frontend code or `.pages.yml`.

## Tests and reports

- [Testing report](docs/TESTING.md)
- [Performance report](docs/PERFORMANCE.md)
- [Remaining manual actions](docs/LAUNCH-CHECKLIST.md)
- [Official sources and upstream](docs/UPSTREAM.md)

Performance targets: Lighthouse performance/SEO/accessibility ≥95; field LCP ≤2.5s, CLS ≤0.1, INP ≤200ms. These are targets, not guarantees. Lab tests do not establish real-user INP. See the actual report for conditions and limitations.

## Fast interactive snippets and private writing at /adminn

The `/adminn` route (two **n** letters) has a native Markdown editor, basic live preview, browser-local draft autosave, Download .md, and optional authenticated GitHub publishing through Cloudflare Pages Functions. New articles default to **published**, not drafts. **Do not put a GitHub token in the browser.**

Runnable code fences in published articles stay static and lightweight until clicked. Python runs on-demand with a pinned Pyodide worker; Java opens a third-party OneCompiler editor only when clicked. No new editor framework or CMS backend is required for public pages.

**Setup/security/local preview:** [docs/ADMINN-AND-CODE-RUNNER.md](docs/ADMINN-AND-CODE-RUNNER.md). The Publish button needs Cloudflare Access and encrypted GitHub secrets; Download .md works without them.

## Maintenance

Keep the lockfile committed. Upgrade AstroPaper/Astro dependencies together after reading their migration notes. Run build and static checks before merging. Review Pages CMS commits, keep URLs stable, and periodically check external links. Content resides in Git, so revert a bad edit with a normal revert commit; Cloudflare can also roll back a deployment.

The MIT license from AstroPaper remains in `LICENSE`.


## Interactive Java examples inside blog posts

A complete Java fenced code block containing `static void main(String[] args)`
gets an **Edit & Run** button automatically. Example:

````md
```java
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, OOP!");
  }
}
```
````

- The existing syntax-highlighted code stays visible and lightweight until the
  reader clicks **Edit & Run**. The embedded Java editor replaces the snippet
  *in the same block*, with its own Run button and output.
- Java source is copied into the embedded editor via OneCompiler's documented
  `populateCode` event; the `.java` filename is derived from the public class
  name, so `public class Student` gets `Student.java`.
- Incomplete Java fragments (no `main`) stay as ordinary syntax-highlighted
  code blocks. Other languages are untouched.
- The reader may use **Back to snippet** to unload the iframe. Edits inside the
  third-party editor are not saved to GitHub or Pages CMS.
- **Privacy**: OneCompiler is an external code-execution service; do not submit
  credentials, secrets, or sensitive data. An internet connection is required.
- If Pages CMS changes Markdown syntax, keep the normal triple-backtick `java`
  code fence; no MDX components or special attributes are needed.
- A demo draft is at `src/content/posts/java-oop-for-beginners.md` with
  `draft: true`. For local preview only, change it to `draft: false`, run
  `pnpm dev`, visit `/blog/java-oop-for-beginners/`, then restore `draft: true`
  before publishing other changes.
