# Inter + Fira Code Retina and larger Linear Algebra learning demos

This snapshot uses **Inter** for the entire website UI and article text, and **Fira Code (450 / Retina)** for code and math demo numerical inputs. Both families are self-hosted by Astro via the Google font provider during the build. No SF Pro, SF Mono, Montserrat, Anton or JetBrains Mono font files are required.

## Windows: install and verify

```powershell
cd C:\Users\vietb\Downloads\personal-website
pnpm.cmd install --frozen-lockfile
pnpm.cmd build
pnpm.cmd test:static
pnpm.cmd dev
```

Check the computed `font-family` in Chrome DevTools. Code snippets should use Fira Code at weight 450. Text, headings and logo use Inter.

## Live demo sizing

`src/styles/study-reader.css` sets the desktop article/demo grid (up to 450px demo width) and enlarges numerical labels, controls, tables and matrix cells. Under 1150px viewport width the layout becomes a single column. No additional graphics library is needed for SVG demos.

## Static route testing

`scripts/verify-static.mjs` checks routes that actually exist in this snapshot, including the three published Linear Algebra chapters. The old sample pages `blog/static-first` and `notes/pca-centering` are no longer required. Only run this test after a successful `pnpm.cmd build`.
