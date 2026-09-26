import allure
import pytest

from src.utils.constants import ADMIN_USERNAME
from src.utils.generators import Generate
from src.utils.models import LoginPayload


@pytest.mark.api
@pytest.mark.security
@allure.title("Блокировка API-авторизации (Rate Limit) после 5 неудачных попыток")
def test_api_login_rate_limit(auth_api) -> None:
    bad_credentials = LoginPayload(username=ADMIN_USERNAME, password="wrong_password")
    max_failed_attempts = 5
    headers = {"X-Forwarded-For": Generate.ip()}

    for _ in range(max_failed_attempts):
        auth_api.login(bad_credentials, custom_headers=headers)

    blocked_response = auth_api.login(bad_credentials)

    assert blocked_response.json()["error"]
