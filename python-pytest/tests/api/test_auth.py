from __future__ import annotations

import pytest

from src.api.auth_api import AuthApi
from src.clients.auth_client import AuthClient
from src.utils.constants import ADMIN_PASSWORD, ADMIN_USERNAME, HTTP, INVALID_TOKEN
from src.utils.types import LoginPayload


@pytest.mark.api
class TestAuthLogin:
    def test_tc_auth_01_successful_admin_login(self, auth_client: AuthClient) -> None:
        response = auth_client.login({"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD})
        assert isinstance(response["accessToken"], str)
        assert isinstance(response["refreshToken"], str)
        assert response["username"] == ADMIN_USERNAME

    def test_tc_auth_02_wrong_password(self, auth_api: AuthApi) -> None:
        response = auth_api.login({"username": ADMIN_USERNAME, "password": "wrong_password"})
        assert response.status_code == HTTP.UNAUTHORIZED
        assert response.json()["error"] == "The key doesn't match this lock."

    @pytest.mark.security
    @pytest.mark.xfail
    def test_tc_auth_03_rate_limit_after_5_failed_attempts(self, auth_api: AuthApi) -> None:
        bad_credentials: LoginPayload = {"username": ADMIN_USERNAME, "password": "wrong_password"}
        max_failed_attempts = 5

        for _ in range(max_failed_attempts):
            auth_api.login(bad_credentials)

        blocked_response = auth_api.login(bad_credentials)

        assert blocked_response.json()["error"] == "The magic needs a moment to recharge."

    def test_tc_auth_04_refresh_token(self, auth_client: AuthClient) -> None:
        login_response = auth_client.login({"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD})
        refresh_response = auth_client.refresh(login_response["refreshToken"])

        assert refresh_response["accessToken"]
        assert len(refresh_response["accessToken"].split(".")) == 3
        assert refresh_response["username"] == ADMIN_USERNAME

    def test_tc_auth_05_invalid_refresh_token(self, auth_api: AuthApi) -> None:
        refresh_response = auth_api.refresh(INVALID_TOKEN)
        assert refresh_response.status_code == HTTP.FORBIDDEN
