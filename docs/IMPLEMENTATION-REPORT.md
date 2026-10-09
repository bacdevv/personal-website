# Implementation report — 2026-10-09

**Scope**: runnable Python/Java code fences inside the blog, private Markdown writer at `/adminn`, zero new runtime/development dependencies, keep AstroPaper static, preserve responsive 880px design and SF Pro/SF Mono system fonts with Google fallbacks.

**Checks performed in this preparation environment**:

- `NODE_PATH=$(npm root -g) node scripts/test-fast-editor.mjs` — **passed**. Covers TypeScript syntax parsing for runner/API scripts, JWT RSA signature verification with generated keys, rejects incorrect emails/audiences/expired assertions/missing credentials, Unicode Markdown Base64 publishing, origin + slug guards, Github file retrieval, and wiring checks.
- `git diff --check` — **passed**.
- Patch applied cleanly to unmodified baseline in a fresh replay directory — **passed**.
- ZIP archive integrity test — **passed**.

**Not verified**:

- Full `pnpm build`, `pnpm test:static`, and live Chrome/Playwright end-to-end were **not run**: Node package installation couldn't resolve `registry.npmjs.org` in this environment (`EAI_AGAIN`). Run these in your development machine before deploying.
- Live authentication + GitHub publication require your Cloudflare Access configuration and GitHub token secret, and weren't executed against production services.
- No Lighthouse/performance measurements were made; no benchmark claims are made. The engineering implementation keeps main site static and loads editing/runtimes on demand, but real performance needs browser testing.

**Known limits**:

- First Python execution downloads the pinned Pyodide runtime and may take noticeable time. Java execution uses external OneCompiler and requires Internet. Input prompts for Python are not implemented. A Java snippet without `main(String[] args)` will remain a static code block.
- `/adminn` uses a basic safe preview (not full Astro MDX) and browser-local autosave; final rendering is performed by Astro in the site's normal static build.
- The GitHub backend operates only on root `src/content/posts/*.md`, not MDX source or other collections. No image upload from `/adminn` is implemented; insert previously hosted images or use Pages CMS for uploads.
