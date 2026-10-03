import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLangStore } from "@/stores/lang";
import { getSiteContent } from "@/content";
import { track } from "@/utils/analytics";
import { Button } from "./Button";
import { Container } from "./Container";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const DARK_LANG_BUTTON =
  "border-header-border bg-transparent text-header-fg hover:bg-white/10 hover:text-white active:bg-white/15 focus-visible:ring-offset-header-bg";

export function SiteNav({
  activeSectionId
}: {
  activeSectionId?: string | null;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, toggleLang } = useLangStore();
  const content = useMemo(() => getSiteContent(lang), [lang]);
  const [open, setOpen] = useState(false);
  const onHome = location.pathname === "/";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const items = onHome
    ? content.nav.sections
    : [
        { id: "home", label: lang === "zh" ? "首页" : "Home" },
        { id: "posts", label: lang === "zh" ? "内容" : "Content" },
        { id: "privacy", label: lang === "zh" ? "隐私" : "Privacy" }
      ];

  const go = (id: string) => {
    if (onHome) {
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        scrollToId(id);
      }
    } else {
      if (id === "home") navigate("/");
      if (id === "posts") navigate("/posts");
      if (id === "privacy") navigate("/privacy");
    }
    setOpen(false);
  };

  return (
    <div className="sticky top-0 z-40 border-b border-header-border bg-header-bg/95 text-header-fg backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2.5"
            aria-label={content.nav.brand}
          >
            <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-white">
              <img
                src="/pegasus-mark.png"
                alt=""
                width={80}
                height={68}
                className="h-7 w-auto"
              />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-header-fg">
              {content.nav.brand}
            </span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {items.map((it) => (
              <button
                key={it.id}
                onClick={() => go(it.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white",
                  onHome &&
                    activeSectionId === it.id &&
                    "bg-white/10 text-white"
                )}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className={cn("hidden md:inline-flex", DARK_LANG_BUTTON)}
            onClick={() => {
              const from = lang;
              toggleLang();
              const to = lang === "zh" ? "en" : "zh";
              track({ name: "language_switch", props: { from_lang: from, to_lang: to } });
            }}
          >
            {lang === "zh" ? "EN" : "中"}
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "h-10 w-10 rounded-full p-0 md:hidden",
              "text-header-fg hover:bg-white/10 hover:text-white active:bg-white/15 focus-visible:ring-offset-header-bg"
            )}
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="site-nav-mobile-menu"
            onClick={() => {
              const next = !open;
              setOpen(next);
              track({
                name: "menu_toggle",
                props: { action: next ? "open" : "close", device: "mobile" }
              });
            }}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </Container>

      {open ? (
        <div
          id="site-nav-mobile-menu"
          className="border-t border-header-border bg-header-bg md:hidden"
        >
          <Container className="py-3">
            <div className="grid gap-2">
              <Button variant="secondary" className={DARK_LANG_BUTTON} onClick={() => {
                const from = lang;
                toggleLang();
                const to = lang === "zh" ? "en" : "zh";
                track({ name: "language_switch", props: { from_lang: from, to_lang: to } });
                setOpen(false);
              }}>
                {lang === "zh" ? "EN" : "中"}
              </Button>
              {items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => go(it.id)}
                  className="rounded-xl border border-header-border bg-transparent px-4 py-3 text-left text-sm font-medium text-header-fg transition hover:bg-white/10"
                >
                  {it.label}
                </button>
              ))}
            </div>
          </Container>
        </div>
      ) : null}
    </div>
  );
}
