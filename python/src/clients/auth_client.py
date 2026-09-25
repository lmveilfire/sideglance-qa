from __future__ import annotations

import allure

from src.api.auth_api import AuthApi
from src.utils.constants import HTTP
from src.utils.models import AuthResponse, LoginPayload


class AuthClient:
    def __init__(self, api: AuthApi) -> None:
        self._api = api

    @allure.step("API: Авторизация в системе (POST /auth/login)")
    def login(self, payload: LoginPayload) -> AuthResponse:
        response = self._api.login(payload)
        if response.status_code not in (HTTP.OK, HTTP.CREATED):
            raise RuntimeError(f"[AuthClient] login failed: {response.status_code} {response.text}")
        return AuthResponse.model_validate(response.json())

    @allure.step("API: Обновление сессии по Refresh Token")
    def refresh(self, refresh_token: str) -> AuthResponse:
        response = self._api.refresh(refresh_token)
        if response.status_code not in (HTTP.OK, HTTP.CREATED):
            raise RuntimeError(
                f"[AuthClient] refresh failed: {response.status_code} {response.text}"
            )
        return AuthResponse.model_validate(response.json())
