# Linear Algebra — Chapters 1–13 QA

## Scope

- Existing chapters revised: 1–4 (Vectors, Matrices, Matrix Multiplication, Matrix Rank).
- New chapters: 5–13 (Matrix Spaces; Solving Systems; Determinant; Inverse; Projections and Orthogonalization; Least Squares; Eigendecomposition; SVD; Quadratic Forms).
- Source chapter lessons: 7–106, 108–170. There is no lesson 107 in the supplied inverse section and no Bonus Section 16 transcript.
- Chapter notes use concise English, without referring to the source as "this transcript".
- The original Digital Image Processing, Blog, CMS, and Python runner have not been modified in this update.

## Verified in the working environment

| Check | Result |
| --- | --- |
| Source Markdown | 13 files with 163 numbered lesson headings in sequence |
| Display equations | 263 parsed with MathJax, no errors |
| Inline math | 576 expressions parsed with MathJax, no errors |
| Display math delimiters and braces | Balanced |
| Static SVG assets | Valid XML |
| Nine new NumPy code samples | 9 / 9 executed |
| Existing vector math unit test | Passed |
| TypeScript files for math demos | TypeScript compiler check passed |
| Chapter coverage script | `node scripts/test-linear-algebra-chapters.mjs`: passed |
| Full Astro production build | Not run: project dependencies not installed in this isolated environment |
| Browser E2E visual/interaction test | Not confirmed: headless Chromium did not complete |

MathJax syntax validation does not guarantee pixel-identical rendering by KaTeX. Preview every page locally before publishing.

## Not yet claimed complete

Each lesson in Chapters 5–13 has a concise core explanation and formula, but these are study notes, not a full transcription of every spoken example. The new chapters feature one interactive core mathematical explorer each, with contextual states for some subtopics; not every numbered lesson has a distinct full simulation. Further depth and demonstration variants can be added as the course progresses.

## Verify on Windows

```powershell
cd "$HOME\Downloads\personal-website"
pnpm.cmd build
pnpm.cmd test:static
pnpm.cmd test:editor
pnpm.cmd test:linear
pnpm.cmd dev
```

Check all `/notes/` chapter routes, LaTeX, SVG labels, light/dark contrast and the closed-by-default Live Demo, including opening it after scrolling into a different numbered lesson.
