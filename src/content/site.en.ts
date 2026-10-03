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
      { id: "featured", label: "Featured" },
      { id: "products", label: "Products & Services" },
      { id: "tools", label: "Tools" },
      { id: "contact", label: "Contact" }
    ]
  },
  announcement: {
    items: [
      "58begin — What seems impossible to the world may simply be something you have never tried to do.",
      "Open to business partnerships — reach out via the footer below."
    ]
  },
  hero: {
    kicker: "Hi, I'm",
    title: "58begin",
    subtitle:
      "｜A new chapter for an old soul｜An unknown product manager, a seasoned hardware veteran.",
    primaryCta: { text: "View products & services", href: "#products" },
    secondaryCta: { text: "Explore featured work", href: "#featured" }
  },
  metrics: [
    { label: "Invention patents", value: "5" },
    { label: "Projects delivered", value: "11" },
    { label: "Satisfaction", value: "9.3/10" }
  ],
  trustBadges: [
    { label: "Hardware × AI background", detail: "11 delivered projects" },
    { label: "5 invention patents", detail: "Medical device focus" },
    { label: "9.3/10 partner satisfaction", detail: "From real collaborations" }
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
      "I believe: what seems impossible to the world may simply be something you have never tried to do."
    ],
    highlights: [
      "Hardware positioning",
      "Break down product requirements",
      "Close the business loop",
      "Leverage AI"
    ]
  },
  featured: {
    title: "Featured",
    items: [
      {
        id: "falco",
        title: "Falco — Windows Optimizer",
        description:
          "A Windows desktop optimizer: health score and real-time monitoring (CPU / GPU / memory / network / temperature), one-click boost, deep clean, and startup management to keep older machines running at high performance.",
        images: [
          {
            src: "/falco-optimizer-dark.png",
            alt: "Falco dark theme: health score, hardware monitoring, and one-click tuning",
            width: 1280,
            height: 952
          },
          {
            src: "/falco-optimizer-light.png",
            alt: "Falco light theme: world art gallery widget",
            width: 1280,
            height: 958
          }
        ],
        ctaText: "View on GitHub",
        ctaHref: "https://github.com/Leo1968/Falco"
      },
      {
        id: "iap",
        title: "IAP",
        description:
          "A complete embedded hardware design built around an LQFP64 MCU, integrating a communication module, audio unit, and multiple external interfaces. Shown as a 3D render preview.",
        images: [
          {
            src: "/iap-pcb-3d.png",
            alt: "IAP hardware 3D render: PCB design with LQFP64 MCU and peripheral interfaces",
            width: 1280,
            height: 845
          }
        ]
      }
    ]
  },
  findMeOn: {
    title: "Find me here",
    items: [
      { id: "rednote", label: "RedNote", href: "https://example.com", icon: "📕", iconKey: "xiaohongshu" },
      { id: "douyin", label: "Douyin", href: "https://example.com", icon: "🎵", iconKey: "douyin" },
      { id: "x", label: "X.com", href: "https://example.com", icon: "🐦", iconKey: "x" },
      { id: "youtube", label: "YouTube", href: "https://example.com", icon: "▶", iconKey: "youtube" },
      { id: "bilibili", label: "Bilibili", href: "https://example.com", icon: "📺", iconKey: "bilibili" }
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
        id: "falco",
        title: "Falco",
        type: "Windows App · Open Source",
        description:
          "A Windows desktop optimizer: health score, real-time hardware monitoring, and one-click boost to keep older machines fast.",
        href: "https://github.com/Leo1968/Falco"
      },
      {
        id: "root-nutrient-uptake",
        title: "Root Nutrient Uptake",
        type: "Open Source",
        description:
          "Monitoring and research around root nutrient uptake: from soil tension sensing to data analysis.",
        href: "https://github.com/Leo1968/Root-nutrient-uptake"
      }
    ]
  },
  contact: {
    title: "Contact",
    description:
      "If you'd like to inquire about courses or discuss partnerships, feel free to reach out via the channels below.",
    email: "hello@58begin.com",
    wechatLabel: "Scan to add WeChat",
    wechatQr: {
      src: "/wechat-qr.png",
      alt: "WeChat QR code: scan to add contact"
    },
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
  closingCta: {
    title: "Turn the impossible into your next step.",
    subtitle: "Start with one conversation: a course, a partnership, or just a good question.",
    primaryCta: { text: "Start a conversation", href: "#contact" },
    secondaryCta: { text: "Read the latest posts", href: "/posts" }
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
