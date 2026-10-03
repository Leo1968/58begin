from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import json
import time


@dataclass
class SyncState:
  last_sha: str | None = None
  last_synced_at: float | None = None


def load_state(state_file: str) -> SyncState:
  p = Path(state_file).expanduser().resolve()
  if not p.exists():
    return SyncState()
  data = json.loads(p.read_text(encoding="utf-8"))
  if not isinstance(data, dict):
    return SyncState()
  last_sha = data.get("last_sha")
  last_synced_at = data.get("last_synced_at")
  return SyncState(
    last_sha=str(last_sha) if last_sha else None,
    last_synced_at=float(last_synced_at) if last_synced_at else None
  )


def save_state(state_file: str, last_sha: str) -> None:
  p = Path(state_file).expanduser().resolve()
  payload = {"last_sha": last_sha, "last_synced_at": time.time()}
  p.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

