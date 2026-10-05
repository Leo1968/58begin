import type { PropsWithChildren } from "react";
import { Helmet } from "react-helmet-async";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useLangStore } from "@/stores/lang";
import { getSiteContent } from "@/content";
import { Container } from "./Container";
import { SiteNav } from "./SiteNav";
import { AnnouncementTicker } from "./AnnouncementTicker";
import { ChatWidget } from "./ChatWidget";

export function PageShell({
  activeSectionId,
  children
}: PropsWithChildren<{ activeSectionId?: string | null }>) {
  const { lang } = useLangStore();
  const content = useMemo(() => getSiteContent(lang), [lang]);

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
        <Container className="grid gap-10 py-14 sm:grid-cols-2">
          <div>
            <img
              src="/footer-logo.png"
              alt={content.nav.brand}
              width={720}
              height={691}
              className="h-16 w-auto"
            />
            <p className="mt-3 text-sm leading-relaxed text-footer-text/80">
              {content.footerTagline}
            </p>
          </div>

          <div className="sm:justify-self-end sm:text-right">
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
          <Container className="py-5 text-xs">
            <div>© {new Date().getFullYear()} {content.copyright}</div>
          </Container>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
