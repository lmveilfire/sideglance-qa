import allure
import pytest

from src.utils.constants import ADMIN_USERNAME
from src.utils.models import LoginPayload


@pytest.mark.api
@pytest.mark.security
@pytest.mark.skip(reason="Требует сброса счетчика попыток на стенде перед каждым прогоном")
@allure.title("Блокировка API-авторизации (Rate Limit) после 5 неудачных попыток")
def test_api_login_rate_limit(auth_api) -> None:
    bad_credentials = LoginPayload(username=ADMIN_USERNAME, password="wrong_password")
    max_failed_attempts = 5

    for _ in range(max_failed_attempts):
        auth_api.login(bad_credentials)

    blocked_response = auth_api.login(bad_credentials)

    assert blocked_response.json()["error"]
