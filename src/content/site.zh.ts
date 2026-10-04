import type { SiteContent } from "./types";

export const siteZh: SiteContent = {
  seo: {
    title: "58begin",
    description: "58begin.com — Skywalker Labs 官网。"
  },
  footerTagline: "志存高远，脚踏实地。",
  copyright: "Skywalker Labs",
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
            height: 972
          },
          {
            src: "/falco-optimizer-light.png",
            alt: "Falco 浅色主题主界面：世界名画画廊组件",
            width: 1280,
            height: 972
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
            width: 1233,
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
      { id: "x", label: "X.com", href: "https://x.com/LeoYang87346355", icon: "🐦", iconKey: "x" },
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
    description: "如果你有开发咨询、ODM、市场分析或商务合作需求，欢迎通过以下方式联系我。",
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
    subtitle: "从一次对话开始：咨询、合作，或只是一个好问题。",
    primaryCta: { text: "开始沟通", href: "#contact" },
    secondaryCta: { text: "阅读最新内容", href: "/posts" }
  },
  posts: {
    title: "医疗器械创新知识库",
    items: [
      {
        slug: "clinical-need-to-product",
        title: "从临床需求到医疗器械产品：创新产品如何实现落地",
        excerpt:
          "从临床痛点与用户需求出发，系统拆解医疗器械产品定义、技术路线、研发验证与产品落地的关键环节，建立从 Clinical Need → Product Definition → Engineering → Product 的完整创新路径。",
        date: "2026-06-06",
        readTime: "8 min",
        tags: ["产品创新", "技术研发"],
        body: `## 从临床需求出发\n\n医疗器械创新的起点不是技术，而是临床痛点。识别真实需求的常用方法：临床观察、医工访谈、现有产品的投诉分析与工作流缺口研究。\n\n## 产品定义\n\n- 目标用户与使用场景\n- 核心临床价值主张\n- 关键性能指标与约束条件\n\n## 技术路线与研发验证\n\n建立 Clinical Need → Product Definition → Engineering → Product 的映射：把临床语言翻译为可测量的工程指标，再通过设计输入/输出评审形成闭环。\n\n## 产品落地\n\n从原理样机到注册样品，需要同步规划 ISO 13485 质量体系与完整的设计历史文档（DHF），避免后期补文档的高成本返工。\n\n## 结语\n\n创新路径的本质，是临床需求与工程实现之间反复对齐的过程——对齐越早，落地越快。`
      },
      {
        slug: "from-poc-to-registration",
        title: "医疗器械研发全流程：从概念验证到注册上市",
        excerpt:
          "医疗器械创新不仅是技术开发，更是法规、风险、质量与工程体系的协同。本文梳理产品开发、风险管理、验证确认、注册申报及量产导入的关键节点。",
        date: "2026-06-06",
        readTime: "10 min",
        tags: ["技术研发", "法规注册"],
        body: `## 概念验证（PoC）\n\n验证技术可行性：原理样机、关键指标测试与初步风险分析，决定项目是否进入工程化阶段。\n\n## 设计与开发\n\n- 设计输入：把需求转化为可执行的产品规范\n- 设计输出：图纸、软件、算法与工艺文件\n- 验证与确认（V&V）：台架测试、型式检验与临床评价\n\n## 风险管理\n\n在 ISO 14971 框架下进行危害识别、风险控制与剩余风险评价，风险管理应贯穿开发全流程，而非注册前的补课。\n\n## 注册申报\n\n选择注册路径（一类/二类/三类），准备技术文档并应对体系核查；注册策略应与产品定义阶段同步设计。\n\n## 量产导入\n\n设计转移、过程验证（PV）、供应商管理与变更控制，是产品从"能做出来"到"稳定量产"的分水岭。`
      },
      {
        slug: "device-market-analysis",
        title: "医疗器械市场分析：从行业趋势到产品机会",
        excerpt:
          "围绕市场规模、竞争格局、技术趋势、用户需求与竞品表现，建立医疗器械市场研究框架，为产品立项、研发方向与商业化决策提供数据支持。",
        date: "2026-06-06",
        readTime: "8 min",
        tags: ["市场洞察", "商业化"],
        body: `## 市场规模与结构\n\n自上而下与自下而上两种测算路径交叉验证，并区分存量替换需求与新增需求——两者的增长逻辑完全不同。\n\n## 竞争格局\n\n- 头部厂商与市场份额分布\n- 进口与国产替代的空间\n- 渠道模式与定价带\n\n## 技术趋势\n\n传感器精度、AI 辅助决策、微创化与家用化是当前的主要方向；判断趋势要看技术成熟度，而不是发布会密度。\n\n## 用户需求\n\n临床端与支付端的双视角分析：谁使用、谁决策、谁付费——三者可能完全不同。\n\n## 产品机会\n\n把洞察转译为立项依据：目标细分、差异化主张与商业化路径，用数据回答"为什么是现在、为什么是我们"。`
      }
    ]
  },
  privacy: {
    title: "隐私政策",
    body: `## 我们收集哪些数据\n\n- 访问数据：页面访问、语言切换、模块曝光与点击等（用于体验优化与统计分析）。\n- 表单数据：当你提交合作/预约表单时，我们会收集你填写的信息（姓名、邮箱、微信、公司、意向、留言）。\n\n## 用途\n\n- 用于联系你、确认需求与提供服务。\n- 用于改进网站内容与用户体验。\n\n## 数据保存\n\n我们仅在达成上述用途所需的期限内保存数据，并采取合理的安全措施保护数据。\n\n## 你的权利\n\n你可以通过邮件联系我们，申请查询、更正或删除你的个人信息。\n`
  }
};
