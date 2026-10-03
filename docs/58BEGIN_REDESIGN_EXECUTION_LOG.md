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
