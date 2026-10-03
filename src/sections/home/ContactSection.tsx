import { useState, type CSSProperties } from "react";
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
            {contact.wechatQr ? (
              <div className="mt-4 flex flex-wrap items-center gap-6">
                <img
                  src={contact.wechatQr.src}
                  alt={contact.wechatQr.alt}
                  width={600}
                  height={568}
                  loading="lazy"
                  decoding="async"
                  className="h-40 w-40 border border-border"
                />
                <div className="text-sm leading-relaxed text-muted">
                  {lang === "zh"
                    ? "微信扫码添加，或点击下方按钮放大查看。"
                    : "Scan with WeChat, or open the dialog below to zoom in."}
                </div>
              </div>
            ) : (
              <div className="mt-3 text-sm text-muted">
                {lang === "zh"
                  ? "如需展示二维码，请将二维码图片放到 public/ 目录并在内容配置中填写链接。"
                  : "To show a QR code, place an image under public/ and set its URL in content config."}
              </div>
            )}
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

