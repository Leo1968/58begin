import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  subtitle,
  id
}: {
  id?: string;
  title: string;
  subtitle?: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-28">
      <div className="flex items-end justify-between gap-6">
        <h2
          className={cn(
            "font-display text-3xl font-semibold tracking-tight text-fg",
            "sm:text-4xl"
          )}
        >
          {title}
        </h2>
      </div>
      {subtitle ? (
        <div className="mt-3 max-w-[760px] text-sm leading-relaxed text-muted sm:text-base">
          {subtitle}
        </div>
      ) : null}
      <div className="mt-6 h-px w-full bg-border" />
    </div>
  );
}

