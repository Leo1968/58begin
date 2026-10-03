import { useState, type CSSProperties } from "react";
import { Check, Copy } from "lucide-react";
import type { SiteContent } from "@/content/types";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { TrackedLink } from "@/components/TrackedLink";
import { LeadForm } from "@/components/LeadForm";
import { Modal } from "@/components/Modal";
import { Toast } from "@/components/Toast";
import { track } from "@/utils/analytics";

export function ContactSection({
  contact,
  findMeOn,
  lang
}: {
  contact: SiteContent["contact"];
  findMeOn: SiteContent["findMeOn"];
  lang: "zh" | "en";
}) {
  const [copied, setCopied] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setToastOpen(true);
    track({
      name: "contact_copy_email",
      props: { email_domain: contact.email.split("@")[1] ?? "" }
    });
    window.setTimeout(() => setCopied(false), 1200);
    window.setTimeout(() => setToastOpen(false), 2400);
  };

  return (
    <Container className="py-16 sm:py-24">
      <SectionHeading id="contact" title={contact.title} subtitle={contact.description} />
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_440px] lg:items-start">
        <div className="grid gap-4">
          <Card shape="square" className="reveal p-6">
            <div className="text-xs text-muted">Email</div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-medium text-fg">{contact.email}</div>
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-sm font-medium text-fg hover:bg-fg/5"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    {lang === "zh" ? "已复制" : "Copied"}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {lang === "zh" ? "复制邮箱" : "Copy email"}
                  </>
                )}
              </button>
            </div>
          </Card>

          <Card shape="square" className="reveal p-6" style={{ "--reveal-delay": "90ms" } as CSSProperties}>
            <div className="text-xs text-muted">{contact.wechatLabel}</div>
            <div className="mt-4 grid gap-8 sm:grid-cols-[176px_1fr] sm:items-start">
              <div>
                {contact.wechatQr ? (
                  <img
                    src={contact.wechatQr.src}
                    alt={contact.wechatQr.alt}
                    width={600}
                    height={568}
                    loading="lazy"
                    decoding="async"
                    className="w-40 border border-border"
                  />
                ) : (
                  <div className="grid h-40 w-40 place-items-center border border-border text-xs text-muted">
                    {lang === "zh" ? "二维码待配置" : "QR not configured"}
                  </div>
                )}
                <button
                  onClick={() => {
                    setQrOpen(true);
                    track({ name: "contact_qr_zoom", props: { source: "contact" } });
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-sm font-medium text-fg hover:bg-fg/5"
                >
                  {lang === "zh" ? "查看二维码区域" : "Open QR area"}
                </button>
              </div>

              <div className="flex flex-wrap content-center gap-3">
                {findMeOn.items.map((it) => (
                  <TrackedLink
                    key={it.id}
                    href={it.href}
                    tracking={{ type: "social", platform: it.label }}
                    aria-label={it.label}
                    title={it.label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-border bg-bg text-xl transition hover:-translate-y-0.5 hover:bg-fg/5"
                  >
                    <span aria-hidden="true">{it.icon}</span>
                  </TrackedLink>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="reveal" style={{ "--reveal-delay": "180ms" } as CSSProperties}>
          <LeadForm />
        </div>
      </div>

      <Modal open={qrOpen} title={contact.wechatLabel} onClose={() => setQrOpen(false)}>
        {contact.wechatQr ? (
          <img
            src={contact.wechatQr.src}
            alt={contact.wechatQr.alt}
            width={600}
            height={568}
            className="mx-auto w-full max-w-[320px] border border-border"
          />
        ) : (
          <div className="rounded-none border border-border bg-card p-5 text-sm text-muted">
            {lang === "zh"
              ? "此处预留二维码展示位：请在 public/ 放置二维码图片并在内容配置中填入链接后替换为 <img>。"
              : "Reserved area for a WeChat QR image. Put the image under public/ and wire it in the content config."}
          </div>
        )}
      </Modal>

      <Toast open={toastOpen}>
        {lang === "zh" ? "已复制邮箱" : "Email copied"}
      </Toast>
    </Container>
  );
}

