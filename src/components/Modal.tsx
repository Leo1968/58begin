import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export function Modal({
  open,
  title,
  onClose,
  children
}: PropsWithChildren<{
  open: boolean;
  title?: string;
  onClose: () => void;
}>) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-fg/30 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn("w-full max-w-lg rounded-none border border-border bg-bg shadow-soft")}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="text-sm font-medium text-fg">{title}</div>
          <Button
            variant="ghost"
            className="h-9 w-9 rounded-full p-0"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
      <button
        className="absolute inset-0 -z-10 cursor-default"
        aria-label="Overlay"
        onClick={onClose}
      />
    </div>
  );
}
