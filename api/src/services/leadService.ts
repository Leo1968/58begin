import type { Env } from "../types";
import type { LeadCreateInput } from "../validators/lead";
import { countLeadsInWindowByIp, insertLead } from "../repos/leadRepo";

export type LeadCreateResult =
  | { ok: true; id: string }
  | { ok: false; code: "RATE_LIMIT" | "SERVER_ERROR" };

export async function createLead(
  env: Env,
  input: LeadCreateInput,
  ctx: { ip?: string }
): Promise<LeadCreateResult> {
  const ip = ctx.ip?.trim() || undefined;

  const windowSeconds = Number(env.RATE_LIMIT_WINDOW_SECONDS ?? 60);
  const maxRequests = Number(env.RATE_LIMIT_MAX_REQUESTS ?? 5);

  if (ip) {
    const since = new Date(Date.now() - windowSeconds * 1000).toISOString();
    const count = await countLeadsInWindowByIp(env, ip, since);
    if (count >= maxRequests) return { ok: false, code: "RATE_LIMIT" };
  }

  const id = crypto.randomUUID();
  await insertLead(env, {
    id,
    name: input.name ?? null,
    email: input.email ?? null,
    wechat: input.wechat ?? null,
    company: input.company ?? null,
    intent: input.intent,
    message: input.message ?? null,
    source_url: input.sourceUrl,
    lang: input.lang,
    utm_json: input.utm ? JSON.stringify(input.utm) : null,
    ip: ip ?? null
  });

  if (env.LEAD_WEBHOOK_URL) {
    const payload = {
      id,
      ...input,
      ip: ip ?? null,
      createdAt: new Date().toISOString()
    };
    await fetch(env.LEAD_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload)
    });
  }

  return { ok: true, id };
}

