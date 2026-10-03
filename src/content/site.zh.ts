import type { SiteContent } from "./types";

export const siteZh: SiteContent = {
  seo: {
    title: "58begin",
    description: "58begin.com — Skywalker Labs 官网。"
  },
  nav: {
    brand: "58begin",
    sections: [
      { id: "about", label: "关于" },
      { id: "featured", label: "代表作" },
      { id: "products", label: "产品与服务" },
      { id: "tools", label: "工具" },
      { id: "contact", label: "联系" }
    ]
  },
  announcement: {
    items: [
      "58begin——你觉得世界上不可能的事，是因为你没有去做。",
      "商务合作，欢迎从页面底部入口联系。"
    ]
  },
  hero: {
    kicker: "你好，我是",
    title: "58begin",
    subtitle:
      "｜上古神登的新天地｜无名产品经理，硬件圈里的老钢炮。",
    primaryCta: { text: "查看产品与服务", href: "#products" },
    secondaryCta: { text: "了解代表作", href: "#featured" }
  },
  metrics: [
    { label: "发明专利", value: "5" },
    { label: "开发项目", value: "11" },
    { label: "满意度", value: "9.3/10" }
  ],
  trustBadges: [
    { label: "硬件 × AI 双重背景", detail: "11 个落地项目" },
    { label: "发明专利 5 项", detail: "医疗器械方向" },
    { label: "合作满意度 9.3/10", detail: "来自真实合作反馈" }
  ],
  about: {
    title: "关于 58begin",
    mission: {
      title: "使命",
      body: "让创新医疗器械更快、更安全，并在全球范围内触达更多人。"
    },
    vision: {
      title: "愿景",
      body: "成为全球领先的 AI 驱动医疗器械创新、卓越合规与商业化加速引擎。"
    },
    paragraphs: [
      "这里是 58begin 的官方站点。你可以在这里快速了解我是谁、做什么、为您解决什么问题，以及如何开始合作。",
      "我相信：你觉得这个世界上不可能的事，是因为你没有去做。"
    ],
    highlights: ["定位硬件方向", "拆透产品需求", "跑通商业闭环", "用好AI杠杆"]
  },
  featured: {
    title: "代表作",
    items: [
      {
        id: "falco",
        title: "Falco — Windows 优化工具",
        description:
          "一款 Windows 桌面优化工具：健康评分与实时监控（CPU / GPU / 内存 / 网络 / 温度），一键加速、深度清理与启动项管理，让老机器也能保持高性能。",
        images: [
          {
            src: "/falco-optimizer-dark.png",
            alt: "Falco 深色主题主界面：健康评分、硬件监控与一键优化",
            width: 1280,
            height: 952
          },
          {
            src: "/falco-optimizer-light.png",
            alt: "Falco 浅色主题主界面：世界名画画廊组件",
            width: 1280,
            height: 958
          }
        ],
        ctaText: "在 GitHub 查看",
        ctaHref: "https://github.com/Leo1968/Falco"
      },
      {
        id: "iap",
        title: "IAP",
        description:
          "一套完整的嵌入式硬件设计：以 LQFP64 主控为核心，集成通信模块、音频单元与多路对外接口。图为 3D 渲染预览。",
        images: [
          {
            src: "/iap-pcb-3d.png",
            alt: "IAP 硬件 3D 渲染：LQFP64 主控与外设接口的 PCB 设计",
            width: 1280,
            height: 845
          }
        ]
      }
    ]
  },
  findMeOn: {
    title: "在这里找到我",
    items: [
      { id: "rednote", label: "小红书", href: "https://example.com", icon: "📕", iconKey: "xiaohongshu" },
      { id: "douyin", label: "抖音", href: "https://example.com", icon: "🎵", iconKey: "douyin" },
      { id: "x", label: "X.com", href: "https://example.com", icon: "🐦", iconKey: "x" },
      { id: "youtube", label: "YouTube", href: "https://example.com", icon: "▶", iconKey: "youtube" },
      { id: "bilibili", label: "哔哩哔哩", href: "https://example.com", icon: "📺", iconKey: "bilibili" }
    ]
  },
  products: {
    title: "产品与服务",
    items: [
      {
        id: "md-consulting",
        title: "医疗器械开发咨询",
        positioning: "从概念到上市的专业研发支持",
        description:
          "覆盖产品定义、研发、法规、注册与质量体系，帮助医疗器械创新项目高效落地。",
        ctaText: "查看详情",
        ctaHref: "#contact"
      },
      {
        id: "odm",
        title: "ODM（医疗器械产品）",
        positioning: "快速打造自有品牌医疗器械",
        description:
          "提供产品设计、软硬件开发、算法及供应链整合，加速医疗器械产品从研发到量产。",
        ctaText: "查看 ODM 产品",
        ctaHref: "#contact"
      },
      {
        id: "market-analysis",
        title: "市场分析",
        positioning: "用数据洞察医疗器械商业机会",
        description:
          "聚焦市场规模、竞争格局、技术趋势、竞品及商业模式，为产品与投资决策提供依据。",
        ctaText: "查看分析服务",
        ctaHref: "#contact"
      }
    ]
  },
  tools: {
    title: "工具与项目",
    items: [
      {
        id: "falco",
        title: "Falco",
        type: "Windows 应用 · 开源",
        description: "Windows 桌面优化工具：健康评分、硬件实时监控与一键加速，让老机器保持高性能。",
        href: "https://github.com/Leo1968/Falco"
      },
      {
        id: "root-nutrient-uptake",
        title: "Root Nutrient Uptake",
        type: "开源项目",
        description: "围绕根系养分吸收的监测与研究：从土壤张力传感到数据分析。",
        href: "https://github.com/Leo1968/Root-nutrient-uptake"
      }
    ]
  },
  contact: {
    title: "联系我",
    description: "如果你想咨询学习或洽谈合作，欢迎通过以下方式联系我。",
    email: "hello@58begin.com",
    wechatLabel: "扫码添加微信",
    wechatQr: {
      src: "/wechat-qr.png",
      alt: "微信二维码：扫码添加好友"
    },
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
        { value: "consulting", label: "开发咨询" },
        { value: "partnership", label: "ODM" },
        { value: "consulting", label: "市场分析" },
        { value: "partnership", label: "商务合作" },
        { value: "other", label: "其他" }
      ]
    }
  },
  closingCta: {
    title: "把不可能，变成下一步。",
    subtitle: "从一次对话开始：课程、合作，或只是一个好问题。",
    primaryCta: { text: "开始沟通", href: "#contact" },
    secondaryCta: { text: "阅读最新内容", href: "/posts" }
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
