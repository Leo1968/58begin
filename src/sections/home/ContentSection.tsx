import { Link } from "react-router-dom";
import type { SiteContent } from "@/content/types";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { TrackedLink } from "@/components/TrackedLink";

export function ContentSection({
  posts,
  findMeOn,
  lang
}: {
  posts: SiteContent["posts"];
  findMeOn: SiteContent["findMeOn"];
  lang: "zh" | "en";
}) {
  return (
    <div className="bg-surface-4">
      <Container className="py-16 sm:py-24">
        <SectionHeading
          id="content"
          title={posts.title}
          subtitle={
            <span>
              {lang === "zh"
                ? "把一次输出变成可检索、可复用、可组合的资产。"
                : "Turn each output into searchable, reusable, composable assets."}
            </span>
          }
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            {posts.items.slice(0, 3).map((p) => (
              <Link key={p.slug} to={`/posts/${p.slug}`} className="group block">
                <Card shape="square" className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="text-base font-semibold text-fg group-hover:underline">
                      {p.title}
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-fg transition-transform duration-200 group-hover:translate-x-0.5"
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
                </Card>
              </Link>
            ))}

            <Link
              to="/posts"
              className="group inline-flex items-center gap-1.5 px-1 text-sm font-medium text-fg"
            >
              {lang === "zh" ? "进入内容中心" : "Go to posts"}
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
              {findMeOn.title}
            </div>
            <div className="mt-4">
              {findMeOn.items.map((it) => (
                <TrackedLink
                  key={it.id}
                  href={it.href}
                  tracking={{ type: "social", platform: it.label }}
                  className="flex items-center justify-between border-b border-border bg-transparent px-1 py-3 text-sm text-fg transition hover:bg-surface-4"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{it.icon}</span>
                    {it.label}
                  </span>
                  <span aria-hidden="true" className="text-muted">
                    →
                  </span>
                </TrackedLink>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
