# Cloudflare 部署全流程（Pages + Workers + D1）

本项目为前后端分离形态：
- 前端：Cloudflare Pages（静态站点，Vite 构建产物 `dist`）
- 后端：Cloudflare Workers（`/api/*`）
- 数据库：Cloudflare D1（线索表单落库）

## 1. 技术栈与兼容性确认
- 静态资源：Vite 产物，适配 Pages；已包含 SPA 回退规则（`public/_redirects`）与安全头（`public/_headers`），构建后会进入 `dist/` 根目录
- 后端服务：Workers（`api/src/index.ts`），使用标准 Fetch Handler，适配 Workers Runtime
- 数据库：D1（SQLite 兼容），迁移脚本位于 `migrations/`
- 环境变量：
  - Pages：`VITE_API_BASE`（建议生产环境不填，默认走同域 `/api`），`VITE_ANALYTICS_PROVIDER`，`VITE_SITE_LANG_DEFAULT`
  - Workers：`ALLOWED_ORIGINS`、`RATE_LIMIT_WINDOW_SECONDS`、`RATE_LIMIT_MAX_REQUESTS`、`LEAD_WEBHOOK_URL`

## 2. Cloudflare 账户初始化（域名接入）
### 2.1 绑定域名
Cloudflare Dashboard → Websites → Add a site → 输入 `58begin.com` → 选择 Plan。

### 2.2 配置 Nameserver（域名所有权验证）
Cloudflare 会给出两条 Nameserver（NS）记录，例如：
- `xxxx.ns.cloudflare.com`
- `yyyy.ns.cloudflare.com`

到你的域名注册商（购买域名的平台）中，将该域名的 Nameserver 修改为 Cloudflare 提供的两条 NS。

验证方式：
- Cloudflare Dashboard 中等待状态变为 Active（通常几十分钟到数小时）
- DNS 传播可用 `dig NS 58begin.com`（可选）

## 3. 选择部署方案（本项目推荐）
采用 **Pages + Workers + D1**：
- Pages：负责站点与 SPA 路由
- Workers：只接管 `/api/*`
- D1：存线索表单数据

不使用 Tunnel（因为无需源站）。

## 4. 核心部署参数配置
### 4.1 创建 D1 数据库并回填 database_id
本地执行（需要你已登录 wrangler）：
```bash
npx wrangler login
npx wrangler d1 create 58begin
```

将输出的 `database_id` 回填到 [wrangler.toml](file:///Users/leoyoung/Desktop/58begin/wrangler.toml) 的两处：
- default：`[[d1_databases]]`
- production：`[[env.production.d1_databases]]`

### 4.2 应用 D1 迁移
```bash
npm run api:migrate:remote
```

### 4.3 部署 Worker（API）
```bash
npx wrangler deploy --env production
```

建议绑定 Worker Route：
- Cloudflare Dashboard → Workers & Pages → 你的 Worker → Triggers → Routes
- 添加 Route：`58begin.com/api/*`

### 4.4 部署 Pages（前端）
Cloudflare Dashboard → Workers & Pages → Pages → Create a project → 连接 GitHub 仓库 `Leo1968/58begin`
- Build command：`npm run build`
- Build output directory：`dist`

Pages 环境变量（Production）建议：
- `VITE_ANALYTICS_PROVIDER=console`（上线后可改为 `none` 或接入第三方）
- `VITE_SITE_LANG_DEFAULT=zh`
- `VITE_API_BASE=`（留空：前端将使用同域 `/api`）

### 4.5 自定义域名与 HTTPS
Pages 项目 → Custom domains：
- 绑定 `58begin.com` 与 `www.58begin.com`
- 开启 Always Use HTTPS（SSL/TLS → Edge Certificates / 或 Rules 中强制）

### 4.6 缓存与 CDN
默认 Pages 静态资源已经走 Cloudflare CDN。
建议补充：
- Cache Rules：对 `/*.js`、`/*.css`、`/assets/*` 采用较长缓存（静态资源已带 hash，安全）
- 对 HTML 维持默认（避免内容更新不生效）

## 5. 部署后全流程验证
### 5.1 可访问性与 HTTPS
- 访问 `https://58begin.com/` 与 `https://www.58begin.com/`，确认自动跳转策略符合预期（建议统一到无 www 或 www 二选一）
- 浏览器地址栏锁标志正常，证书为 Cloudflare Universal SSL

### 5.2 页面与链接有效性
- `/`（首页滚动/菜单锚点/语言切换）
- `/posts`（内容列表与标签筛选）
- `/posts/:slug`（详情页目录与复制链接）
- `/privacy`
- 站内所有外链点击正常（新标签打开）

### 5.3 API 与核心业务
健康检查：
- `https://58begin.com/api/health`

线索提交（示例）：
```bash
curl -X POST https://58begin.com/api/lead \
  -H 'content-type: application/json' \
  -d '{"intent":"partnership","sourceUrl":"https://58begin.com/","lang":"zh"}'
```

验证入库：
- Cloudflare Dashboard → D1 → 58begin → Tables / Query：查询 `lead` 表新增数据

### 5.4 CDN 加速效果（可选）
- Cloudflare Dashboard → Analytics 中查看缓存命中、带宽、请求量

## 6. 运维与安全基线
### 6.1 WAF / DDoS
Cloudflare 默认提供 DDoS 防护。
建议开启：
- WAF Managed Rules（按业务容忍度）
- Bot Fight Mode（若遭遇机器人流量）

表单防护增强（可选）：
- Cloudflare Turnstile：对表单提交增加人机验证（垃圾量大时再加）

### 6.2 监控与告警
- Pages：构建失败告警（GitHub Actions + Pages）
- Workers：错误率/延迟监控（Dashboard）
- 域名可用性：UptimeRobot/自建监控（可选）

### 6.3 备份与回滚
- 前端：Pages Deployments 可一键回滚到上一版本
- 后端：Workers Versions 可回滚到上一版本
- 数据：D1 可导出（需要时执行）；关键是做好“误提交流程”与限流防护

