import type { SiteContent } from "@/content/types";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { Card } from "@/components/Card";

export function CultureSection({ culture }: { culture: SiteContent["culture"] }) {
  return (
    <Container className="py-14">
      <SectionHeading id="culture" title={culture.title} />
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {culture.items.map((it) => (
          <Card key={it.title}>
            <div className="text-lg font-semibold text-fg">{it.title}</div>
            <div className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">
              {it.description}
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}

