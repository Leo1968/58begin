import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { SiteContent } from "@/content/types";
import { Container } from "@/components/Container";
import { track } from "@/utils/analytics";

export function ClosingCtaSection({
  closingCta
}: {
  closingCta: SiteContent["closingCta"];
}) {
  const secondaryHref = closingCta.secondaryCta.href;
  const secondaryProps = {
    className:
      "inline-flex items-center gap-2 rounded-full border border-white/40 bg-transparent px-6 py-3 text-sm font-semibold text-header-fg transition hover:bg-white hover:text-fg",
    onClick: () =>
      track({
        name: "cta_click",
        props: {
          cta_id: "closing_secondary",
          cta_text: closingCta.secondaryCta.text,
          section: "closing_cta",
          target_url: closingCta.secondaryCta.href,
          is_external: false
        }
      })
  };
  return (
    <div className="bg-header-bg text-header-fg">
      <Container className="py-14 text-center sm:py-20">
        <h2
          className="reveal mx-auto max-w-[880px] font-display text-[clamp(36px,5.5vw,64px)] font-extrabold leading-[1.05] tracking-[-0.02em]"
        >
          {closingCta.title}
        </h2>
        <p
          className="reveal mx-auto mt-5 max-w-[560px] text-sm text-white/60 sm:text-base"
          style={{ "--reveal-delay": "90ms" } as CSSProperties}
        >
          {closingCta.subtitle}
        </p>
        <div
          className="reveal mt-9 flex flex-wrap items-center justify-center gap-3"
          style={{ "--reveal-delay": "180ms" } as CSSProperties}
        >
          <a
            href={closingCta.primaryCta.href}
            className="inline-flex items-center gap-2 rounded-full bg-bg px-6 py-3 text-sm font-semibold text-fg transition hover:bg-white/90"
            onClick={() =>
              track({
                name: "cta_click",
                props: {
                  cta_id: "closing_primary",
                  cta_text: closingCta.primaryCta.text,
                  section: "closing_cta",
                  target_url: closingCta.primaryCta.href,
                  is_external: false
                }
              })
            }
          >
            {closingCta.primaryCta.text}
          </a>
          {secondaryHref.startsWith("#") ? (
            <a href={secondaryHref} {...secondaryProps}>
              {closingCta.secondaryCta.text}
            </a>
          ) : (
            <Link to={secondaryHref} {...secondaryProps}>
              {closingCta.secondaryCta.text}
            </Link>
          )}
        </div>
      </Container>
    </div>
  );
}
