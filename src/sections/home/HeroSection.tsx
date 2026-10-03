import { ArrowUpRight } from "lucide-react";
import type { Metric, SiteContent } from "@/content/types";
import { Container } from "@/components/Container";
import { track } from "@/utils/analytics";

/**
 * Hero renders statically — no scroll-reveal gating. Above-the-fold and
 * LCP-adjacent content must never be hidden behind a JS/IO trigger
 * (background-tab loads and throttled webviews can delay those callbacks,
 * which left this content invisible until a manual refresh).
 */
export function HeroSection({
  hero,
  metrics,
  trustBadges
}: {
  hero: SiteContent["hero"];
  metrics: Metric[];
  trustBadges: SiteContent["trustBadges"];
}) {
  return (
    <Container className="section-y">
      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
        {hero.kicker}
      </div>
      <h1 className="mt-4 max-w-[900px] font-display text-[clamp(48px,7.5vw,88px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-fg">
        {hero.title}
      </h1>
      <p className="mt-6 max-w-[720px] text-base leading-relaxed text-muted sm:text-lg">
        {hero.subtitle}
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <a
          href={hero.primaryCta.href}
          className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg transition hover:bg-fg/90 active:bg-fg/85"
          onClick={() =>
            track({
              name: "cta_click",
              props: {
                cta_id: "hero_primary",
                cta_text: hero.primaryCta.text,
                section: "hero",
                target_url: hero.primaryCta.href,
                is_external: false
              }
            })
          }
        >
          {hero.primaryCta.text}
          <ArrowUpRight className="h-4 w-4" />
        </a>
        <a
          href={hero.secondaryCta.href}
          className="inline-flex items-center gap-2 rounded-full border border-fg bg-transparent px-6 py-3 text-sm font-semibold text-fg transition hover:bg-fg hover:text-bg"
          onClick={() =>
            track({
              name: "cta_click",
              props: {
                cta_id: "hero_secondary",
                cta_text: hero.secondaryCta.text,
                section: "hero",
                target_url: hero.secondaryCta.href,
                is_external: false
              }
            })
          }
        >
          {hero.secondaryCta.text}
        </a>
      </div>

      <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-6">
        {trustBadges.map((b) => (
          <div key={b.label}>
            <div className="text-sm font-semibold text-fg">{b.label}</div>
            <div className="mt-0.5 text-xs text-muted">{b.detail}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-none border-[3px] border-fg bg-card px-5 py-4 shadow-[6px_6px_0_0_rgb(var(--fg))]"
          >
            <div className="text-xs text-muted">{m.label}</div>
            <div className="mt-2 font-accent text-3xl leading-none text-fg">
              {m.value}
            </div>
            {m.note ? (
              <div className="mt-2 text-xs text-muted">{m.note}</div>
            ) : null}
          </div>
        ))}
      </div>
    </Container>
  );
}
