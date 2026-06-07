import { useEffect, useRef } from "react";
import { track } from "@/utils/analytics";

export function useSectionTracking(
  sections: { id: string; name: string }[]
) {
  const seen = useRef(new Set<string>());

  useEffect(() => {
    const els = sections
      .map((s) => ({ ...s, el: document.getElementById(s.id) }))
      .filter((s) => s.el) as { id: string; name: string; el: HTMLElement }[];
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = (entry.target as HTMLElement).id;
          const item = els.find((x) => x.id === id);
          if (!item) return;
          if (seen.current.has(id)) return;
          seen.current.add(id);
          track({
            name: "section_view",
            props: { section_id: id, section_name: item.name }
          });
        });
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.15, 0.3] }
    );

    els.forEach((s) => observer.observe(s.el));
    return () => observer.disconnect();
  }, [sections.map((s) => s.id).join("|")]);
}

