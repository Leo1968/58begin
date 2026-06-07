# 上线前检查清单（Release Checklist）

## 内容与配置
- [ ] 填写/替换：一句话定位（中英）、指标卡数据、产品/工具链接、社媒链接
- [ ] 检查外链：全部可访问、打开新标签（外链）且无 404
- [ ] 隐私政策与实际数据行为一致（表单/埋点）

## 功能
- [ ] 首页：菜单锚点跳转正常，移动端可展开/收起
- [ ] 语言切换：中/EN 切换正常，刷新后保持偏好
- [ ] 内容中心：列表/标签过滤/详情页目录正常
- [ ] Contact：邮箱复制、表单提交成功（D1 入库），限流生效

## 质量
- [ ] `npm run check` 通过
- [ ] `npm run test` 通过
- [ ] `npm run test:e2e` 通过
- [ ] Lighthouse（移动端）记录：LCP/CLS/INP 达标或有明确优化计划

## Cloudflare
- [ ] Worker 路由：`58begin.com/api/*` 已绑定
- [ ] D1 database_id 已写入 wrangler.toml（production）
- [ ] 迁移已应用（`npm run api:migrate:remote`）
- [ ] Pages 构建输出目录为 `dist`，并确认 `_redirects`/`_headers` 生效

## CI/CD
- [ ] GitHub Actions Secrets：`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`
- [ ] `deploy.yml` 中 `projectName` 与 Pages 项目一致

