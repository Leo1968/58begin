import type { CSSProperties } from "react";
import type { SiteContent } from "@/content/types";
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
    <Container className="py-16 sm:py-24">
      <SectionHeading id="products" title={products.title} />
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {products.items.map((it, i) => (
          <div
            key={it.id}
            className="reveal flex flex-col rounded-[20px] border border-border bg-card p-6 transition hover:bg-surface-4"
            style={{ "--reveal-delay": `${i * 90}ms` } as CSSProperties}
          >
            <div className="text-lg font-semibold text-fg">{it.title}</div>
            {it.positioning ? (
              <div className="mt-2 text-sm font-medium text-fg/90">
                {it.positioning}
              </div>
            ) : null}
            <div className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {it.description}
            </div>
            {it.ctaText && it.ctaHref ? (
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
            ) : null}
          </div>
        ))}
      </div>
    </Container>
  );
}
