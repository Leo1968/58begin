CREATE TABLE IF NOT EXISTS lead (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  wechat TEXT,
  company TEXT,
  intent TEXT NOT NULL,
  message TEXT,
  source_url TEXT NOT NULL,
  lang TEXT NOT NULL,
  utm_json TEXT,
  ip TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lead_created_at ON lead(created_at);
CREATE INDEX IF NOT EXISTS idx_lead_ip_created_at ON lead(ip, created_at);

