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
      <Container className="py-16 sm:py-24">
        <div className="max-w-[900px]">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
            {lang === "zh" ? "内容中心" : "Content hub"}
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-fg sm:text-5xl">
            {content.posts.title}
          </h1>
          <div className="mt-4 text-sm text-muted sm:text-base">
            {lang === "zh"
              ? "长期增长来自可检索、可复用的内容资产。"
              : "Long-term growth comes from searchable, reusable content assets."}
          </div>

          {allTags.length ? (
            <div className="mt-8 flex flex-wrap gap-2">
              <button
                onClick={() => setParams({})}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  !tag
                    ? "border-fg bg-fg text-bg"
                    : "border-border bg-transparent text-muted hover:border-fg/40 hover:text-fg"
                }`}
              >
                {lang === "zh" ? "全部" : "All"}
              </button>
              {allTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setParams({ tag: t })}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                    tag === t
                      ? "border-fg bg-fg text-bg"
                      : "border-border bg-transparent text-muted hover:border-fg/40 hover:text-fg"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-10 grid gap-4">
            {posts.map((p) => (
              <Link key={p.slug} to={`/posts/${p.slug}`} className="group block">
                <Card shape="square" className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="text-lg font-semibold text-fg group-hover:underline">
                      {p.title}
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-fg transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </div>
                  <div className="mt-1.5 text-xs text-muted">
                    {p.date} · {p.readTime}
                  </div>
                  <div className="mt-3 text-sm leading-relaxed text-muted">
                    {p.excerpt}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-surface-3 px-2.5 py-1 text-[11px] font-medium text-fg/80"
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

