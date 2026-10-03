# 58BEGIN_REDESIGN_GATES.md — Visual Redesign V1.1 门禁记录

> 生成：2026-10-03（P6 收口）。依据：`docs/58BEGIN_VISUAL_REDESIGN_V1_1.md` 第 13 节。
> 分支：`restyle/visual-redesign-v1.1`　执行日志：`docs/58BEGIN_REDESIGN_EXECUTION_LOG.md`

## Gate 0 — Baseline：**PASS**（P0，commit `restyle(p0)`）

- git 工作树状态已记录；5 条路由全部可访问（preview 200）
- zh/en 切换正常（e2e + 单测）；`/api/health` = `{"ok":true}`（生产只读探测）
- 改前三视口基线截图 15 张（`tools/reference/baseline/`，本地）
- Track B（ai-site-cloner）测量数据生成：tokens/css/responsive + 71 张分区截图
- `tools/vendor/`、`tools/reference/` 已 gitignore；git 与 dist 双扫描确认参考数据零泄漏

## Gate 1 — Functional：**PASS**（P2/P3/P6 复核）

| 检查项 | 结果 | 证据 |
|---|---|---|
| 原有 route 100% 可访问 | ✅ | 矩阵 70 格全部截图成功（7 视口 × zh/en × 5 路由） |
| 导航、锚点、语言切换 | ✅ | e2e chromium+webkit 4/4；SiteNav 单测；`<html lang>` 随切换同步（en↔zh 实测） |
| LeadForm 可提交 / API contract 不变 | ✅ | `api/**`、`migrations/**` 零 diff（`git diff main` 验证）；表单组件逻辑未触碰 |
| Toast / Modal / QR Modal | ✅ | e2e modal 用例通过；Modal 新增 Escape 关闭后用例仍绿 |
| analytics event schema 不变 | ✅ | 事件名与 payload 结构零变更；仅新增既有 `cta_id` 字段的取值（closing_primary/secondary） |
| zh/en 内容结构测试 | ✅ | `siteContentAlignment` 6/6 用例含新增字段 |

## Gate 2 — Visual：**PASS**（P3/P4/P6 复核；规则详见 `58BEGIN_REDESIGN_VISUAL_RULES.md`）

- Hero typography（clamp 48–88/1.02/-0.03em/800）✓ 容器 1440 ✓
- 深色 header/footer/closing 三明治 + 分区 light/dark 节奏 ✓
- square/product 卡、药丸/描边反转/箭头 CTA 语法 ✓
- 编号聚光（Silkscreen 01）✓ 块眉/eyebrow 语法 ✓
- 响应式：7 视口 × 2 语言 × 5 路由 = **70 格全部 0px 横向溢出**（`tools/reference/p6/qa-report.json`）
- 原则执行：设计规则一致 > 像素复制；参考站零文案/零资产复制

## Gate 3 — Accessibility & Performance：**PASS**（自动化实测）

| 检查项 | 结果 | 实测值 |
|---|---|---|
| `<html lang>` 与语言一致 | ✅ | 切 en → `en`；切回 → `zh` |
| aria-expanded / aria-controls | ✅ | 移动菜单展开 = `true`，Escape 后 = `false` |
| Escape 关闭 modal / menu | ✅ | QR Modal 与移动菜单均关闭 |
| 键盘 Tab 顺序 | ✅ | header → 首个 CTA（#products），符合 DOM 顺序 |
| focus 可见 | ✅ | focus-visible ring 生效（`ring-accent/50` 体系） |
| prefers-reduced-motion | ✅ | marquee `animationName=none`；全部 `.reveal` opacity=1 |
| 对比度 WCAG AA | ✅ | muted(60% 黑/白)≈5.7:1；footer-text(#b9b9b9/#1e1e1e)≈8.4:1；深色区 white/60≈11:1 |
| LCP | ✅ | **492ms**（目标 <2500ms） |
| CLS | ✅ | **0**（常规与 Fast 3G 均为 0；目标 <0.1） |
| INP | ◐ | 实验室代理：交互路径无 >50ms 长任务（rAF/passive/合成器动效）；字段 INP 需上线后真实用户数据，列入上线后观察项 |
| Fast 3G 无严重 FOUT/CLS | ✅ | CLS=0；正文系统栈无字体闪替；Silkscreen 仅微标签且 display=swap |

## Gate 4 — Release：**BLOCKED（等待人工批准）**

P0–P6 全部完成、G1–G3 全部 PASS。按 V1.1 第 12.3 节（不得未经授权发布生产部署）与第 18 节执行顺序，P7（创建 PR → 人工批准 → deploy → 线上冒烟 → 回滚演练）停止在"PR 已创建/可创建、等待批准"状态。

## 已知偏差（跨 Gate 汇总）

1. **Firefox e2e 引擎本机无法启动**（`browserType.launch` 180s 超时 + GFX 崩溃）——**改前主干基线即如此**，环境性问题，非本次改造引入。chromium + webkit 全绿；浏览器矩阵以 chromium 完成 70 格。
2. **lint 既有债务**（主干遗留）：`api/src/lead.test.ts` 5×no-explicit-any；`useActiveSection.ts`/`useSectionTracking.ts` 4×exhaustive-deps。均不在本次改动文件中，按 12.1（不改 api/**）与最小变更原则未处理；本次全部变更文件零 lint 问题。
3. Hero 桌面视差有意省略（58begin Hero 无媒体资产，视差无作用对象；见 P5 日志）。
4. `RainbowProgress` 组件已就绪、默认关闭（`accent-spectrum` 当前未进入 UI），启用属视觉决策，留人工批准。
