import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ts = require("typescript");
async function importTS(path) {
  const compiled = ts.transpileModule(readFileSync(path, "utf8"), {
    fileName: path,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    reportDiagnostics: true,
  });
  assert.equal((compiled.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0, `TS syntax: ${path}`);
  return import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString("base64")}`);
}
const { checkAdminAccess } = await importTS("src/server/adminAuth.ts");
const { onRequestGet, onRequestPost } = await importTS("functions/api/adminn/posts.ts");
for (const path of ["src/scripts/inlineJavaRunner.ts", "src/scripts/pythonRunner.worker.ts", "src/scripts/adminn.ts", "functions/api/adminn/_middleware.ts"]) {
  const parsed = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
  assert.equal(parsed.parseDiagnostics.length, 0, `Syntax error in ${path}`);
}
assert.match(readFileSync("src/pages/adminn.astro", "utf8"), /id="adminn-publish"/);
assert.match(readFileSync("src/pages/blog/[...slug]/index.astro", "utf8"), /inlineJavaRunner/);
assert.match(readFileSync("astro.config.ts", "utf8"), /data-language/);

const keyPair = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
const jwk = { ...await crypto.subtle.exportKey("jwk", keyPair.publicKey), kid: "test-key" };
const b64url = input => Buffer.from(input).toString("base64url");
async function token(payload) {
  const h = b64url(JSON.stringify({ alg: "RS256", kid: jwk.kid, typ: "JWT" }));
  const p = b64url(JSON.stringify(payload));
  const signed = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", keyPair.privateKey, new TextEncoder().encode(`${h}.${p}`));
  return `${h}.${p}.${Buffer.from(signed).toString("base64url")}`;
}
const env = { GITHUB_TOKEN: "test-only", CF_ACCESS_TEAM_DOMAIN: "https://myteam.cloudflareaccess.com", CF_ACCESS_AUD: "aud-123", ADMIN_EMAIL: "author@example.com" };
const now = Math.floor(Date.now() / 1000);
const claims = { aud: [env.CF_ACCESS_AUD], iss: env.CF_ACCESS_TEAM_DOMAIN, email: env.ADMIN_EMAIL, exp: now + 300, iat: now };
let requestCount = 0;
const originalFetch = globalThis.fetch;
globalThis.fetch = async url => {
  requestCount++;
  assert.equal(url, `${env.CF_ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`);
  return new Response(JSON.stringify({ keys: [jwk] }), { status: 200 });
};
try {
  const validJwt = await token(claims);
  const req = new Request("https://bacdev.tech/api/adminn/posts", { headers: { "Cf-Access-Jwt-Assertion": validJwt } });
  assert.equal(await checkAdminAccess(req, env), true);
  assert.equal(requestCount, 1, "JWKS fetched once");
  assert.equal(await checkAdminAccess(req, env), true, "cached JWKS works");
  assert.equal(await checkAdminAccess(new Request(req.url), env), false, "missing token rejected");
  const impostor = await token({ ...claims, email: "attacker@example.com" });
  assert.equal(await checkAdminAccess(new Request(req.url, { headers: { "Cf-Access-Jwt-Assertion": impostor } }), env), false, "wrong email rejected");
  const expired = await token({ ...claims, exp: now - 5 });
  assert.equal(await checkAdminAccess(new Request(req.url, { headers: { "Cf-Access-Jwt-Assertion": expired } }), env), false, "expired token rejected");
  const wrongAudience = await token({ ...claims, aud: ["other"] });
  assert.equal(await checkAdminAccess(new Request(req.url, { headers: { "Cf-Access-Jwt-Assertion": wrongAudience } }), env), false, "wrong audience rejected");
  assert.equal(await checkAdminAccess(req, { ...env, GITHUB_TOKEN: undefined }), false, "missing secrets rejected");
} finally { globalThis.fetch = originalFetch; }

let saved;
globalThis.fetch = async (url, options) => {
  assert.match(url, /^https:\/\/api\.github\.com\/repos\/bacdevv\/personal-website\/contents\/src\/content\/posts\//);
  if (options?.method === "PUT") {
    saved = JSON.parse(options.body);
    assert.equal(saved.branch, "main");
    return new Response(JSON.stringify({ content: { sha: "a".repeat(40) }, commit: { html_url: "https://github.com/example/commit" } }), { status: 201 });
  }
  return new Response(JSON.stringify({ type: "file", encoding: "base64", sha: "b".repeat(40), content: Buffer.from("---\ntitle: hello\n---\nBody\n").toString("base64") }), { status: 200 });
};
const article = { slug: "java-oop", title: "Java OOP hướng dẫn", description: "Object-oriented Java basics", body: "## Hello\n\n```java\nSystem.out.println(1);\n```", tags: ["java", "oop"], featured: false, draft: false, pubDatetime: "2026-10-09T04:00:00.000Z" };
const url = "https://bacdev.tech/api/adminn/posts";
const makePost = (value, origin = "https://bacdev.tech") => new Request(url, { method: "POST", headers: { "Origin": origin, "Content-Type": "application/json" }, body: JSON.stringify(value) });
try {
  assert.equal((await onRequestPost({ request: makePost(article), env })).status, 201);
  assert.match(Buffer.from(saved.content, "base64").toString("utf8"), /Java OOP hướng dẫn/);
  assert.match(Buffer.from(saved.content, "base64").toString("utf8"), /draft: false/);
  assert.equal((await onRequestPost({ request: makePost({ ...article, slug: "../bad" }), env })).status, 400);
  assert.equal((await onRequestPost({ request: makePost(article, "https://evil.example"), env })).status, 403);
  const result = await onRequestGet({ request: new Request(`${url}?slug=java-oop`), env });
  assert.equal(result.status, 200);
  assert.equal((await result.json()).sha, "b".repeat(40));
  assert.equal((await onRequestGet({ request: new Request(`${url}?slug=../../etc`), env })).status, 400);
} finally { globalThis.fetch = originalFetch; }
console.log("PASS: 6 TypeScript files parsed; article route and code annotations present");
console.log("PASS: Access JWT signature, email, audience, expiry and missing-secret checks");
console.log("PASS: GitHub publish Base64 Unicode, origin guard, path guard and article retrieval");
