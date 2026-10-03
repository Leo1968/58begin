import { useEffect, useRef } from "react";

/**
 * 3px accent-spectrum scroll-progress bar, pinned to the top edge.
 * Opt-in visual module: `enabled` defaults to false (V1.1 P2 keeps it off
 * until the visual gate approves turning it on).
 * rAF-throttled passive scroll listener; hidden entirely under
 * prefers-reduced-motion.
 */
export function RainbowProgress({ enabled = false }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
      el.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left scale-x-0 bg-spectrum motion-reduce:hidden"
    />
  );
}
