# Fast article editor and inline code runner

This project keeps every public AstroPaper page statically generated. No CMS server or persistent application database is needed.

## What changed

- `/adminn` is a **private authoring route** (note **two n's**). No `/admin` route has been created.
- The editor uses a native textarea, auto-saves to the current browser's localStorage, offers a safe basic preview, downloads a Markdown file, and can publish to GitHub via an authenticated Cloudflare Pages Function. New posts have **Draft unchecked by default**.
- Fenced `python` or `py` snippets in articles gain an **Edit & Run** button. The Python runtime is pinned to Pyodide `0.27.2`, loaded **after clicking Run** in a Web Worker; it never enters the main page bundle. The first run may be slow on a slow connection, because Python's WASM runtime must download. Stop extremely slow execution by navigating away; the runner enforces a timeout. `input()` is not supported in the simple runner.
- Complete `java` programs containing a `public static void main(String[] args)` gain **Edit & Run**. Java uses an **on-demand OneCompiler embed**. Java remains remotely executed; it is not run on Cloudflare. Don't enter sensitive values. The Java third-party UI may vary independently of this site.
- Code snippets without runnable Java entry points remain lightweight Shiki-highlighted code, and the public home page doesn't ship the editor runtime.

## Local preview, without publishing

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:4321/adminn` to write and **Download .md**. The private publishing API is not part of Astro's development server (`pnpm dev`); it runs through **Cloudflare Pages Functions** in Cloudflare Pages deployments or a local `wrangler pages dev` environment configured with the required secrets.

Preview a published blog article containing:

````markdown
```python
for i in range(3):
    print(i)
```

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java");
    }
}
```
````

The Java and Python editors appear only when a reader clicks **Edit & Run**. Python console output remains under the code. The Java editor is embedded inside the article.

## Secure GitHub publishing — production setup

**Important:** Do not publish a GitHub token in client-side JavaScript, `.env` committed to Git, Pages CMS metadata, HTML, or Cloudflare public variables.

1. Cloudflare Pages project `personal-website-blog` must use the regular Pages Git integration with a static build (`pnpm build`, output `dist`), and automatically discover the repository's root `functions/` directory. `astro build` alone doesn't run Pages Functions; the functions are deployed by Cloudflare Pages.
2. In **Cloudflare Zero Trust → Access → Applications**, create a **Self-hosted** application whose public hostname/path covers both `bacdev.tech/adminn*` and `bacdev.tech/api/adminn/*`. Restrict its Allow policy to **your email address**. Ensure both path patterns are covered; the admin UI is static, but the API also independently cryptographically validates an Access JWT. If separate applications are unavoidable, configure `CF_ACCESS_AUD` to the API application's audience.
3. In **Cloudflare Pages → personal-website-blog → Settings → Variables and Secrets** for **Production**, configure:
   - `CF_ACCESS_TEAM_DOMAIN`: e.g. `https://your-team.cloudflareaccess.com` (no path; the real Cloudflare Access team domain).
   - `CF_ACCESS_AUD`: the application's audience tag / Application AUD, from Cloudflare Access app details (use the API app's AUD if they are separate).
   - `ADMIN_EMAIL`: the exact email permitted to publish.
   - `GITHUB_TOKEN`: **encrypted secret**, a fine-grained GitHub PAT restricted to `bacdevv/personal-website` with repository **Contents: Read and write**. Use the minimum scope, store in Cloudflare secret storage, and rotate if exposed.
   - `GITHUB_BRANCH`: `main` (optional; defaults to `main`).
4. Also add an Access policy to the `pages.dev` preview or protect the preview environment; Pages Functions still reject missing/invalid tokens on unprotected aliases. Restrict your Preview environment secrets if the preview is public.
5. Redeploy after setting secrets; sign in to Access and open `https://bacdev.tech/adminn`. The top bar should say **Ready** rather than offline, and **Publish to GitHub** should make a commit. The new article will appear when the following Cloudflare static build succeeds and its `pubDatetime` is not in the future. If Draft is ticked, it remains unpublished.
6. Verify Cloudflare Deployment Logs and `https://bacdev.tech/blog/<slug>/`. Use the GitHub commit link in the editor's status to verify the write.

The API will **refuse** all requests until GitHub and Cloudflare Access variables are configured. It verifies the Cloudflare Access JWT's RSA signature, issuer, audience, expiration, and your exact admin email; it also rejects cross-origin POSTs and invalid paths. It only writes under `src/content/posts/*.md` in the fixed repository. Concurrency is protected using the GitHub file SHA.

## Edit posts from GitHub / Pages CMS

After production setup, the **Existing articles** dropdown lists root Markdown files. Selecting one fetches the current source and GitHub SHA so saving updates it rather than overwriting blindly. Avoid changing the slug of an existing article; it creates a new article URL. MDX source files are deliberately managed in GitHub/Pages CMS, not through this Markdown editor.

The in-browser preview is intentionally basic and uses safe DOM text nodes. Published code highlighting, math, tables, images, and page SEO are rendered by Astro on build; use the blog page as the final preview.

## Common issues

- `403 Unauthorized`: Cloudflare Access missing, `CF_ACCESS_AUD` mismatch, wrong admin email, or secret not configured. For local authoring use Download .md.
- `409 Conflict`: Another GitHub commit changed the file. Reload the article from **Existing articles**, review changes, then try again. The API will never force overwrite.
- `Publish succeeded, article missing`: ensure `draft: false` and `pubDatetime` is now or past, and the subsequent deployment is Success.
- Python editor missing: only fenced code blocks labeled `python` or `py` are enhanced. Page rendering is static until clicked.
- Java editor missing: use a complete Java program with `static void main(String[] args)`. Partial examples stay static.
- Offline / CORS / blocked third-party scripts: Pyodide and OneCompiler require an Internet connection to start. No external runtime is loaded on the blog's initial page render.

## Checks before deploying

```powershell
pnpm build
pnpm test:static
```

The first production build with fonts needs network access; verify actual Pages build logs and test both Run buttons in a browser after deployment. The server-side authoring API needs manual Cloudflare Access and GitHub secret configuration; its presence in source does not grant access by itself.

Run the dependency-light API and syntax checks with `pnpm test:editor` after installing dependencies. See `docs/IMPLEMENTATION-REPORT.md` for test coverage and limitations.
