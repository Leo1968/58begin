import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  id
}: {
  id?: string;
  title: string;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-28">
      {eyebrow ? (
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          {eyebrow}
        </div>
      ) : null}
      <h2
        className={cn(
          "font-display text-3xl font-bold tracking-tight text-fg sm:text-5xl",
          eyebrow && "mt-3"
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <div className="mt-4 max-w-[760px] text-sm leading-relaxed text-muted sm:text-base">
          {subtitle}
        </div>
      ) : null}
      <div className="mt-8 h-px w-full bg-border" />
    </div>
  );
}
