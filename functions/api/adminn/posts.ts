import type { AdminEnv } from "../../../src/server/adminAuth";

type Ctx = { request: Request; env: AdminEnv };
const owner = "bacdevv";
const repo = "personal-website";
const dir = "src/content/posts";
const filenamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
const reply = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers });

async function github(env: AdminEnv, path: string, init: RequestInit = {}) {
  return fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    ...init,
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "BacDev-Adminn",
      ...(init.headers || {}),
    },
  });
}

// Works for Unicode; avoid btoa's Latin-1 limitation.
function encode64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let result = "";
  for (let start = 0; start < bytes.length; start += 8192) {
    result += String.fromCharCode(...bytes.subarray(start, start + 8192));
  }
  return btoa(result);
}
function decode64(value: string) {
  const bytes = Uint8Array.from(atob(value.replace(/\s/g, "")), c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
function goodSlug(slug: string) { return slug.length <= 80 && filenamePattern.test(slug); }
function branch(env: AdminEnv) { return env.GITHUB_BRANCH || "main"; }

export const onRequestGet = async ({ request, env }: Ctx) => {
  const slug = new URL(request.url).searchParams.get("slug");
  if (slug !== null && !goodSlug(slug)) return reply({ error: "Invalid article slug." }, 400);
  const path = slug ? `${dir}/${slug}.md` : dir;
  const upstream = await github(env, `${path}?ref=${encodeURIComponent(branch(env))}`);
  if (!upstream.ok) return reply({ error: upstream.status === 404 ? "Article not found." : "GitHub could not load articles." }, upstream.status === 404 ? 404 : 502);
  const data = await upstream.json() as any;
  if (!slug) return reply({ articles: (Array.isArray(data) ? data : []).filter((f: any) => f.type === "file" && /^[a-z0-9-]+\.md$/.test(f.name)).map((f: any) => ({ slug: f.name.slice(0, -3), sha: f.sha })) });
  if (data.encoding !== "base64" || typeof data.content !== "string") return reply({ error: "Unexpected GitHub response." }, 502);
  return reply({ slug, sha: data.sha, content: decode64(data.content) });
};

const yaml = (value: string) => JSON.stringify(value); // Valid YAML double-quoted strings
export const onRequestPost = async ({ request, env }: Ctx) => {
  const origin = new URL(request.url).origin;
  if (request.headers.get("Origin") !== origin || !request.headers.get("Content-Type")?.startsWith("application/json")) return reply({ error: "Invalid request origin or content type." }, 403);
  if (Number(request.headers.get("Content-Length") || 0) > 160000) return reply({ error: "Article too large." }, 413);
  let data: any;
  try {
    const body = await request.text();
    if (body.length > 160000) return reply({ error: "Article too large." }, 413);
    data = JSON.parse(body);
  } catch { return reply({ error: "Invalid request body." }, 400); }
  const { slug, title, description, body, tags, featured, draft, pubDatetime, sha } = data || {};
  if (typeof slug !== "string" || !goodSlug(slug) || typeof title !== "string" || title.trim().length < 3 || title.length > 160 || typeof description !== "string" || !description.trim() || description.length > 300 || typeof body !== "string" || !body.trim() || body.length > 100000 || !Array.isArray(tags) || tags.length > 12 || tags.some((tag: unknown) => typeof tag !== "string" || !/^[a-z0-9-]{1,32}$/.test(tag)) || typeof featured !== "boolean" || typeof draft !== "boolean" || typeof pubDatetime !== "string" || !Number.isFinite(Date.parse(pubDatetime)) || (sha !== undefined && (typeof sha !== "string" || !/^[0-9a-f]{40}$/.test(sha)))) {
    return reply({ error: "Invalid fields. Check title, slug, description, date, tags, and body." }, 400);
  }
  const md = `---\ntitle: ${yaml(title.trim())}\ndescription: ${yaml(description.trim())}\npubDatetime: ${new Date(pubDatetime).toISOString()}\ndraft: ${draft}\nfeatured: ${featured}\ntags:\n${(tags.length ? tags : ["others"]).map((tag: string) => `  - ${tag}`).join("\n")}\n---\n\n${body.trim()}\n`;
  const path = `${dir}/${slug}.md`;
  const upstream = await github(env, path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: `${sha ? "Update" : "Publish"} post: ${slug}`, branch: branch(env), content: encode64(md), ...(sha ? { sha } : {}) }),
  });
  if (!upstream.ok) return reply({ error: upstream.status === 409 || upstream.status === 422 ? "GitHub rejected the change. The article may already exist or have been updated: reload it first." : `GitHub publish failed (HTTP ${upstream.status}).` }, upstream.status === 409 || upstream.status === 422 ? 409 : 502);
  const saved = await upstream.json() as any;
  return reply({ success: true, slug, sha: saved.content?.sha, commit: saved.commit?.html_url, draft }, sha ? 200 : 201);
};
