from __future__ import annotations

import datetime as dt
import fnmatch
import time
from pathlib import Path
from typing import Any, Callable

from .config import AppConfig
from .github_api import GitHubClient
from .site_api import check_health
from .state import load_state, save_state


def _match_any(path: str, globs: list[str]) -> bool:
  for g in globs:
    if fnmatch.fnmatch(path, g):
      return True
  return False


def _filter_changed_files(cfg: AppConfig, files: list[dict[str, Any]]) -> list[dict[str, Any]]:
  include_globs = cfg.sync.include_globs
  exclude_globs = cfg.sync.exclude_globs

  out: list[dict[str, Any]] = []
  for f in files:
    filename = str(f.get("filename", ""))
    if not filename:
      continue
    if include_globs and not _match_any(filename, include_globs):
      continue
    if exclude_globs and _match_any(filename, exclude_globs):
      continue
    out.append(f)
  return out


def run_sync(
  cfg: AppConfig,
  logger,
  confirm: Callable[[str | None, str, list[dict[str, Any]]], bool] | None = None
) -> int:
  gh = GitHubClient(cfg.github.api_base, cfg.github.token, cfg.sync.request_timeout_seconds)
  repo = gh.parse_repo(cfg.github.repo)

  state = load_state(cfg.sync.state_file)
  created_after = dt.datetime.now(dt.timezone.utc)
  head_sha = gh.get_branch_head_sha(repo, cfg.github.branch)

  logger.info(f"github head sha: {head_sha}")

  changed_files: list[dict[str, Any]] = []
  base_sha = state.last_sha
  if cfg.sync.mode == "incremental" and base_sha:
    if base_sha == head_sha:
      logger.info("no changes since last sync, skip")
      return 0
    diff = gh.compare(repo, base_sha=base_sha, head_sha=head_sha)
    files = diff.get("files")
    if isinstance(files, list):
      changed_files = _filter_changed_files(cfg, [f for f in files if isinstance(f, dict)])
    logger.info(f"changed files: {len(changed_files)} (base={base_sha})")
    if len(changed_files) == 0:
      logger.info("no matched changes, skip")
      save_state(cfg.sync.state_file, head_sha)
      return 0
  else:
    logger.info("full mode: always deploy")

  if changed_files:
    for f in changed_files:
      filename = str(f.get("filename", ""))
      status = str(f.get("status", ""))
      logger.info(f"change {status}: {filename}")

  if cfg.sync.snapshot_dir and changed_files:
    root = Path(cfg.sync.snapshot_dir).expanduser().resolve()
    root.mkdir(parents=True, exist_ok=True)
    for f in changed_files:
      filename = str(f.get("filename", ""))
      if not filename:
        continue
      try:
        text = gh.get_file_text(repo, filename, ref=head_sha)
        out_path = (root / filename).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(text, encoding="utf-8")
      except Exception as e:
        logger.info(f"snapshot skipped: {filename} ({e})")

  if confirm and not confirm(base_sha, head_sha, changed_files):
    logger.info("cancelled")
    return 0

  logger.info(f"dispatch workflow: {cfg.github.workflow} ref={cfg.github.branch}")
  gh.dispatch_workflow(repo, workflow=cfg.github.workflow, ref=cfg.github.branch)

  run = None
  start = time.time()
  while time.time() - start < cfg.sync.poll_timeout_seconds:
    run = gh.find_run_for_sha(
      repo,
      workflow=cfg.github.workflow,
      head_sha=head_sha,
      created_after=created_after - dt.timedelta(seconds=30)
    )
    if run:
      break
    time.sleep(cfg.sync.poll_interval_seconds)

  if not run:
    raise RuntimeError("workflow run not found after dispatch")

  run_id = int(run.get("id"))
  logger.info(f"workflow run id: {run_id}")

  start = time.time()
  while time.time() - start < cfg.sync.poll_timeout_seconds:
    r = gh.get_run(repo, run_id=run_id)
    status = str(r.get("status", ""))
    conclusion = str(r.get("conclusion", ""))
    if status == "completed":
      if conclusion != "success":
        raise RuntimeError(f"workflow failed: conclusion={conclusion}")
      logger.info("workflow success")
      break
    time.sleep(cfg.sync.poll_interval_seconds)
  else:
    raise RuntimeError("workflow timeout")

  logger.info("check site health")
  check_health(cfg.site.base_url, cfg.site.health_path, cfg.site.timeout_seconds)
  logger.info("site health ok")

  save_state(cfg.sync.state_file, head_sha)
  logger.info("sync done")
  return 0
