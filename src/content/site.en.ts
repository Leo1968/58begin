import type { SiteContent } from "./types";

export const siteEn: SiteContent = {
  seo: {
    title: "58begin",
    description:
      "58begin.com — a personal brand site with featured work, content, products, tools, and contact entry points."
  },
  nav: {
    brand: "58begin",
    sections: [
      { id: "about", label: "About" },
      { id: "featured", label: "Featured" },
      { id: "content", label: "Content" },
      { id: "products", label: "Products" },
      { id: "tools", label: "Tools" },
      { id: "contact", label: "Contact" }
    ]
  },
  hero: {
    kicker: "Hi, I'm",
    title: "58begin",
    subtitle:
      "Build a long-term business with clear positioning, reusable content assets, and a productized offer stack.",
    primaryCta: { text: "Explore products", href: "#products" },
    secondaryCta: { text: "See featured work", href: "#featured" }
  },
  metrics: [
    { label: "Students", value: "30,000+" },
    { label: "Followers", value: "1,500,000+" },
    { label: "Rating", value: "9.2/10" }
  ],
  about: {
    title: "About 58begin",
    paragraphs: [
      "This is the official home for 58begin. Get a fast overview of who I am, what I do, and how to start working together.",
      "I believe clear communication, compounding content assets, and productized delivery are the core levers for long-term growth."
    ],
    highlights: [
      "Positioning & messaging",
      "Content systems & growth",
      "Productization",
      "AI leverage"
    ]
  },
  featured: {
    title: "Featured",
    items: [
      {
        id: "book-1",
        title: "The Passion Business Playbook",
        description:
          "A practical guide to building a personal brand and turning your expertise into products.",
        ctaText: "Learn more",
        ctaHref: "https://example.com"
      }
    ]
  },
  findMeOn: {
    title: "Find me on",
    items: [
      { id: "rednote", label: "RedNote", href: "https://example.com", icon: "📕" },
      { id: "douyin", label: "Douyin", href: "https://example.com", icon: "🎵" },
      { id: "x", label: "X.com", href: "https://example.com", icon: "🐦" },
      { id: "youtube", label: "YouTube", href: "https://example.com", icon: "▶" }
    ]
  },
  products: {
    title: "Products & Services",
    groups: [
      {
        id: "courses",
        title: "Programs",
        items: [
          {
            id: "creator-bootcamp",
            title: "Creator Bootcamp",
            description: "Build your personal brand and a sustainable online business.",
            tag: "Program",
            ctaText: "View details",
            ctaHref: "https://example.com"
          },
          {
            id: "ai-solo",
            title: "AI Solopreneur Intensive",
            description:
              "Multiply your output with AI tools and build a one-person company.",
            tag: "Program",
            ctaText: "View details",
            ctaHref: "https://example.com"
          }
        ]
      },
      {
        id: "partnership",
        title: "Partnerships",
        items: [
          {
            id: "brand",
            title: "Brand Partnerships",
            description:
              "Open to interviews, sponsored videos, and content collaborations.",
            tag: "Business",
            ctaText: "Get in touch",
            ctaHref: "#contact"
          }
        ]
      }
    ]
  },
  tools: {
    title: "Tools",
    items: [
      {
        id: "tool-1",
        title: "CoverMagic",
        type: "Web App",
        description: "Generate platform-ready thumbnails in seconds.",
        href: "https://example.com"
      }
    ]
  },
  contact: {
    title: "Contact",
    description: "For programs, consulting, or partnerships, reach out via email or the form.",
    email: "hello@58begin.com",
    wechatLabel: "WeChat",
    form: {
      title: "Inquiry form",
      nameLabel: "Name",
      emailLabel: "Email",
      wechatLabel: "WeChat",
      companyLabel: "Company",
      intentLabel: "Intent",
      messageLabel: "Message",
      submitText: "Submit",
      successText: "Received. I will get back to you soon.",
      errorText: "Failed to submit. Please try again later or email me directly.",
      intents: [
        { value: "course", label: "Program" },
        { value: "consulting", label: "Consulting" },
        { value: "partnership", label: "Partnership" },
        { value: "other", label: "Other" }
      ]
    }
  },
  posts: {
    title: "Content",
    items: [
      {
        slug: "start-with-positioning",
        title: "Start with a one-line positioning statement",
        excerpt:
          "Positioning is not a slogan. It's a default choice in a specific audience's mind. Here's a practical template.",
        date: "2026-06-06",
        readTime: "6 min",
        tags: ["Positioning", "Messaging"],
        body: `## A simple template\n\n> I help {who} achieve {result} in {context} using {method}.\n\n## Next step\n\nWrite your version and ask 3 target users to repeat it back to you.`
      }
    ]
  },
  privacy: {
    title: "Privacy",
    body: `## What we collect\n\n- Usage data (page views, clicks, language, section exposure).\n- Form data you submit (name, email, WeChat, company, intent, message).\n\n## Why\n\n- To respond to your inquiry.\n- To improve the site.\n\n## Contact\n\nEmail us to request access, correction, or deletion of your data.\n`
  }
};

