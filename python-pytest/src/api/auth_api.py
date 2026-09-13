from __future__ import annotations

import requests

from src.utils.constants import API_URL
from src.utils.headers import merge_headers
from src.utils.types import AuthResponse, LoginPayload


class AuthApi:
    def __init__(self, session: requests.Session) -> None:
        self._session = session

    def _headers(self, custom: dict[str, str] | None = None) -> dict[str, str]:
        return merge_headers(custom)

    def login(self, payload: LoginPayload) -> requests.Response:
        return self._session.post(
            f"{API_URL}/api/auth/login",
            json=dict(payload),
            headers=self._headers(),
            timeout=10,
        )

    def refresh(self, refresh_token: str) -> requests.Response:
        return self._session.post(
            f"{API_URL}/api/auth/refresh",
            data=refresh_token,
            headers=self._headers({"Content-Type": "text/plain"}),
            timeout=10,
        )

    def get_token(self, username: str, password: str) -> str:
        response = self.login({"username": username, "password": password})
        if not response.ok:
            raise RuntimeError(f"[AuthApi] login failed: {response.status_code} {response.text}")
        body: AuthResponse = response.json()
        return body["accessToken"]

    def get_auth_headers(self, username: str, password: str) -> dict[str, str]:
        token = self.get_token(username, password)
        return {"Authorization": f"Bearer {token}"}
