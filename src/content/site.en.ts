import type { SiteContent } from "./types";

export const siteEn: SiteContent = {
  seo: {
    title: "58begin",
    description:
      "58begin.com — official site for a personal brand and product matrix: featured work, content, products & services, tools, and contact entry points."
  },
  nav: {
    brand: "58begin",
    sections: [
      { id: "about", label: "About" },
      { id: "culture", label: "Culture" },
      { id: "featured", label: "Featured" },
      { id: "content", label: "Content" },
      { id: "products", label: "Products & Services" },
      { id: "tools", label: "Tools" },
      { id: "contact", label: "Contact" }
    ]
  },
  hero: {
    kicker: "Hi, I'm",
    title: "58begin",
    subtitle:
      "｜A new chapter for an old soul｜Starting a venture at 58. A not-so-famous product manager, a seasoned hardware veteran.",
    primaryCta: { text: "View products & services", href: "#products" },
    secondaryCta: { text: "Explore featured work", href: "#featured" }
  },
  metrics: [
    { label: "Invention patents", value: "5" },
    { label: "Projects delivered", value: "11" },
    { label: "Satisfaction", value: "9.3/10" }
  ],
  about: {
    title: "About 58begin",
    mission: {
      title: "Mission",
      body: "Making innovative medical devices faster, safer, and accessible worldwide."
    },
    vision: {
      title: "Vision",
      body: "To become the world's leading AI-powered engine accelerating medical device innovation, regulatory excellence, and commercialization."
    },
    paragraphs: [
      "This is the official site for 58begin. Here you can quickly learn who I am, what I do, what problems I can help you solve, and how to start working together.",
      "I believe: the reason something feels impossible is simply because you haven't done it yet."
    ],
    highlights: [
      "Hardware positioning",
      "Break down product requirements",
      "Close the business loop",
      "Leverage AI"
    ]
  },
  culture: {
    title: "Our Values",
    items: [
      { title: "Mission Driven", description: "Innovating to improve lives." },
      { title: "Innovation", description: "Breaking technology boundaries to transform healthcare." },
      {
        title: "Responsibility",
        description: "Respecting life through uncompromising quality and safety."
      },
      { title: "Execution", description: "Turning bold ideas into real-world medical solutions." },
      {
        title: "Collaboration",
        description: "Building a global ecosystem for healthcare innovation."
      }
    ]
  },
  featured: {
    title: "Featured",
    items: [
      {
        id: "book-1",
        title: "Soil Tension Sensor ZL202211359507.7",
        description:
          "Uses soil tension as a core indicator of plants’ water uptake capacity. By continuously monitoring root-zone moisture dynamics with a low-cost sensor, it enables a precise shift from experience-based irrigation to on-demand irrigation, providing critical data infrastructure for smart agriculture.",
        ctaText: "Learn & buy",
        ctaHref: "https://example.com"
      }
    ]
  },
  findMeOn: {
    title: "Find me here",
    items: [
      { id: "rednote", label: "RedNote", href: "https://example.com", icon: "📕" },
      { id: "douyin", label: "Douyin", href: "https://example.com", icon: "🎵" },
      { id: "x", label: "X.com", href: "https://example.com", icon: "🐦" },
      { id: "youtube", label: "YouTube", href: "https://example.com", icon: "▶" },
      { id: "bilibili", label: "Bilibili", href: "https://example.com", icon: "📺" }
    ]
  },
  products: {
    title: "Products & Services",
    groups: [
      {
        id: "courses",
        title: "Courses",
        items: [
          {
            id: "creator-bootcamp",
            title: "Creator Bootcamp",
            description:
              "Build a personal brand from scratch and set up a sustainable online business.",
            tag: "Course",
            ctaText: "View details",
            ctaHref: "https://example.com"
          },
          {
            id: "ai-solo",
            title: "AI Solopreneur Practicum",
            description:
              "Amplify efficiency with AI tools and create outsized value as a one-person company.",
            tag: "Course",
            ctaText: "View details",
            ctaHref: "https://example.com"
          }
        ]
      },
      {
        id: "partnership",
        title: "Business partnerships",
        items: [
          {
            id: "brand",
            title: "Brand Partnerships",
            description:
              "Reach a high-quality audience. Open to interviews, sponsored videos, and co-created content collaborations.",
            tag: "Partnership",
            ctaText: "Submit partnership inquiry",
            ctaHref: "#contact"
          }
        ]
      }
    ]
  },
  tools: {
    title: "Tools & Projects",
    items: [
      {
        id: "tool-1",
        title: "CoverMagic",
        type: "Web App",
        description:
          "Enter a title and style to generate platform-ready cover images in one click.",
        href: "https://example.com"
      },
      {
        id: "tool-2",
        title: "X Reply Helper",
        type: "Chrome Extension",
        description: "Helps you generate more natural replies in the other person's language.",
        href: "https://example.com"
      }
    ]
  },
  contact: {
    title: "Contact",
    description:
      "If you'd like to inquire about courses or discuss partnerships, feel free to reach out via the channels below.",
    email: "hello@58begin.com",
    wechatLabel: "Scan to add WeChat",
    form: {
      title: "Partnership / booking form",
      nameLabel: "Name",
      emailLabel: "Email",
      wechatLabel: "WeChat",
      companyLabel: "Company / organization",
      intentLabel: "Intent",
      messageLabel: "Additional info",
      submitText: "Submit",
      successText: "Received. I will get back to you soon.",
      errorText: "Failed to submit. Please try again later or email me directly.",
      intents: [
        { value: "course", label: "Course inquiry" },
        { value: "consulting", label: "Consulting / service" },
        { value: "partnership", label: "Business partnership" },
        { value: "other", label: "Other" }
      ]
    }
  },
  posts: {
    title: "Content",
    items: [
      {
        slug: "start-with-positioning",
        title: "Start with a one-line positioning: let users understand you in 10 seconds",
        excerpt:
          "Positioning is not a slogan. It's your “default option” in the mind of a specific audience. This article gives you a copy-ready structure and a self-checklist.",
        date: "2026-06-06",
        readTime: "6 min",
        tags: ["Positioning", "Messaging"],
        body: `## Why a one-line positioning drives conversion\n\nWhen users land on your homepage for the first time, they won't “patiently understand you”. They will quickly decide: are you what I need?\n\n## One-line positioning structure\n\n> I help {a certain group of people}, use {a method}, in {a context} to achieve {a measurable result}.\n\n## Closing\n\nWrite your one-line positioning, then ask 3 target users to repeat it back to you. Check whether what they repeat is consistent.`
      },
      {
        slug: "content-asset-system",
        title: "Content as assets: turn one output into long-term compounding",
        excerpt:
          "The value of content isn't just today's views. It's whether it can be searched, reused, and recombined—eventually becoming a sustainable entry point for products.",
        date: "2026-06-06",
        readTime: "8 min",
        tags: ["Content", "Growth"],
        body: `## Three levels of content assets\n\n- Instant content: peaks at publish time\n- Searchable content: brings steady traffic via search\n- Composable content: becomes modules for courses, tools, or reports\n\n## A simple method\n\nArchive your past content by “problem”, not by “platform”.`
      }
    ]
  },
  privacy: {
    title: "Privacy Policy",
    body: `## What data we collect\n\n- Usage data: page visits, language switching, section exposure and clicks (for experience optimization and analytics).\n- Form data: when you submit the partnership/booking form, we collect the information you provide (name, email, WeChat, company, intent, message).\n\n## Purpose\n\n- To contact you, confirm your needs, and provide services.\n- To improve the website content and user experience.\n\n## Data retention\n\nWe retain data only for as long as necessary to fulfill the purposes above, and we take reasonable security measures to protect it.\n\n## Your rights\n\nYou can contact us via email to request access, correction, or deletion of your personal information.\n`
  }
};
