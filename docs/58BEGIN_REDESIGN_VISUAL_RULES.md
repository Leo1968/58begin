# 58BEGIN_REDESIGN_VISUAL_RULES.md — 视觉规则固化版（as-built）

> 2026-10-03 P6 收口。数值来源：参考站实测（`docs/58BEGIN_VISUAL_REDESIGN_V1_1.md` §3.1/§3.3/§17）经转译落地的 58begin 自有 token 体系（`src/index.css` / `tailwind.config.js`）。
> 用途：后续任何 UI 改动必须遵守本文件；偏离需在此登记理由。

## Typography

```text
Hero h1:      font-display  clamp(48px, 7.5vw, 88px) / lh 1.02 / ls -0.03em / w800
Closing h2:   font-display  clamp(36px, 5.5vw, 64px) / lh 1.05 / ls -0.02em / w800
Section h2:   font-display  text-3xl → sm:text-5xl / w700 / tracking-tight
Card title:   text-lg–2xl / w600–700
Eyebrow:      text-xs / uppercase / tracking 0.2–0.25em / text-muted（深色区 white/50）
Body:         系统无衬线栈（ui-sans-serif → PingFang SC/雅黑回退）16px / lh 1.5
```

- `font-display` = `"Helvetica Neue", Arial, ui-sans-serif, system-ui, sans-serif`
- `font-accent` = `Silkscreen, ui-monospace, Menlo, monospace`——**仅限**数字/拉丁微标签：指标贴纸卡数值、编号聚光（01…）、404 标记。无 CJK 字形，禁止用于中文文案。

## Shape

```text
Primary/secondary button: 药丸（rounded-full，≥30px 语义）
Square card:              0px（Card shape="square"）
Product card:             20px（Card shape="product" / 分区内联 rounded-[20px]）
Modal:                    0px
Metric sticker:           0px + 3px 实心描边 + 6px 6px 0 硬偏移阴影
Tag/badge chip:           rounded-full
```

## Container & rhythm

```text
max-width: 1440px（max-w-site）
容器水平留白: 20px → 32px(sm) → 40px(lg)
分区纵向节奏: .section-y = var(--section-y) = 40px（移动）→ 48px（≥sm）
              （两轮收紧：64/96 → 48/64 → 40/48；全站共享，调距只改这两个值）
标题→内容:    mt-8（32px）
收尾带内边距: py-14（56px）→ sm:py-20（80px）
分区底色带:   bg-surface-2/3/4 = 黑 8%/4%/2%（斑马交替）
打印/导出:    reveal 内容强制直显（@media print）
```

## Colors（token 即规范）

```text
--bg #fff ｜ --fg #000 ｜ --muted 黑@60% ｜ --border 黑@10%（发丝线）
深色三明治: --header-bg #1e1e1e ｜ --header-fg #fff ｜ --header-border 白@15% ｜ --footer-text #b9b9b9
深色区文字层级: #fff（主）/ white-60（次）/ white-50（眉题）/ white-40（装饰点）
```

## CTA 语法

```text
primary:       黑色药丸实心 + ArrowUpRight 图标，hover 90% 透明度
secondary:     1px 黑描边药丸，hover 反转为黑实心白字（outline-invert）
text-arrow:    文字 + " →"，hover 箭头右移 2px / 200ms
深色区 primary: 白药丸黑字；深色区 secondary: 白@40% 描边，hover 白实心黑字
```

## Borders

```text
浅色区: rgba(0,0,0,.10) 发丝线（border-border）
深色区: rgba(255,255,255,.15)（border-header-border）
贴纸卡: 3px solid rgb(var(--fg)) + shadow-[6px_6px_0_0_rgb(var(--fg))]
```

## Motion

```text
reveal:       translateY(28px)→0 + opacity 0→1，.9–1s，cubic-bezier(.2,.7,.2,1)
级联:         --reveal-delay 内联变量，90ms 步进（指标卡 300ms 起）
media:        scale(1.08)→1，1.4s（当前站点无大图资产，类已就绪）
marquee:      translateX 0→-50%，30s linear infinite（双拷贝，第二拷贝 aria-hidden）
渐进增强:      隐藏态门控于 .reveal-ready（JS 挂载后），无 JS 内容直显
reduced-motion: marquee 静止、reveal 直显、全部 transition 禁用
禁止:          Lenis / GSAP / 重量动效运行时；!important 仅限 reduced-motion 降级
```

## Accent Spectrum（受控）

```text
token: --accent-spectrum = linear-gradient(90deg, #2a66c4 0 33%, #e67c2a 33% 66%, #965096 66% 100%)
--accent: #2a66c4 ｜ --accent-2: #965096（selection/focus-ring 语义）

允许: 滚动进度指示（RainbowProgress，默认关闭）、微型装饰、加载/状态微元素
禁止: Logo、Hero 背景、主标题、主 CTA、任何品牌识别核心元素
当前状态: 未进入 UI（等 Gate/人工批准决定是否启用进度条）
```

## 分区节奏（首页 as-built）

```text
深(公告栏+导航) → 白 Hero → 2%带 About → 白 Values → 白 Featured(编号)
→ 2%带 Content → 白 Products → 2%带 Tools → 白 Contact → 深 Closing → 深 Footer
```
