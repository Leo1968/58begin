import type { AnchorHTMLAttributes } from "react";
import { isExternalUrl, track } from "@/utils/analytics";

export function TrackedLink({
  tracking,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  tracking?:
    | { type: "social"; platform: string }
    | { type: "cta"; id: string; text: string; section: string };
}) {
  const href = props.href ?? "";
  const external = href ? isExternalUrl(href) : false;

  return (
    <a
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        if (!href) return;

        if (tracking?.type === "social") {
          track({
            name: "social_click",
            props: { platform: tracking.platform, target_url: href }
          });
        }

        if (tracking?.type === "cta") {
          track({
            name: "cta_click",
            props: {
              cta_id: tracking.id,
              cta_text: tracking.text,
              section: tracking.section,
              target_url: href,
              is_external: isExternalUrl(href)
            }
          });
        }

        if (isExternalUrl(href)) {
          try {
            const u = new URL(href, window.location.href);
            track({
              name: "outbound_redirect",
              props: { target_domain: u.hostname, target_url: u.href }
            });
          } catch {
            track({
              name: "outbound_redirect",
              props: { target_domain: "unknown", target_url: href }
            });
          }
        }
      }}
      target={props.target ?? (external ? "_blank" : undefined)}
      rel={props.rel ?? (external ? "noopener noreferrer" : undefined)}
    />
  );
}
