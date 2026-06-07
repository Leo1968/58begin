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
      <Container className="py-20">
        <div className="max-w-xl">
          <div className="font-display text-4xl font-semibold tracking-tight">
            {lang === "zh" ? "页面不存在" : "Page not found"}
          </div>
          <div className="mt-3 text-sm text-muted">
            {lang === "zh"
              ? "你访问的页面不存在或已被移动。"
              : "The page you are looking for doesn't exist."}
          </div>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-fg hover:bg-fg/5"
            >
              {content.nav.brand} / {lang === "zh" ? "返回首页" : "Back home"}
            </Link>
          </div>
        </div>
      </Container>
    </PageShell>
  );
}

