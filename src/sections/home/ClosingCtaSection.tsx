import type { SiteContent } from "@/content/types";
import { Container } from "@/components/Container";
import { track } from "@/utils/analytics";

export function ClosingCtaSection({
  closingCta
}: {
  closingCta: SiteContent["closingCta"];
}) {
  return (
    <div className="bg-header-bg text-header-fg">
      <Container className="py-20 text-center sm:py-28">
        <h2 className="mx-auto max-w-[880px] font-display text-[clamp(36px,5.5vw,64px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
          {closingCta.title}
        </h2>
        <p className="mx-auto mt-5 max-w-[560px] text-sm text-white/60 sm:text-base">
          {closingCta.subtitle}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
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
          <a
            href={closingCta.secondaryCta.href}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-transparent px-6 py-3 text-sm font-semibold text-header-fg transition hover:bg-white hover:text-fg"
            onClick={() =>
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
            }
          >
            {closingCta.secondaryCta.text}
          </a>
        </div>
      </Container>
    </div>
  );
}
