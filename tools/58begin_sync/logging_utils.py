from __future__ import annotations

from pathlib import Path
import logging


def setup_logger(log_file: str) -> logging.Logger:
  logger = logging.getLogger("58begin_sync")
  if logger.handlers:
    return logger

  logger.setLevel(logging.INFO)
  fmt = logging.Formatter("%(asctime)s %(levelname)s %(message)s")

  sh = logging.StreamHandler()
  sh.setFormatter(fmt)
  logger.addHandler(sh)

  p = Path(log_file).expanduser().resolve()
  p.parent.mkdir(parents=True, exist_ok=True)
  fh = logging.FileHandler(p, encoding="utf-8")
  fh.setFormatter(fmt)
  logger.addHandler(fh)

  return logger

