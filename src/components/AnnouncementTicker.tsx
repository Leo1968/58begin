import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLangStore } from "@/stores/lang";
import { getSiteContent } from "@/content";

/**
 * Dark announcement bar, three-segment grammar measured from the reference:
 * social slot | single centered message with prev/next arrows | utility slot.
 * Auto-advances every 6s (pauses on hover, disabled under
 * prefers-reduced-motion); arrows always available.
 */
export function AnnouncementTicker() {
  const { lang } = useLangStore();
  const content = useMemo(() => getSiteContent(lang), [lang]);
  const items = content.announcement.items;
  const social = content.findMeOn.items.find((it) => it.id === "x");

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length < 2 || paused) return;
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      6000
    );
    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  const arrowsLabel = lang === "zh" ? "公告" : "Announcements";
  const multi = items.length > 1;

  return (
    <div
      className="bg-header-bg text-header-fg"
      role="region"
      aria-label={lang === "zh" ? "站点公告" : "Announcements"}
    >
      <div className="grid h-10 grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
        {/* left slot: social link (hidden on small screens, cell keeps the grid) */}
        <div className="hidden sm:block">
          {social ? (
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-sm font-bold tracking-tight text-white/80 transition hover:text-white"
            >
              𝕏
            </a>
          ) : null}
        </div>

        {/* center slot: one message at a time, chevrons when multiple */}
        <div
          className="flex items-center justify-center gap-2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {multi ? (
            <button
              type="button"
              onClick={prev}
              aria-label={
                lang === "zh" ? "上一条公告" : "Previous announcement"
              }
              className="rounded-full p-0.5 text-white/50 transition hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : null}
          <p
            key={index}
            aria-live="polite"
            className={cn(
              "truncate px-1 text-center text-[13px] leading-tight text-white/90",
              "motion-reduce:animate-none"
            )}
            style={{ animation: multi ? "announce-fade .4s ease-out" : undefined }}
          >
            {items[index]}
          </p>
          {multi ? (
            <button
              type="button"
              onClick={next}
              aria-label={lang === "zh" ? "下一条公告" : "Next announcement"}
              className="rounded-full p-0.5 text-white/50 transition hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {/* right slot: email shortcut */}
        <div className="hidden text-right sm:block">
          <a
            href={`mailto:${content.contact.email}`}
            className="text-xs text-white/60 transition hover:text-white"
          >
            {content.contact.email}
          </a>
        </div>
      </div>
    </div>
  );
}
