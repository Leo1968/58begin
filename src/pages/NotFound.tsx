import { Link } from "react-router-dom";
import { useMemo } from "react";
import { PageShell } from "@/components/PageShell";
import { Container } from "@/components/Container";
import { useLangStore } from "@/stores/lang";
import { getSiteContent } from "@/content";

export default function NotFound() {
  const { lang } = useLangStore();
  const content = useMemo(() => getSiteContent(lang), [lang]);

  return (
    <PageShell>
      <Container className="py-24 sm:py-32">
        <div className="max-w-xl">
          <div aria-hidden="true" className="font-accent text-2xl text-muted">
            404
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-fg sm:text-5xl">
            {lang === "zh" ? "页面不存在" : "Page not found"}
          </h1>
          <div className="mt-4 text-sm text-muted sm:text-base">
            {lang === "zh"
              ? "你访问的页面不存在或已被移动。"
              : "The page you are looking for doesn't exist."}
          </div>
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg transition hover:bg-fg/90"
            >
              {content.nav.brand} / {lang === "zh" ? "返回首页" : "Back home"}
            </Link>
          </div>
        </div>
      </Container>
    </PageShell>
  );
}
