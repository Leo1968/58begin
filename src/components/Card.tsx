import type { CSSProperties, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  shape = "rounded",
  style
}: PropsWithChildren<{
  className?: string;
  /** rounded = legacy soft card; square = hairline flat card; product = 20px product card */
  shape?: "rounded" | "square" | "product";
  style?: CSSProperties;
}>) {
  return (
    <div
      style={style}
      className={cn(
        "border border-border bg-card p-5 transition",
        shape === "rounded" &&
          "rounded-2xl shadow-[0_1px_0_rgba(0,0,0,0.02)] hover:-translate-y-0.5 hover:shadow-soft",
        shape === "square" && "rounded-none hover:bg-surface-4",
        shape === "product" && "rounded-[20px] hover:bg-surface-4",
        className
      )}
    >
      {children}
    </div>
  );
}
