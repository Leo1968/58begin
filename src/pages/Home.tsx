import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useSectionTracking } from "@/hooks/useSectionTracking";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLangStore } from "@/stores/lang";
import { getSiteContent } from "@/content";
import { track } from "@/utils/analytics";
import { HeroSection } from "@/sections/home/HeroSection";
import { AboutSection } from "@/sections/home/AboutSection";
import { FeaturedSection } from "@/sections/home/FeaturedSection";
import { ContentSection } from "@/sections/home/ContentSection";
import { ProductsSection } from "@/sections/home/ProductsSection";
import { ToolsSection } from "@/sections/home/ToolsSection";
import { ContactSection } from "@/sections/home/ContactSection";
import { ClosingCtaSection } from "@/sections/home/ClosingCtaSection";

export default function Home() {
  const { lang } = useLangStore();
  const content = useMemo(() => getSiteContent(lang), [lang]);
  const location = useLocation();
  const active = useActiveSection(content.nav.sections.map((s) => s.id));

  useSectionTracking(
    content.nav.sections.map((s) => ({ id: s.id, name: s.label }))
  );

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

  useEffect(() => {
    const hash = location.hash?.replace("#", "");
    if (!hash) return;
    const el = document.getElementById(hash);
    if (!el) return;
    window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }, [location.hash]);

  const revealRoot = useRef<HTMLDivElement>(null);
  useScrollReveal(revealRoot);

  return (
    <PageShell activeSectionId={active}>
      <div ref={revealRoot}>
      <HeroSection hero={content.hero} metrics={content.metrics} trustBadges={content.trustBadges} />
      <AboutSection about={content.about} />
      <FeaturedSection featured={content.featured} />
      <ContentSection posts={content.posts} findMeOn={content.findMeOn} lang={lang} />
      <ProductsSection products={content.products} />
      <ToolsSection tools={content.tools} />
      <ContactSection contact={content.contact} lang={lang} />
      <ClosingCtaSection closingCta={content.closingCta} />
      </div>
    </PageShell>
  );
}
