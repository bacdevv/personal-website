/** Private lightweight Markdown authoring UI. No rich-editor framework needed. */
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const form = $<HTMLFormElement>("adminn-form");
const title = $<HTMLInputElement>("adminn-title");
const slug = $<HTMLInputElement>("adminn-slug");
const description = $<HTMLTextAreaElement>("adminn-description");
const tags = $<HTMLInputElement>("adminn-tags");
const date = $<HTMLInputElement>("adminn-date");
const draft = $<HTMLInputElement>("adminn-draft");
const featured = $<HTMLInputElement>("adminn-featured");
const body = $<HTMLTextAreaElement>("adminn-body");
const existing = $<HTMLSelectElement>("adminn-existing");
const statusElement = $<HTMLElement>("adminn-status");
const preview = $<HTMLElement>("adminn-preview");
const saveButton = $<HTMLButtonElement>("adminn-publish");
const storageKey = "bacdev-adminn-autosave-v1";
let currentSha: string | undefined;

function localDate(value = new Date()) {
  return new Date(value.getTime() - value.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
function normalizeSlug(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
function fields() {
  return { title: title.value, slug: slug.value, description: description.value,
    body: body.value, tags: tags.value, pubDatetime: date.value,
    draft: draft.checked, featured: featured.checked, sha: currentSha };
}
function setStatus(message: string) { statusElement.textContent = message; }
function stash() { try { localStorage.setItem(storageKey, JSON.stringify(fields())); } catch { /* private mode */ } }
function restore() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    const value = JSON.parse(raw);
    title.value = value.title || "";
    slug.value = value.slug || "";
    description.value = value.description || "";
    tags.value = value.tags || "";
    date.value = value.pubDatetime || localDate();
    draft.checked = value.draft === true;
    featured.checked = value.featured === true;
    body.value = value.body || "";
    currentSha = value.sha;
  } catch { /* ignore damaged local draft */ }
}
function normalizeTags() {
  return [...new Set(tags.value.split(",").map(t => normalizeSlug(t).slice(0, 32)).filter(Boolean))].slice(0, 12);
}
function validateArticle() {
  if (!form.reportValidity()) return null;
  if (!body.value.trim() || !description.value.trim() || !title.value.trim()) {
    setStatus("Title, description and body are required."); return null;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.value)) {
    setStatus("Slug must contain lowercase letters, numbers and hyphens only."); return null;
  }
  const datetime = new Date(date.value);
  if (!Number.isFinite(datetime.getTime())) { setStatus("Invalid date."); return null; }
  return { ...fields(), title: title.value.trim(), description: description.value.trim(),
    body: body.value.trim(), pubDatetime: datetime.toISOString(), tags: normalizeTags() };
}
function markdown(data: NonNullable<ReturnType<typeof validateArticle>>) {
  const tagList = data.tags.length ? data.tags : ["others"];
  return `---\ntitle: ${JSON.stringify(data.title)}\ndescription: ${JSON.stringify(data.description)}\npubDatetime: ${data.pubDatetime}\ndraft: ${data.draft}\nfeatured: ${data.featured}\ntags:\n${tagList.map(tag => `  - ${tag}`).join("\n")}\n---\n\n${data.body}\n`;
}
function previewMarkdown(text: string) {
  // Deliberately safe: use textContent rather than inserting untrusted HTML.
  // Full Markdown/MDX and KaTeX rendering remains in Astro's article pipeline.
  const fragment = document.createDocumentFragment();
  const lines = text.split("\n");
  let inCode = false, codeLines: string[] = [], language = "";
  for (const line of lines) {
    const matchFence = line.match(/^\s*```\s*(\w*)/);
    if (matchFence) {
      if (inCode) {
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.textContent = codeLines.join("\n");
        pre.append(code);
        pre.title = `${language || "text"} code block`;
        fragment.append(pre); codeLines = []; inCode = false;
      } else { language = matchFence[1]; inCode = true; }
      continue;
    }
    if (inCode) { codeLines.push(line); continue; }
    if (!line.trim()) continue;
    const h = line.match(/^(#{1,4})\s+(.+)$/);
    if (h) {
      const element = document.createElement(`h${h[1].length}`);
      element.textContent = h[2]; fragment.append(element); continue;
    }
    const bullet = line.match(/^\s*[-*]\s+(.+)/);
    const element = document.createElement(bullet ? "li" : line.startsWith("> ") ? "blockquote" : "p");
    element.textContent = bullet ? bullet[1] : line.replace(/^>\s*/, "");
    fragment.append(element);
  }
  if (inCode) { const pre = document.createElement("pre"); pre.textContent = codeLines.join("\n"); fragment.append(pre); }
  preview.replaceChildren(fragment);
  if (!preview.firstChild) preview.textContent = "Nothing to preview yet.";
}

// A small frontmatter reader for articles saved by this editor or Pages CMS.
function importArticle(raw: string) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) { body.value = raw; return; }
  const meta = m[1];
  const get = (key: string) => {
    const value = meta.match(new RegExp(`^${key}:\\s*(.*)$`, "m"))?.[1]?.trim() || "";
    if (value.startsWith('"')) { try { return JSON.parse(value); } catch { return value; } }
    return value.replace(/^'|'$/g, "");
  };
  title.value = get("title");
  description.value = get("description");
  const rawDate = new Date(get("pubDatetime"));
  date.value = Number.isFinite(rawDate.getTime()) ? localDate(rawDate) : localDate();
  draft.checked = get("draft") === "true";
  featured.checked = get("featured") === "true";
  const tagSection = meta.match(/^tags:\s*\n((?:\s+-\s+[^\n]+\n?)*)/m)?.[1] || "";
  tags.value = tagSection.split("\n").map(s => s.replace(/^\s*-\s*/, "").trim()).filter(Boolean).join(", ");
  body.value = m[2].trim();
}

async function api(url: string, init: RequestInit = {}) {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store", ...init });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || `Request failed (${response.status})`);
  return result;
}
async function loadList() {
  try {
    const results = await api("/api/adminn/posts");
    for (const article of results.articles || []) {
      const option = document.createElement("option");
      option.value = article.slug; option.textContent = article.slug;
      existing.append(option);
    }
    setStatus("Ready. Your drafts are auto-saved in this browser; Publish creates a GitHub commit.");
  } catch {
    setStatus("Offline editing is available. To publish, set Cloudflare Access and GitHub secrets (see README). You can also Download .md.");
  }
}
existing.addEventListener("change", async () => {
  if (!existing.value) return;
  if (!confirm("Load this article? Your current editor state is auto-saved locally.")) return;
  try {
    setStatus("Loading article...");
    const article = await api(`/api/adminn/posts?slug=${encodeURIComponent(existing.value)}`);
    currentSha = article.sha;
    slug.value = article.slug;
    importArticle(article.content);
    stash();
    setStatus(`Editing ${article.slug}. Saving will update its existing GitHub file.`);
  } catch (error) { setStatus(String(error)); }
});
title.addEventListener("blur", () => { if (!slug.value) { slug.value = normalizeSlug(title.value); stash(); } });
form.addEventListener("input", stash);
$("adminn-new").addEventListener("click", () => {
  if (!confirm("Start a new article? Current changes are saved only as a browser draft.")) return;
  form.reset();
  currentSha = undefined; slug.value = ""; date.value = localDate(); draft.checked = false;
  existing.value = ""; stash(); setStatus("New article. Publish creates a new GitHub file.");
});
$("adminn-export").addEventListener("click", () => {
  const article = validateArticle(); if (!article) return;
  const file = new Blob([markdown(article)], { type: "text/markdown;charset=utf-8" });
  const href = URL.createObjectURL(file);
  const link = document.createElement("a"); link.href = href; link.download = `${article.slug}.md`;
  link.click(); window.setTimeout(() => URL.revokeObjectURL(href), 1000);
  setStatus("Markdown exported. You may upload it via GitHub or Pages CMS.");
});
$("adminn-preview-mode").addEventListener("click", () => {
  previewMarkdown(body.value);
  preview.hidden = false; body.hidden = true;
  $("adminn-preview-mode").setAttribute("aria-pressed", "true");
  $("adminn-edit-mode").setAttribute("aria-pressed", "false");
});
$("adminn-edit-mode").addEventListener("click", () => {
  preview.hidden = true; body.hidden = false;
  $("adminn-preview-mode").setAttribute("aria-pressed", "false");
  $("adminn-edit-mode").setAttribute("aria-pressed", "true");
});
form.addEventListener("submit", async e => {
  e.preventDefault();
  const article = validateArticle(); if (!article) return;
  saveButton.disabled = true;
  setStatus("Creating GitHub commit...");
  try {
    const saved = await api("/api/adminn/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(article) });
    currentSha = saved.sha;
    stash();
    const label = article.draft ? "Draft saved to GitHub" : "Published to GitHub";
    setStatus(`${label}. Cloudflare Pages will build this change next. ${saved.commit || ""}`);
    if (![...existing.options].some(x => x.value === article.slug)) {
      const option = document.createElement("option"); option.value = article.slug;
      option.textContent = article.slug; existing.append(option);
    }
    existing.value = article.slug;
  } catch (error) { setStatus(`Publish failed: ${String(error)}. Your local draft is preserved.`); }
  finally { saveButton.disabled = false; }
});

restore(); if (!date.value) date.value = localDate(); loadList();
