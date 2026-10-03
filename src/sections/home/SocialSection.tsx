import type { SiteContent } from "@/content/types";
import { Container } from "@/components/Container";
import { TrackedLink } from "@/components/TrackedLink";

export function SocialSection({
  findMeOn
}: {
  findMeOn: SiteContent["findMeOn"];
}) {
  return (
    <div className="bg-surface-4">
      <Container className="py-16 sm:py-24">
        <div className="max-w-[640px]">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
            {findMeOn.title}
          </div>
          <div className="mt-6">
            {findMeOn.items.map((it) => (
              <TrackedLink
                key={it.id}
                href={it.href}
                tracking={{ type: "social", platform: it.label }}
                className="group flex items-center justify-between border-b border-border bg-transparent px-1 py-4 text-base text-fg transition hover:bg-surface-4"
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">{it.icon}</span>
                  {it.label}
                </span>
                <span
                  aria-hidden="true"
                  className="text-muted transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </TrackedLink>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
