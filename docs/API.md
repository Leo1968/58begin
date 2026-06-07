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

