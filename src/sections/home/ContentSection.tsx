import { ArrowUpRight } from "lucide-react";
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
    <Container className="py-14">
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
      <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {posts.items.slice(0, 3).map((p) => (
            <Link key={p.slug} to={`/posts/${p.slug}`} className="group">
              <Card className="hover:border-fg/20">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-base font-semibold text-fg group-hover:opacity-90">
                    {p.title}
                  </div>
                  <div className="text-xs text-muted">
                    {p.date} · {p.readTime}
                  </div>
                </div>
                <div className="mt-2 text-sm leading-relaxed text-muted">
                  {p.excerpt}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="h-fit">
          <div className="text-sm font-medium text-fg">
            {lang === "zh" ? "内容中心" : "Content hub"}
          </div>
          <div className="mt-2 text-sm leading-relaxed text-muted">
            {lang === "zh"
              ? "查看完整文章列表、标签筛选与详情页阅读体验。"
              : "Browse full list, filter by tags, and read in a focused layout."}
          </div>
          <div className="mt-5">
            <Link
              to="/posts"
              className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg hover:bg-fg/90"
            >
              {lang === "zh" ? "进入内容中心" : "Go to posts"}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8">
            <div className="text-xs font-medium text-fg">{findMeOn.title}</div>
            <div className="mt-3 grid gap-2">
              {findMeOn.items.map((it) => (
                <TrackedLink
                  key={it.id}
                  href={it.href}
                  tracking={{ type: "social", platform: it.label }}
                  className="flex items-center justify-between rounded-xl border border-border bg-bg px-3 py-2 text-sm text-fg hover:bg-fg/5"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{it.icon}</span>
                    {it.label}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted" />
                </TrackedLink>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
}

