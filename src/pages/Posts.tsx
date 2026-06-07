import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { useLangStore } from "@/stores/lang";
import { getSiteContent } from "@/content";
import { track } from "@/utils/analytics";

export default function Posts() {
  const { lang } = useLangStore();
  const content = useMemo(() => getSiteContent(lang), [lang]);
  const [params, setParams] = useSearchParams();
  const tag = params.get("tag");

  const allTags = useMemo(() => {
    const s = new Set<string>();
    content.posts.items.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s);
  }, [content.posts.items]);

  const posts = useMemo(() => {
    if (!tag) return content.posts.items;
    return content.posts.items.filter((p) => p.tags.includes(tag));
  }, [content.posts.items, tag]);

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
        <div className="max-w-[900px]">
          <div className="font-display text-4xl font-semibold tracking-tight text-fg">
            {content.posts.title}
          </div>
          <div className="mt-3 text-sm text-muted">
            {lang === "zh"
              ? "长期增长来自可检索、可复用的内容资产。"
              : "Long-term growth comes from searchable, reusable content assets."}
          </div>

          {allTags.length ? (
            <div className="mt-8 flex flex-wrap gap-2">
              <button
                onClick={() => setParams({})}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  !tag
                    ? "border-fg/20 bg-fg/5 text-fg"
                    : "border-border bg-card text-muted hover:text-fg"
                }`}
              >
                {lang === "zh" ? "全部" : "All"}
              </button>
              {allTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setParams({ tag: t })}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    tag === t
                      ? "border-fg/20 bg-fg/5 text-fg"
                      : "border-border bg-card text-muted hover:text-fg"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-8 grid gap-4">
            {posts.map((p) => (
              <Link key={p.slug} to={`/posts/${p.slug}`} className="group">
                <Card className="hover:border-fg/20">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-lg font-semibold text-fg transition group-hover:opacity-90">
                      {p.title}
                    </div>
                    <div className="text-xs text-muted">
                      {p.date} · {p.readTime}
                    </div>
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-muted">
                    {p.excerpt}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border bg-bg px-2 py-0.5 text-[11px] text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </PageShell>
  );
}

