# AstroPaper-style typography and reading tools (current)

The theme colors remain AstroPaper's Paper Light / Paper Dark II. Both Inter and Fira Code are self-hosted by Astro's font API; no new fonts or JavaScript dependencies are needed.

## Typography

- Site-wide content max-width: **768px**, matching AstroPaper's `max-w-3xl`.
- Body and paragraphs: **Inter 16px**, generous 1.7–1.75 line-height.
- Code, numeric inputs and code-output widgets: **Fira Code Retina (weight 450)**.
- H1 page headings: ~30–38px; H2 headings in articles: 24px; H3: 20px; navigation and metadata follow a smaller, consistent scale.
- Paragraphs in main content are **justified** and can hyphenate when supported by the browser/language. Controls, live experiments, code blocks and formulas remain left-aligned or otherwise natively aligned.

## Right-side reading tools

The table of contents is **collapsed by default**, exposed by the fixed `Contents` button on the right of notes, project pages, and blog posts that have headings. A second `Live demo` button appears on Linear Algebra chapters that contain an interactive demo. Buttons, panel headings and the close control are always part of the page; the drawer opens only when clicked, never merely because the page was scrolled.

On desktop, the drawer is a fixed, scrollable panel up to 440px wide. On mobile, the drawer stays within the viewport and adds a dim backdrop. Use `Esc`, the close button, the backdrop (mobile), or a TOC link to close. The currently viewed section and the Notes reading-progress bar still update even with the drawer closed.

Implementation files:
- `src/components/ReadingDrawer.astro` — TOC and demo slots
- `src/scripts/studyReader.ts` — interaction and progress logic
- `src/styles/study-reader.css` — fixed drawer styling
- `src/layouts/ContentPage.astro` and `src/pages/blog/[...slug]/index.astro` — placement
- `src/styles/global.css` and `src/styles/portfolio.css` — site-wide typography

## Local checks

```powershell
pnpm.cmd build
pnpm.cmd test:static
pnpm.cmd dev
```

The ZIP does not contain `dist`, `.astro`, `.git`, `node_modules`, or secret files. The included root-level `APPLY-TO-EXISTING.ps1` backs up and replaces only the relevant design files; it preserves your current Git history and article content. Never `git reset --hard` to apply this update.
