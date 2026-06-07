import type { PropsWithChildren } from "react";
import { Helmet } from "react-helmet-async";
import { useMemo } from "react";
import { useLangStore } from "@/stores/lang";
import { getSiteContent } from "@/content";
import { Container } from "./Container";
import { SiteNav } from "./SiteNav";

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

      <SiteNav activeSectionId={activeSectionId} />

      <main>{children}</main>

      <footer className="mt-24 border-t border-border">
        <Container className="flex flex-col items-start justify-between gap-3 py-10 sm:flex-row sm:items-center">
          <div className="text-sm text-muted">
            © {new Date().getFullYear()} {content.nav.brand}
          </div>
          <div className="text-xs text-muted">
            {lang === "zh"
              ? "本网站内容支持持续更新与版本迭代。"
              : "This site is continuously updated and iterated."}
          </div>
        </Container>
      </footer>
    </div>
  );
}

