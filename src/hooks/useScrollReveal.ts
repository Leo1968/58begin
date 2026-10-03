import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Scroll-reveal orchestration for a page root.
 * Adds `.reveal-ready` on mount (arming the CSS hidden state) and reveals
 * every `.reveal` descendant once it intersects the viewport (one-shot).
 * Cascade delays come from each element's inline `--reveal-delay`.
 * Under prefers-reduced-motion the CSS layer disables all of it.
 */
export function useScrollReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    el.classList.add("reveal-ready");
    const targets = Array.from(el.querySelectorAll<HTMLElement>(".reveal"));
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [root]);
}
