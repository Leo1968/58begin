import type { SiteContent } from "@/content/types";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { TrackedLink } from "@/components/TrackedLink";

export function FeaturedSection({
  featured
}: {
  featured: SiteContent["featured"];
}) {
  return (
    <Container className="py-16 sm:py-24">
      <SectionHeading id="featured" title={featured.title} />
      <div>
        {featured.items.map((it, i) => (
          <div
            key={it.id}
            className="grid gap-6 border-t border-border py-10 lg:grid-cols-[140px_1fr_auto] lg:items-start"
          >
            <div
              aria-hidden="true"
              className="font-accent text-[clamp(28px,6vw,40px)] leading-none text-fg"
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="max-w-[720px]">
              <div className="font-display text-2xl font-bold tracking-tight text-fg">
                {it.title}
              </div>
              <div className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {it.description}
              </div>
            </div>
            <div className="lg:pt-2">
              <TrackedLink
                href={it.ctaHref}
                tracking={{
                  type: "cta",
                  id: `featured_${it.id}`,
                  text: it.ctaText,
                  section: "featured"
                }}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-fg"
              >
                {it.ctaText}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </TrackedLink>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
