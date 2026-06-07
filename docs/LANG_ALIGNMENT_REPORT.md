# 中英文版内容与体验对齐报告

日期：2026-06-07

## 1. 范围与基线

- 口径源：中文版（英文版按中文版等价翻译/补齐）
- 对齐目标：中英文在同一路由下提供一致的信息结构、条目数量/排序、交互与视觉体验
- 语言切换策略：同一路由不变，仅切换全局 `lang` 内容源（`src/content/site.zh.ts` vs `src/content/site.en.ts`）

## 2. 全站页面清单（核对台账）

| 页面 | 路由 | 内容来源 | 主要交互/功能点 | 对齐结论 |
|---|---|---|---|---|
| 首页 | `/` | `content.hero/about/featured/findMeOn/products/tools/contact/posts` | 顶部导航锚点跳转、语言切换、外链跳转、复制邮箱、打开二维码区域、联系表单提交 | 已对齐 |
| 内容列表 | `/posts` | `content.posts` + `findMeOn/products`（侧栏复用） | 标签筛选、卡片跳转、语言切换 | 已对齐 |
| 内容详情 | `/posts/:slug` | `content.posts.items[].slug` | 返回列表、复制链接、目录锚点、语言切换 | 已对齐 |
| 隐私政策 | `/privacy` | `content.privacy` | 页面跳转、语言切换 | 已对齐 |
| 404 | `*` | `lang` 条件渲染文本 | 返回首页 | 已对齐 |

## 3. 内容对齐核对结果（要点）

- 列表条目一致性：`findMeOn/tools/posts` 现已实现两语言条目数量与排序一致（以 `id/slug` 对齐）
- 代表作一致性：修复了 `featured.items[0].id = "book-1"` 在英文中指向不同作品的问题，改为与中文同一作品的等价英文表述
- 口径一致性：`hero/metrics/about/privacy` 英文已按中文信息结构与条款结构补齐

## 4. 功能对齐验证（手工回归）

覆盖用例（两语言均验证通过）：

- 路由跳转：`/` ↔ `/posts` ↔ `/posts/:slug` ↔ `/privacy`
- 语言切换：在每个路由页面切换语言后，路由不变、内容正确切换
- 内容详情稳定性：两篇文章 slug 在两语言都存在，切换语言不会触发 “Post not found”
- 复制邮箱：按钮可触发复制流程（Toast 文案随语言变化）
- 内容列表标签筛选：标签列表可点击筛选并更新展示

说明：

- 本站当前未实现登录/注册、支付、站内搜索等模块；本次对齐不涉及该类流程的实现差异
- 表单提交需要 `VITE_API_BASE` 或同域 `/api/lead` 后端可用；在无后端时两语言均会进入同样的失败反馈路径

## 5. 设计与响应式核对

- 关键页面（`/`、`/posts`、`/posts/:slug`、`/privacy`）在中英文切换后布局结构一致
- 由于文案长度差异可能导致换行位置不同，本次以“组件结构、间距、对齐方式、交互区域”一致为准进行核对

## 6. 自动化对齐保障

- 新增内容对齐测试用例：`src/content/siteContentAlignment.test.ts`
  - 校验 `nav/featured/findMeOn/products/tools/posts` 的 `id/slug` 列表在中英文一致

