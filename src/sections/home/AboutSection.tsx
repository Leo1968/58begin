import type { SiteContent } from "@/content/types";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";

export function AboutSection({ about }: { about: SiteContent["about"] }) {
  return (
    <div className="bg-surface-4">
      <Container className="py-16 sm:py-24">
        <SectionHeading id="about" title={about.title} />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="max-w-[760px]">
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                  {about.mission.title}
                </div>
                <p className="mt-3 whitespace-pre-line text-lg font-medium leading-relaxed text-fg">
                  {about.mission.body}
                </p>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                  {about.vision.title}
                </div>
                <p className="mt-3 whitespace-pre-line text-lg font-medium leading-relaxed text-fg">
                  {about.vision.body}
                </p>
              </div>
            </div>
            {about.paragraphs.map((p) => (
              <p key={p} className="mt-6 text-sm leading-relaxed text-fg/90 sm:text-base">
                {p}
              </p>
            ))}
          </div>
          <div className="flex flex-wrap content-start gap-2 lg:flex-col">
            {about.highlights.map((h) => (
              <div
                key={h}
                className="rounded-full border border-border bg-bg px-4 py-2 text-sm font-medium text-fg"
              >
                {h}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
