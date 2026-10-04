import type { SiteContent } from "./types";

export const siteEn: SiteContent = {
  seo: {
    title: "58begin",
    description: "58begin.com — Skywalker Labs official site."
  },
  footerTagline: "Aim High, Stay Grounded.",
  copyright: "Skywalker Labs",
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
      "A new chapter for an old soul · An unknown product manager, a seasoned hardware veteran.",
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
      "This is the official site of Skywalker Labs. Here you can quickly learn who I am, what I do, what problems I can help you solve, and how to start working together."
    ],
    belief: "I believe: what seems impossible to the world may simply be something you have never tried to do.",
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
            height: 972
          },
          {
            src: "/falco-optimizer-light.png",
            alt: "Falco light theme: world art gallery widget",
            width: 1280,
            height: 972
          }
        ],
        ctaText: "View on GitHub",
        ctaHref: "https://github.com/Leo1968/Falco"
      },
      {
        id: "iap",
        title: "IAP",
        description:
          "A complete embedded hardware design built around an LQFP64 MCU, integrating a communication module, audio unit, and multiple external interfaces. Shown as a 3D render.",
        images: [
          {
            src: "/iap-pcb-3d.png",
            alt: "IAP hardware 3D render: PCB design with LQFP64 MCU and peripheral interfaces",
            width: 1233,
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
      { id: "x", label: "X.com", href: "https://x.com/LeoYang87346355", icon: "🐦", iconKey: "x" },
      { id: "youtube", label: "YouTube", href: "https://example.com", icon: "▶", iconKey: "youtube" },
      { id: "bilibili", label: "Bilibili", href: "https://example.com", icon: "📺", iconKey: "bilibili" }
    ]
  },
  products: {
    title: "Products & Services",
    items: [
      {
        id: "md-consulting",
        title: "Medical Device Development Consulting",
        positioning: "Professional R&D support from concept to market",
        description:
          "Covering product definition, R&D, regulatory affairs, registration, and quality systems to help medical device innovations land efficiently.",
        ctaText: "View details",
        ctaHref: "#contact"
      },
      {
        id: "odm",
        title: "ODM (Medical Devices)",
        positioning: "Build your own-brand medical devices, fast",
        description:
          "Product design, software & hardware development, algorithms, and supply chain integration to accelerate the path from R&D to mass production.",
        ctaText: "View ODM products",
        ctaHref: "#contact"
      },
      {
        id: "market-analysis",
        title: "Market Analysis",
        positioning: "Data-driven insight into medical device opportunities",
        description:
          "Market size, competitive landscape, technology trends, competitors, and business models to inform product and investment decisions.",
        ctaText: "View analysis services",
        ctaHref: "#contact"
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
      "If you'd like to discuss development consulting, ODM, market analysis, or partnerships, feel free to reach out via the channels below.",
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
        { value: "consulting", label: "Development Consulting" },
        { value: "partnership", label: "ODM" },
        { value: "consulting", label: "Market Analysis" },
        { value: "partnership", label: "Business Partnership" },
        { value: "other", label: "Other" }
      ]
    }
  },
  closingCta: {
    title: "Turn the impossible into your next step.",
    subtitle: "Start with one conversation: consulting, ODM, market analysis, or just a good question.",
    primaryCta: { text: "Start a conversation", href: "#contact" },
    secondaryCta: { text: "Read the latest posts", href: "/posts" }
  },
  posts: {
    title: "Medical Device Innovation Knowledge Base",
    items: [
      {
        slug: "clinical-need-to-product",
        title: "From clinical need to medical device product: how innovation lands",
        excerpt:
          "Starting from clinical pain points and user needs, this article breaks down product definition, technical route, R&D verification, and product landing — building the complete path from Clinical Need → Product Definition → Engineering → Product.",
        date: "2026-06-06",
        readTime: "8 min",
        tags: ["Product Innovation", "Technical R&D"],
        body: `## Start from clinical needs\n\nThe starting point of medical device innovation is not technology but clinical pain points. Common ways to identify real needs: clinical observation, clinician–engineer interviews, complaint analysis of existing products, and workflow gap studies.\n\n## Product definition\n\n- Target users and use scenarios\n- Core clinical value proposition\n- Key performance metrics and constraints\n\n## Technical route and R&D verification\n\nBuild the mapping of Clinical Need → Product Definition → Engineering → Product: translate clinical language into measurable engineering specs, then close the loop with design input/output reviews.\n\n## Product landing\n\nFrom bench prototype to registration sample, plan the ISO 13485 quality system and the full Design History File (DHF) early — late documentation is the most expensive rework.\n\n## Closing\n\nThe essence of the innovation path is the repeated alignment between clinical needs and engineering implementation — the earlier the alignment, the faster the landing.`
      },
      {
        slug: "from-poc-to-registration",
        title: "The medical device R&D process: from PoC to registration",
        excerpt:
          "Medical device innovation is not just technology development — it is the coordination of regulation, risk, quality, and engineering systems. This article maps product development, risk management, V&V, registration, and mass-production handoff.",
        date: "2026-06-06",
        readTime: "10 min",
        tags: ["Technical R&D", "Regulatory & Registration"],
        body: `## Proof of concept (PoC)\n\nVerify technical feasibility: bench prototype, key metric testing, and preliminary risk analysis decide whether the project enters engineering.\n\n## Design and development\n\n- Design input: translate requirements into an executable product specification\n- Design output: drawings, software, algorithms, and process documents\n- Verification & validation (V&V): bench testing, type testing, and clinical evaluation\n\n## Risk management\n\nHazard identification, risk control, and residual risk evaluation under ISO 14971 — risk management runs through the whole process, not as homework before registration.\n\n## Registration\n\nChoose the registration class (I/II/III), prepare the technical documentation, and pass the QMS audit; the registration strategy should be designed together with product definition.\n\n## Production handoff\n\nDesign transfer, process validation (PV), supplier management, and change control — the watershed between “can be built” and “built consistently”.`
      },
      {
        slug: "device-market-analysis",
        title: "Medical device market analysis: from industry trends to product opportunities",
        excerpt:
          "Market size, competitive landscape, technology trends, user needs, and competitor performance — a market research framework for medical devices to support project approval, R&D direction, and commercialization decisions.",
        date: "2026-06-06",
        readTime: "8 min",
        tags: ["Market Insight", "Commercialization"],
        body: `## Market size and structure\n\nCross-validate top-down and bottom-up estimates, and separate replacement demand from new demand — their growth logics are fundamentally different.\n\n## Competitive landscape\n\n- Leading vendors and market share distribution\n- Headroom for domestic substitution\n- Channel models and price bands\n\n## Technology trends\n\nSensor precision, AI-assisted decision-making, minimally invasive, and home-use directions — judge trends by technology maturity, not by launch-event density.\n\n## User needs\n\nA dual view of clinical and payer sides: who uses it, who decides, who pays — often three different people.\n\n## Product opportunities\n\nTranslate insight into project rationale: target segment, differentiation, and commercialization path — answering “why now, and why us” with data.`
      }
    ]
  },
  privacy: {
    title: "Privacy Policy",
    body: `## What data we collect\n\n- Usage data: page visits, language switching, section exposure and clicks (for experience optimization and analytics).\n- Form data: when you submit the partnership/booking form, we collect the information you provide (name, email, WeChat, company, intent, message).\n\n## Purpose\n\n- To contact you, confirm your needs, and provide services.\n- To improve the website content and user experience.\n\n## Data retention\n\nWe retain data only for as long as necessary to fulfill the purposes above, and we take reasonable security measures to protect it.\n\n## Your rights\n\nYou can contact us via email to request access, correction, or deletion of your personal information.\n`
  }
};
