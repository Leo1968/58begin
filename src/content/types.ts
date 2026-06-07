export type Lang = "zh" | "en";

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
};

export type FeaturedItem = {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
};

export type ProductItem = {
  id: string;
  title: string;
  description: string;
  tag?: string;
  ctaText: string;
  ctaHref: string;
};

export type ProductGroup = {
  id: string;
  title: string;
  items: ProductItem[];
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
  nav: {
    brand: string;
    sections: { id: string; label: string }[];
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    primaryCta: { text: string; href: string };
    secondaryCta: { text: string; href: string };
  };
  metrics: Metric[];
  about: {
    title: string;
    paragraphs: string[];
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
    groups: ProductGroup[];
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
  posts: {
    title: string;
    items: { slug: string; title: string; excerpt: string; date: string; readTime: string; tags: string[]; body: string }[];
  };
  privacy: {
    title: string;
    body: string;
  };
};

