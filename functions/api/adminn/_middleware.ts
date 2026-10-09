import { checkAdminAccess, type AdminEnv } from "../../../src/server/adminAuth";

type Context = { request: Request; env: AdminEnv; next(): Promise<Response> };
export const onRequest = async (context: Context) => {
  if (!await checkAdminAccess(context.request, context.env)) {
    return new Response(JSON.stringify({ error: "Unauthorized. Check Cloudflare Access and admin secrets." }), {
      status: 403,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  return context.next();
};
