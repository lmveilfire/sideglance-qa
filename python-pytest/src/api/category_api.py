from __future__ import annotations

import requests

from src.utils.constants import API_URL


class CategoryApi:
    def __init__(self, session: requests.Session, auth_headers: dict[str, str]) -> None:
        self._session = session
        self._auth_headers = auth_headers

    def get_all(self) -> requests.Response:
        return self._session.get(f"{API_URL}/api/categories", timeout=10)

    def create(self, name: str) -> requests.Response:
        return self._session.post(
            f"{API_URL}/api/categories",
            json={"name": name},
            headers=self._auth_headers,
            timeout=10,
        )

    def delete_category(
        self, category_id: int, headers: dict[str, str] | None = None
    ) -> requests.Response:
        return self._session.delete(
            f"{API_URL}/api/categories/{category_id}",
            headers=headers or self._auth_headers,
            timeout=10,
        )
