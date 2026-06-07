import { ArrowUpRight } from "lucide-react";
import type { SiteContent } from "@/content/types";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { TrackedLink } from "@/components/TrackedLink";
import { track } from "@/utils/analytics";

export function ProductsSection({
  products
}: {
  products: SiteContent["products"];
}) {
  return (
    <Container className="py-14">
      <SectionHeading id="products" title={products.title} />
      <div className="mt-10 grid gap-10">
        {products.groups.map((g) => (
          <div key={g.id}>
            <div className="font-display text-2xl font-semibold tracking-tight text-fg">
              {g.title}
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {g.items.map((it) => (
                <Card key={it.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-lg font-semibold text-fg">{it.title}</div>
                    {it.tag ? (
                      <span className="rounded-full border border-border bg-bg px-2 py-0.5 text-[11px] text-muted">
                        {it.tag}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-muted">
                    {it.description}
                  </div>
                  <div className="mt-5">
                    <TrackedLink
                      href={it.ctaHref}
                      tracking={{
                        type: "cta",
                        id: `product_${it.id}`,
                        text: it.ctaText,
                        section: "products"
                      }}
                      onClick={() =>
                        track({
                          name: "product_card_click",
                          props: { product_id: it.id, product_name: it.title }
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-sm font-medium text-fg hover:bg-fg/5"
                      target={it.ctaHref.startsWith("#") ? "_self" : "_blank"}
                      rel={it.ctaHref.startsWith("#") ? undefined : "noopener noreferrer"}
                    >
                      {it.ctaText}
                      <ArrowUpRight className="h-4 w-4 text-muted" />
                    </TrackedLink>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

