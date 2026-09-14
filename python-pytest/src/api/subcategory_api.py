from __future__ import annotations

import requests

from src.utils.constants import API_URL
from src.utils.headers import merge_headers


class SubcategoryApi:
    def __init__(
        self, session: requests.Session, auth_headers: dict[str, str] | None = None
    ) -> None:
        self._session = session
        self._auth_headers = auth_headers or {}

    @property
    def _headers(self) -> dict[str, str]:
        return merge_headers(self._auth_headers)

    def get_by_category_id(self, category_id: int) -> requests.Response:
        return self._session.get(
            f"{API_URL}/api/subcategories",
            params={"categoryId": category_id},
            timeout=10,
        )

    def create(self, category_id: int, name: str) -> requests.Response:
        return self._session.post(
            f"{API_URL}/api/subcategories",
            json={"categoryId": category_id, "name": name},
            headers=self._headers,
            timeout=10,
        )

    def delete_subcategory(
        self, subcategory_id: int, headers: dict[str, str] | None = None
    ) -> requests.Response:
        return self._session.delete(
            f"{API_URL}/api/subcategories/{subcategory_id}",
            headers=headers or self._headers,
            timeout=10,
        )
