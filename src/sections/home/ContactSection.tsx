import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { SiteContent } from "@/content/types";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { LeadForm } from "@/components/LeadForm";
import { Modal } from "@/components/Modal";
import { Toast } from "@/components/Toast";
import { track } from "@/utils/analytics";

export function ContactSection({
  contact,
  lang
}: {
  contact: SiteContent["contact"];
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
    <Container className="py-14">
      <SectionHeading id="contact" title={contact.title} subtitle={contact.description} />
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_440px] lg:items-start">
        <div className="grid gap-4">
          <Card>
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

          <Card>
            <div className="text-xs text-muted">{contact.wechatLabel}</div>
            <div className="mt-3 text-sm text-muted">
              {lang === "zh"
                ? "如需展示二维码，请将二维码图片放到 public/ 目录并在内容配置中填写链接。"
                : "To show a QR code, place an image under public/ and set its URL in content config."}
            </div>
            <div className="mt-5">
              <button
                onClick={() => {
                  setQrOpen(true);
                  track({ name: "contact_qr_zoom", props: { source: "contact" } });
                }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-sm font-medium text-fg hover:bg-fg/5"
              >
                {lang === "zh" ? "查看二维码区域" : "Open QR area"}
              </button>
            </div>
          </Card>
        </div>

        <LeadForm />
      </div>

      <Modal open={qrOpen} title={contact.wechatLabel} onClose={() => setQrOpen(false)}>
        <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted">
          {lang === "zh"
            ? "此处预留二维码展示位：请在 public/ 放置二维码图片并在内容配置中填入链接后替换为 <img>。"
            : "Reserved area for a WeChat QR image. Put the image under public/ and wire it in the content config."}
        </div>
      </Modal>

      <Toast open={toastOpen}>
        {lang === "zh" ? "已复制邮箱" : "Email copied"}
      </Toast>
    </Container>
  );
}

