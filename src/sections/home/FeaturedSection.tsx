import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
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
            className="reveal border-t border-border py-10"
            style={{ "--reveal-delay": `${i * 90}ms` } as CSSProperties}
          >
            <div className="grid gap-6 lg:grid-cols-[140px_1fr_auto] lg:items-start">
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

            {it.images?.length ? (
              <div
                className={cn(
                  "mt-8 grid gap-4",
                  it.images.length > 1 && "sm:grid-cols-2"
                )}
              >
                {it.images.map((img) => (
                  <div
                    key={img.src}
                    className="reveal-media border border-border bg-card"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Container>
  );
}
