import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Scroll-reveal orchestration for a page root.
 * Adds `.reveal-ready` on mount (arming the CSS hidden state) and reveals
 * every `.reveal` descendant once it intersects the viewport (one-shot).
 * Cascade delays come from each element's inline `--reveal-delay`.
 * Under prefers-reduced-motion the CSS layer disables all of it.
 *
 * Self-healing guarantees (content must never stay invisible):
 * 1. A passive scroll/resize sweep re-checks unrevealed elements that are
 *    already inside the viewport (covers missed IO state changes).
 * 2. A 1s interval re-runs the sweep until every target is revealed
 *    (covers throttled IO in backgrounded tabs, where no further scroll
 *    event may ever fire while the content sits on screen).
 * 3. Switching back to the tab triggers an immediate sweep.
 */
export function useScrollReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    el.classList.add("reveal-ready");
    const targets = Array.from(el.querySelectorAll<HTMLElement>(".reveal"));
    if (targets.length === 0) return;

    const inView = (target: HTMLElement) => {
      const rect = target.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.98 && rect.bottom > 0;
    };
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
      for (const target of targets) {
        if (target.classList.contains("is-revealed")) continue;
        if (inView(target)) {
          reveal(target);
          io.unobserve(target);
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sweep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onScroll);

    const guard = window.setInterval(() => {
      sweep();
      if (targets.every((t) => t.classList.contains("is-revealed"))) {
        window.clearInterval(guard);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        document.removeEventListener("visibilitychange", onScroll);
        io.disconnect();
      }
    }, 1000);

    return () => {
      window.clearInterval(guard);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [root]);
}
