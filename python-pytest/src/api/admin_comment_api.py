from __future__ import annotations

import requests

from src.utils.constants import API_URL
from src.utils.headers import merge_headers
from src.utils.types import CommentStatus


class AdminCommentApi:
    def __init__(self, session: requests.Session, auth_headers: dict[str, str]) -> None:
        self._session = session
        self._auth_headers = auth_headers

    @property
    def _headers(self) -> dict[str, str]:
        return merge_headers(self._auth_headers)

    def get_comments(self, page: int = 0, size: int = 20) -> requests.Response:
        return self._session.get(
            f"{API_URL}/api/admin/comments",
            params={"page": page, "size": size},
            headers=self._headers,
            timeout=10,
        )

    def get_stats(self) -> requests.Response:
        return self._session.get(
            f"{API_URL}/api/admin/comments/stats",
            headers=self._headers,
            timeout=10,
        )

    def moderate(
        self, comment_id: int, status: CommentStatus, rejection_reason: str | None = None
    ) -> requests.Response:
        body: dict[str, object] = {"status": status}
        if rejection_reason:
            body["rejectionReason"] = rejection_reason
        return self._session.put(
            f"{API_URL}/api/admin/comments/{comment_id}/moderate",
            json=body,
            headers=self._headers,
            timeout=10,
        )

    def delete_comment(self, comment_id: int) -> requests.Response:
        return self._session.delete(
            f"{API_URL}/api/admin/comments/{comment_id}",
            headers=self._headers,
            timeout=10,
        )
