# API 文档

## POST /api/lead
用于提交合作/预约线索。

### Request
- Content-Type: application/json

```json
{
  "name": "string (optional)",
  "email": "string (optional)",
  "wechat": "string (optional)",
  "company": "string (optional)",
  "intent": "course | consulting | partnership | other",
  "message": "string (optional)",
  "sourceUrl": "string (required, url)",
  "utm": { "utm_source": "string (optional)" },
  "lang": "zh | en",
  "hp": "string (optional, honeypot)"
}
```

### Response
成功：
```json
{ "ok": true, "id": "uuid" }
```

失败：
```json
{ "ok": false, "code": "INVALID | RATE_LIMIT | SERVER_ERROR" }
```

### 错误码
- INVALID：参数校验失败
- RATE_LIMIT：同 IP 在窗口期内提交次数超过限制
- SERVER_ERROR：服务端异常


## POST /api/chat —— AI 智能客服（2026-10 新增）

基于 Cloudflare Workers AI（`@cf/zai-org/glm-4.7-flash`）+ 站内知识库系统提示词。

**请求**：`{ "message": string(1-600), "history"?: [{ role: "user"|"assistant", content: string }]*6 }`

**响应 200**：`{ "ok": true, "reply": string }`
**错误**：400 INVALID（校验失败）｜429 RATE_LIMIT（同 IP 60s 内 10 次）｜502 AI_ERROR

护栏：仅回答本站业务；不提供医疗/法规/合规专业意见与报价，此类问题引导表单或邮件；回复由 GLM 生成，已剥离思维链。
