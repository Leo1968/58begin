from __future__ import annotations

import requests


def check_health(base_url: str, health_path: str, timeout_seconds: int) -> None:
  url = base_url.rstrip("/") + health_path
  res = requests.get(url, timeout=timeout_seconds)
  if not res.ok:
    raise RuntimeError(f"site health check failed: {res.status_code} {res.text}")

