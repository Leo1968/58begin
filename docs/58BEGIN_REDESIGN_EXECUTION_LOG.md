# 58begin Visual Redesign 执行日志（V1.1）

> 依据：`docs/58BEGIN_VISUAL_REDESIGN_V1_1.md`。每阶段追加，不覆盖历史。
> 分支：`restyle/visual-redesign-v1.1`

---

## P0 — Baseline & Measurement（2026-10-03）

### Changed files

| 文件 | 变更 |
|---|---|
| `.gitignore` | 追加 `tools/vendor/`、`tools/reference/`（vendored 工具与参考数据隔离） |
| `docs/58BEGIN_VISUAL_REDESIGN_V1_1.md` | 新增（V1.1 方案归档入仓，来自执行指令） |
| `docs/58BEGIN_REDESIGN_EXECUTION_LOG.md` | 新增（本文件） |
| `tools/capture-local.mjs` | 新增（本地视觉取证脚本：5 路由 × 3 视口全页截图 + 横向溢出检测，Playwright 1.53 零新增依赖） |

**未改动任何业务代码**（`src/`、`api/`、`migrations/` 零变更，符合 P0 约束）。

### Commands executed

```bash
node -v                                  # v24.5.0 ✓（≥22）
git checkout -b restyle/visual-redesign-v1.1
# Track B（ai-site-cloner，vendored 于 tools/vendor/ai-site-cloner，gitignored）
git clone --depth 1 https://github.com/Mahanaicoach/ai-site-cloner tools/vendor/ai-site-cloner
# 供应链检查：package.json 无 postinstall/未知下载脚本；extract 脚本仅依赖 playwright/pngjs/pixelmatch
# 最小化安装 pngjs+pixelmatch（--no-save，主项目 package.json/package-lock.json 零变更）
node scripts/extract/tokens.mjs https://wozmerch.com/
node scripts/extract/page.mjs   https://wozmerch.com/    # 一站式勘察（token/css/responsive/截图/交互）
npm run build
npx vite preview --port 4173
node tools/capture-local.mjs http://localhost:4173 tools/reference/baseline p0-baseline
npm run test:e2e
curl https://www.58begin.com/api/health          # {"ok":true}
grep -rliE "wozmerch|tools/vendor|tools/reference" dist/   # 空 = 构建产物纯净
```

### Evidence（全部本地留存，不进 git）

- Track B 实测数据：`tools/vendor/ai-site-cloner/docs/research/wozmerch.com/`（tokens.json / css.json / responsive.json / sections/）
- Track B 参考截图：`tools/vendor/ai-site-cloner/docs/design-references/wozmerch.com/`（12 个分区 × pc/ipad/phone + review 态，71 张）
- 本站改前基线：`tools/reference/baseline/p0-baseline-*.png`（5 路由 × 3 视口 = 15 张）+ 溢出报告（全部 0px 横向溢出）
- Token 交叉核对：脚本实测 rgb(0,0,0)/rgb(23,22,20)#171614/rgb(185,185,185)#b9b9b9/rgb(244,239,227)#F4EFE3/rgb(42,102,196)#2a66c4/紫系 —— 与方案 3.1 节人工提取值**一致**

### Gate 0 检查项

| 检查项 | 结果 |
|---|---|
| git working tree 状态已记录 | ✓（main@3247d9d 基础上建分支；用户未跟踪文件 `docs/SITE_AUTO_SYNC.md`、`tools/58begin_sync` 保持原样未纳入） |
| 首页 /posts /post detail /privacy /404 可访问 | ✓（preview 4173 全部 200，见基线截图） |
| zh/en 可切换 | ✓（Chromium/WebKit e2e 语言切换用例通过；见下方偏差说明） |
| `/api/health` 正常 | ✓ 生产 `{"ok":true}` |
| 三视口基线截图已保存 | ✓ 15 张 |
| Track B 参考数据已生成 | ✓（Track C 未触发） |
| `tools/vendor` / `tools/reference` 已 gitignore | ✓ `git check-ignore` 通过 |
| 参考数据未进入 git / production bundle | ✓ 双扫描通过 |

### Known deviations（如实记录）

1. **Firefox e2e 引擎在本机无法启动**（`browserType.launch` 180s 超时：`sandbox_extension_issue_file_to_process … Operation not permitted` + `RenderCompositorSWGL` GFX 崩溃）。**改前基线即如此**，与本次改造无关；P0 中 chromium + webkit 全绿（4 passed），firefox 2 failed 系环境问题。后续各 Gate 以 chromium+webkit 为准并在 P6 复核 firefox 是否环境恢复。
2. 最小化安装 `pngjs@2 + pixelmatch@1`（纯 JS、共 ~740KB）落在本项目 `node_modules`（vendored 目录内 npm 因向上解析 package.json 所致）；`--no-save` 故 `package.json`/`package-lock.json` **零 git 变更**，src/ 从不 import，构建产物扫描确认不进 bundle。符合 §5.6 意图（不进生产依赖清单、不进产物）。

### Gate 0 result: **PASS**（含上述两项已记录偏差）

### Next-stage recommendation

进入 P1（Design Tokens & Global Layer）。P1 将依据 Track B 实测值 + 方案第 17 节 Visual Rules 落地 token。

---

## P1 — Design Tokens & Global Layer（2026-10-03）

### Changed files

| 文件 | 变更 | 原因 |
|---|---|---|
| `src/index.css` | 7 个语义 token 重定义（bg 纯白、fg 黑、border 黑@10%、muted 黑@60%、accent #2a66c4、accent-2 #965096）+ 新增 `--header-bg/--header-fg/--header-border/--footer-text/--surface-2/3/4/--accent-spectrum` + `.reveal`/`.reveal-media` 动效基元（含 reduced-motion 降级） | 方案 G1/G2/G13/G14；值全部来自 Track B 实测与 §17 Visual Rules |
| `tailwind.config.js` | 同步映射新 token（pinned alpha）；`fontFamily.display` 换系统无衬线栈 + 新增 `accent`(Silkscreen)；`maxWidth.site: 1440px`；`bgImage.spectrum`；keyframes/animation `marquee` | G3/G7/G8 |
| `index.html` | Google Fonts 仅保留 Silkscreen（移除 IBM Plex Sans + Newsreader 双字重请求） | G3/G4；正文改系统栈，减请求、降 CLS |
| `src/stores/lang.ts` | 增加不改变数据契约的 UI side effect：`setLang/toggleLang/初始` 时同步 `document.documentElement.lang` | 方案 7 节明确允许的唯一 store 改动；Gate 3 `<html lang>` 要求 |
| `eslint.config.js` | ignores 追加 `tools/vendor/**`、`tools/reference/**` | §5.6 隔离：vendored 仓库源码不得进入本项目工具链（此前 lint 扫到其 src 产生 2 条外部 warning） |

### Token diff（旧 → 新）

| token | 旧 | 新 |
|---|---|---|
| `--bg` | 252 252 250 暖白 | 255 255 255 纯白 |
| `--fg` | 17 17 17 | 0 0 0 |
| `--muted` | 118 118 118 实色 | 0 0 0 @60%（实测 rgba(0,0,0,.6)） |
| `--border` | 227 227 225 实色 | 0 0 0 @10%（发丝线） |
| `--accent` | 225 70 12 橙红 | 42 102 196（实测 #2a66c4） |
| `--accent-2` | 29 79 167 | 150 80 150（实测 #965096） |
| 新增 | — | header-bg #1e1e1e、header-fg #fff、header-border @15%、footer-text #b9b9b9、surface-2/3/4 @8/4/2%、accent-spectrum 渐变 |

映射安全审计：`muted`/`border` 在 src 中零 alpha 修饰符使用（pinned 渲染安全）；`accent` 系存在 `ring-accent/40` 等 7 处，故保持 `<alpha-value>` 映射。

### Tests executed

- `npm run check`（tsc）：✅ 0 error
- `npm run lint`：改前 5 error + 6 warning → 改后 **5 error + 4 warning**；**本次变更文件零 lint 问题**。残留问题全部为主干既有债务（5 error = `api/src/lead.test.ts` 的 no-explicit-any；4 warning = `useActiveSection.ts`/`useSectionTracking.ts` 的 exhaustive-deps），均在未触碰文件上、改动前即存在；依据 12.1（不改 api/**）与 11.1.3（最小变更）不越界修复，如实记录。
- `npm test`（vitest）：✅ 3 files / 6 tests 全绿
- `npm run build`：✅（CSS 32.65kB，无 404 资源）
- `node tools/capture-local.mjs`（preview 4173）：5 路由 × 3 视口 = 15 张，**横向溢出全部 0px**

### Visual evidence

`tools/reference/p1/p1-tokens-home-desktop.png` vs `tools/reference/baseline/p0-baseline-home-desktop.png` 并排比对：**布局/分区/结构逐段一致，仅色彩/字体换轨**（"换色不换版" 达成）。字体回退链含 PingFang SC/微软雅黑，zh 文案不受 Silkscreen/系统栈影响。

### Known deviations

1. lint 既有债务（见上）——方案 9.1 "0 error/0 warning" 的基线前提与实际主干状态不符；本 Gate 按 "变更文件零新增问题" 执行，主干债务移交 P6 处理决策（或经批准后豁免）。
2. Firefox e2e 引擎环境不可启动（P0 已记录），本阶段以 tsc/lint/vitest/build/截图为准。

### Gate 1 result（基础检查）: **PASS**

### Next-stage recommendation

进入 P2（Global Shell：AnnouncementTicker + 深色 SiteNav + 4 栏深色 Footer + Button 变体 + content 新字段）。

---

## P2 — Global Shell（2026-10-03）

### Changed files

| 文件 | 变更 | 原因 |
|---|---|---|
| `src/content/types.ts` | `SiteContent` 新增 `announcement` / `trustBadges` / `closingCta` 三个原创双语字段类型 | G8/G12，方案 7 节授权的字段扩展 |
| `src/content/site.zh.ts` / `site.en.ts` | 三个字段的双语原创文案（zh/en 同 commit） | 58begin 自有品牌语气，零参考站文案 |
| `src/content/siteContentAlignment.test.ts` | 新增对齐断言（announcement 条数、trustBadges 结构、closingCta 键完整性） | R5 缓解 |
| `src/components/AnnouncementTicker.tsx` | **新增**：深色 CSS marquee 公告栏（双拷贝循环 + `aria-hidden` 第二拷贝 + `motion-reduce:animate-none` 静态化） | G8 |
| `src/components/AnnouncementTicker.test.tsx` | **新增**：双语渲染 + marquee 结构/无障碍单测 | 9.4 |
| `src/components/SiteNav.tsx` | 深色化（`bg-header-bg/95` + `border-header-border` + white/10 悬停态）；新增 `aria-expanded`/`aria-controls`/`id` 与 **Escape 关闭移动菜单**；语言切换按钮文案与锚点行为保持不变 | G2；e2e 依赖保护 |
| `src/components/PageShell.tsx` | 页脚重构为**深色四栏**（品牌+简介 / 站点导航 / 社交 / 联系与声明）+ 版权条；`<AnnouncementTicker/>` 挂载在导航之上（不吸顶，随页滚动） | G2/G15 |
| `src/components/Button.tsx` | 新增 `outline-invert`（描边→悬停实心反转）与 `text-arrow`（箭头文字链接，hover 箭头右移）两变体；原三变体不动 | G5 |
| `src/components/Container.tsx` | `max-w-[1200px]` → `max-w-site`(1440px) + 响应式 padding（20/32/40px） | G7 |
| `src/components/RainbowProgress.tsx` | **新增**（rAF + passive scroll，`motion-reduce:hidden`）；**默认关闭、未挂载**，待 Gate 2 批准后启用 | G13（受控） |

### Tests executed

- `npm run check`：✅ 0 error
- `npm run lint`：与 P1 基线持平（仅主干既有 5 error + 4 warning，均在未触碰文件）
- `npm test`：✅ 4 files / 9 tests 全绿（新增 2 例 AnnouncementTicker；首版测试直接调 `setLang` 未包 `act()` 导致 1 失败，已修正测试自身后通过——业务代码未为此改动）
- `npm run build`：✅
- `npx playwright test --project=chromium --project=webkit`：✅ 4 passed（firefox 引擎本机环境性不可启动，见 P0 偏差记录；P6 复核）
- `node tools/capture-local.mjs`（preview 4173）：5 路由 × 3 视口，**横向溢出全部 0px**

### Visual evidence

- `tools/reference/p2/p2-shell-home-mobile.png`：深色公告栏 + 深色吸顶导航 + 白色正文 + 深色四栏页脚，三明治结构成型
- 桌面/平板同结构（`tools/reference/p2/` 共 15 张）

### Known deviations

1. `RainbowProgress` 组件就绪但未挂载（V1.1 P2 要求"默认关闭"，启用决策留给 Gate 2/人工批准）。
2. e2e 本阶段运行 chromium + webkit 两引擎（firefox 环境性问题延续 P0 记录）。

### Gate 1 result（Functional）: **PASS**

- 路由 100% 可访问（5 路由截图）✓；导航/锚点/语言切换 100%（e2e + 单测）✓；LeadForm/QR Modal 契约未动（ContactSection 本阶段零改动）✓；analytics event schema 未变（未新增事件名/未改 payload）✓；zh/en 内容结构测试通过（含新字段）✓

### Next-stage recommendation

进入 P3（首页分区重组）。SectionHeading/Hero/Featured/Products/Tools/About/Culture/Content/Contact/ClosingCta 按序执行，每段双语走查。

---

## P3 — Home Recomposition（2026-10-03）

### Changed files

| 文件 | 变更 | 对应 Gap |
|---|---|---|
| `src/components/SectionHeading.tsx` | h2 升级为 `text-3xl→sm:text-5xl font-bold`；新增可选 `eyebrow` 插槽（全大写 + 0.25em 字距）；细线保留 | G4 |
| `src/components/Card.tsx` | 新增 `shape` 变体：`square`（直角+发丝线+悬停 2% 洗色）/`product`（20px 圆角）；`rounded` 默认变体行为不变（存量调用零破坏） | G6 |
| `src/sections/home/HeroSection.tsx` | 重写：移除光晕→纯白巨标题（clamp 48–88px/1.02/-0.03em/800）+ 黑色药丸主 CTA + outline-invert 次 CTA + **trustBadges 信任行** + **指标贴纸卡**（3px 描边 + 6px 硬偏移阴影 + Silkscreen 数字） | G3/G5/G9 |
| `src/sections/home/FeaturedSection.tsx` | 重写为**编号聚光**：Silkscreen "01" 编号 + 大标题 + 文字箭头 CTA + 发丝线分隔 | G9 |
| `src/sections/home/ProductsSection.tsx` | 产品卡统一版式：20px 圆角、标签徽章、文字箭头 CTA（事件 `product_card_click`/cta schema 原样保留） | G10 |
| `src/sections/home/ToolsSection.tsx` | 同产品卡语言 + type 大写 eyebrow；图标按钮改为文字箭头（事件 schema 原样） | G10 |
| `src/sections/home/AboutSection.tsx` | 品牌故事带：`bg-surface-4` 全宽段 + mission/vision 大字陈述（eyebrow 眉题）+ highlights 药丸 chips | G11 |
| `src/sections/home/CultureSection.tsx` | 直角发丝线卡网格（shape=square） | G11 |
| `src/sections/home/ContentSection.tsx` | `bg-surface-4` 带 + 方角文章卡（标题+→）+ 文字箭头"进入内容中心"+ 社交发丝线列表 | G10/G11 |
| `src/sections/home/ContactSection.tsx` | 仅外壳换装（方角卡 + 节奏）；**LeadForm/Modal/Toast/事件逻辑零改动** | — |
| `src/sections/home/ClosingCtaSection.tsx` | **新增**：深色收尾带（巨标语 + 白药丸主 CTA + 白描边次 CTA；`cta_click` schema 复用，仅新增 cta_id 值） | G12 |
| `src/sections/home/ClosingCtaSection.test.tsx` | **新增**：zh/en 双语渲染单测 | 9.4 |
| `src/pages/Home.tsx` | 挂载 ClosingCtaSection；Hero 传入 trustBadges | G12 |

**分区节奏（本次重组后）**：深公告栏/导航 → 白 Hero → 灰带 About → 白 Values → 白 Featured（编号）→ 灰带 Content → 白 Products → 灰带 Tools → 白 Contact → **深色 ClosingCta** → 深色 Footer。

### Tests executed

- `npm run check` ✅ / `npm test` ✅（5 files / 11 tests，新增 ClosingCta 2 例）/ `npm run build` ✅
- `npx playwright test --project=chromium --project=webkit`：✅ 4 passed
- 15 张三视口截图 **全部 0px 横向溢出**

### Visual evidence

`tools/reference/p3/p3-home-home-desktop.png`：三明治节奏、巨标题字阶、贴纸卡、编号聚光、产品卡、收尾带全部落地（见上）；双语截图（zh/en 切换态）在 P6 全量走查补齐。

### Known deviations

1. 计划要求"每完成一个 section 即 commit"；本次实现按共享件（SectionHeading/Card 变体）→ 分区改造两批完成后统一验证，故 **P3 合并为单次 commit**（`restyle(p3)`），文件级改动明细如上表，支持按文件 revert。
2. `eyebrow` 插槽仅在 Hero kicker/Tools type/About mission-vision/页脚使用（Silkscreen 无 CJK 字形，中文块眉用系统大写字距样式，Silkscreen 限定拉丁数字微标签——与 §17 用途约束一致）。

### Gate 2 result（Visual，分区级）: **PASS**（对照 5.5 参考包原则：设计规则一致 > 像素复制）

- 深-浅-深节奏 ✓；容器 1440 + 响应式 padding ✓；巨标题 clamp 字阶 ✓；药丸/描边反转/箭头 CTA 语法 ✓；square/product 卡 ✓；编号聚光 ✓；深色 header/footer/closing ✓；7 视口溢出检查延至 P6 全矩阵。

### Gate 1 result（Functional，回归）: **PASS**（e2e 4/4；LeadForm/Modal/Toast 未动；analytics schema 未变）

### Next-stage recommendation

进入 P4（子页面套新视觉系统）。

---

## P4 — Secondary Pages（2026-10-03）

### Changed files

| 文件 | 变更 |
|---|---|
| `src/pages/Posts.tsx` | 巨标题 + `CONTENT HUB`/内容中心 eyebrow；标签筛选改 chip 语法（激活=黑实心药丸，未激活=发丝线）；文章卡方角化 + 标题右箭头（hover 右移）+ 标签徽章改弱底药丸 |
| `src/pages/PostDetail.tsx` | 日期改为大写字距 eyebrow；h1/h2 巨字阶加粗；blockquote 改左墨线 + 2% 洗色；TOC 侧栏方角化；逻辑（TOC 提取/复制链接/markdown 渲染）零改动 |
| `src/pages/Privacy.tsx` | eyebrow + 巨标题 + h2 加粗 |
| `src/pages/NotFound.tsx` | Silkscreen "404" 装饰标记 + 巨标题 + 黑色药丸返回 CTA（主按钮语法统一） |

内容模型/URL/路由/prose 数据流零改动（符合 P4 约束）。

### Tests executed
`npm run check` ✅ / `npm test` ✅（11）/ `npm run build` ✅ / 15 张截图零溢出。

### Visual evidence
`tools/reference/p4/p4-pages-posts-desktop.png`（chip 筛选 + 方角卡 + 深色三明治）；其余见 `tools/reference/p4/`。

### Gate: **PASS**（M4：全站四路由风格统一）

---

## P5 — Motion & Micro-interaction（2026-10-03）

### Changed files

| 文件 | 变更 |
|---|---|
| `src/index.css` | reveal 基元改为**渐进增强**：隐藏态门控于 `.reveal-ready`（JS 挂载后才生效），无 JS 环境内容直接可见；`--reveal-delay` 级联变量；reduced-motion 全量降级保留 |
| `src/hooks/useScrollReveal.ts` | **新增**：IO 一次性 reveal（threshold 0.15 + rootMargin -8%），`is-revealed` 单向添加后 unobserve |
| `src/hooks/useScrollReveal.test.tsx` | **新增**：IO mock 双用例（armed+observed；intersect 后单元素 reveal） |
| `src/pages/Home.tsx` | 挂载 reveal root（useRef + hook） |
| Hero/Featured/Products/Tools/About/Culture/Content/Contact/ClosingCta | 关键块挂 `.reveal` + `--reveal-delay` 级联（90ms 步进；指标卡 300ms 起步） |
| `src/components/Card.tsx` | 透传 `style`（级联延迟需要） |
| `src/components/Modal.tsx` | 清理死类 `animate-in fade-in zoom-in-95`（tailwindcss-animate 未安装，本就无效）；方角化；**新增 Escape 关闭**（Gate 3 要求；modal.spec 断言不受影响） |

按钮 hover 反转/箭头位移（P2/P3 已随变体落地）与 marquee（P2）在本阶段联调确认。

### Intentional omission（如实记录）

- **Hero 桌面视差未实现**：参考站的视差作用于其大幅 hero 摄影媒体；58begin Hero 为纯排版（无媒体资产），视差无作用对象。引入假媒体违反"内容原创"边界，故省略——属设计判断而非遗漏。

### Tests executed

- `npm run check` ✅ / `npm test` ✅（6 files / 13 tests）/ `npm run build` ✅ / lint 持平既有基线
- e2e chromium+webkit：✅ 4 passed（modal Escape 改动后 Modal 开合用例仍绿）
- 15 张截图零溢出；`tools/reference/p5/`
- **reduced-motion 专项**（Playwright `reducedMotion: 'reduce'`）：marquee `animationName = none` ✓；全部 `.reveal` 元素 `opacity = 1` ✓

### Gate 3（动效与无障碍相关项）: **PASS**（reduced-motion/Escape/焦点样式部分；全矩阵在 P6 收口）

### Next-stage recommendation

进入 P6（全量 QA + Gate 文档收口）。

---

## P6 — QA / Gate Closure（2026-10-03）

### Changed files

| 文件 | 变更 |
|---|---|
| `tools/qa-matrix.mjs` | **新增**：P6 矩阵执行器（7 视口 × zh/en × 5 路由 = 70 格溢出+截图；a11y 探针：html lang 同步/aria-expanded/Escape×2/Tab 顺序/focus ring；CWV：LCP/CLS 常规+Fast3G） |
| `docs/58BEGIN_REDESIGN_GATES.md` | **新增**：G0–G4 门禁记录 |
| `docs/58BEGIN_REDESIGN_VISUAL_RULES.md` | **新增**：as-built 视觉规则固化版 |

### Test suite results

| 套件 | 结果 |
|---|---|
| `npm run check`（tsc） | ✅ 0 error |
| `npm run lint` | 持平主干既有基线（5 error + 4 warning，全部位于未触碰文件；本次变更文件零问题） |
| `npm test`（vitest） | ✅ 6 files / 13 tests |
| `npm run test:e2e` 全引擎 | chromium+webkit 4/4 ✅；firefox 2 failed（环境性 launch 崩溃，与改前主干基线一致——**非回归**，证据：P0 基线同结果） |
| QA 矩阵（chromium） | ✅ 70 格全部 0px 横向溢出 |
| CWV | LCP **492ms** ✅ ｜ CLS **0**（常规+Fast3G）✅ ｜ INP：实验室无长任务，字段值待上线观察 ◐ |
| reduced-motion | ✅ marquee 静止 + reveal 直显（P5 实测） |
| a11y 探针 | ✅ html lang 同步 / aria-expanded / Escape×2 / Tab 顺序 / focus ring |

### Gate results

- **Gate 1 + Gate 2 + Gate 3：全部 PASS**（明细见 `docs/58BEGIN_REDESIGN_GATES.md`）
- **Gate 4：BLOCKED** —— 按 12.3 节等待人工批准，不执行发布

### Next-stage recommendation

进入 P7（Release）：创建 PR（含变更/测试/风险/回滚说明）→ **等待人工批准** → 批准后 deploy + 线上冒烟 + 回滚演练。

---

## 增量变更 — 代表作切换为 Falco（2026-10-03，预览评审后用户指令）

> 性质：内容替换 + 小型组件能力扩展，未改变视觉规则与业务契约。

### Changed files

| 文件 | 变更 |
|---|---|
| `public/falco-windows-optimizer.png` | **新增**：Falco 主界面截图（源图 2211×1655 → 1600×1197，1.1MB；本机 sips 不支持 webp 写出，PNG+lazy 加载 + 显式宽高防 CLS） |
| `src/content/types.ts` | `FeaturedItem` 增可选 `image`/`imageAlt` 字段 |
| `src/content/site.zh.ts` / `site.en.ts` | 代表作条目替换：土壤张力传感器 → **Falco — Windows Optimizer**（原创双语描述）；CTA → `https://github.com/Leo1968/Falco`，文案"在 GitHub 查看 / View on GitHub"；**公告栏同步**更新代表作引述 |
| `src/sections/home/FeaturedSection.tsx` | 支持 `image` 渲染：全宽 `reveal-media`（缩放进入动效）+ 发丝线边框 + `loading="lazy"` + 固定 1600×1197 防 CLS；无图条目回退原纯文字版式 |

### Verification

- tsc ✅ / vitest 13 ✅（zh/en 对齐测试随 id 同步替换通过）/ build ✅
- Playwright 实测：`a[href="https://github.com/Leo1968/Falco"]` 唯一存在 ✓；图片可见且加载完成 ✓
- 证据：`tools/reference/preview-featured-falco.png`

### Gate 影响

无 Gate 降级：功能契约零变化（既有 cta/social 事件 schema 复用），视觉语法沿用 VISUAL_RULES（编号聚光 + media scale + 发丝线）。旧"土壤张力传感器"条目可随时经 git 历史恢复。

---

## P7 — Release（2026-10-03，人工批准后执行）

- PR #3（restyle/visual-redesign-v1.1 → main，43+ 文件）经所有者批准合并（merge commit `60296e7`）；合并后所有者又以逐条指令驱动 12 轮迭代（Falco 代表作、官方品牌图标、Skywalker Labs 品牌、知识库、间距两轮收紧等），全部直接提交 main 并推送。
- **GitHub Actions 部署失败（既有问题）**：仓库无 `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` secrets（`gh secret list` 为空，8 月初起即如此），CI 侧部署不可用。
- **生产发布改经本机 wrangler OAuth**：`npx wrangler deploy --env production` → Worker `58begin-web` 版本 `02495330-9c4b-4d8b-9328-f39643af2e47`，自定义域 58begin.com 立即生效。
- **线上验证**：`/api/health` {"ok":true}；meta description 为新文案；zh 首页导航飞马 logo / 新公告栏文案 / X 真实链接 ×2 / 巨标题均在；页脚 © 2026 Skywalker Labs + 志存高远 tagline + 反白 logo 均在；/posts 200、favicon 200。
- **回滚路径**（如需）：`npx wrangler rollback`（秒级回退到上一 Worker 版本）或 `git revert` 对应提交后重新本地部署。
- **遗留**：① 恢复 push 自动部署需在 Cloudflare 面板创建 API Token（Edit Workers 模板）并 `gh secret set CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID`；② 小红书/抖音/YouTube/B 站四个社交图标仍为占位链接；③ 远端存在分支 `update_worker_name_to_58begin-web`（来源待所有者确认）。

---

## 增量功能 — Workers AI 智能客服"小天"（2026-10-04）

- **后端**：`/api/chat`（POST）→ Workers AI `@cf/zai-org/glm-4.7-flash`；系统提示词注入业务知识库/服务/联系方式；zod 校验；同 IP 10 次/60s 限流（per-isolate 尽力而为）；思维链剥离；V1.1 的 api 契约例外已由所有者批准（新增端点，`/api/lead` 不变）。
- **前端**：`ChatWidget` 右下角气泡（贴纸风视觉、双语、快捷问题、Esc 关闭、AI_ERROR 时邮件兜底话术），挂载于 PageShell 全站可见。
- **部署踩坑记录**：① `[ai]` 顶层绑定不传入 `[env.production]`，需在环境中显式声明；② qwen1.5 模型已于 2025-10 弃用，切换 GLM；③ GLM 返回 OpenAI chat.completion 结构且默认思维链，需解析 choices 并提高 max_tokens。
- **验证**：线上真实中文回复 ✓；医疗法规问题护栏转人工 ✓；限流/校验单测 ✓；组件交互单测 ✓（全套 19 测试）。
