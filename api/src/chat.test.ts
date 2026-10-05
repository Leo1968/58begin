import { describe, expect, it } from "vitest";
import worker from "./index";
import type { Env } from "./types";

function createEnv(overrides?: Partial<Env>): Env {
  return {
    DB: {} as Env["DB"],
    ASSETS: {} as Env["ASSETS"],
    AI: {
      run: async () => ({ response: "我们提供开发咨询、ODM 与市场分析服务。" })
    },
    ALLOWED_ORIGINS: "",
    ...overrides
  };
}

function chatRequest(body: unknown, ip = "1.2.3.4") {
  return new Request("https://example.com/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", "cf-connecting-ip": ip },
    body: JSON.stringify(body)
  });
}

describe("POST /api/chat", () => {
  it("returns an AI reply for a valid message", async () => {
    const res = await worker.fetch(
      chatRequest({ message: "你们提供什么服务？" }),
      createEnv()
    );
    expect(res.status).toBe(200);
    const data = (await res.json()) as { ok: boolean; reply?: string };
    expect(data.ok).toBe(true);
    expect(data.reply).toContain("服务");
  });

  it("rejects invalid payloads with 400", async () => {
    const res = await worker.fetch(chatRequest({ message: "" }), createEnv());
    expect(res.status).toBe(400);
    const data = (await res.json()) as { code?: string };
    expect(data.code).toBe("INVALID");
  });

  it("returns 502 AI_ERROR when the AI binding fails", async () => {
    const res = await worker.fetch(
      chatRequest({ message: "你好" }, "10.0.0.1"),
      createEnv({
        AI: {
          run: async () => {
            throw new Error("boom");
          }
        }
      })
    );
    expect(res.status).toBe(502);
    const data = (await res.json()) as { code?: string };
    expect(data.code).toBe("AI_ERROR");
  });

  it("rate limits the same IP after 10 requests", async () => {
    const env = createEnv();
    const ip = "9.9.9.9";
    let last = 200;
    for (let i = 0; i < 11; i++) {
      const res = await worker.fetch(
        chatRequest({ message: `问题 ${i}` }, ip),
        env
      );
      last = res.status;
    }
    expect(last).toBe(429);
  });
});
