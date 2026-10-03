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
      <div className="mt-10 grid gap-12">
        {products.groups.map((g) => (
          <div key={g.id}>
            <div className="font-display text-xl font-bold tracking-tight text-fg sm:text-2xl">
              {g.title}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((it, i) => (
                <div
                  key={it.id}
                  className="reveal flex flex-col rounded-[20px] border border-border bg-card p-6 transition hover:bg-surface-4"
                  style={{ "--reveal-delay": `${i * 90}ms` } as CSSProperties}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-lg font-semibold text-fg">{it.title}</div>
                    {it.tag ? (
                      <span className="shrink-0 rounded-full bg-surface-3 px-2.5 py-1 text-[11px] font-medium text-fg/80">
                        {it.tag}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 flex-1 text-sm leading-relaxed text-muted">
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
                      className="group inline-flex items-center gap-1.5 text-sm font-medium text-fg"
                      target={it.ctaHref.startsWith("#") ? "_self" : "_blank"}
                      rel={it.ctaHref.startsWith("#") ? undefined : "noopener noreferrer"}
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
          </div>
        ))}
      </div>
    </Container>
  );
}
