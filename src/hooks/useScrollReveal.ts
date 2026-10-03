import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Scroll-reveal orchestration for a page root.
 * Adds `.reveal-ready` on mount (arming the CSS hidden state) and reveals
 * every `.reveal` descendant once it intersects the viewport (one-shot).
 * Cascade delays come from each element's inline `--reveal-delay`.
 * Under prefers-reduced-motion the CSS layer disables all of it.
 *
 * Safety net: a passive scroll/resize sweep re-checks unrevealed elements
 * already inside the viewport, so content can never stay hidden if the
 * observer is throttled or misses a state change (e.g. backgrounded
 * webviews, instant anchor jumps).
 */
export function useScrollReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    el.classList.add("reveal-ready");
    const targets = Array.from(el.querySelectorAll<HTMLElement>(".reveal"));
    if (targets.length === 0) return;

    const reveal = (node: Element) => {
      node.classList.add("is-revealed");
    };

    if (!("IntersectionObserver" in window)) {
      targets.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((t) => io.observe(t));

    let raf = 0;
    const sweep = () => {
      raf = 0;
      let pending = false;
      for (const target of targets) {
        if (target.classList.contains("is-revealed")) continue;
        const rect = target.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
          reveal(target);
          io.unobserve(target);
        } else {
          pending = true;
        }
      }
      if (!pending) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sweep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [root]);
}
