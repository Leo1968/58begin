import type { SiteContent } from "@/content/types";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";

export function AboutSection({ about }: { about: SiteContent["about"] }) {
  return (
    <Container className="py-14">
      <SectionHeading id="about" title={about.title} />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="max-w-[760px]">
          {about.paragraphs.map((p) => (
            <p key={p} className="mt-4 text-sm leading-relaxed text-fg/90 sm:text-base">
              {p}
            </p>
          ))}
        </div>
        <div className="grid gap-3">
          {about.highlights.map((h) => (
            <div
              key={h}
              className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-fg"
            >
              {h}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

