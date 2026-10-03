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
