import { useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PageShell } from "@/components/PageShell";
import { Container } from "@/components/Container";
import { useLangStore } from "@/stores/lang";
import { getSiteContent } from "@/content";
import { track } from "@/utils/analytics";

export default function Privacy() {
  const { lang } = useLangStore();
  const content = useMemo(() => getSiteContent(lang), [lang]);

  useEffect(() => {
    track({
      name: "page_view",
      props: {
        url: window.location.href,
        referrer: document.referrer,
        lang,
        device: window.innerWidth < 768 ? "mobile" : "desktop"
      }
    });
  }, [lang]);

  return (
    <PageShell>
      <Container className="section-y">
        <div className="max-w-[860px]">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
            {lang === "zh" ? "法律声明" : "Legal"}
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-fg sm:text-5xl">
            {content.privacy.title}
          </h1>
          <div className="mt-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 className="mt-10 font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="mt-4 text-sm leading-relaxed text-fg/90 sm:text-base">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-fg/90 sm:text-base">
                    {children}
                  </ul>
                )
              }}
            >
              {content.privacy.body}
            </ReactMarkdown>
          </div>
        </div>
      </Container>
    </PageShell>
  );
}

