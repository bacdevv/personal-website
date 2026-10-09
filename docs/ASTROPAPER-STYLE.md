# AstroPaper-style refresh

Reference: https://astro-paper.pages.dev/ and the official upstream source
https://github.com/satnaing/astro-paper (MIT license; kept in `LICENSE`).

This version deliberately follows the original blog-first layout:
- Single column, reading width approximately 768px instead of a wide SaaS grid.
- Minimal header with text navigation, icons for archives/search/theme.
- Intro, Featured, Recent Posts, and All Posts on the home page.
- Projects, learning notes and research are retained as additional plain-text sections.
- Original-inspired light palette `#fdfdfd / #282728 / #006cac` and dark
  palette `#212737 / #eaedf3 / #ff6b01`.
- A monospace/system font stack is used in place of a remote font; this keeps
  font loading free of extra HTTP requests. Therefore the typography is similar,
  but is not a pixel-perfect copy of Google Sans Code used in the original.
- No new databases, npm packages, client frameworks or CMS changes.

## Customize

- Profile, social links: `src/site.ts`
- Theme colors and font: `src/styles/theme.css`
- Layout spacing and responsive header: `src/styles/portfolio.css`
- Homepage editorial sections: `src/pages/index.astro`
- Navigation: `src/components/Header.astro`

Keep `.pages.yml`, `src/content.config.ts`, all content, and `SITE_URL` /
`SITE_INDEXABLE` production settings. No DNS changes or database migration.

## Deploy

`pnpm install --frozen-lockfile && pnpm build && pnpm test:static`

Push changes to `main` of your `bacdevv/personal-website` GitHub repository;
Cloudflare Pages will deploy automatically if Git integration is enabled.
Validate home, /blog, /projects, /notes, /research, /search and theme/mobile menu.

This environment did not have dependencies installed and could not reach npm,
so production compilation and live visual comparison must be performed in your
Cloudflare build environment. Do not treat a source-format check as a build pass.
