import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Toast({
  open,
  children
}: {
  open: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-5 left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2",
        open ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className={cn(
          "pointer-events-auto rounded-2xl border border-border bg-card px-4 py-3 text-sm text-fg shadow-soft transition",
          open ? "translate-y-0" : "translate-y-2"
        )}
      >
        {children}
      </div>
    </div>
  );
}

