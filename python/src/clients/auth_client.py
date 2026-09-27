from __future__ import annotations

import allure

from src.api.auth_api import AuthApi
from src.helpers.api_helpers import assert_status
from src.utils.constants import HTTP
from src.utils.models import AuthResponse, LoginPayload


class AuthClient:
    def __init__(self, api: AuthApi) -> None:
        self._api = api

    @allure.step("API: Авторизация в системе (POST /auth/login)")
    def login(self, payload: LoginPayload) -> AuthResponse:
        response = self._api.login(payload)
        assert_status(response, "AuthClient] login", HTTP.OK, HTTP.CREATED)
        return AuthResponse.model_validate(response.json())

    @allure.step("API: Обновление сессии по Refresh Token")
    def refresh(self, refresh_token: str) -> AuthResponse:
        response = self._api.refresh(refresh_token)
        assert_status(response, "AuthClient] refresh", HTTP.OK, HTTP.CREATED)
        return AuthResponse.model_validate(response.json())
