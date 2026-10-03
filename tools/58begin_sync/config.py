from __future__ import annotations

from dataclasses import dataclass, replace
from pathlib import Path
import os
import json
from typing import Any


@dataclass(frozen=True)
class GitHubConfig:
  repo: str
  branch: str = "main"
  token: str = ""
  workflow: str = "deploy.yml"
  api_base: str = "https://api.github.com"


@dataclass(frozen=True)
class SiteConfig:
  base_url: str = "https://www.58begin.com"
  health_path: str = "/api/health"
  timeout_seconds: int = 20


@dataclass(frozen=True)
class SyncConfig:
  mode: str = "incremental"
  state_file: str = ".58begin_sync_state.json"
  log_file: str = "58begin_sync.log"
  snapshot_dir: str | None = None
  request_timeout_seconds: int = 20
  poll_interval_seconds: int = 5
  poll_timeout_seconds: int = 900
  include_globs: list[str] | None = None
  exclude_globs: list[str] | None = None


@dataclass(frozen=True)
class AppConfig:
  github: GitHubConfig
  site: SiteConfig
  sync: SyncConfig


def _read_yaml_or_json(path: Path) -> dict[str, Any]:
  raw = path.read_text(encoding="utf-8")
  if path.suffix.lower() in {".json"}:
    return json.loads(raw)
  try:
    import yaml  # type: ignore

    v = yaml.safe_load(raw)
    if not isinstance(v, dict):
      raise ValueError("config root must be a mapping")
    return v
  except ModuleNotFoundError:
    return json.loads(raw)


def _env(name: str, default: str | None = None) -> str | None:
  v = os.getenv(name)
  if v is None:
    return default
  v = v.strip()
  return v if v else default


def load_config(
  config_path: str | None,
  repo: str | None = None,
  branch: str | None = None,
  github_token: str | None = None,
  workflow: str | None = None,
  site_base_url: str | None = None,
  mode: str | None = None,
  include_globs: list[str] | None = None,
  exclude_globs: list[str] | None = None,
  state_file: str | None = None,
  log_file: str | None = None,
  snapshot_dir: str | None = None
) -> AppConfig:
  base = AppConfig(
    github=GitHubConfig(
      repo="",
      branch="main",
      token="",
      workflow="deploy.yml",
      api_base="https://api.github.com"
    ),
    site=SiteConfig(),
    sync=SyncConfig()
  )

  if config_path:
    p = Path(config_path).expanduser().resolve()
    data = _read_yaml_or_json(p)
    gh = data.get("github", {}) if isinstance(data.get("github", {}), dict) else {}
    st = data.get("site", {}) if isinstance(data.get("site", {}), dict) else {}
    sy = data.get("sync", {}) if isinstance(data.get("sync", {}), dict) else {}

    base = replace(
      base,
      github=replace(
        base.github,
        repo=str(gh.get("repo", base.github.repo)),
        branch=str(gh.get("branch", base.github.branch)),
        token=str(gh.get("token", base.github.token)),
        workflow=str(gh.get("workflow", base.github.workflow)),
        api_base=str(gh.get("api_base", base.github.api_base))
      ),
      site=replace(
        base.site,
        base_url=str(st.get("base_url", base.site.base_url)),
        health_path=str(st.get("health_path", base.site.health_path)),
        timeout_seconds=int(st.get("timeout_seconds", base.site.timeout_seconds))
      ),
      sync=replace(
        base.sync,
        mode=str(sy.get("mode", base.sync.mode)),
        state_file=str(sy.get("state_file", base.sync.state_file)),
        log_file=str(sy.get("log_file", base.sync.log_file)),
        snapshot_dir=str(sy.get("snapshot_dir")) if sy.get("snapshot_dir") else None,
        request_timeout_seconds=int(
          sy.get("request_timeout_seconds", base.sync.request_timeout_seconds)
        ),
        poll_interval_seconds=int(
          sy.get("poll_interval_seconds", base.sync.poll_interval_seconds)
        ),
        poll_timeout_seconds=int(sy.get("poll_timeout_seconds", base.sync.poll_timeout_seconds)),
        include_globs=list(sy.get("include_globs")) if sy.get("include_globs") else None,
        exclude_globs=list(sy.get("exclude_globs")) if sy.get("exclude_globs") else None
      )
    )

  base = replace(
    base,
    github=replace(
      base.github,
      repo=repo or _env("GHSYNC_GITHUB_REPO", base.github.repo) or "",
      branch=branch or _env("GHSYNC_GITHUB_BRANCH", base.github.branch) or "main",
      token=github_token or _env("GHSYNC_GITHUB_TOKEN", base.github.token) or "",
      workflow=workflow or _env("GHSYNC_GITHUB_WORKFLOW", base.github.workflow) or "deploy.yml"
    ),
    site=replace(
      base.site,
      base_url=site_base_url or _env("GHSYNC_SITE_BASE_URL", base.site.base_url) or base.site.base_url
    ),
    sync=replace(
      base.sync,
      mode=mode or _env("GHSYNC_MODE", base.sync.mode) or base.sync.mode,
      include_globs=include_globs or base.sync.include_globs,
      exclude_globs=exclude_globs or base.sync.exclude_globs,
      state_file=state_file or _env("GHSYNC_STATE_FILE", base.sync.state_file) or base.sync.state_file,
      log_file=log_file or _env("GHSYNC_LOG_FILE", base.sync.log_file) or base.sync.log_file,
      snapshot_dir=snapshot_dir
      or _env("GHSYNC_SNAPSHOT_DIR", base.sync.snapshot_dir or "")
      or base.sync.snapshot_dir
    )
  )

  if base.github.repo.count("/") != 1:
    raise ValueError("github.repo must be in 'owner/name' format")
  if base.github.token.strip() == "":
    raise ValueError("missing github token")
  if base.sync.mode not in {"full", "incremental"}:
    raise ValueError("sync.mode must be 'full' or 'incremental'")

  return base
