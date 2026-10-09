/** Verify a Cloudflare Access assertion before any request can use GITHUB_TOKEN.
 * The /adminn* and /api/adminn/* paths MUST also be protected by Access rules.
 * No build-time or client-side GitHub tokens are used.
 */
export interface AdminEnv {
  GITHUB_TOKEN?: string;
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
  ADMIN_EMAIL?: string;
  GITHUB_BRANCH?: string;
}

const asJson = (value: string): Record<string, unknown> => {
  const plain = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(plain.padEnd(Math.ceil(plain.length / 4) * 4, "="));
  return JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0))));
};

type SigningKey = JsonWebKey & { kid: string };
let cached: { url: string; until: number; keys: SigningKey[] } | undefined;

export async function checkAdminAccess(request: Request, env: AdminEnv): Promise<boolean> {
  if (!env.GITHUB_TOKEN || !env.CF_ACCESS_AUD || !env.CF_ACCESS_TEAM_DOMAIN || !env.ADMIN_EMAIL) return false;
  const assertion = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!assertion) return false;
  const sections = assertion.split(".");
  if (sections.length !== 3) return false;

  try {
    const header = asJson(sections[0]);
    const payload = asJson(sections[1]);
    if (header.alg !== "RS256" || typeof header.kid !== "string") return false;
    const team = env.CF_ACCESS_TEAM_DOMAIN.replace(/\/+$/, "");
    const teamURL = new URL(team);
    if (teamURL.protocol !== "https:" || !teamURL.hostname.endsWith(".cloudflareaccess.com") || teamURL.pathname !== "/") return false;
    if (payload.iss !== team && payload.iss !== `${team}/`) return false;
    if (!Array.isArray(payload.aud) || !payload.aud.includes(env.CF_ACCESS_AUD)) return false;
    if (typeof payload.email !== "string" || payload.email.toLowerCase() !== env.ADMIN_EMAIL.trim().toLowerCase()) return false;
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== "number" || payload.exp <= now) return false;
    if (typeof payload.nbf === "number" && payload.nbf > now) return false;

    if (!cached || cached.url !== team || cached.until < Date.now()) {
      const reply = await fetch(`${team}/cdn-cgi/access/certs`, { headers: { Accept: "application/json" } });
      if (!reply.ok) return false;
      const content = await reply.json() as { keys?: SigningKey[] };
      if (!Array.isArray(content.keys)) return false;
      cached = { url: team, until: Date.now() + 60 * 60 * 1000, keys: content.keys };
    }
    const jwk = cached.keys.find(item => item.kid === header.kid);
    if (!jwk || jwk.kty !== "RSA") return false;
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const binarySig = atob(sections[2].replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(sections[2].length / 4) * 4, "="));
    return crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, Uint8Array.from(binarySig, c => c.charCodeAt(0)), new TextEncoder().encode(`${sections[0]}.${sections[1]}`));
  } catch {
    return false;
  }
}
