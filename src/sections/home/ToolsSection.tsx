import type { CSSProperties } from "react";
import type { SiteContent } from "@/content/types";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { TrackedLink } from "@/components/TrackedLink";
import { track } from "@/utils/analytics";

export function ToolsSection({ tools }: { tools: SiteContent["tools"] }) {
  return (
    <div className="bg-surface-4">
      <Container className="section-y">
        <SectionHeading id="tools" title={tools.title} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {tools.items.map((t, i) => (
            <div
              key={t.id}
              className="reveal flex flex-col rounded-[20px] border border-border bg-card p-6 transition hover:bg-surface-4"
              style={{ "--reveal-delay": `${i * 90}ms` } as CSSProperties}
            >
              <div className="text-xs uppercase tracking-[0.2em] text-muted">
                {t.type}
              </div>
              <div className="mt-2 text-lg font-semibold text-fg">{t.title}</div>
              <div className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {t.description}
              </div>
              <div className="mt-5">
                <TrackedLink
                  href={t.href}
                  tracking={{
                    type: "cta",
                    id: `tool_${t.id}`,
                    text: t.title,
                    section: "tools"
                  }}
                  onClick={() =>
                    track({
                      name: "tool_card_click",
                      props: { tool_id: t.id, tool_name: t.title, tool_type: t.type }
                    })
                  }
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-fg"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.title}
                >
                  {t.title}
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
    </div>
  );
}
