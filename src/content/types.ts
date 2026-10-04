export type Lang = "zh" | "en";

import type { BrandIconName } from "@/components/BrandIcons";

export type Metric = {
  label: string;
  value: string;
  note?: string;
};

export type LinkItem = {
  id: string;
  label: string;
  href: string;
  icon?: string;
  iconKey?: BrandIconName;
};

export type FeaturedItem = {
  id: string;
  title: string;
  description: string;
  images?: { src: string; alt: string; width: number; height: number }[];
  ctaText?: string;
  ctaHref?: string;
};

export type ProductItem = {
  id: string;
  title: string;
  /** one-line positioning shown right under the title */
  positioning?: string;
  description: string;
  tag?: string;
  ctaText?: string;
  ctaHref?: string;
};

export type ToolItem = {
  id: string;
  title: string;
  type: string;
  description: string;
  href: string;
};

export type SiteContent = {
  seo: {
    title: string;
    description: string;
  };
  /** short brand slogan shown under the footer logo */
  footerTagline: string;
  /** entity name shown in the footer copyright bar (may differ from site brand) */
  copyright: string;
  nav: {
    brand: string;
    sections: { id: string; label: string }[];
  };
  announcement: {
    items: string[];
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    primaryCta: { text: string; href: string };
    secondaryCta: { text: string; href: string };
  };
  metrics: Metric[];
  trustBadges: { label: string; detail: string }[];
  about: {
    title: string;
    mission: { title: string; body: string };
    vision: { title: string; body: string };
    paragraphs: string[];
    /** belief statement, rendered with the same emphasis as mission/vision */
    belief: string;
    highlights: string[];
  };
  featured: {
    title: string;
    items: FeaturedItem[];
  };
  findMeOn: {
    title: string;
    items: LinkItem[];
  };
  products: {
    title: string;
    items: ProductItem[];
  };
  tools: {
    title: string;
    items: ToolItem[];
  };
  contact: {
    title: string;
    description: string;
    email: string;
    wechatLabel: string;
    wechatQr?: { src: string; alt: string };
    form: {
      title: string;
      nameLabel: string;
      emailLabel: string;
      wechatLabel: string;
      companyLabel: string;
      intentLabel: string;
      messageLabel: string;
      submitText: string;
      successText: string;
      errorText: string;
      intents: { value: "course" | "consulting" | "partnership" | "other"; label: string }[];
    };
  };
  closingCta: {
    title: string;
    subtitle: string;
    primaryCta: { text: string; href: string };
    secondaryCta: { text: string; href: string };
  };
  posts: {
    title: string;
    items: { slug: string; title: string; excerpt: string; date: string; readTime: string; tags: string[]; body: string }[];
  };
  privacy: {
    title: string;
    body: string;
  };
};
