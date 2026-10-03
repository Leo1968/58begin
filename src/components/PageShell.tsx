import type { PropsWithChildren } from "react";
import { Helmet } from "react-helmet-async";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useLangStore } from "@/stores/lang";
import { getSiteContent } from "@/content";
import { Container } from "./Container";
import { SiteNav } from "./SiteNav";
import { AnnouncementTicker } from "./AnnouncementTicker";

export function PageShell({
  activeSectionId,
  children
}: PropsWithChildren<{ activeSectionId?: string | null }>) {
  const { lang } = useLangStore();
  const content = useMemo(() => getSiteContent(lang), [lang]);

  const siteLinks = [
    { to: "/", label: lang === "zh" ? "首页" : "Home" },
    { to: "/posts", label: lang === "zh" ? "内容" : "Content" },
    { to: "/privacy", label: lang === "zh" ? "隐私" : "Privacy" }
  ];

  return (
    <div className="min-h-dvh">
      <Helmet>
        <title>{content.seo.title}</title>
        <meta name="description" content={content.seo.description} />
      </Helmet>

      <AnnouncementTicker />

      <SiteNav activeSectionId={activeSectionId} />

      <main>{children}</main>

      <footer className="border-t border-header-border bg-header-bg text-footer-text">
        <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-display text-lg font-bold tracking-tight text-header-fg">
              {content.nav.brand}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-footer-text/80">
              {content.seo.description}
            </p>
          </div>

          <nav aria-label={lang === "zh" ? "站点导航" : "Site"}>
            <div className="text-xs uppercase tracking-[0.2em] text-white/50">
              {lang === "zh" ? "站点" : "Site"}
            </div>
            <ul className="mt-4 grid gap-2 text-sm">
              {siteLinks.map((l) => (
                <li key={l.to}>
                  <Link className="transition hover:text-white" to={l.to}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/50">
              {content.findMeOn.title}
            </div>
            <ul className="mt-4 grid gap-2 text-sm">
              {content.findMeOn.items.map((item) => (
                <li key={item.id}>
                  <a
                    className="transition hover:text-white"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/50">
              {lang === "zh" ? "联系" : "Contact"}
            </div>
            <ul className="mt-4 grid gap-2 text-sm">
              <li>
                <a className="transition hover:text-white" href={`mailto:${content.contact.email}`}>
                  {content.contact.email}
                </a>
              </li>
              <li>
                <Link className="transition hover:text-white" to="/privacy">
                  {content.privacy.title}
                </Link>
              </li>
            </ul>
          </div>
        </Container>

        <div className="border-t border-header-border">
          <Container className="flex flex-col items-start justify-between gap-2 py-5 text-xs sm:flex-row sm:items-center">
            <div>© {new Date().getFullYear()} {content.nav.brand}</div>
            <div>
              {lang === "zh"
                ? "本网站内容支持持续更新与版本迭代。"
                : "This site is continuously updated and iterated."}
            </div>
          </Container>
        </div>
      </footer>
    </div>
  );
}
