import type { Env, LeadIntent, Lang } from "../types";

export type LeadRecord = {
  id: string;
  name: string | null;
  email: string | null;
  wechat: string | null;
  company: string | null;
  intent: LeadIntent;
  message: string | null;
  source_url: string;
  lang: Lang;
  utm_json: string | null;
  ip: string | null;
  created_at: string;
};

export async function insertLead(
  env: Env,
  record: Omit<LeadRecord, "created_at">
): Promise<void> {
  const createdAt = new Date().toISOString();
  const stmt = env.DB.prepare(
    "INSERT INTO lead (id, name, email, wechat, company, intent, message, source_url, lang, utm_json, ip, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  await stmt
    .bind(
      record.id,
      record.name,
      record.email,
      record.wechat,
      record.company,
      record.intent,
      record.message,
      record.source_url,
      record.lang,
      record.utm_json,
      record.ip,
      createdAt
    )
    .run();
}

export async function countLeadsInWindowByIp(
  env: Env,
  ip: string,
  sinceIso: string
): Promise<number> {
  const stmt = env.DB.prepare(
    "SELECT COUNT(1) as cnt FROM lead WHERE ip = ? AND created_at >= ?"
  );
  const res = await stmt.bind(ip, sinceIso).first<{ cnt: number }>();
  return Number(res?.cnt ?? 0);
}

