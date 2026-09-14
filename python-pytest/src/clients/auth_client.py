from __future__ import annotations

from typing import cast

from src.api.auth_api import AuthApi
from src.utils.constants import HTTP
from src.utils.decorators import step
from src.utils.types import AuthResponse, LoginPayload


class AuthClient:
    def __init__(self, api: AuthApi) -> None:
        self._api = api

    @step()
    def login(self, payload: LoginPayload) -> AuthResponse:
        response = self._api.login(payload)
        if response.status_code not in (HTTP.OK, HTTP.CREATED):
            raise RuntimeError(f"[AuthClient] login failed: {response.status_code} {response.text}")
        return cast(AuthResponse, response.json())

    @step()
    def refresh(self, refresh_token: str) -> AuthResponse:
        response = self._api.refresh(refresh_token)
        if response.status_code not in (HTTP.OK, HTTP.CREATED):
            raise RuntimeError(
                f"[AuthClient] refresh failed: {response.status_code} {response.text}"
            )
        return cast(AuthResponse, response.json())
