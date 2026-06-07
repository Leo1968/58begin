# 部署（Cloudflare Pages + Workers + D1）

更完整的“一步一步从域名接入到上线验证”说明见：
- [CLOUDFLARE_RUNBOOK.md](file:///Users/leoyoung/Desktop/58begin/docs/CLOUDFLARE_RUNBOOK.md)

## 0. 前置条件
- 已有 Cloudflare 账号并可管理域名 `58begin.com`
- 已创建 Cloudflare Pages 项目（建议项目名：`58begin-web`）
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

## 3. 部署 Worker（API）
```bash
npx wrangler deploy --env production
```

建议路由：
- 在 Cloudflare Workers 为该 Worker 添加 Route：`58begin.com/api/*`
- Pages 将处理除 `/api/*` 之外的所有路由

## 4. 部署 Pages（前端）
Cloudflare Pages 构建配置：
- Build command：`npm run build`
- Build output directory：`dist`

前端 SPA 路由：
- 已内置 [public/_redirects](file:///Users/leoyoung/Desktop/58begin/public/_redirects) 支持 History 路由回退

安全 Header：
- 已内置 [public/_headers](file:///Users/leoyoung/Desktop/58begin/public/_headers)

## 5. GitHub Actions 自动部署
- 工作流文件：
  - [ci.yml](file:///Users/leoyoung/Desktop/58begin/.github/workflows/ci.yml)
  - [deploy.yml](file:///Users/leoyoung/Desktop/58begin/.github/workflows/deploy.yml)
- 默认 Pages 项目名写死为 `58begin-web`，如不同请修改 `deploy.yml` 中 `projectName`
