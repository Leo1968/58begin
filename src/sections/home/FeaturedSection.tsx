import { ArrowUpRight } from "lucide-react";
import type { SiteContent } from "@/content/types";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { TrackedLink } from "@/components/TrackedLink";

export function FeaturedSection({
  featured
}: {
  featured: SiteContent["featured"];
}) {
  return (
    <Container className="py-14">
      <SectionHeading id="featured" title={featured.title} />
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {featured.items.map((it) => (
          <Card key={it.id}>
            <div className="text-lg font-semibold text-fg">{it.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-muted">
              {it.description}
            </div>
            <div className="mt-5">
              <TrackedLink
                href={it.ctaHref}
                tracking={{
                  type: "cta",
                  id: `featured_${it.id}`,
                  text: it.ctaText,
                  section: "featured"
                }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-sm font-medium text-fg hover:bg-fg/5"
              >
                {it.ctaText}
                <ArrowUpRight className="h-4 w-4 text-muted" />
              </TrackedLink>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}

