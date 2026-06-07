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
      <Container className="py-14">
        <div className="max-w-[860px]">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-fg">
            {content.privacy.title}
          </h1>
          <div className="mt-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight text-fg">
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

