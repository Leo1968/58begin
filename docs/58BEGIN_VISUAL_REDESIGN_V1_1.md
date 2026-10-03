# 58begin Visual Redesign Implementation Plan V1.1

> 版本：V1.1　｜　日期：2026-10-03　｜　状态：Claude Code / Codex Execution Edition
> 依据：wozmerch.com 线上实测快照（HTML + 主题 CSS 逐项提取）、本项目全量代码勘察、websnap 工具可用性实测核查。

---

## 0. 执行摘要

- **改造目标**：在**不改变核心业务信息架构、路由、数据模型、用户任务路径、i18n 双语机制、LeadForm/API 后端**的前提下，将 58begin 重构为一种**受参考站设计语言启发、但保持自身品牌与内容独立性**的视觉系统：白底黑字、深色页头/页脚三明治结构、巨型无衬线标题、药丸按钮 + 直角卡片、编号聚光版式、受控的色彩点缀、滚动淡入动效。允许新增纯展示/引导性质的视觉模块或重新编排首页视觉节奏，但不得建立新的独立业务信息层级。
- **关键事实 1（工具）**：websnap 定位是"SPA 离线镜像抓取引擎"（ui.rip 流水线的 Stage 1），**只负责抓取参考站做离线对照，不生成代码、不做样式迁移**。经实测（2026-10-03），该工具**当前不可用**：npm 上的 `websnap@1.1.2` 是 2014 年的无关老包（PhantomJS 截图工具，安装即失败）；GitHub 仓库 `uirip/websnap` 仅有 1 个 main 分支、根目录唯一文件 README.md、0 个 Release，无代码可构建。替代工具 **ai-site-cloner**（Mahanaicoach/ai-site-cloner，MIT，实测有 208KB 真实代码、2026-07 仍在更新）经评估**部分采用**：采用其 Playwright 实测提取脚本集（token 提取 / computed-style 遍历 / 三视口响应式实测 / 交互态捕获）与像素 diff 诊断器作为参考采集与比对手段（Track B，默认执行）；**不采用**其"整站克隆生成 Next.js"主流程（交付物与技术栈均不匹配，见 1.4 节）。自研 Playwright 捕获脚本降为 Track C 兜底；websnap 保留为 Track A（上游发布代码后启用）。
- **现状基线修正**：项目的**颜色、边框及主要语义色**已经高度 token 化；但不能把全部 UI 规格概括为“100% token 驱动”。字体、间距、圆角、阴影、布局等仍大量通过 Tailwind utility / 组件级样式表达。因此，本版本将“约 70% 色彩迁移可由 token 重定义完成”作为工作量判断，而不是把整个 UI 声称为 100% token 驱动。
- **工期**：建议按 **12–15 人日，目标 13 人日**执行；7 个阶段，5 个主要里程碑 + 4 个最终 Gate。每阶段原子提交、独立可回滚。

---

## 1. 目标工具梳理：websnap 功能特性与使用限制

### 1.1 功能特性（依据其 README 承诺）

| 能力 | 说明 |
|---|---|
| 状态树探索 | 不按 URL 爬取，而是通过无障碍树（accessibility tree）发现可交互元素，逐个点击、检测 DOM 变化、快照新状态并递归（BFS） |
| 资产实时拦截 | 基于 Playwright `page.route()`，浏览器加载时即截存所有 CSS/图片/字体响应，无需二次下载 |
| 离线 HTML 输出 | 重写 HTML `src/href/srcset` 与 CSS `url()/@import/@font-face` 为本地相对路径，每个快照可完全离线打开 |
| 模板去重 | 结构相同的页面（如 1000 个商品页）每模板限量抓取 |
| 环路检测 | 对无障碍树内容做 SHA-256 哈希，防止点击循环 |
| 守护进程 + CLI | `open` 启动常驻浏览器会话（TCP + 行分隔 JSON），`auto/tree/snap/click/fill/goto/screenshot/done` 等子命令 |
| 状态树导出 | ASCII 树 + `bundle.json`，机器可读 |
| 环境要求 | Node ≥ 20、pnpm ≥ 10、Playwright Chromium（本机 Node v24.5.0、chromium 已缓存，均满足） |

### 1.2 使用限制（含实测核查结论）

| 限制 | 详情 | 对本项目的影响 |
|---|---|---|
| **定位限制** | websnap 只做"抓取→离线镜像"，位于 ui.rip 流水线 `capture → inspect → analyze → generate → verify` 的第 1 站；"站点转 Next.js 代码"是 ui.rip 闭源 SaaS 的后续阶段，**不在 websnap 内** | 不能指望它"自动换肤"。它在本方案中的角色 = **采集 wozmerch.com 离线对照包 + 多视口截图 + 交互状态清单**，作为设计还原的验收基准；改代码仍由本项目人工完成 |
| **可用性：npm 同名冲突（实测）** | `npm view websnap` → `websnap@1.1.2`，作者是 geta6，依赖 `phantomjs@1.9.2-6`，postinstall 下载 `phantomjs.googlecode.com`（2016 年已死，实测 ETIMEDOUT）→ **安装必然失败**。与 uirip/websnap 毫无关系 | **严禁执行 `npm install -g websnap`**（会装到无关老包） |
| **可用性：仓库无代码（实测）** | GitHub API 确认：仅 main 分支（commit `487f3a3`）、`/contents/` 仅 `README.md`、Releases 为空；README 中引用的 package.json/LICENSE/CONTRIBUTING.md 均不存在，`pnpm install` 无从执行 | Track A 暂不可行，触发条件见 5.2 |
| 重写器为正则实现 | 自述"regex-based、无 HTML 解析器"，复杂内联样式/极端属性存在改写遗漏的固有风险 | 对照素材仅作参考，不进构建产物，无生产风险 |
| 需真实浏览器 | 依赖 Chromium；目标站为 Shopify 店铺，瀑布流懒加载图片需要足够的 `--wait` 停留时间 | 捕获脚本需预留 settle 时间 |
| 版权边界 | 镜像产物含对方全部受版权保护的资产 | 对照包仅限内部设计比对，**不得进入本项目 git 与部署产物** |

### 1.3 角色界定结论

websnap 在本项目中 = **"参考站采集与验收基准工具"**，不是"改造工具"。改造的实施主体是本项目自身的 token 体系 + 组件重构（第 6、7 节）。

### 1.4 工具横向对比与选型结论（websnap vs ai-site-cloner vs 自研脚本）

| 维度 | websnap（Track A） | **ai-site-cloner（Track B，默认）** | 自研 Playwright 脚本（Track C，兜底） |
|---|---|---|---|
| 可用性（2026-10-03 实测） | ❌ 仓库仅 README，npm 同名冲突 | ✅ 208KB 真实 JS 代码、41 commits、2026-07 活跃、有 Release、MIT | ✅ 项目已有 Playwright 1.53 |
| 本质定位 | SPA 状态树离线镜像抓取 | **AI 编码代理的建站技能包**：Playwright 实测提取 + 分规格生成 + 像素 diff QA | 按需定制的捕获脚本 |
| 对参考站的产出 | 离线 HTML + 全量资产 + 状态树 | **实测设计 token、computed-style 遍历、390/768/1440 响应式实测、hover 等交互态捕获、整页截图** | 三视口截图 + 资产 URL 清单 |
| 对本项目代码的影响 | 无 | 无（测量数据与框架无关） | 无 |
| 全流程产出 | — | **全新 Next.js 16 + React 19 + Tailwind v4 + shadcn/ui 克隆站**（含对方内容） | — |
| 适配本项目的能力 | 仅作对照素材 | 测量/比对环节完全适配；**生成环节不适配**（见下） | 对照素材 |
| 主要缺口 | 工具不存在；无 token 提取 | 生成栈与本项目栈不匹配；无 zh/en 双语概念 | 测量深度依赖自己写 |

**选型结论：部分采用 ai-site-cloner，不采用其生成主流程。**

1. **采用什么**：其 `scripts/extract/` 测量脚本集（`page.mjs` 一站式勘察、`tokens.mjs` token 提取、`css.mjs`/computed-style 遍历、`responsive.mjs` 响应式实测——恰好就是我们兼容性矩阵的 390/768/1440 三档、`section.mjs` 交互态捕获、`screenshot.mjs` 截图）与 `diff.mjs`/`compare.mjs` 像素差异诊断器。该工具的核心哲学是"AI 永不凭空编一个值，一切脚本实测"，正对本方案 9.3 节视觉验收最容易走偏的环节。测量产物是纯数据（token 值、间距、字阶、computed styles），与 Tailwind v4/React 19 还是 Tailwind 3/React 18 无关，可直接喂给 P1 令牌落地。
2. **不采用什么**：六阶段"整站克隆"流水线（crawl → foundation → sections → assembly → QA 95% 门槛）。三个硬理由：① **交付物错位**——它生成全新 Next.js 项目，而我们的交付物是改造现有 React 18 + Vite + Tailwind 3 项目且硬约束"后端/数据契约/i18n 机制零改动"，全盘采用等于平台迁移，工期从 11–13 人日膨胀到数周并推翻本方案全部结构；② **内容错位**——克隆产物是 wozmerch 的商品内容与文案，本项目必须使用自有 zh/en 原创内容（3.5 节合规边界），克隆站只能沦为丢弃式参考，投入产出比极低；③ **验收错位**——95% 像素门槛只对"克隆同一站点"成立，我们的页面内容与对方不同，像素分天然不可能达标，验收仍以"结构一致优先"为标准（9.3 节），像素 diff 仅作定位工具（见 5.5 节）。
3. **运行前提**：该工具设计为 AI 编码代理驱动（Claude Code/Cursor 等），本执行环境即属此类，满足；Node ≥ 22（本机 v24.5.0 ✓）。

---

## 2. 现状评估：技术栈、代码结构、设计规范

### 2.1 技术栈

| 层 | 技术 | 版本 |
|---|---|---|
| 框架 | React + TypeScript | 18.3 / 5.8 |
| 构建 | Vite | 6.3 |
| 样式 | Tailwind CSS（`darkMode: "class"` 已配置但全站未使用） | 3.4 |
| 路由 | react-router-dom（BrowserRouter，无嵌套布局） | 7.3 |
| 状态 | zustand（仅 1 个 store：`lang`，localStorage 持久化） | 5.0 |
| SEO | react-helmet-async | 2.0 |
| 部署 | Cloudflare Worker（静态资产 + `/api/*` 同 Worker）+ D1 | wrangler 4.98 |
| 测试 | Vitest 4（jsdom）+ Playwright 1.53（chromium/firefox/webkit） | — |

### 2.2 代码结构（改造相关部分）

```
src/
├── index.css                     # 唯一全局 CSS：token 变量（仅浅色）+ prose
├── App.tsx                       # 全部路由定义
├── components/
│   ├── PageShell.tsx             # 布局壳：SEO + SiteNav + main + 浅色 footer   ← 改
│   ├── SiteNav.tsx               # 吸顶导航：品牌/锚点|路由/EN中切换/汉堡抽屉      ← 改
│   ├── Button.tsx                # primary/secondary/ghost 三变体，rounded-full  ← 改
│   ├── Card.tsx                  # rounded-2xl 卡片 + hover 抬升 + shadow-soft   ← 改
│   ├── SectionHeading.tsx        # 分区标题（display 衬线体）+ 细线              ← 改
│   └── Toast/Modal/LeadForm/TrackedLink/Container …                        ← 保留
├── sections/home/
│   ├── HeroSection.tsx           # kicker + 大标题 + 2 CTA + 光晕 + 3 指标卡      ← 改
│   ├── AboutSection.tsx / CultureSection.tsx / FeaturedSection.tsx
│   ├── ContentSection.tsx / ProductsSection.tsx / ToolsSection.tsx
│   └── ContactSection.tsx        # 邮箱复制 + QR Modal + LeadForm               ← 结构保留
├── content/
│   ├── types.ts                  # SiteContent 类型（Lang = zh | en）            ← 扩展
│   ├── site.zh.ts / site.en.ts   # 全站文案唯一来源                              ← 扩展
│   └── siteContentAlignment.test.ts  # zh/en 结构对齐门禁                        ← 同步
├── hooks/                        # useActiveSection / useSectionTracking / useTheme(未用)
└── stores/lang.ts                # 语言 store                                    ← 保留
```

路由：`/`（单页锚点分区）、`/posts`、`/posts/:slug`、`/privacy`、`*`（404）。API：仅 `POST /api/lead`（zod 校验 + 限流 + 蜜罐 + D1），**本方案零改动**。

### 2.3 现有设计规范（改造基线）

| Token | 当前值（`src/index.css` :root） | 用途 |
|---|---|---|
| `--bg` | `252 252 250` 暖白 | 页面底色 |
| `--fg` | `17 17 17` | 正文 |
| `--muted` | `118 118 118` | 次级文字 |
| `--card` | `255 255 255` | 卡片底 |
| `--border` | `227 227 225` | 边框 |
| `--accent` | `225 70 12` 橙红 | 强调 |
| `--accent-2` | `29 79 167` 蓝 | 次强调 |

- 字体：标题 `Newsreader`（衬线，display）；正文 `IBM Plex Sans`（Google Fonts 于 `index.html` 引入）。
- 形状：按钮 `rounded-full` 药丸；卡片 `rounded-2xl` + `shadow-soft`；容器 `max-w-[1200px]`。
- **关键事实**：src 内 0 处硬编码色值、0 处 Tailwind 原生色阶类（`text-fg` 54 处、`text-muted` 44 处、`border-border` 34 处……全部语义 token）。→ **重定义 token 值即可完成约 70% 的色彩/字体迁移，无需逐文件改色**。
- 死代码：`useTheme.ts`（暗色钩子）、`MarkdownView.tsx`、`Empty.tsx` 未被引用；`Modal` 使用了未安装的 `tailwindcss-animate` 类（入场动画实际无效）——顺手清理。
- 测试基线：SiteNav 语言切换单测、zh/en 内容对齐测试、API lead 4 例、e2e（首页标题/语言切换/`/posts` 导航、QR Modal 开合）。

---

## 3. 目标风格深度分析：wozmerch.com 设计语言

以下数据均为线上 CSS/HTML **实测原值**（theme.css + Shopify 内联主题设置 + woz-\* 定制层）。

### 3.1 设计令牌（实测原值）

**颜色（黑白灰基底）**

| 变量 | 值 | 语义 |
|---|---|---|
| `--color-background-main` | `#ffffff` | 页面底色（纯白） |
| `--color-background-main-alternate` | `#EEF1F2` | 交替分区浅灰蓝 |
| `--color-background-header / footer` | `#1e1e1e` | **深色页头/页脚**（三明治结构） |
| `--color-text-main` | `#000000` | 正文黑 |
| `--color-secondary-text-main` | `rgba(0,0,0,.6)` | 次级文字 |
| `--color-text-footer` | `#b9b9b9` | 页脚灰字 |
| `--color-borders-main` | `rgba(0,0,0,.1)` | 主边框（发丝线） |
| `--color-borders-header` | `rgba(255,255,255,.15)` | 深色区边框 |
| `--color-secondary/third/fourth-background-main` | `rgba(0,0,0,.08 / .04 / .02)` | 三级弱底色（斑马纹/悬停态） |

**参考站色彩点缀系（仅作测量数据）**：绿 `#61BB46`、黄 `#FDB827`、橙 `#F5821F`、红 `#E03A3E`、紫 `#963D97`、蓝 `#009DDC`；墨 `#171614`、奶油 `#F4EFE3`。滚动进度条渐变实测为 `linear-gradient(90deg, #2a66c4 0 33%, #e67c2a 33% 66%, #965096 66% 100%)`。

**圆角/尺寸**：按钮 `30px`（药丸）｜卡片 `0px`（直角）｜产品卡 `20px`｜表单/组件 `10px`｜最大宽度 `1440px`｜容器留白 15/20/30/40px 响应式。

**字体（实测）**：主题层标题/正文为 `Arial, Helvetica, sans-serif` 系统栈（标题常规字重，靠尺寸与全大写字距制造层次）；`wozv4` 定制层 Hero 巨标题 **`clamp(48px, 7.5vw, 88px)` / line-height 1.02 / letter-spacing -0.03em / font-weight 800**；分区块眉全大写小字号；`Silkscreen`（Google Fonts 像素等宽字体）用于编号贴纸卡（`clamp(28px, 6vw, 40px)` + 3px 描边 + `8px 8px 0` 硬偏移阴影的"新拟物贴纸"风格）；`Playfair Display italic 700` 偶发衬线点缀。

### 3.2 版式结构（参考站 13 段叙事节奏，不作为 58begin 的页面复制模板）

公告跑马灯 → 深色页头（mega menu + 货币/地区选择）→ **Hero**（块眉 + 巨标题 "Wear your curiosity" + 双 CTA + 3 枚信任徽章 + 媒体背书条）→ 编号聚光（01/02 贴纸卡）→ 4 列畅销网格（角标徽章）→ 3 列系列 → 品牌故事带 → 高端合作 4 列 → 分类瓷片（图 + "Shop x →"）→ 幕后照片墙（"Explore more +" 可展开）→ 收尾 CTA 带 → 深色页脚（快捷链接 / Newsletter 表单 / 联系块 / 支付图标 + 版权条）。

核心节奏特征：**深-浅-深三明治**、分区交替使用白 / `#EEF1F2` / 弱黑透明底、文字箭头链接承担大量轻量 CTA、图片直出无圆角或 20px 圆角两种规格。58begin 只提取这些设计原则，不要求逐段复制 13 段结构。

### 3.3 交互逻辑与动效（`woz-motion.css` 实测原值）

| 动效 | 实现参数 | 复刻方式 |
|---|---|---|
| 平滑滚动 | Lenis（`html.lenis` 类） | **不引入依赖**：保持原生滚动 + 锚点 `scroll-behavior: smooth`（本项目已有 hash-scroll） |
| 滚动淡入上移 | `.wm-reveal`：初始 `translate3d(0,28px,0)` + opacity 0 → 进入后归位；`opacity .9s / transform 1s cubic-bezier(.2,.7,.2,1)`，支持 `--wm-delay` 级联 | `IntersectionObserver`（项目已有 useActiveSection 同款模式）+ CSS transition，新增 `useScrollReveal` |
| 图片缩放进入 | `scale(1.08) → 1`，1.4s 同曲线 | 同上，`.reveal-media` 类 |
| 彩虹进度条 | 固定顶部 3px，`transform: scaleX` 随滚动，渐变见上 | `useScrollProgress`（rAF + passive scroll） |
| Hero 视差 | 媒体层 `translate3d(0, calc(var(--wm-p)*1px), 0) scale(1.06)` | 同一 rAF 循环内输出，仅桌面端启用 |
| 公告栏 | scroll-snap 横向轮播（桌面三段 27%/46%/27% 网格；移动端单条） | CSS `animation` 无限 marquee + `prefers-reduced-motion` 静态化（比原站 scroll-snap 更省 JS） |
| 按钮 | outline → hover 反转为 solid；文字箭头链接 hover 箭头位移；图标按钮 hover 旋转 | Button 变体重构 + CSS |
| 无障碍降级 | `prefers-reduced-motion: reduce` 下全部动效禁用、进度条隐藏 | 必须保留同等降级 |

### 3.4 技术实现要求结论

目标站全部效果**零框架依赖**（Shopify 主题层 + 少量定制 CSS/JS），本项目**无需新增任何运行时依赖**即可完整复刻（Silkscreen 字体走已有 Google Fonts 通道，CSP 已放行 `fonts.googleapis.com`，`public/_headers` 无需改动）。

### 3.5 合规边界与 Design Transformation Guardrails（重要）

仅借鉴**抽象设计原则、视觉语法、组件模式、交互模式与动效曲线**；不把参考站作为页面结构复制模板。明确禁止：
- 复制 WOZ 商标、Logo、Slogan、品牌名称、产品名称、人物肖像、产品摄影、原始 SVG/logo 资产；
- 复制完整页面文案、HTML/CSS、可直接识别的品牌插画或独特品牌资产；
- 将参考站内容、资产或镜像文件带入生产构建；
- 让 AI 根据截图生成与参考站高度同构、可被视为复制品的页面；
- 改变 58begin 的核心业务 IA、路由、API contract、analytics schema、i18n 原则。
参考站的正确用途是**Design Measurement → Principle Extraction → Original Recomposition**，而不是 Website Cloning。

---

## 4. 差距分析：目标风格 → 本项目改造点映射

| # | 目标风格要素 | 现状 | 改造点 | 层级 |
|---|---|---|---|---|
| G1 | 纯白底 + 黑字 + 60% 次级灰 + 发丝边框 | 暖白/深灰/橙红强调 | 重定义 6 个 token 值，新增 4 个 | token |
| G2 | 深色页头/页脚 `#1e1e1e` 三明治 | 全浅色 | SiteNav + PageShell footer 深色化，新增 header/footer 专用 token | 组件 |
| G3 | 无衬线重磅巨标题（800/1.02/-0.03em/clamp 48–88px） | Newsreader 衬线 600 | `fontFamily.display` 改系统无衬线栈；`display-1` 工具类 | token |
| G4 | 像素字体块眉（Silkscreen）+ 全大写字距块眉 | Newsreader kicker | 引入 Silkscreen；SectionHeading 增 eyebrow 样式 | 组件 |
| G5 | 药丸按钮（30px）+ outline→solid 反转 + 箭头文字链接 | 已是药丸；无反转/箭头变体 | Button 增加 `outline-invert`、`text-arrow` 变体 | 组件 |
| G6 | 直角卡片 + 20px 圆角产品卡；卡片无阴影、靠 1px 发丝线 | 全部 2xl 圆角 + 投影 | Card 增 `square` / `product` 变体，弱化阴影 | 组件 |
| G7 | 容器 1440px、分区留白 40–80px 节奏 | 1200px | `maxWidth` 扩展 + Section 纵向节奏类 | token |
| G8 | 公告跑马灯 | 无 | 新增 `AnnouncementTicker` 组件 + 双语文案字段 | 新组件 |
| G9 | 编号聚光（01/02 贴纸卡） | FeaturedSection 普通卡片 | FeaturedSection 重排为编号聚光版式 | 分区 |
| G10 | 产品卡（图 + 名 + "→"CTA + 徽章）+ 分类瓷片 | Products/Tools 卡片风格不同 | 统一 `ProductCard` 版式 + 新增分类瓷片行 | 分区 |
| G11 | 品牌故事带（深/浅交替全宽段） | About/Culture 常规白底 | 分区交替底色（白/`#EEF1F2`/弱黑 2%–8%） | 分区 |
| G12 | 收尾 CTA 带（"Stay curious." 式全宽标语） | 无 | 新增 `ClosingCtaSection` + 双语文案字段 | 新组件 |
| G13 | 受控色彩点缀 | 橙红单色 | 新增 `--accent-spectrum`；默认仅用于微型装饰/反馈，不进入 Logo/Hero/主 CTA | token/新组件 |
| G14 | 滚动淡入 + 图片缩放 + 级联延迟 | 无动效（Modal 动画失效） | `useScrollReveal` + `.wm-reveal` 等价类 | 动效 |
| G15 | 深色页脚 4 栏 + 订阅框式样 + 支付/社交条 | 单行 © 版权 | PageShell footer 重构为 4 栏（联系/锚点/社交/声明） | 组件 |

---

## 5. 工具调用流程与参数配置

### 5.1 工具可用性预检门（每阶段开始前执行一次）

```bash
# ① 环境满足（本机已验证：Node v24.5.0 ✓，Playwright chromium 已缓存 ✓）
node -v   # 需 >= 20

# ② 禁止误装 npm 同名老包（websnap@1.1.2 = 无关的 PhantomJS 工具，安装必失败）
npm view websnap repository.url   # 若仍指向 geta6 / 无仓库字段 → 不安装

# ③ 检查上游是否已发布真实代码（Track A 触发条件）
curl -s https://api.github.com/repos/uirip/websnap/contents/ | grep '"name"'
# 输出仍是 "README.md" 单文件 → 维持现状（默认执行 Track B：ai-site-cloner）
```

### 5.2 Track A：websnap 启用流程（上游发布代码后执行）

```bash
# 安装：必须从 GitHub 源码构建，禁止 npm 同名包
git clone https://github.com/uirip/websnap.git && cd websnap
corepack enable && pnpm install && pnpm run build && npm link
npx playwright install chromium

# 采集桌面态（参数依据：目标站 max-width 1440，故 viewport 取 1440x900）
websnap open https://wozmerch.com \
  --output ./reference/wozmerch-desktop \
  --viewport 1440x900 --headless --wait 1500        # 1500ms：等待 Shopify 懒加载图

# 状态树探索：depth 2 足够覆盖 导航下拉/抽屉菜单/购物车抽屉 三类交互态；
# include 限定导航与主内容链接，exclude 排除 Cookie 横幅与结账按钮；
# max-per-template 1：商品详情页属同一模板，只抓 1 个代表页
websnap auto --depth 2 --max-states 60 \
  --include "nav a, header a, main a, details summary, button[aria-expanded]" \
  --exclude ".cookie-banner *, .shopify-payment-button *, footer a" \
  --max-per-template 1

# 结构与视觉存档
websnap snapshot > reference/a11y-tree.txt
websnap screenshot reference/woz-home-1440.png
websnap tree > reference/state-tree.txt
websnap status && websnap done

# 移动态第二轮（并行会话）
websnap open https://wozmerch.com --session mobile \
  --output ./reference/wozmerch-mobile --viewport 390x844 --headless --wait 1500
websnap auto --depth 2 --max-states 40 && websnap done
```

产出物用途：离线 HTML = 交互/响应式行为对照；`bundle.json` + `state-tree.txt` = 需覆盖的状态清单（对照第 9 节测试矩阵）；`_assets/` = 供像素级比对的原始素材。**reference/ 目录加入 .gitignore，仅本地存在。**

### 5.3 Track B（默认执行）：ai-site-cloner 实测提取脚本

项目**不引入其生成流水线**（理由见 1.4 节），仅以 vendored 方式运行其测量脚本，把参考站的 token / 样式 / 响应式 / 交互态从"目测"升级为"脚本实测"：

```bash
# ① 克隆到 vendored 位置（整个目录加入 .gitignore：tools/vendor/ 与 tools/reference/，
#    不进版本库、不进构建产物）
git clone https://github.com/Mahanaicoach/ai-site-cloner tools/vendor/ai-site-cloner
cd tools/vendor/ai-site-cloner
npm install                    # Chromium 首次运行自动安装（本机已有 Playwright 缓存）

# ② 一站式勘察（等价 websnap 的"侦察"环节，约 3 次页面加载，15s 级）：
#    提取设计 token、遍历 computed styles、下载资产清单、
#    390/768/1440 三档响应式实测、整页截图、交互扫描
node scripts/extract/page.mjs https://wozmerch.com/

# ③ 单项补测（page.mjs 已含全部，单项失败时单独重跑）
node scripts/extract/tokens.mjs     https://wozmerch.com/    # 设计 token 提取
node scripts/extract/css.mjs        https://wozmerch.com/    # computed-style 遍历
node scripts/extract/responsive.mjs https://wozmerch.com/    # 三视口响应式实测
node scripts/extract/screenshot.mjs https://wozmerch.com/    # 整页截图
node scripts/extract/assets.mjs     https://wozmerch.com/    # 资产清单
node scripts/extract/section.mjs    https://wozmerch.com/ \
  --selector "header" --state hover:"nav a"                  # 交互态捕获（如 mega-menu 悬停）
node scripts/extract/crawl.mjs https://wozmerch.com/ --max 10  # 导航结构（确认分区清单）
```

产出物对接：

| 产出 | 喂给 | 用途 |
|---|---|---|
| token 提取结果 | P1（`index.css` / `tailwind.config.js`） | 与 3.1 节人工提取值交叉核对后落 token |
| computed-style 遍历 | P3 各分区 | 字阶/间距/行高实测值，替代目测 |
| 响应式实测（390/768/1440） | 9.2 兼容性矩阵 | 每档断点行为基准 |
| 交互态捕获 | P2/P5 | mega-menu 悬停、按钮 hover 反转的实测样式 |
| 整页截图 | 9.3 视觉验收 | 参考包基准图 |

运行前提：Node ≥ 22（本机 v24.5.0 ✓）；工具为 AI 编码代理驱动设计，脚本本身是普通 Node CLI，无需额外账号或 API Key；MIT 许可。**边界**：其生成环节（Next.js 16 / React 19 / Tailwind v4 代码与 spec 体系）不使用、不迁移；`BRAND.md` 与 `/restyle` 技能对本任务无用，忽略。

### 5.4 Track C（兜底）：自研 Playwright 捕获脚本

若 Track B 脚本对 Shopify 站点出现兼容问题（如懒加载导致遍历不全），回退到项目自建脚本（依赖现有 `@playwright/test@1.53`，零新增依赖）：

```ts
// 用法：npx tsx tools/capture-reference.mts   （产出 tools/reference/wozmerch/，已 gitignore）
import { chromium, devices } from "playwright";
import { mkdirSync, writeFile } from "node:fs/promises";

const OUT = "tools/reference/wozmerch";
mkdirSync(OUT, { recursive: true });

for (const [name, device] of Object.entries({
  desktop: { viewport: { width: 1440, height: 900 } },
  tablet:  { ...devices["iPad Mini"] },
  mobile:  { ...devices["iPhone 13"] },
}) as const) {
  const browser = await chromium.launch();
  const page = await browser.newPage(device);
  const assets: string[] = [];
  page.on("response", r => assets.push(r.url()));          // 等价 websnap 资产拦截
  await page.goto("https://wozmerch.com/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500); // 等待关键 Hero / 懒加载资源稳定；必要时补充 auto-scroll

  await page.screenshot({ path: `${OUT}/home-${name}.png`, fullPage: true });
  if (name === "desktop") {
    await page.screenshot({ path: `${OUT}/home-fold.png` });// 首屏折叠线
    // 展开移动端抽屉/桌面下拉后各补一张交互态截图（等价 websnap 状态树）
    await page.getByRole("navigation").getByRole("link", { name: /Shop/i }).first().hover().catch(() => {});
    await page.screenshot({ path: `${OUT}/home-meganav.png` });
  }
  await page.content().then(h => writeFile(`${OUT}/home-${name}.html`, h)); // DOM 存档
  await browser.close();
}
```

（Track C 为兜底手段，实施时以最终脚本为准；验收点：三视口 full-page 截图 + 首屏图 + mega-menu 交互态图 + DOM 存档 + 网络资产 URL 清单落盘。）

单条命令速查（临时比对用）：

```bash
npx playwright screenshot --viewport-size=1440,900 --full-page https://wozmerch.com tools/reference/home-1440.png
```

### 5.5 对照工作流（贯穿各阶段）

1. **P0**：运行 Track B 测量脚本产出实测数据包（token / computed styles / 响应式 / 交互态 / 截图）；同时留存**当前项目**三视口 full-page 截图（改前基线）。
2. **每阶段完成**：对项目同视口重新截图，与参考包并排比对（结构对齐优先于像素对齐）。
3. **P6 诊断**（可选增强）：借用 Track B 的像素 diff 工具做差异定位——
   ```bash
   cd tools/vendor/ai-site-cloner
   node scripts/diff.mjs --original https://wozmerch.com \
     --clone http://localhost:5173 --route / --viewport all   # 启动 dev server 后运行
   node scripts/compare.mjs    # 输出存在差异的 CSS 属性，按视觉影响排序
   ```
   注意：**diff 分数仅用于定位差异点，不作为通过门槛**——本项目内容与对方不同（原创 zh/en 文案），克隆场景的 95% 像素门槛不适用；验收标准仍以 9.3 节"结构一致优先"为准。
4. 关键页可接入 Playwright `expect(page).toHaveScreenshot()` 快照测试（初期限本地比对，避免跨平台像素抖动进 CI）。

---

## 5.6 Vendored 工具隔离与供应链规则

`ai-site-cloner` 仅作为本地参考测量工具。V1.1 强制执行：

- 路径固定为 `tools/vendor/ai-site-cloner/`；
- `tools/vendor/`、`tools/reference/` 必须进入 `.gitignore`；
- 不允许在 `src/` 中 import 其任何代码；
- 不允许把它加入生产 `dependencies`；
- 不允许把它加入生产构建；
- 运行前做 LICENSE / manifest / package-script 检查；
- 不向该工具提供生产 secrets、Cloudflare credentials、API keys；
- 若安装脚本触发未知网络下载或 postinstall 行为，立即停止并改用 Track C；
- 测量结果以 JSON/CSV/截图等纯数据形式留存于本地 reference 目录；
- 参考站资产不得进入 git、npm package、Cloudflare deployment artifact。

推荐执行：

```bash
git status --short
git check-ignore -v tools/vendor/ tools/reference/
npm pkg get dependencies devDependencies
```

在 P0 结束时执行一次 production bundle scan，确认 `dist/` 不包含 `tools/vendor`、`tools/reference` 或参考站资产。

---

## 6. 分阶段实施计划（总工期 12–15 人日，目标 13 人日）

| 阶段 | 内容 | 工期 | 优先级 | 里程碑/验收门 |
|---|---|---|---|---|
| **P0 基线与素材** | 开分支 `restyle/visual-redesign-v1.1`；按 5.3 节部署测量工具并运行；产出 token / computed styles / 响应式 / 交互态 / 截图；留存改前三视口基线；建立 Guardrails 与工作树检查 | 1d | 高 | M0：实测数据包 + 基线截图 + 执行环境记录 |
| **P1 设计令牌与全局** | 重定义 `index.css` 6 个 token 值并新增语义 token（header/footer 深色、accent-spectrum 渐变、弱底三级）；`tailwind.config.js` 同步映射 + `maxWidth.site: 1440px` + `fontFamily.display` 换系统无衬线 + 新 keyframes（marquee）；`index.html` 引入 Silkscreen、清理未用字体请求；复核 `public/_headers` | 1d | 高 | M1：token 落地，全站无 404 资源、tsc/lint 绿、旧页面"换色不换版" |
| **P2 页面骨架** | 新增 `AnnouncementTicker`（双语）；`SiteNav` 深色化；`PageShell` footer 重构为深色 4 栏；`RainbowProgress` 默认不作为必选项，只有 Gate 通过后才可启用 | 2d | 高 | M2：骨架多视口走查通过，导航/语言切换 e2e 全绿 |
| **P3 首页分区** | 以参考站的叙事原则重新编排视觉节奏，但不机械复制 13 段：Hero → Featured → Products/Tools → About/Culture → Content → Contact + Closing CTA；每段完成即双语走查 | 3.5d | 高（Hero/Featured/Products），中（其余） | M3：首页视觉语法与业务 IA 同时通过 |
| **P4 子页面** | `/posts`（标签筛选条改瓷片风格）、`/posts/:slug`（prose 排版对齐新 token）、`/privacy`、404 | 1d | 中 | M4：全站四路由风格统一 |
| **P5 动效** | `useScrollReveal`（IO + 级联延迟 + 媒体缩放）；按钮 hover 反转/箭头位移；marquee 动画；Hero 桌面视差；`prefers-reduced-motion` 全量降级；清理 `Modal` 失效动画类 | 1.5d | 中 | M5：动效走查 + 性能无长帧 |
| **P6 测试与修复** | 第 9 节 + V1.1 Gate 全量执行：tsc/lint/vitest/playwright + 兼容性矩阵 + 双语 + A11y + CWV + 视觉规则验证 | 2d | 高（不可裁剪） | G1–G4 全部通过 |
| **P7 上线与回滚演练** | 合并 PR → `deploy` workflow dispatch → `/api/health` + 首页冒烟 + 三视口线上截图；演练一次回滚（见 8.2） | 0.5d | 高 | DoD 全项勾选 |

时间节点（按 1 人全职估算）：D1 → M0；D2 → M1；D3–D4 → M2；D5–D7.5 → M3；D8.5 → M4；D9–D10 → M5；D10–D12 → P6；D13 → P7 上线；预留 1–2 天视觉返工/兼容性修复，计划上限 15 人日。

---

## 7. 核心文件修改清单

**优先级**：P0 = 本阶段必改，P1 = 高，P2 = 中，P3 = 低。

| 文件 | 改动类型 | 优先级 | 阶段 | 说明 |
|---|---|---|---|---|
| `src/index.css` | 重写 | P0 | P1 | 主要语义 token 重定义；新增 `--header-bg/--footer-text/--accent-spectrum/--surface-2/3/4`；`.reveal*` 动效类；移除 Newsreader 回退依赖 |
| `tailwind.config.js` | 修改 | P0 | P1 | token 映射扩充、`maxWidth.site: 1440px`、`fontFamily.display`/`accent`、`keyframes: marquee` |
| `index.html` | 修改 | P0 | P1 | 引入 `Silkscreen`；移除 Newsreader；语言切换时由应用层同步 `document.documentElement.lang`，不再作为“另行任务” |
| `src/components/PageShell.tsx` | 重写 | P0 | P2 | 深色 4 栏 footer（品牌/站点锚点/联系与社交/声明），保留 Helmet 逻辑 |
| `src/components/SiteNav.tsx` | 重写 | P0 | P2 | 深色 header + 公告栏插槽；**保持语言切换按钮可访问文案与锚点行为不变**（e2e 依赖） |
| `src/components/AnnouncementTicker.tsx` | 新增 | P0 | P2 | CSS marquee，双语，reduced-motion 静态化 |
| `src/components/RainbowProgress.tsx` | 新增 | P3 | P2（可延至 P5） | 3px `accent-spectrum` 滚动进度条；默认可关闭 |
| `src/components/Button.tsx` | 修改 | P0 | P2 | 新增 `outline-invert`/`text-arrow` 变体；保留原 3 变体兼容存量调用 |
| `src/components/Card.tsx` | 修改 | P1 | P3 | 新增 `square`/`product` 变体（直角/20px 圆角、发丝线、弱阴影） |
| `src/components/SectionHeading.tsx` | 修改 | P1 | P3 | eyebrow（全大写字距/Silkscreen 可选）+ 巨标题字阶 |
| `src/sections/home/HeroSection.tsx` | 重写 | P0 | P3 | clamp 巨标题 + 双 CTA + 信任徽章行 + 指标贴纸卡 |
| `src/sections/home/FeaturedSection.tsx` | 重写 | P1 | P3 | 编号聚光（01/02 贴纸卡 + 图片缩放进入） |
| `src/sections/home/ProductsSection.tsx` | 重写 | P1 | P3 | 产品卡统一版式 + 分类瓷片行 |
| `src/sections/home/ToolsSection.tsx` | 重写 | P1 | P3 | 同产品卡语言，图标链接改箭头式 |
| `src/sections/home/AboutSection.tsx` / `CultureSection.tsx` | 修改 | P2 | P3 | 品牌故事带，交替底色 |
| `src/sections/home/ContentSection.tsx` | 修改 | P2 | P3 | 文章卡 + "查看全部 →" 文字箭头 |
| `src/sections/home/ContactSection.tsx` | 修改 | P2 | P3 | 外壳套新样式；**LeadForm/API/Toast/Modal 逻辑零改动** |
| `src/sections/home/ClosingCtaSection.tsx` | 新增 | P2 | P3 | 收尾全宽 CTA 带 |
| `src/content/types.ts` | 修改 | P0 | P2 | `SiteContent` 增 `announcement`、`closingCta`、`trustBadges` 字段 |
| `src/content/site.zh.ts` / `site.en.ts` | 修改 | P0 | P2–P3 | 新增字段的双语原创文案 |
| `src/content/siteContentAlignment.test.ts` | 修改 | P1 | P2 | 新字段纳入对齐断言 |
| `src/hooks/useScrollReveal.ts` | 新增 | P2 | P5 | IO 淡入/级联/媒体缩放 |
| `public/_headers` | 复核 | P2 | P1 | 现行 CSP 已放行 Google Fonts，预计零改动 |
| `e2e/home.spec.ts`、`src/components/SiteNav.test.tsx` | 回归确认 | P1 | P6 | 断言的选择器/文案不得因改版失效 |
| **明确不动**：`api/**`、`migrations/**`、`src/utils/analytics.ts`（事件类型不变）、`wrangler.toml`；`src/stores/lang.ts`原则上不改，仅允许为同步 `<html lang>`增加不改变数据契约的 UI side effect；`PostDetail/Privacy`仅换样式类 | — | — | — | 后端与数据契约零风险 |

---

## 8. 风险评估与回滚机制

### 8.1 风险清单

| # | 风险 | 概率 | 影响 | 缓解措施 |
|---|---|---|---|---|
| R1 | 误装 npm 同名 `websnap` 老包导致依赖污染 | 低（已写明禁令） | 中 | 仅允许 5.1 预检门通过的安装路径；工具不进 `package.json`，捕获脚本走 devDependency 的 Playwright |
| R2 | websnap 上游长期不发布 | 高（已发生） | 低 | Track B 已完整等价（同为 Playwright/Chromium 内核），不阻塞任何阶段 |
| R3 | token 值重定义引发全站隐性视觉回归 | 中 | 中 | 现状零硬编码色值（2.3 节）→ 改值天然全站生效；每阶段三视口截图比对；先增新 token 后改旧值，分两个 commit |
| R4 | SiteNav 改版破坏 e2e 语言切换/导航断言 | 中 | 中 | 保持按钮可访问名称与 DOM 层级语义不变；e2e 与单测纳入每阶段验收 |
| R5 | 双语内容新增字段漏改另一语言 | 中 | 中 | `siteContentAlignment.test.ts` 扩展新字段；文案提交必须 zh/en 同 commit |
| R6 | 动效引发低端设备掉帧/眩晕 | 低 | 中 | 不引入 Lenis 等重依赖；动效仅 opacity/transform（合成层）；`prefers-reduced-motion` 全量降级 |
| R7 | 商标/文案侵权 | 低（有 3.5 边界） | 高 | 仅借鉴版式与令牌体系；文案原创；彩虹渐变仅作进度条等抽象装饰，不复刻其 logo 元素 |
| R8 | 上线后 Cloudflare 缓存/回滚不及时 | 低 | 高 | 沿用 `docs/OPERATIONS.md` 既有 `wrangler rollback` 流程，P7 实际演练一次 |
| R9 | ai-site-cloner 测量脚本对 Shopify 懒加载站点遍历不全或字段缺失 | 低 | 低 | `page.mjs` 产出与 3.1/3.3 节人工提取值交叉核对；不一致时用单项脚本重跑或回退 Track C |
| R10 | vendored 工具目录误入版本库或构建产物 | 低 | 中 | `tools/vendor/`、`tools/reference/` 双目录进 `.gitignore`；P0 完成时验证 `git status`；构建产物扫描不含参考资产 |

### 8.2 回滚机制（三层）

1. **开发期（分支级）**：全程在 `restyle/woz-style` 分支；每阶段一个原子 commit（前缀 `restyle(p1): …`），任一阶段可独立 `git revert`；PR 合并前 CI 全绿为硬门禁。
2. **合并后（部署级）**：`deploy` workflow（见 `docs/SITE_AUTO_SYNC.md`）仅由 main `workflow_dispatch` 触发 → 回滚 = `git revert` 对应 merge commit → 重新 dispatch → 验证 `/api/health` + 首页冒烟。预计恢复时间 < 10 分钟。
3. **应急（平台级）**：线上发现严重问题时直接 `wrangler rollback`（Workers 版本回退，秒级生效），随后再走 git 层回滚对齐源码（操作细节以 `docs/OPERATIONS.md` 为准）。

补充：`tools/vendor/`（ai-site-cloner 仓库本体）与 `tools/reference/`（参考站实测数据、截图与资产）均仅存本地、加入 `.gitignore`，**不进 git、不进构建产物**，规避版权与体积风险。

---

## 9. 兼容性测试与功能回归测试执行标准

### 9.1 回归测试范围（全部必须通过，缺一不可）

| 套件 | 命令 | 通过标准 |
|---|---|---|
| 类型检查 | `npm run check` | 0 error |
| Lint | `npm run lint` | 0 error / 0 warning（现状基线） |
| 单元/集成 | `npm test` | 全绿：SiteNav 语言切换、zh/en 内容对齐（含新增字段）、API lead 4 例（创建/限流 429/校验 400/蜜罐） |
| E2E | `npm run test:e2e` | chromium/firefox/webkit 三引擎全绿：首页标题、语言切换、`/posts` 导航、QR Modal 开合 |

### 9.2 兼容性测试矩阵（P6 执行，逐格走查）

| 维度 | 取值 |
|---|---|
| 浏览器 | Chromium / Firefox / WebKit（Playwright 三引擎） |
| 视口 | 1440×900、1280×800、1024×768、768×1024、430×932、390×844、375×812 |
| 语言 | zh / en（每页双向切换后走查） |
| 动效偏好 | `prefers-reduced-motion: reduce` 开 / 关（开启时：marquee 静态、reveal 直显、进度条隐藏） |
| 网络节流 | Fast 3G 首开一次（验证字体闪替与懒加载无布局抖动，CLS 目标 < 0.1） |

每格检查项：无水平滚动条/横向溢出；分区底色交替正确；深色区文字对比度 ≥ WCAG AA；导航/锚点跳转正确；语言切换后全部新分区文案同步；表单与 Modal 功能完好。

### 9.3 视觉验收标准（对照第 5.5 节参考包；以设计规则一致性为主）

1. 版式规则一致：深-浅-深节奏、容器宽度、栅格、对齐线、分区留白、CTA 语法与参考原则一致；**不以页面段落数量或单一像素差作为硬门槛**。
2. 字阶一致：Hero 巨标题 clamp 区间、分区 h2、块眉的三级字阶与参考实测值对齐（3.1/3.3 节数值）。
3. 组件规格一致：药丸按钮 30px、直角卡片 + 20px 产品卡、发丝线边框、箭头链接。
4. 动效曲线一致：reveal 采用 `cubic-bezier(.2,.7,.2,1)`、位移 28px、时长 0.9–1.4s。
5. 性能：以 Core Web Vitals 为硬指标：LCP < 2.5s、CLS < 0.1、INP < 200ms；正常滚动无明显 >50ms 长任务；Lighthouse 仅作辅助诊断，不用“基线 -2 分”替代 CWV。
6. 差异定位闭环：`compare.mjs` 输出的高影响 CSS 属性差异逐项清零，或给出"内容性差异（文案不同所致）"的接受理由（见 5.5 节，分数不作门槛）。

### 9.4 新增测试项（随阶段交付）

- `AnnouncementTicker`：渲染双语、reduced-motion 静态（vitest）。
- `useScrollReveal`：IO mock 下类名切换正确（vitest）。
- `ClosingCtaSection` 锚点/CTA 渲染（vitest）。
- `siteContentAlignment.test.ts` 扩展：announcement/trustBadges/closingCta 双语对齐。
- e2e 补充：深色 header/footer 存在于首屏与页尾（light-housekeeping 级断言，不锁像素）。

---

## 10. 交付物与验收清单（Definition of Done）

- [ ] 分支 `restyle/woz-style` 全部 7 阶段 commit + PR 描述含本方案链接
- [ ] 参考包（token/computed styles 实测数据 + 三视口截图 + 交互态 + 资产清单）与改前基线归档（本地）
- [ ] 9.1 全部测试套件绿；9.2 矩阵逐格走查记录留档 `docs/` 
- [ ] 9.3 视觉验收 5 项逐条比对通过
- [ ] 双语走查签字（zh/en 各一遍全站）
- [ ] 合并 → 部署 → 线上 `/api/health` 200 + 三视口线上截图核验
- [ ] 回滚演练完成并记录恢复用时

---

## 附录 A：目标站实测数据备查

- 主题变量与彩虹色系、圆角/宽度、动效参数：见 3.1 / 3.3（均于 2026-10-03 自 `theme.css`、`woz-motion.css`、页面内联 `<style>` 提取）。
- 参考站技术栈：Shopify（Online Store 2.0），主题层 + `woz-launch-fixes/layout-qa/motion/home-compact/product-presentation/buyer-confidence` 六个定制 CSS 层；字体经 Google Fonts 加载 Silkscreen/Playfair Display。
- websnap 可用性核查证据：npm `websnap@1.1.2`（author geta6，deps `phantomjs@1.9.2-6`，postinstall 下载 `phantomjs.googlecode.com` 实测 ETIMEDOUT）；GitHub API `/repos/uirip/websnap`：branches = [main]，releases = []，contents = [README.md]。
- ai-site-cloner 可用性核查证据（2026-10-03）：GitHub API `repos/Mahanaicoach/ai-site-cloner`——languages `{JavaScript: 208036, TypeScript: 5060, CSS: 4389}`，41 commits，pushed 2026-07-22，MIT，已有 Release；`git/trees/main` 确认 `scripts/extract/{page,tokens,css,responsive,section,screenshot,assets,crawl}.mjs`、`scripts/{diff,compare,manifest,lint-spec}.mjs` 与 `.claude/skills/{clone-website,restyle}/SKILL.md` 均真实存在；要求 Node ≥ 22（`.nvmrc`）。

## 附录 B：与本方案相关的既有文档

- `docs/OPERATIONS.md` —— 平台级回滚（8.2 第 3 层直接引用）
- `docs/SITE_AUTO_SYNC.md` —— GitHub → 生产部署链路（8.2 第 2 层直接引用）
- `docs/LANG_ALIGNMENT_REPORT.md` / `FIXLIST.md` —— 双语对齐方法论（R5 沿用）
- `docs/RELEASE_CHECKLIST.md` —— 上线检查单（P7 并入执行）


---

## 11. V1.1 Claude Code / Codex 执行协议

本章是本方案的**机器执行契约**。Claude Code、Codex 或其他 coding agent 必须把本方案视为受控实施规格，而不是自由发挥的设计提示词。

### 11.1 Agent 总原则

1. **先读后改**：先读取仓库结构、现有组件、测试、构建脚本和本方案，再修改代码。
2. **先测量后设计**：不得凭截图或主观印象猜测参考站参数；可用 Track B，失败则 Track C。
3. **最小变更原则**：优先修改 token、组件和页面样式，不迁移框架、不替换路由、不重写 API。
4. **保持业务不变量**：业务数据、LeadForm、API contract、analytics event schema、i18n 数据结构不得被视觉改造破坏。
5. **每阶段一个原子 commit**：阶段未通过 Gate，不得进入下一阶段。
6. **不自批准**：Agent 可以运行测试并报告结果，但不得把失败测试标记为通过，不得删除/弱化测试以制造绿色结果。
7. **禁止大范围自动重构**：除非本方案明确授权，不得顺手升级 React/Vite/Tailwind/router、替换状态管理或引入 UI 框架。
8. **所有新增依赖必须先说明**：V1.1 默认零新增 runtime dependency。
9. **视觉原创重组**：参考站仅提供设计原则和测量数据，最终 DOM 结构、文案、资产和品牌表达必须属于 58begin。
10. **可回滚优先**：任何不可逆操作前先建立 git checkpoint。

### 11.2 Claude Code / Codex 工作循环

```text
READ → INSPECT → MEASURE → PLAN → PATCH → TEST → SCREENSHOT → REVIEW → COMMIT → GATE
```

每个阶段必须输出：

```text
1. Changed files
2. Why each file changed
3. Tests executed
4. Test results
5. Screenshot / visual evidence
6. Known deviations
7. Gate result: PASS / FAIL / BLOCKED
8. Next-stage recommendation
```

### 11.3 Agent 状态文件

建议在仓库根目录维护：

```text
docs/58BEGIN_VISUAL_REDESIGN_V1_1.md
docs/58BEGIN_REDESIGN_EXECUTION_LOG.md
docs/58BEGIN_REDESIGN_GATES.md
docs/58BEGIN_REDESIGN_VISUAL_RULES.md
```

`EXECUTION_LOG.md` 每阶段追加，不覆盖历史。

---

## 12. Claude Code / Codex 禁止事项

### 12.1 技术禁止事项

- 禁止执行 `npm install -g websnap`。
- 禁止把 `ai-site-cloner` 的 Next.js 生成项目复制进 58begin。
- 禁止迁移到 Next.js 16 / React 19 / Tailwind 4。
- 禁止修改 `api/**`、数据库 migration、Cloudflare Worker contract。
- 禁止改变 `/api/lead` 的 request/response contract。
- 禁止改变 analytics event name / payload schema。
- 禁止删除现有 e2e、unit test 来规避失败。
- 禁止为了通过 lint/test 删除功能。
- 禁止把 `tools/vendor/`、`tools/reference/` 纳入 production bundle。
- 禁止提交参考站截图、HTML、CSS、图片、字体或其他受保护资产。
- 禁止新增 Lenis、GSAP 等重量运行时动画依赖，除非另行批准。
- 禁止使用 `!important` 大面积覆盖现有样式作为改造手段。

### 12.2 设计禁止事项

- 禁止复制 WOZ Logo、商标、Slogan、产品名称、产品摄影、人物摄影、SVG/logo。
- 禁止逐段复制参考站首页 13-section DOM。
- 禁止复制其文案或将其内容作为 58begin placeholder。
- 禁止把彩虹元素做成 58begin 的品牌识别核心。
- 禁止彩虹渐变用于 Logo、Hero 大背景、主标题或主 CTA。
- 禁止为了“更像参考站”而改变 58begin 的业务信息架构。
- 禁止为了像素 diff 分数而改变内容、文案或真实业务布局。
- 禁止将参考站像素 diff 作为最终通过标准。

### 12.3 Agent 行为禁止事项

- 不得声称“已验证”而没有实际执行命令。
- 不得声称“视觉一致”而没有截图或明确检查证据。
- 不得隐瞒测试失败。
- 不得在一个 commit 中同时混入多个未关联的大型重构。
- 不得自动修改 `.env`、生产 secrets、Cloudflare credentials。
- 不得将外部站点抓取数据上传到第三方 AI 服务。
- 不得在未获授权时发布生产部署。

---

## 13. 四级 Gate 门禁

### Gate 0 — Baseline Gate

**必须满足：**

- git working tree 状态已记录；
- 当前首页 /posts /post detail /privacy /404 均可访问；
- zh/en 均可切换；
- `/api/health` 正常；
- 当前版本三视口截图已保存；
- Track B 或 Track C 参考数据已生成；
- `tools/vendor` / `tools/reference` 已加入 `.gitignore`；
- 参考数据未进入 git。

**失败处理：**停止 P1。

### Gate 1 — Functional Gate

**必须满足：**

- 所有原有 route 100% 可访问；
- 导航、锚点、语言切换 100% 正常；
- LeadForm 可提交；
- API lead contract 未改变；
- Toast / Modal 正常；
- QR Modal 正常；
- analytics event schema 未改变；
- zh/en 内容结构测试通过。

**失败处理：**不得进入视觉精修。

### Gate 2 — Visual Gate

检查：

- Hero typography；
- container width；
- grid；
- spacing rhythm；
- black/white/light-gray section rhythm；
- header/footer；
- button grammar；
- square/product card；
- arrow CTA；
- image treatment；
- section heading；
- responsive breakpoints。

**原则：设计规则一致 > 像素复制。**

### Gate 3 — Accessibility & Performance Gate

必须满足：

- keyboard navigation；
- visible focus；
- logical tab order；
- semantic button/link；
- `aria-expanded` / `aria-controls` 正确；
- mobile menu 可键盘关闭；
- Escape 可关闭 modal/menu；
- 表单 label / error 可访问；
- contrast 达到 WCAG AA；
- `prefers-reduced-motion` 正常；
- `<html lang>` 与当前语言一致；
- LCP < 2.5s；
- CLS < 0.1；
- INP < 200ms；
- 正常滚动无明显长任务；
- Fast 3G 无严重 FOUT/CLS。

### Gate 4 — Release Gate

必须满足：

- P0–P7 全部完成；
- 全测试绿；
- 视觉验收记录完成；
- zh/en 全站走查完成；
- 线上 smoke test 完成；
- `/api/health` = 200；
- 三视口线上截图完成；
- rollback rehearsal 完成；
- PR description 包含变更、测试、风险、回滚方案。

---

## 14. 验收矩阵 V1.1

| 类别 | 检查项 | 目标 | 证据 | Gate |
|---|---|---|---|---|
| Functional | Routes | 100% | Playwright | G1 |
| Functional | Language switch | zh/en 100% | Playwright + screenshot | G1 |
| Functional | LeadForm | request/response 不变 | Vitest/E2E | G1 |
| Functional | Analytics | event schema 不变 | unit inspection | G1 |
| Visual | Hero | 字阶/宽度/行高符合规则 | screenshot | G2 |
| Visual | Container | 1440 max-width + responsive padding | screenshot | G2 |
| Visual | Cards | square/product 两类正确 | screenshot | G2 |
| Visual | CTA | pill / outline / arrow grammar | screenshot | G2 |
| Visual | Header/Footer | dark sandwich structure | screenshot | G2 |
| Visual | Sections | light/dark rhythm | screenshot | G2 |
| Visual | Motion | reveal / hover / marquee | video or screenshot sequence | G2 |
| Responsive | 1440×900 | pass | screenshot | G2 |
| Responsive | 1280×800 | pass | screenshot | G2 |
| Responsive | 1024×768 | pass | screenshot | G2 |
| Responsive | 768×1024 | pass | screenshot | G2 |
| Responsive | 430×932 | pass | screenshot | G2 |
| Responsive | 390×844 | pass | screenshot | G2 |
| Responsive | 375×812 | pass | screenshot | G2 |
| Accessibility | Keyboard | 100% core flows | manual + Playwright | G3 |
| Accessibility | Focus | visible | manual | G3 |
| Accessibility | ARIA | correct | DOM inspection | G3 |
| Accessibility | Reduced motion | all required degradation | Playwright | G3 |
| Accessibility | Language | `<html lang>` correct | DOM assertion | G3 |
| Performance | LCP | <2.5s target | Lighthouse/DevTools | G3 |
| Performance | CLS | <0.1 | Lighthouse/DevTools | G3 |
| Performance | INP | <200ms target | DevTools/field measurement where available | G3 |
| Performance | Long tasks | no obvious >50ms scroll-path stalls | Performance trace | G3 |
| Release | Health | 200 | curl / smoke | G4 |
| Release | Rollback | rehearsed | execution log | G4 |

---

## 15. 分阶段 Claude Code / Codex Prompt

以下 Prompt 可直接粘贴给 Claude Code 或 Codex。每个阶段只执行对应 Prompt；完成后必须停在 Gate。

### P0 Prompt — Baseline & Measurement

```text
你现在执行 58begin Visual Redesign Implementation Plan V1.1 的 P0。

目标：
1. 只做审计、测量、基线，不改业务代码。
2. 阅读 docs/ 与 package.json、src/、tests、wrangler 配置。
3. 检查 Node、Playwright、git 状态。
4. 禁止安装 npm websnap。
5. 优先运行 Track B；失败则 Track C。
6. 生成：
   - reference tokens
   - computed styles
   - responsive measurements
   - interaction states
   - reference screenshots
   - current-site baseline screenshots
7. 建立/验证 tools/vendor 与 tools/reference 的 gitignore。
8. 检查参考数据不会进入 production build。
9. 创建 docs/58BEGIN_REDESIGN_EXECUTION_LOG.md。

不要：
- 修改 API；
- 修改路由；
- 修改业务组件；
- 修改 package.json，除非仅为已存在的本地工具问题且先报告；
- 提交参考站资产。

完成后只报告：
Changed files / Commands / Evidence / Risks / Gate 0 PASS or FAIL。
如果 Gate 0 FAIL，停止。
```

### P1 Prompt — Design Tokens

```text
执行 V1.1 P1：Design Tokens & Global Layer。

先读取 P0 测量结果。

要求：
1. 把参考站测量值转译成 58begin 自己的 semantic tokens。
2. 使用 --accent-spectrum，不使用 --rainbow。
3. 不复制品牌色彩资产作为品牌识别。
4. Hero/body 使用系统 sans；Silkscreen 仅用于 eyebrow/编号微元素。
5. 更新 tailwind.config.js。
6. max-width.site = 1440px。
7. 修正字体加载策略、font-display、fallback 与 CLS 风险。
8. 将语言切换与 document.documentElement.lang 的同步纳入 i18n UI 行为。
9. 不改 API、route、store contract、analytics schema。
10. 完成 tsc + lint + unit。

视觉目标：
“换设计语言，不换业务结构”。

完成后：
- 输出 token diff；
- 输出 before/after screenshot；
- 运行 Gate 1 基础检查；
- 失败则停止，不进入 P2。
```

### P2 Prompt — Global Shell

```text
执行 V1.1 P2：Page Shell / Navigation。

实现：
1. AnnouncementTicker；
2. dark SiteNav；
3. responsive mobile menu；
4. dark four-column footer；
5. Button 新 variants；
6. 可选 RainbowProgress，但默认关闭；
7. 保持现有导航语义和 e2e selectors 可维护；
8. 键盘、focus-visible、aria-expanded、aria-controls、Escape 行为必须正确；
9. language switch 必须同步 <html lang>。

禁止：
- 改路由；
- 改 analytics；
- 改 API；
- 引入新的 animation framework。

运行：
tsc / lint / unit / e2e / 1440 / 1024 / 768 / 430 / 390 / 375 screenshots。

Gate 1 不通过就停止。
```

### P3 Prompt — Home Recomposition

```text
执行 V1.1 P3：首页视觉重组。

核心原则：
不要复制 wozmerch 的 13 段 DOM。
提取其 Visual Grammar，然后重新组合 58begin 自己的内容。

实现：
Hero → Featured → Products/Tools → About/Culture → Content → Contact → Closing CTA。

要求：
1. Hero 巨标题；
2. trust badges；
3. numbered spotlight；
4. square/product cards；
5. arrow CTA；
6. light/dark section rhythm；
7. original 58begin content；
8. zh/en 同步；
9. Contact 的 LeadForm/API/Toast/Modal 逻辑零改动；
10. 所有新内容字段通过 alignment test。

每完成一个 section：
screenshot → inspect → test → commit。

不得：
- 复制参考站文案；
- 复制参考站摄影；
- 复制参考站 SVG；
- 复制其具体页面结构。

P3 完成后执行 Gate 1 + Gate 2。
```

### P4 Prompt — Secondary Pages

```text
执行 V1.1 P4。

目标：
让 /posts、/posts/:slug、/privacy、404 与首页共享同一 Visual System。

要求：
- 不改变内容模型；
- 不改变 URL；
- prose 使用新 typography tokens；
- posts filters 使用 chip/tile grammar；
- 404 使用同一 CTA language；
- zh/en 全部检查；
- keyboard/accessibility 一并检查。

完成后：
npm run check
npm run lint
npm test
npm run test:e2e

输出页面截图和 Gate 结果。
```

### P5 Prompt — Motion & Micro-interaction

```text
执行 V1.1 P5。

只允许使用 CSS + IntersectionObserver + requestAnimationFrame。

实现：
- reveal translateY(28px) → 0；
- opacity transition；
- media scale 1.08 → 1；
- button hover inversion；
- arrow movement；
- marquee；
- optional desktop hero parallax。

必须：
- prefers-reduced-motion = reduce 时：
  marquee 静态；
  reveal 直接显示；
  progress hidden；
  parallax disabled。

禁止：
- Lenis；
- GSAP；
- 大型 motion runtime。

完成后运行 Performance trace：
重点观察 LCP、CLS、scroll long tasks。
```

### P6 Prompt — QA / Gate Closure

```text
执行 V1.1 P6：全量 QA。

运行：
npm run check
npm run lint
npm test
npm run test:e2e

然后执行：
1. Chromium / Firefox / WebKit；
2. 1440×900；
3. 1280×800；
4. 1024×768；
5. 768×1024；
6. 430×932；
7. 390×844；
8. 375×812；
9. zh/en；
10. reduced-motion on/off；
11. Fast 3G；
12. keyboard navigation；
13. focus；
14. ARIA；
15. Escape；
16. form validation；
17. <html lang>。

性能硬门：
LCP < 2.5s
CLS < 0.1
INP < 200ms target
无明显 >50ms scroll-path long task。

视觉硬规则：
container / typography / grid / spacing / card / button / header / footer / section rhythm。

像素 diff 只能用于定位，不作为通过门槛。

生成：
docs/58BEGIN_REDESIGN_GATES.md
docs/58BEGIN_REDESIGN_VISUAL_RULES.md

只有 G1/G2/G3 全部 PASS 才能进入 P7。
```

### P7 Prompt — Release

```text
执行 V1.1 P7 Release。

发布前确认：
1. git diff；
2. git status；
3. package.json 无非授权变更；
4. API contract 未变；
5. migrations 未变；
6. analytics schema 未变；
7. tools/vendor 与 tools/reference 不在 git；
8. production bundle 不含 reference assets；
9. 全测试绿；
10. G1/G2/G3 PASS；
11. zh/en full-site walk-through 完成。

然后：
- 创建 PR；
- 不自动 merge；
- 等待人工批准；
- 执行 deploy；
- /api/health = 200；
- 首页 smoke test；
- 线上多视口截图；
- 执行 rollback rehearsal。

任何一项失败：
STOP，不发布。
```

---

## 16. 推荐的 Agent Commit Convention

```text
restyle(p0): establish visual baseline
restyle(p1): implement semantic design tokens
restyle(p2): rebuild global shell
restyle(p3): recompose homepage visual system
restyle(p4): align secondary pages
restyle(p5): add controlled motion system
restyle(p6): close visual and functional QA
restyle(p7): release visual redesign
```

禁止使用：

```text
fix everything
update website
major redesign
cleanup
misc
```

原因：这些 commit message 无法支持阶段级回滚和责任追踪。

---

## 17. Visual Rules 固化版

### Typography

```text
Hero: clamp(48px, 7.5vw, 88px)
Hero line-height: 1.02
Hero letter-spacing: -0.03em
Hero weight: 800
```

Body / UI：

```text
system sans
Arial, Helvetica, sans-serif
```

Silkscreen：

```text
仅用于 eyebrow / numbered micro-label / decorative marker
```

Playfair：

```text
仅允许极少量 decorative accent
```

### Shape

```text
Primary button: 30px radius
Square card: 0px
Product card: 20px
Form/control: 10px
```

### Container

```text
max-width: 1440px
responsive padding:
15 / 20 / 30 / 40px
```

### Borders

```text
light border ≈ rgba(0,0,0,.10)
dark border ≈ rgba(255,255,255,.15)
```

### Motion

```text
reveal:
translateY(28px)
opacity: 0 → 1
duration: .9–1.0s

media:
scale(1.08) → 1
duration: 1.4s

easing:
cubic-bezier(.2,.7,.2,1)
```

### Accent Spectrum

```text
token: --accent-spectrum

allowed:
- progress indicator
- tiny decorative marker
- loading / status micro-element

not allowed:
- logo
- hero background
- primary heading
- primary CTA
- major brand identity element
```

---

## 18. V1.1 最终执行顺序

```text
P0
 ↓
Gate 0
 ↓
P1
 ↓
Gate 1
 ↓
P2
 ↓
Gate 1
 ↓
P3
 ↓
Gate 2
 ↓
P4
 ↓
P5
 ↓
Gate 2 + Gate 3
 ↓
P6
 ↓
Gate 1 + Gate 2 + Gate 3
 ↓
P7
 ↓
Gate 4
 ↓
Human Approval
 ↓
Production
```

**任何 Gate FAIL → STOP → 修复 → 重新 Gate。**

---

## 19. V1.1 最终判断

本方案不需要推翻重写。原 V1.0 的核心技术路线仍然成立：

```text
Reference Measurement
        ↓
Semantic Tokens
        ↓
Global Components
        ↓
Original Section Recomposition
        ↓
Controlled Motion
        ↓
Visual QA
        ↓
Functional QA
        ↓
Accessibility / Performance
        ↓
Release / Rollback
```

V1.1 的关键升级不是增加更多视觉效果，而是把项目从：

> “把 58begin 做得像 wozmerch”

升级为：

> **“从参考站提取 Design Language → 建立 58begin 自己的 Visual System → 用 Claude Code / Codex 在 Gate 控制下实施。”**

因此，**参考站负责提供测量数据，58begin 负责产生最终设计；AI Agent 负责执行，但不能自行改变项目边界。**

---

## 附录 C：V1.1 变更记录

| 项目 | V1.0 | V1.1 |
|---|---|---|
| IA | “不改 IA”但允许 13 段复制式节奏 | 保持核心业务 IA；允许纯视觉/引导模块 |
| 设计方法 | 对齐 / clone language | Design Language Extraction + Original Recomposition |
| Token 表述 | 100% token-driven | 颜色/语义 token 高度覆盖；其余仍有 utility/component style |
| Rainbow | `--rainbow` | `--accent-spectrum`，严格受控 |
| ai-site-cloner | vendored | vendor 隔离、仅测量，不进入 src/build |
| Track C | `networkidle` | `domcontentloaded` + settle + 关键元素等待 |
| Track C code | `writeFile` import 缺失 | 修正 fs import |
| Responsive | 3 档 | 7 档 |
| Accessibility | 基础 | keyboard/focus/ARIA/Escape/lang/contrast/reduced-motion |
| Performance | Lighthouse baseline | CWV hard gates |
| Visual QA | 8% spacing + 13-section | design-rule consistency，不做像素复制 |
| 工期 | 11–13d | 12–15d，目标 13d |
| Agent | 无执行协议 | Claude Code / Codex 完整执行协议 |
| Gates | 测试门 | G0–G4 |
| Prompts | 无 | P0–P7 可直接执行 Prompt |
| Release | DoD | Functional / Visual / A11y-Performance / Release 四级 Gate |
