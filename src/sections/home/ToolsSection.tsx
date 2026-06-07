import { ArrowUpRight } from "lucide-react";
import type { SiteContent } from "@/content/types";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { TrackedLink } from "@/components/TrackedLink";
import { track } from "@/utils/analytics";

export function ToolsSection({ tools }: { tools: SiteContent["tools"] }) {
  return (
    <Container className="py-14">
      <SectionHeading id="tools" title={tools.title} />
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {tools.items.map((t) => (
          <Card key={t.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-fg">{t.title}</div>
                <div className="mt-1 text-xs text-muted">{t.type}</div>
              </div>
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg hover:bg-fg/5"
                aria-label={t.title}
              >
                <ArrowUpRight className="h-4 w-4 text-muted" />
              </TrackedLink>
            </div>
            <div className="mt-3 text-sm leading-relaxed text-muted">
              {t.description}
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}

