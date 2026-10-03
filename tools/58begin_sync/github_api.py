from __future__ import annotations

from dataclasses import dataclass
import datetime as dt
from typing import Any
import requests


@dataclass(frozen=True)
class GitHubRepoRef:
  owner: str
  name: str


class GitHubClient:
  def __init__(self, api_base: str, token: str, timeout_seconds: int) -> None:
    self.api_base = api_base.rstrip("/")
    self.timeout_seconds = timeout_seconds
    self.session = requests.Session()
    self.session.headers.update(
      {
        "accept": "application/vnd.github+json",
        "authorization": f"Bearer {token}",
        "x-github-api-version": "2022-11-28",
        "user-agent": "58begin-sync/1.0"
      }
    )

  @staticmethod
  def parse_repo(repo: str) -> GitHubRepoRef:
    owner, name = repo.split("/", 1)
    return GitHubRepoRef(owner=owner, name=name)

  def _url(self, path: str) -> str:
    return f"{self.api_base}{path}"

  def _request(self, method: str, path: str, **kwargs: Any) -> requests.Response:
    url = self._url(path)
    return self.session.request(method, url, timeout=self.timeout_seconds, **kwargs)

  def get_branch_head_sha(self, repo: GitHubRepoRef, branch: str) -> str:
    res = self._request("GET", f"/repos/{repo.owner}/{repo.name}/commits/{branch}")
    if not res.ok:
      raise RuntimeError(f"github get branch head failed: {res.status_code} {res.text}")
    data = res.json()
    sha = data.get("sha")
    if not sha:
      raise RuntimeError("github branch head missing sha")
    return str(sha)

  def compare(self, repo: GitHubRepoRef, base_sha: str, head_sha: str) -> dict[str, Any]:
    res = self._request("GET", f"/repos/{repo.owner}/{repo.name}/compare/{base_sha}...{head_sha}")
    if not res.ok:
      raise RuntimeError(f"github compare failed: {res.status_code} {res.text}")
    return res.json()

  def dispatch_workflow(self, repo: GitHubRepoRef, workflow: str, ref: str) -> None:
    payload = {"ref": ref}
    res = self._request(
      "POST",
      f"/repos/{repo.owner}/{repo.name}/actions/workflows/{workflow}/dispatches",
      json=payload
    )
    if res.status_code not in {204}:
      raise RuntimeError(f"github dispatch failed: {res.status_code} {res.text}")

  def list_workflow_runs(
    self, repo: GitHubRepoRef, workflow: str, per_page: int = 20
  ) -> list[dict[str, Any]]:
    res = self._request(
      "GET",
      f"/repos/{repo.owner}/{repo.name}/actions/workflows/{workflow}/runs",
      params={"per_page": per_page}
    )
    if not res.ok:
      raise RuntimeError(f"github list runs failed: {res.status_code} {res.text}")
    data = res.json()
    runs = data.get("workflow_runs")
    if not isinstance(runs, list):
      return []
    return [r for r in runs if isinstance(r, dict)]

  def find_run_for_sha(
    self,
    repo: GitHubRepoRef,
    workflow: str,
    head_sha: str,
    created_after: dt.datetime | None
  ) -> dict[str, Any] | None:
    runs = self.list_workflow_runs(repo, workflow=workflow, per_page=30)
    for r in runs:
      if str(r.get("head_sha", "")) != head_sha:
        continue
      if r.get("event") not in {"workflow_dispatch", "push"}:
        continue
      created_at = r.get("created_at")
      if created_after and created_at:
        try:
          t = dt.datetime.fromisoformat(str(created_at).replace("Z", "+00:00"))
          if t < created_after:
            continue
        except Exception:
          pass
      return r
    return None

  def get_run(self, repo: GitHubRepoRef, run_id: int) -> dict[str, Any]:
    res = self._request(
      "GET", f"/repos/{repo.owner}/{repo.name}/actions/runs/{run_id}"
    )
    if not res.ok:
      raise RuntimeError(f"github get run failed: {res.status_code} {res.text}")
    data = res.json()
    if not isinstance(data, dict):
      raise RuntimeError("github run response invalid")
    return data

  def get_file_text(self, repo: GitHubRepoRef, path: str, ref: str) -> str:
    res = self._request(
      "GET",
      f"/repos/{repo.owner}/{repo.name}/contents/{path}",
      params={"ref": ref}
    )
    if not res.ok:
      raise RuntimeError(f"github get content failed: {res.status_code} {res.text}")
    data = res.json()
    if not isinstance(data, dict):
      raise RuntimeError("github content response invalid")
    if data.get("type") != "file":
      raise RuntimeError("github content is not a file")
    download_url = data.get("download_url")
    if download_url:
      r2 = self.session.get(str(download_url), timeout=self.timeout_seconds)
      if not r2.ok:
        raise RuntimeError(f"github download failed: {r2.status_code} {r2.text}")
      return r2.text
    content = data.get("content")
    encoding = data.get("encoding")
    if encoding == "base64" and content:
      import base64

      return base64.b64decode(str(content)).decode("utf-8", errors="replace")
    raise RuntimeError("github content missing")
