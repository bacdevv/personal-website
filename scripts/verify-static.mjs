import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('dist');
if (!existsSync(root) || !existsSync(resolve(root, 'index.html'))) {
  console.error('Missing build output in dist/. Run pnpm.cmd build successfully before pnpm.cmd test:static.');
  process.exit(1);
}

const failures = [];
const files = [];
async function walk(dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = resolve(dir, ent.name);
    if (ent.isDirectory()) await walk(p);
    else files.push(p);
  }
}
await walk(root);
const htmls = files.filter(f => f.endsWith('.html'));

// These are real, published routes in the current source tree.
// The removed sample routes /blog/static-first and /notes/pca-centering
// must not be required by the test after content was unpublished.
const requiredRoutes = [
  '', 'about', 'projects', 'blog', 'notes', 'research', 'contact', 'search',
  'blog/java-oop-for-beginners', 'blog/python-lists-for-beginners',
  'projects/studyos',
  'notes/vectors', 'notes/matrices', 'notes/matrix-multiplication',
];
for (const route of requiredRoutes) {
  if (!existsSync(resolve(root, route, 'index.html'))) {
    failures.push(`Missing route: /${route}`);
  }
}

for (const f of htmls) {
  const html = await readFile(f, 'utf8');
  if ((html.match(/<h1\b/g) || []).length !== 1) failures.push(`Expected one h1: ${f}`);
  if (!/<title>.+?<\/title>/.test(html)) failures.push(`Missing title: ${f}`);
  if (!/name="description"/.test(html)) failures.push(`Missing description: ${f}`);
  if (!/rel="canonical"/.test(html)) failures.push(`Missing canonical: ${f}`);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const path = decodeURIComponent(match[1]);
    const target = resolve(root, '.' + path);
    if (!existsSync(target) && !existsSync(resolve(target, 'index.html')) && !existsSync(target + '.html')) {
      failures.push(`Broken local URL ${path} in ${f}`);
    }
  }
  for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]); }
    catch { failures.push(`Invalid JSON-LD: ${f}`); }
  }
}

for (const f of files.filter(f => /\.(html|xml|json|txt)$/.test(f))) {
  const text = await readFile(f, 'utf8');
  if (/DRAFT_ISOLATION_SENTINEL_8D2C|FUTURE_ISOLATION_SENTINEL_8D2C|Draft isolation fixture|Scheduled isolation fixture/.test(text)) {
    failures.push(`Unpublished content leaked: ${f}`);
  }
}
for (const path of ['blog/draft-check','blog/future-check','blog/mdx/mdx-example','notes/pca-centering']) {
  if (existsSync(resolve(root,path,'index.html'))) failures.push(`Unpublished/removed route generated: ${path}`);
}
for (const file of ['rss.xml','sitemap-index.xml','robots.txt','_headers','_redirects','pagefind/pagefind.js']) {
  if (!existsSync(resolve(root,file))) failures.push(`Missing output: ${file}`);
}
const css = files.filter(f => f.endsWith('.css'));
const js = files.filter(f => f.endsWith('.js') && f.replaceAll('\\','/').includes('/_astro/'));
const sizes = {
  htmlPages: htmls.length,
  cssFiles: css.length,
  jsFiles: js.length,
  cssBytes: (await Promise.all(css.map(f => stat(f)))).reduce((a,v) => a + v.size, 0),
  jsBytes: (await Promise.all(js.map(f => stat(f)))).reduce((a,v) => a + v.size, 0),
};
console.log(JSON.stringify({ passed: failures.length === 0, ...sizes, failures }, null, 2));
if (failures.length) process.exit(1);
