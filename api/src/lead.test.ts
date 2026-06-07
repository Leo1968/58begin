import { beforeEach, describe, expect, it } from "vitest";
import type { LeadCreateResponse } from "./types";
import worker from "./index";

type LeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  wechat: string | null;
  company: string | null;
  intent: string;
  message: string | null;
  source_url: string;
  lang: string;
  utm_json: string | null;
  ip: string | null;
  created_at: string;
};

type MockStmt = {
  bind: (...args: unknown[]) => MockStmt;
  run: () => Promise<void>;
  first: <T>() => Promise<T | null>;
};

function createMockDb() {
  const state: { leads: LeadRow[] } = { leads: [] };

  const db = {
    async exec(sql: string) {
      if (/DELETE\s+FROM\s+lead/i.test(sql)) state.leads = [];
    },
    prepare(sql: string): MockStmt {
      const ctx: { args: unknown[] } = { args: [] };
      return {
        bind(...args: unknown[]) {
          ctx.args = args;
          return this;
        },
        async run() {
          if (/INSERT\s+INTO\s+lead/i.test(sql)) {
            const [
              id,
              name,
              email,
              wechat,
              company,
              intent,
              message,
              source_url,
              lang,
              utm_json,
              ip,
              created_at
            ] = ctx.args as [
              string,
              string | null,
              string | null,
              string | null,
              string | null,
              string,
              string | null,
              string,
              string,
              string | null,
              string | null,
              string
            ];
            state.leads.push({
              id,
              name,
              email,
              wechat,
              company,
              intent,
              message,
              source_url,
              lang,
              utm_json,
              ip,
              created_at
            });
          }
        },
        async first<T>() {
          if (/COUNT\(1\)\s+as\s+cnt/i.test(sql)) {
            if (/WHERE\s+ip\s*=\s*\?\s+AND\s+created_at\s*>=\s*\?/i.test(sql)) {
              const [ip, since] = ctx.args as [string, string];
              const cnt = state.leads.filter(
                (l) => l.ip === ip && l.created_at >= since
              ).length;
              return { cnt } as T;
            }
            return { cnt: state.leads.length } as T;
          }
          return null;
        }
      };
    }
  };

  return { db, state };
}

const { db, state } = createMockDb();
const env = {
  DB: db as unknown as D1Database,
  ALLOWED_ORIGINS: "http://example.com",
  RATE_LIMIT_WINDOW_SECONDS: "60",
  RATE_LIMIT_MAX_REQUESTS: "5"
};

beforeEach(async () => {
  await db.exec("DELETE FROM lead;");
});

describe("POST /api/lead", () => {
  it("should create lead", async () => {
    const res = await worker.fetch(
      new Request("http://example.com/api/lead", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "cf-connecting-ip": "1.2.3.4",
          origin: "http://example.com"
        },
        body: JSON.stringify({
          name: "Test",
          email: "test@example.com",
          intent: "partnership",
          message: "hello",
          sourceUrl: "https://58begin.com/",
          lang: "zh",
          utm: { utm_source: "unit_test" }
        })
      }),
      env as unknown as any
    );

    expect(res.status).toBe(200);
    const data = (await res.json()) as LeadCreateResponse;
    expect(data.ok).toBe(true);
    expect(state.leads.length).toBe(1);
  });

  it("should rate-limit repeated submissions", async () => {
    for (let i = 0; i < 5; i += 1) {
      const res = await worker.fetch(
        new Request("http://example.com/api/lead", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "cf-connecting-ip": "9.9.9.9",
            origin: "http://example.com"
          },
          body: JSON.stringify({
            intent: "partnership",
            sourceUrl: "https://58begin.com/",
            lang: "zh"
          })
        }),
        env as unknown as any
      );
      expect(res.status).toBe(200);
    }

    const res = await worker.fetch(
      new Request("http://example.com/api/lead", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "cf-connecting-ip": "9.9.9.9",
          origin: "http://example.com"
        },
        body: JSON.stringify({
          intent: "partnership",
          sourceUrl: "https://58begin.com/",
          lang: "zh"
        })
      }),
      env as unknown as any
    );

    expect(res.status).toBe(429);
    const data = (await res.json()) as LeadCreateResponse;
    expect(data.ok).toBe(false);
  });

  it("should reject invalid payload", async () => {
    const res = await worker.fetch(
      new Request("http://example.com/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "http://example.com" },
        body: JSON.stringify({ intent: "partnership" })
      }),
      env as unknown as any
    );

    expect(res.status).toBe(400);
    const data = (await res.json()) as LeadCreateResponse;
    expect(data.ok).toBe(false);
  });

  it("should accept honeypot submissions without storing", async () => {
    const res = await worker.fetch(
      new Request("http://example.com/api/lead", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "cf-connecting-ip": "2.2.2.2",
          origin: "http://example.com"
        },
        body: JSON.stringify({
          intent: "partnership",
          sourceUrl: "https://58begin.com/",
          lang: "zh",
          hp: "bot"
        })
      }),
      env as unknown as any
    );

    expect(res.status).toBe(200);
    expect(state.leads.length).toBe(0);
  });
});
