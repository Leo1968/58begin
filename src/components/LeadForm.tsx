import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useLangStore } from "@/stores/lang";
import { getSiteContent } from "@/content";
import { Button } from "./Button";
import { Toast } from "./Toast";
import { isExternalUrl, track } from "@/utils/analytics";

type Status = "idle" | "submitting" | "success" | "error";

function getApiBase(): string {
  const v = import.meta.env.VITE_API_BASE;
  if (!v) return "";
  return String(v).replace(/\/$/, "");
}

export function LeadForm({ className }: { className?: string }) {
  const { lang } = useLangStore();
  const content = useMemo(() => getSiteContent(lang), [lang]);
  const [status, setStatus] = useState<Status>("idle");
  const [openToast, setOpenToast] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wechat, setWechat] = useState("");
  const [company, setCompany] = useState("");
  const [intent, setIntent] = useState<
    "course" | "consulting" | "partnership" | "other"
  >("partnership");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");

  const showToast = () => {
    setOpenToast(true);
    window.setTimeout(() => setOpenToast(false), 2400);
  };

  const submit = async () => {
    if (status === "submitting") return;
    setStatus("submitting");

    const payload = {
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      wechat: wechat.trim() || undefined,
      company: company.trim() || undefined,
      intent,
      message: message.trim() || undefined,
      sourceUrl: window.location.href,
      lang,
      hp: hp.trim() || undefined,
      utm: Object.fromEntries(new URLSearchParams(window.location.search))
    };

    try {
      const url = `${getApiBase()}/api/lead`;
      track({
        name: "cta_click",
        props: {
          cta_id: "lead_form_submit",
          cta_text: content.contact.form.submitText,
          section: "contact",
          target_url: url,
          is_external: isExternalUrl(url)
        }
      });

      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      showToast();
      setName("");
      setEmail("");
      setWechat("");
      setCompany("");
      setMessage("");
      setHp("");
    } catch {
      setStatus("error");
      showToast();
    } finally {
      window.setTimeout(() => setStatus("idle"), 800);
    }
  };

  const t = content.contact.form;

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5", className)}>
      <div className="text-sm font-medium text-fg">{t.title}</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs text-muted">{t.nameLabel}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 rounded-xl border border-border bg-bg px-3 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
            placeholder={t.nameLabel}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-muted">{t.emailLabel}</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 rounded-xl border border-border bg-bg px-3 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
            placeholder={t.emailLabel}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-muted">{t.wechatLabel}</span>
          <input
            value={wechat}
            onChange={(e) => setWechat(e.target.value)}
            className="h-10 rounded-xl border border-border bg-bg px-3 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
            placeholder={t.wechatLabel}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-muted">{t.companyLabel}</span>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="h-10 rounded-xl border border-border bg-bg px-3 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
            placeholder={t.companyLabel}
          />
        </label>
        <label className="grid gap-1 sm:col-span-2">
          <span className="text-xs text-muted">{t.intentLabel}</span>
          <select
            value={intent}
            onChange={(e) =>
              setIntent(e.target.value as "course" | "consulting" | "partnership" | "other")
            }
            className="h-10 rounded-xl border border-border bg-bg px-3 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
          >
            {t.intents.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 sm:col-span-2">
          <span className="text-xs text-muted">{t.messageLabel}</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="rounded-xl border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
            placeholder={t.messageLabel}
          />
        </label>
      </div>

      <div className="sr-only">
        <input value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-xs text-muted">
          {lang === "zh"
            ? "提交即代表你同意我们按隐私政策处理你的信息。"
            : "By submitting, you agree to our privacy policy."}
        </div>
        <Button
          onClick={submit}
          disabled={status === "submitting"}
          className={cn(status === "submitting" && "opacity-70")}
        >
          {t.submitText}
        </Button>
      </div>

      <Toast open={openToast}>
        {status === "success" ? t.successText : null}
        {status === "error" ? t.errorText : null}
      </Toast>
    </div>
  );
}

