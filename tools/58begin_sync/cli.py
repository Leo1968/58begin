from __future__ import annotations

import argparse
import sys
import warnings

warnings.filterwarnings(
  "ignore",
  message=r".*doesn't match a supported version.*"
)

from .config import load_config
from .logging_utils import setup_logger
from .sync import run_sync


def _parse_args(argv: list[str]) -> argparse.Namespace:
  p = argparse.ArgumentParser(prog="58begin-sync")
  p.add_argument("--config", help="config file path (.yml/.json)", default=None)
  p.add_argument("--repo", help="GitHub repo (owner/name)", default=None)
  p.add_argument("--branch", help="GitHub branch", default=None)
  p.add_argument("--token", help="GitHub token", default=None)
  p.add_argument("--workflow", help="GitHub Actions workflow file, e.g. deploy.yml", default=None)
  p.add_argument("--site", help="Site base url, e.g. https://www.58begin.com", default=None)
  p.add_argument("--mode", choices=["full", "incremental"], default=None)
  p.add_argument("--include", action="append", default=None)
  p.add_argument("--exclude", action="append", default=None)
  p.add_argument("--state-file", default=None)
  p.add_argument("--log-file", default=None)
  p.add_argument("--snapshot-dir", default=None)
  p.add_argument("--yes", action="store_true", help="do not prompt for confirmation")
  return p.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
  ns = _parse_args(argv or sys.argv[1:])
  cfg = load_config(
    config_path=ns.config,
    repo=ns.repo,
    branch=ns.branch,
    github_token=ns.token,
    workflow=ns.workflow,
    site_base_url=ns.site,
    mode=ns.mode,
    include_globs=ns.include,
    exclude_globs=ns.exclude,
    state_file=ns.state_file,
    log_file=ns.log_file,
    snapshot_dir=ns.snapshot_dir
  )
  logger = setup_logger(cfg.sync.log_file)
  try:
    def confirm(base_sha: str | None, head_sha: str, files: list[dict[str, object]]) -> bool:
      if ns.yes or not sys.stdin.isatty():
        return True
      count = len(files)
      tip = f"Deploy to {cfg.site.base_url} from {cfg.github.repo}@{cfg.github.branch}"
      if base_sha:
        tip += f" (base={base_sha[:7]} head={head_sha[:7]} changes={count})"
      else:
        tip += f" (head={head_sha[:7]} full)"
      print(tip)
      ans = input("Proceed? [y/N]: ").strip().lower()
      return ans in {"y", "yes"}

    return run_sync(cfg, logger, confirm=confirm)
  except Exception as e:
    logger.error(str(e))
    return 1


if __name__ == "__main__":
  raise SystemExit(main())
