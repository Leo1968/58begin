export function json(body: unknown, init?: ResponseInit): Response {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { ...init, headers });
}

export function text(body: string, init?: ResponseInit): Response {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "text/plain; charset=utf-8");
  return new Response(body, { ...init, headers });
}

export function getRequestIp(request: Request): string | undefined {
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp;
  const xff = request.headers.get("x-forwarded-for");
  if (!xff) return undefined;
  const first = xff.split(",")[0]?.trim();
  return first || undefined;
}

export function parseAllowedOrigins(value?: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

