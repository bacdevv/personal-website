import type { APIRoute } from "astro";
import { indexable } from "@/site";
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\n${indexable ? "Allow: /\nDisallow: /adminn\nDisallow: /api/adminn/" : "Disallow: /"}\nSitemap: ${new URL("sitemap-index.xml", site)}\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
