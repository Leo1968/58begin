import { useMemo } from "react";
import { useLangStore } from "@/stores/lang";
import { getSiteContent } from "@/content";

/**
 * Dark announcement marquee above the sticky header.
 * Pure CSS animation (translateX loop over two identical copies);
 * `motion-reduce:animate-none` renders it as a static single line.
 */
export function AnnouncementTicker() {
  const { lang } = useLangStore();
  const content = useMemo(() => getSiteContent(lang), [lang]);
  const items = content.announcement.items;

  return (
    <div
      className="overflow-hidden bg-header-bg text-header-fg"
      role="region"
      aria-label={lang === "zh" ? "站点公告" : "Announcements"}
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className="flex shrink-0 items-center"
          >
            {items.map((text, i) => (
              <li
                key={i}
                className="flex items-center whitespace-nowrap py-2 text-xs text-white/80"
              >
                <span aria-hidden="true" className="px-4 text-white/40">
                  ·
                </span>
                {text}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
