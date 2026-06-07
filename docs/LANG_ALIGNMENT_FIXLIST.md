# 中英文对齐问题修复清单

日期：2026-06-07

## 已修复

| ID | 类型 | 现象 | 修复位置 |
|---|---|---|---|
| ALN-001 | 内容缺失 | 英文缺少 `findMeOn` 的 `bilibili` 条目 | [site.en.ts](file:///Users/leoyoung/Desktop/58begin/src/content/site.en.ts) |
| ALN-002 | 内容缺失 | 英文缺少 `tools.items` 的 `tool-2 (X Reply Helper)` | [site.en.ts](file:///Users/leoyoung/Desktop/58begin/src/content/site.en.ts) |
| ALN-003 | 功能风险 | `posts.items` 中英文 slug 不一致导致切换语言后详情页可能 “Post not found” | [site.en.ts](file:///Users/leoyoung/Desktop/58begin/src/content/site.en.ts) |
| ALN-004 | 口径偏差 | `hero.subtitle` 英文口径与中文不一致（非等价翻译） | [site.en.ts](file:///Users/leoyoung/Desktop/58begin/src/content/site.en.ts) |
| ALN-005 | 口径偏差 | `metrics` 英文指标体系与中文不一致 | [site.en.ts](file:///Users/leoyoung/Desktop/58begin/src/content/site.en.ts) |
| ALN-006 | 数据一致性 | `featured.items[0].id = "book-1"` 中英文指向不同作品 | [site.en.ts](file:///Users/leoyoung/Desktop/58begin/src/content/site.en.ts) |
| ALN-007 | 条款不等价 | 英文隐私政策缺少与中文等价的 “数据保存/你的权利” 结构 | [site.en.ts](file:///Users/leoyoung/Desktop/58begin/src/content/site.en.ts) |
| ALN-008 | 质量保障 | 缺少自动化校验中英文关键列表对齐 | [siteContentAlignment.test.ts](file:///Users/leoyoung/Desktop/58begin/src/content/siteContentAlignment.test.ts) |
| ALN-009 | 测试阻断 | E2E 配置依赖 `@playwright/test` 但未安装导致 `npm run test:e2e` 失败 | [package.json](file:///Users/leoyoung/Desktop/58begin/package.json) |

## 验证记录

- `npm test`：通过（包含新增对齐测试）
- `npm run build`：通过
- `npm run test:e2e`：已解除缺包阻断；首次运行需执行 `npx playwright install` 下载浏览器后再跑

