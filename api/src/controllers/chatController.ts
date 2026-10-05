import type { ChatCreateInput, ChatCreateResponse, ChatMessage } from "../validators/chat";
import type { Env } from "../types";
import { SYSTEM_PROMPT } from "../chat/prompt";
import { chatCreateSchema } from "../validators/chat";
import { json } from "../utils/http";

// Best-effort per-IP rate limiting (per isolate): 10 requests / 60s.
// Durable limits can be added later via D1 (see execution plan P-C).
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  return false;
}

export async function handleChatCreate(
  request: Request,
  env: Env
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    const res: ChatCreateResponse = { ok: false, code: "INVALID" };
    return json(res, { status: 400 });
  }

  const parsed = chatCreateSchema.safeParse(body);
  if (!parsed.success) {
    const res: ChatCreateResponse = { ok: false, code: "INVALID" };
    return json(res, { status: 400 });
  }

  const ip = request.headers.get("cf-connecting-ip") ?? "local";
  if (rateLimited(ip)) {
    const res: ChatCreateResponse = { ok: false, code: "RATE_LIMIT" };
    return json(res, { status: 429 });
  }

  const input = parsed.data as ChatCreateInput;
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...(input.history ?? []).map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.content
    })),
    { role: "user", content: input.message }
  ];

  try {
    const result = (await env.AI.run("@cf/zai-org/glm-4.7-flash", {
      messages,
      max_tokens: 700,
      temperature: 0.4
    })) as {
      response?: string;
      choices?: { message?: { content?: string | null; reasoning?: string | null } }[];
    };
    const choice = result.choices?.[0]?.message;
    const reply = ((choice?.content ?? "") || (choice?.reasoning ?? "") || (result.response ?? ""))
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .trim();
    if (!reply) throw new Error("empty reply");
    const res: ChatCreateResponse = { ok: true, reply };
    return json(res, { status: 200 });
  } catch (e) {
    const res: ChatCreateResponse = { ok: false, code: "AI_ERROR" };
    return json(res, { status: 502 });
  }
}
