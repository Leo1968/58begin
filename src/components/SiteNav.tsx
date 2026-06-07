import { useMemo, useState } from "react";
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
    <div className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="font-display text-lg font-semibold tracking-tight text-fg"
          >
            {content.nav.brand}
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {items.map((it) => (
              <button
                key={it.id}
                onClick={() => go(it.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-fg/5 hover:text-fg",
                  onHome &&
                    activeSectionId === it.id &&
                    "bg-fg/5 text-fg"
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
            className="hidden md:inline-flex"
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
            className="h-10 w-10 rounded-full p-0 md:hidden"
            onClick={() => {
              const next = !open;
              setOpen(next);
              track({
                name: "menu_toggle",
                props: { action: next ? "open" : "close", device: "mobile" }
              });
            }}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-border md:hidden">
          <Container className="py-3">
            <div className="grid gap-2">
              <Button variant="secondary" onClick={() => {
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
                  className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm font-medium text-fg"
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

