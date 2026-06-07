type AnalyticsProvider = "console" | "none";

export type TrackEvent =
  | { name: "page_view"; props: Record<string, unknown> }
  | { name: "language_switch"; props: { from_lang: string; to_lang: string } }
  | { name: "menu_toggle"; props: { action: "open" | "close"; device: string } }
  | { name: "section_view"; props: { section_id: string; section_name: string } }
  | {
      name: "cta_click";
      props: {
        cta_id: string;
        cta_text: string;
        section: string;
        target_url: string;
        is_external: boolean;
      };
    }
  | { name: "social_click"; props: { platform: string; target_url: string } }
  | { name: "product_card_click"; props: { product_id: string; product_name: string } }
  | { name: "tool_card_click"; props: { tool_id: string; tool_name: string; tool_type: string } }
  | { name: "contact_copy_email"; props: { email_domain: string } }
  | { name: "contact_qr_zoom"; props: { source: string } }
  | { name: "outbound_redirect"; props: { target_domain: string; target_url: string } };

function getProvider(): AnalyticsProvider {
  const v = import.meta.env.VITE_ANALYTICS_PROVIDER;
  if (v === "none") return "none";
  return "console";
}

export function track(event: TrackEvent) {
  const provider = getProvider();
  if (provider === "none") return;
  if (provider === "console") {
    globalThis.console.info("[track]", event.name, event.props);
  }
}

export function isExternalUrl(url: string): boolean {
  try {
    const u = new URL(url, window.location.href);
    return u.origin !== window.location.origin;
  } catch {
    return false;
  }
}
