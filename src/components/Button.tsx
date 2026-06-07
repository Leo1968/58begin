import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        variant === "primary" &&
          "bg-fg text-bg hover:bg-fg/90 active:bg-fg/85",
        variant === "secondary" &&
          "border border-border bg-card text-fg hover:bg-fg/5 active:bg-fg/10",
        variant === "ghost" &&
          "text-fg hover:bg-fg/5 active:bg-fg/10",
        className
      )}
      {...props}
    />
  );
}

