export type Lang = "zh" | "en";

export type LeadIntent = "course" | "consulting" | "partnership" | "other";

export type LeadCreateRequest = {
  name?: string;
  email?: string;
  wechat?: string;
  company?: string;
  intent: LeadIntent;
  message?: string;
  sourceUrl: string;
  utm?: Record<string, string | undefined>;
  lang: Lang;
  hp?: string;
};

export type LeadCreateResponse =
  | { ok: true; id: string }
  | { ok: false; code: "INVALID" | "RATE_LIMIT" | "SERVER_ERROR" };

export type Env = {
  DB: D1Database;
  ASSETS: Fetcher;
  ALLOWED_ORIGINS?: string;
  RATE_LIMIT_WINDOW_SECONDS?: string;
  RATE_LIMIT_MAX_REQUESTS?: string;
  LEAD_WEBHOOK_URL?: string;
};
