import { ArrowUpRight } from "lucide-react";
import type { Metric, SiteContent } from "@/content/types";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { track } from "@/utils/analytics";

export function HeroSection({
  hero,
  metrics
}: {
  hero: SiteContent["hero"];
  metrics: Metric[];
}) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute -top-20 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -top-40 left-1/2 h-[420px] w-[740px] -translate-x-1/2 rounded-full bg-accent-2/10 blur-3xl" />

      <Container className="relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="text-xs font-medium tracking-wide text-muted">
              {hero.kicker}
            </div>
            <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight text-fg sm:text-6xl">
              {hero.title}
            </h1>
            <p className="mt-5 max-w-[720px] text-sm leading-relaxed text-fg/80 sm:text-base">
              {hero.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={hero.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition hover:bg-fg/90"
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
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-fg transition hover:bg-fg/5"
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
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {metrics.map((m) => (
              <Card key={m.label} className="p-4 hover:-translate-y-0">
                <div className="text-xs text-muted">{m.label}</div>
                <div className="mt-2 font-display text-2xl font-semibold text-fg">
                  {m.value}
                </div>
                {m.note ? (
                  <div className="mt-1 text-xs text-muted">{m.note}</div>
                ) : null}
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

