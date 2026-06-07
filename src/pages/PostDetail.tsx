import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PageShell } from "@/components/PageShell";
import { Container } from "@/components/Container";
import { useLangStore } from "@/stores/lang";
import { getSiteContent } from "@/content";
import { track } from "@/utils/analytics";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractToc(markdown: string) {
  const lines = markdown.split("\n");
  const items: { depth: number; text: string; id: string }[] = [];
  for (const line of lines) {
    const m = /^(#{2,3})\s+(.*)\s*$/.exec(line);
    if (!m) continue;
    const depth = m[1].length;
    const text = m[2].trim();
    items.push({ depth, text, id: slugify(text) });
  }
  return items;
}

export default function PostDetail() {
  const { slug } = useParams();
  const { lang } = useLangStore();
  const content = useMemo(() => getSiteContent(lang), [lang]);

  const post = useMemo(
    () => content.posts.items.find((p) => p.slug === slug),
    [content.posts.items, slug]
  );

  const toc = useMemo(() => extractToc(post?.body ?? ""), [post?.body]);

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

  if (!post) {
    return (
      <PageShell>
        <Container className="py-14">
          <div className="text-sm text-muted">
            {lang === "zh" ? "内容不存在。" : "Post not found."}
          </div>
          <div className="mt-4">
            <Link
              to="/posts"
              className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-fg hover:bg-fg/5"
            >
              {lang === "zh" ? "返回内容中心" : "Back to posts"}
            </Link>
          </div>
        </Container>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <article className="max-w-[860px]">
            <div className="text-xs text-muted">
              {post.date} · {post.readTime}
            </div>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-fg">
              {post.title}
            </h1>
            <div className="mt-6">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => {
                    const text = String(children);
                    const id = slugify(text);
                    return (
                      <h2
                        id={id}
                        className="mt-10 scroll-mt-28 font-display text-2xl font-semibold tracking-tight text-fg"
                      >
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children }) => {
                    const text = String(children);
                    const id = slugify(text);
                    return (
                      <h3
                        id={id}
                        className="mt-8 scroll-mt-28 text-lg font-semibold text-fg"
                      >
                        {children}
                      </h3>
                    );
                  },
                  p: ({ children }) => (
                    <p className="mt-4 text-sm leading-relaxed text-fg/90 sm:text-base">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-fg/90 sm:text-base">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-fg/90 sm:text-base">
                      {children}
                    </ol>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="mt-4 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-fg/90">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline-offset-4 hover:underline"
                    >
                      {children}
                    </a>
                  )
                }}
              >
                {post.body}
              </ReactMarkdown>
            </div>

            <div className="mt-12 border-t border-border pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/posts"
                  className="text-sm font-medium text-fg hover:underline"
                >
                  {lang === "zh" ? "← 返回内容中心" : "← Back to posts"}
                </Link>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(window.location.href);
                  }}
                  className="text-sm font-medium text-muted hover:text-fg"
                >
                  {lang === "zh" ? "复制链接" : "Copy link"}
                </button>
              </div>
            </div>
          </article>

          {toc.length ? (
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
                <div className="text-xs font-medium text-fg">
                  {lang === "zh" ? "目录" : "Contents"}
                </div>
                <div className="mt-3 grid gap-2">
                  {toc.map((it) => (
                    <a
                      key={it.id}
                      href={`#${it.id}`}
                      className={`text-sm text-muted hover:text-fg ${
                        it.depth === 3 ? "pl-3" : ""
                      }`}
                    >
                      {it.text}
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </Container>
    </PageShell>
  );
}

