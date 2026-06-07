# 部署（Cloudflare Workers + Static Assets + D1）

更完整的“一步一步从域名接入到上线验证”说明见：
- [CLOUDFLARE_RUNBOOK.md](file:///Users/leoyoung/Desktop/58begin/docs/CLOUDFLARE_RUNBOOK.md)

## 0. 前置条件
- 已有 Cloudflare 账号并可管理域名 `58begin.com`
- 已准备 GitHub Actions Secrets：
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`

## 1. 创建 D1 数据库
```bash
npx wrangler d1 create 58begin
```
- 将返回的 `database_id` 写入 [wrangler.toml](file:///Users/leoyoung/Desktop/58begin/wrangler.toml)（default 与 production 两处）

## 2. 应用迁移
本地（可选）：
```bash
npm run api:migrate:local
```

生产：
```bash
npm run api:migrate:remote
```

## 3. 部署 Worker（前端静态资源 + API）
先构建前端产物（生成 `dist/`）：
```bash
npm run build
```

```bash
npx wrangler deploy --env production
```

建议路由：
- 在 Cloudflare Workers 为该 Worker 添加 Route：`58begin.com/*`
- 如需同时支持 `www.58begin.com`，再加一条 Route：`www.58begin.com/*`

## 4. GitHub Actions 自动部署
- 工作流文件：
  - [ci.yml](file:///Users/leoyoung/Desktop/58begin/.github/workflows/ci.yml)
  - [deploy.yml](file:///Users/leoyoung/Desktop/58begin/.github/workflows/deploy.yml)
- `deploy.yml` 会先 `npm run build` 生成 `dist/`，再使用 `wrangler deploy` 发布（不再依赖 Pages）
