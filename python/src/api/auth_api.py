from __future__ import annotations

import requests

from src.helpers.api_helpers import assert_status
from src.utils.constants import API_URL, HTTP
from src.utils.headers import merge_headers
from src.utils.models import AuthResponse, LoginPayload


class AuthApi:
    def __init__(self, session: requests.Session) -> None:
        self._session = session

    def _headers(self, custom: dict[str, str] | None = None) -> dict[str, str]:
        return merge_headers(custom)

    def login(
        self, payload: LoginPayload, custom_headers: dict[str, str] | None = None
    ) -> requests.Response:
        return self._session.post(
            f"{API_URL}/api/auth/login",
            json=payload.model_dump(),
            headers=self._headers(custom_headers),
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
        response = self.login(LoginPayload(username=username, password=password))
        assert_status(response, "AuthApi.get_token", HTTP.OK)
        body = AuthResponse.model_validate(response.json())
        return body.accessToken

    def get_auth_headers(self, username: str, password: str) -> dict[str, str]:
        token = self.get_token(username, password)
        return {"Authorization": f"Bearer {token}"}
