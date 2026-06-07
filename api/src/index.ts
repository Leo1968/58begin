import type { Env } from "./types";
import { handleLeadCreate } from "./controllers/leadController";
import { getRequestIp, json, parseAllowedOrigins, text } from "./utils/http";

function withCors(request: Request, env: Env, response: Response): Response {
  const allowed = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const origin = request.headers.get("origin") ?? "";
  const headers = new Headers(response.headers);

  if (allowed.length === 0 || allowed.includes(origin)) {
    headers.set("access-control-allow-origin", origin || "*");
    headers.set("vary", "origin");
    headers.set("access-control-allow-credentials", "true");
  }

  headers.set(
    "access-control-allow-headers",
    "content-type, x-requested-with"
  );
  headers.set("access-control-allow-methods", "GET,POST,OPTIONS");
  headers.set("access-control-max-age", "86400");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function handleOptions(request: Request, env: Env): Response {
  return withCors(request, env, text("", { status: 204 }));
}

async function serveStaticAsset(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const lastSegment = path.split("/").pop() ?? "";
  const ext = lastSegment.includes(".")
    ? lastSegment.split(".").pop()?.toLowerCase()
    : undefined;

  const res = await env.ASSETS.fetch(request);

  if (
    request.method === "GET" &&
    ext &&
    ext !== "html" &&
    (res.headers.get("content-type") ?? "").includes("text/html")
  ) {
    return text("Not Found", { status: 404 });
  }

  if (res.status === 307) {
    if (request.method !== "GET") return res;

    const accept = request.headers.get("accept") ?? "";
    const looksLikeHtmlNavigation = accept.includes("text/html");
    const location = res.headers.get("location");

    if (looksLikeHtmlNavigation && location === "/") {
      const indexUrl = new URL(request.url);
      indexUrl.pathname = "/index.html";
      return env.ASSETS.fetch(new Request(indexUrl, request));
    }
  }

  if (res.status !== 404) return res;

  if (request.method !== "GET") return res;

  const accept = request.headers.get("accept") ?? "";
  const looksLikeHtmlNavigation = accept.includes("text/html");
  const hasExtension = lastSegment.includes(".");

  if (!looksLikeHtmlNavigation || hasExtension) return res;

  const indexUrl = new URL(request.url);
  indexUrl.pathname = "/index.html";
  return env.ASSETS.fetch(new Request(indexUrl, request));
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS") return handleOptions(request, env);

    if (request.method === "GET" && path === "/api/health") {
      return withCors(request, env, json({ ok: true }, { status: 200 }));
    }

    if (request.method === "POST" && path === "/api/lead") {
      const ip = getRequestIp(request);
      const res = await handleLeadCreate(request, env, { ip });
      return withCors(request, env, res);
    }

    if (!path.startsWith("/api")) {
      return serveStaticAsset(request, env);
    }

    return withCors(
      request,
      env,
      json({ ok: false, code: "NOT_FOUND" }, { status: 404 })
    );
  }
};
