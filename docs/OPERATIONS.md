# 运维手册（最小集合）

## 1. 监控建议
- Pages：开启 Web Analytics（可选），并关注构建失败告警
- Worker：关注请求量、错误率、延迟（Cloudflare Dashboard）
- 前端：定期跑 Lighthouse（移动端）记录 LCP/CLS/INP

## 2. 日志与排障
- Worker：
```bash
npx wrangler tail --env production
```
- 本地：
```bash
npm run dev:api
```

## 3. 安全基线
- 已配置安全 Headers：见 [public/_headers](file:///Users/leoyoung/Desktop/58begin/public/_headers)
- 表单反垃圾：honeypot + D1 基于 IP 的窗口限流（可按垃圾量升级 Turnstile）
- 外链：统一 `noopener noreferrer`

## 4. 回滚策略
- Pages：回滚到上一构建版本（Cloudflare Pages -> Deployments）
- Worker：回滚到上一版本（Cloudflare Workers -> Versions）

## 5. 配置项
- Worker vars：`ALLOWED_ORIGINS`、`RATE_LIMIT_WINDOW_SECONDS`、`RATE_LIMIT_MAX_REQUESTS`、`LEAD_WEBHOOK_URL`
- 前端 env：`VITE_API_BASE`、`VITE_SITE_LANG_DEFAULT`、`VITE_ANALYTICS_PROVIDER`

