import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition",
        "hover:-translate-y-0.5 hover:shadow-soft",
        className
      )}
    >
      {children}
    </div>
  );
}

