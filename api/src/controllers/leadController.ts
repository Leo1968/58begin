import type { Env, LeadCreateResponse } from "../types";
import { json } from "../utils/http";
import { leadCreateSchema } from "../validators/lead";
import { createLead } from "../services/leadService";

type LeadCreateError = { ok: false; code: "RATE_LIMIT" | "SERVER_ERROR" };

export async function handleLeadCreate(
  request: Request,
  env: Env,
  ctx: { ip?: string }
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    const res: LeadCreateResponse = { ok: false, code: "INVALID" };
    return json(res, { status: 400 });
  }

  const parsed = leadCreateSchema.safeParse(body);
  if (!parsed.success) {
    const res: LeadCreateResponse = { ok: false, code: "INVALID" };
    return json(res, { status: 400 });
  }

  if (parsed.data.hp && parsed.data.hp.trim().length > 0) {
    const res: LeadCreateResponse = { ok: true, id: crypto.randomUUID() };
    return json(res, { status: 200 });
  }

  try {
    const result = await createLead(env, parsed.data, ctx);
    if (result.ok === true) {
      const res: LeadCreateResponse = { ok: true, id: result.id };
      return json(res, { status: 200 });
    } else {
      const err = result as LeadCreateError;
      const res: LeadCreateResponse = { ok: false, code: err.code };
      return json(res, { status: 429 });
    }
  } catch {
    const res: LeadCreateResponse = { ok: false, code: "SERVER_ERROR" };
    return json(res, { status: 500 });
  }
}
