# GitHub → 58begin.com 自动同步脚本

本仓库的线上站点 `https://www.58begin.com/` 通过 GitHub Actions 自动部署到 Cloudflare Worker（见 `.github/workflows/deploy.yml`）。因此“同步更新网站内容”的稳定方式是：

1) 识别 GitHub 仓库最新变更（全量/增量）；  
2) 触发 `deploy` 工作流发布；  
3) 发布完成后访问站点后端健康检查接口 `/api/health` 验证上线成功。  

脚本目录：`tools/58begin_sync/`

## 1. 依赖安装

建议使用虚拟环境：

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r tools/58begin_sync/requirements.txt
```

## 2. 配置方式

支持两种方式（二选一）：

### 方式 A：环境变量（推荐）

- `GHSYNC_GITHUB_REPO`：例如 `Leo1968/58begin`
- `GHSYNC_GITHUB_BRANCH`：默认 `main`
- `GHSYNC_GITHUB_TOKEN`：GitHub Token（需要 Actions 权限以触发 workflow_dispatch）
- `GHSYNC_GITHUB_WORKFLOW`：默认 `deploy.yml`
- `GHSYNC_SITE_BASE_URL`：默认 `https://www.58begin.com`
- `GHSYNC_MODE`：`incremental` 或 `full`
- `GHSYNC_STATE_FILE`：默认 `.58begin_sync_state.json`
- `GHSYNC_LOG_FILE`：默认 `58begin_sync.log`
- `GHSYNC_SNAPSHOT_DIR`：可选，若设置则将本次变更文件内容拉取并保存到该目录（用于审计/排查）

### 方式 B：配置文件

复制示例配置并填写：

```bash
cp tools/58begin_sync/config.example.yml tools/58begin_sync/config.yml
```

然后运行时通过 `--config` 指定。

## 3. 一键运行

### 增量同步（默认）

增量模式会基于“上次成功同步的 commit sha”与当前分支 head sha 做 compare：

- 如果没有匹配的变更文件：跳过发布（同时更新 state 文件）
- 如果有变更：触发 deploy workflow，等待完成，再做 `/api/health` 校验

```bash
export GHSYNC_GITHUB_TOKEN="your_token"
python -m tools.58begin_sync.cli --repo Leo1968/58begin --mode incremental
```

### 全量同步

无论是否有变更都会触发一次发布：

```bash
python -m tools.58begin_sync.cli --repo Leo1968/58begin --mode full
```

### 只同步指定路径（可选）

```bash
python -m tools.58begin_sync.cli \
  --repo Leo1968/58begin \
  --mode incremental \
  --yes \
  --snapshot-dir "./sync_snapshots" \
  --include "src/**" \
  --include "api/**" \
  --exclude "**/*.md"
```

## 4. 日志与状态文件

- 日志：默认写入 `58begin_sync.log`（同时输出到控制台）
- 状态文件：默认 `.58begin_sync_state.json`，保存最近一次成功同步的 sha

## 5. 定时任务（cron 示例）

每 30 分钟同步一次（macOS/Linux）：

```bash
*/30 * * * * cd /path/to/58begin && /path/to/58begin/.venv/bin/python -m tools.58begin_sync.cli --repo Leo1968/58begin --mode incremental --yes >> /path/to/58begin/cron.log 2>&1
```

## 6. 常见问题排查

- 触发 workflow 失败（403/404）  
  - Token 缺少权限：需包含 `repo` + `workflow`（或相当权限）
  - workflow 文件名不正确：默认是 `deploy.yml`
- 找不到 workflow run  
  - 可能 GitHub Actions 有排队延迟；可增大 `poll_timeout_seconds`
- `/api/health` 校验失败  
  - 说明 Worker 未成功发布或路由未绑定到 `www.58begin.com/*`；参考 `docs/DEPLOYMENT.md`
