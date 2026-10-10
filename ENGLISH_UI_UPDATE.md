# English Stage 1 — UI improvements

This update changes only the English learning chapter and its components.

## Changes

- Press Enter to check a text answer; Ctrl+Enter (or Cmd+Enter) checks multi-line Part C answers while normal Enter inserts a newline.
- Multiple-choice selections are checked on change, including selections made using the keyboard; native Enter remains available to open a dropdown.
- Per-exercise expand/collapse controls preserve entered answers and feedback.
- Chapter controls: Collapse all / Expand all, and Compact view On / Off.
- Native select options, text inputs, feedback, and buttons use AstroPaper light/dark theme colors.
- Previous incorrect feedback is cleared when an answer is edited.
- Test-score rules, lesson order, and unrelated site features have not been changed.

## Apply the patch

From the patch ZIP, copy the `src` and `scripts` folders into the *root of an up-to-date checkout* of `bacdevv/personal-website` (the directory containing `package.json`), merging and replacing the five changed/new English files and adding the test script. Do not delete existing folders or the `.git` directory.

## Validation

Successfully run in the offline environment:

- `node scripts/test-english-stage1.mjs`: 134 questions and original 50-point test pass.
- `node scripts/test-english-ui.mjs`: client-side TS source syntax and UI rules pass.
- `node scripts/test-linear-algebra-chapters.mjs`: 13 chapters pass.

Full `pnpm build` and visual browser testing remain unverified here because the package registry is unreachable. Cloudflare Pages should build the GitHub commit and will report any remaining issues.

## Deploy

Commit the changed files and push to the linked GitHub `main` branch. If Cloudflare Pages is connected to this branch, it will deploy automatically. Verify `/notes/english-stage-1/` in both light and dark themes, especially native selection menus on your Windows browser.
