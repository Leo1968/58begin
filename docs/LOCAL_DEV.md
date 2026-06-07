# 本地开发

## 1. 安装依赖
```bash
npm install
```

## 2. 前端启动
```bash
npm run dev
```

默认地址：`http://localhost:5173/`

## 3. 后端（Cloudflare Worker）本地启动
```bash
npm run dev:api
```

默认地址：`http://localhost:8787/api/health`

## 4. 本地联调（前端调用后端）
- 在根目录创建 `.env.local`：
```bash
VITE_API_BASE=http://localhost:8787
```
- 重启前端 `npm run dev`

## 5. 数据库迁移（D1）
```bash
npm run api:migrate:local
```

