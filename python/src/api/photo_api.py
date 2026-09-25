from __future__ import annotations

from pathlib import Path

import requests

from src.utils.constants import API_URL
from src.utils.headers import merge_headers
from src.utils.models import PhotoPayload


class PhotoApi:
    def __init__(self, session: requests.Session, auth_headers: dict[str, str]) -> None:
        self._session = session
        self._auth_headers = auth_headers

    @property
    def _headers(self) -> dict[str, str]:
        return merge_headers(self._auth_headers)

    def get_all(self) -> requests.Response:
        return self._session.get(f"{API_URL}/api/photos", timeout=10)

    def get_by_id(self, photo_id: int) -> requests.Response:
        return self._session.get(f"{API_URL}/api/photos/{photo_id}", timeout=10)

    def get_by_category(self, category_id: int) -> requests.Response:
        return self._session.get(f"{API_URL}/api/photos/category/{category_id}", timeout=10)

    def upload(self, file_path: str, payload: PhotoPayload) -> requests.Response:
        path = Path(file_path)
        form_data: dict[str, str] = {
            "title": payload.title,
            "author": payload.author,
            "place": payload.place,
        }
        if payload.takenAt:
            form_data["takenAt"] = payload.takenAt
        if payload.categoryId is not None:
            form_data["categoryId"] = str(payload.categoryId)
        if payload.subcategoryId is not None:
            form_data["subcategoryId"] = str(payload.subcategoryId)
        with path.open("rb") as fh:
            files = {"file": (path.name, fh, "image/jpeg")}
            return self._session.post(
                f"{API_URL}/api/photos",
                data=form_data,
                files=files,
                headers=self._auth_headers,
                timeout=30,
            )

    def like(self, photo_id: int) -> requests.Response:
        return self._session.put(
            f"{API_URL}/api/photos/{photo_id}/like",
            headers=self._headers,
            timeout=10,
        )

    def record_view(self, photo_id: int) -> requests.Response:
        return self._session.put(f"{API_URL}/api/photos/{photo_id}/view", timeout=10)

    def delete_photo(self, photo_id: int) -> requests.Response:
        return self._session.delete(
            f"{API_URL}/api/photos/{photo_id}",
            headers=self._auth_headers,
            timeout=10,
        )
