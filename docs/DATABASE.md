# 数据库设计（D1）

## 表：lead
| 字段 | 类型 | 说明 |
|---|---|---|
| id | TEXT | 主键（uuid） |
| name | TEXT | 姓名（可选） |
| email | TEXT | 邮箱（可选） |
| wechat | TEXT | 微信（可选） |
| company | TEXT | 公司/组织（可选） |
| intent | TEXT | 意向（course/consulting/partnership/other） |
| message | TEXT | 留言（可选） |
| source_url | TEXT | 提交时页面 URL |
| lang | TEXT | 语言（zh/en） |
| utm_json | TEXT | UTM JSON（可选） |
| ip | TEXT | 提交 IP（可选，用于限流） |
| created_at | TEXT | ISO 时间 |

## 索引
- idx_lead_created_at(created_at)
- idx_lead_ip_created_at(ip, created_at)

## 迁移文件
- [202606061900_create_lead.sql](file:///Users/leoyoung/Desktop/58begin/migrations/202606061900_create_lead.sql)

