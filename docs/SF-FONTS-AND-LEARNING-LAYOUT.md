# SF Pro Display + SF Mono / Larger Linear Algebra demos

This update uses **SF Pro Display** for all interface and article text (including headings, not Anton), and **SF Mono** for code, inline code, terminals and math-demo numerical controls. Color themes, markup and Shiki syntax highlighting are unchanged. It also enlarges the sticky learning sidebar to approximately 400–450 px, SVG coordinates, matrix inputs, TOC links and article tables.

No font files are included in the source patch or ZIP. The owner-supplied Apple font binaries remain entirely on the user's computer unless they choose to deploy them. **Apple SF font terms may restrict embedding and redistribution on public websites**. Confirm that you have rights to host the supplied fonts before committing files under `public/fonts/` to public GitHub or Cloudflare. If unsure, use licensed web fonts instead.

## One-time setup (Windows PowerShell)

Put these originals in your Downloads folder:

- `SF Pro Display.zip`
- `SFMonoLigaturized-Regular.ttf`
- `SFMonoLigaturized-Medium.ttf`
- `SFMonoLigaturized-RegularItalic.ttf`
- `SFMonoLigaturized-MediumItalic.ttf`

Open PowerShell in the repository root:

```powershell
py -m pip install fonttools brotli
py scripts/install-sf-fonts.py
pnpm.cmd build
pnpm.cmd test:static
pnpm.cmd dev
```

`python` can replace `py` if that's the installed Python command. The converter creates **eight compact WOFF2 files** in `public/fonts`, retaining Vietnamese glyphs and common mathematical symbols. No external font download is made. With the needed files present, the website does not request Google Fonts at runtime or at build time.

After checking the font licensing and confirming a successful build, add the code files and locally generated webfonts as appropriate, commit and push. If Cloudflare builds without these WOFF2 files, browsers will fall back to their system fonts (and the font request returns 404).

For demo sizing, edit `src/styles/study-reader.css`: `.study-columns` controls article and demo widths; `.study-sidebar .la-learning-lab ...` controls table cells, captions, labels and SVG sizes. The mobile breakpoint is 1150 px to protect the article width.
