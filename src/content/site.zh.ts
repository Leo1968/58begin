import type { SiteContent } from "./types";

export const siteZh: SiteContent = {
  seo: {
    title: "58begin",
    description:
      "58begin.com — 个人品牌与产品矩阵官网：代表作、内容、产品与服务、工具与联系入口。"
  },
  nav: {
    brand: "58begin",
    sections: [
      { id: "about", label: "关于" },
      { id: "featured", label: "代表作" },
      { id: "content", label: "内容" },
      { id: "products", label: "产品与服务" },
      { id: "tools", label: "工具" },
      { id: "contact", label: "联系" }
    ]
  },
  hero: {
    kicker: "你好，我是",
    title: "58begin",
    subtitle:
      "用清晰的定位、可复用的内容资产与产品矩阵，把热爱变成长期事业。",
    primaryCta: { text: "查看产品与服务", href: "#products" },
    secondaryCta: { text: "了解代表作", href: "#featured" }
  },
  metrics: [
    { label: "累计学员", value: "30,000+" },
    { label: "全网粉丝", value: "1,500,000+" },
    { label: "满意度", value: "9.2/10" }
  ],
  about: {
    title: "关于 58begin",
    paragraphs: [
      "这里是 58begin 的官方站点。你可以在这里快速了解我是谁、做什么、为谁解决什么问题，以及如何开始合作/学习。",
      "我相信：清晰的表达、可沉淀的内容资产，以及可交付的产品服务，是个人品牌长期增长的三条主线。"
    ],
    highlights: ["个人品牌定位", "内容系统与增长", "产品化与商业闭环", "AI 工具与效率放大"]
  },
  featured: {
    title: "代表作",
    items: [
      {
        id: "book-1",
        title: "《把热爱变成事业》",
        description:
          "从 0 到 1 搭建个人品牌与产品体系的实践总结，提供可落地的方法与路径。",
        ctaText: "了解与购买",
        ctaHref: "https://example.com"
      }
    ]
  },
  findMeOn: {
    title: "在这里找到我",
    items: [
      { id: "rednote", label: "小红书", href: "https://example.com", icon: "📕" },
      { id: "douyin", label: "抖音", href: "https://example.com", icon: "🎵" },
      { id: "x", label: "X.com", href: "https://example.com", icon: "🐦" },
      { id: "youtube", label: "YouTube", href: "https://example.com", icon: "▶" },
      { id: "bilibili", label: "哔哩哔哩", href: "https://example.com", icon: "📺" }
    ]
  },
  products: {
    title: "产品与服务",
    groups: [
      {
        id: "courses",
        title: "课程项目",
        items: [
          {
            id: "creator-bootcamp",
            title: "自媒体创业营",
            description: "从零打造个人品牌，建立可持续的线上商业。",
            tag: "课程",
            ctaText: "查看详情",
            ctaHref: "https://example.com"
          },
          {
            id: "ai-solo",
            title: "AI 一人公司实战营",
            description: "用 AI 工具放大效率，实现一人撬动大价值。",
            tag: "课程",
            ctaText: "查看详情",
            ctaHref: "https://example.com"
          }
        ]
      },
      {
        id: "partnership",
        title: "商务合作",
        items: [
          {
            id: "brand",
            title: "品牌合作",
            description:
              "覆盖高质量受众人群，接受访谈合作、口播视频与内容共创等合作形式。",
            tag: "合作",
            ctaText: "提交合作意向",
            ctaHref: "#contact"
          }
        ]
      }
    ]
  },
  tools: {
    title: "工具与项目",
    items: [
      {
        id: "tool-1",
        title: "CoverMagic",
        type: "Web App",
        description: "输入标题与风格，一键生成平台适配的封面图。",
        href: "https://example.com"
      },
      {
        id: "tool-2",
        title: "X Reply Helper",
        type: "Chrome Extension",
        description: "帮助你用对方语种生成更自然的回复。",
        href: "https://example.com"
      }
    ]
  },
  contact: {
    title: "联系我",
    description: "如果你想咨询学习或洽谈合作，欢迎通过以下方式联系我。",
    email: "hello@58begin.com",
    wechatLabel: "扫码添加微信",
    form: {
      title: "合作/预约表单",
      nameLabel: "姓名",
      emailLabel: "邮箱",
      wechatLabel: "微信",
      companyLabel: "公司/组织",
      intentLabel: "意向",
      messageLabel: "补充信息",
      submitText: "提交",
      successText: "已收到，我会尽快回复你。",
      errorText: "提交失败，请稍后重试或直接发邮件联系。",
      intents: [
        { value: "course", label: "课程咨询" },
        { value: "consulting", label: "咨询/服务" },
        { value: "partnership", label: "商务合作" },
        { value: "other", label: "其他" }
      ]
    }
  },
  posts: {
    title: "内容",
    items: [
      {
        slug: "start-with-positioning",
        title: "从一句话定位开始：让用户 10 秒内看懂你",
        excerpt:
          "定位不是一句口号，而是你在特定人群心智中的“默认选项”。这篇文章给出可直接照抄的定位结构与自检清单。",
        date: "2026-06-06",
        readTime: "6 min",
        tags: ["定位", "表达"],
        body: `## 为什么一句话定位决定转化\n\n当用户第一次来到你的主页，他们不会“耐心地理解你”，而是会快速判断：你是不是我需要的。\n\n## 一句话定位结构\n\n> 我帮助【某类人】，用【某种方法】，在【某个场景】达到【可衡量结果】。\n\n## 结语\n\n把一句话定位写出来，然后让 3 个目标用户复述，看他们复述出来的是否一致。`
      },
      {
        slug: "content-asset-system",
        title: "内容资产化：把一次输出变成长期复利",
        excerpt:
          "内容的价值不只在当下播放量，而在于是否能被检索、复用与组合，最终成为产品的持续入口。",
        date: "2026-06-06",
        readTime: "8 min",
        tags: ["内容", "增长"],
        body: `## 内容资产的三个层级\n\n- 即时内容：发布即峰值\n- 可检索内容：被搜索带来持续流量\n- 可组合内容：沉淀为课程/工具/报告的模块\n\n## 一个简单的方法\n\n把你过去的内容按“问题”而不是按“平台”归档。`
      }
    ]
  },
  privacy: {
    title: "隐私政策",
    body: `## 我们收集哪些数据\n\n- 访问数据：页面访问、语言切换、模块曝光与点击等（用于体验优化与统计分析）。\n- 表单数据：当你提交合作/预约表单时，我们会收集你填写的信息（姓名、邮箱、微信、公司、意向、留言）。\n\n## 用途\n\n- 用于联系你、确认需求与提供服务。\n- 用于改进网站内容与用户体验。\n\n## 数据保存\n\n我们仅在达成上述用途所需的期限内保存数据，并采取合理的安全措施保护数据。\n\n## 你的权利\n\n你可以通过邮件联系我们，申请查询、更正或删除你的个人信息。\n`
  }
};

