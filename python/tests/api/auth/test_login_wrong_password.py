import allure
import pytest

from src.utils.constants import ADMIN_USERNAME, HTTP
from src.utils.models import LoginPayload


@pytest.mark.api
@allure.title("Ошибка API-авторизации при вводе неверного пароля")
def test_login_wrong_password(auth_api) -> None:
    wrong_password = "XCBjmxdo3r0"
    response = auth_api.login(LoginPayload(username=ADMIN_USERNAME, password=wrong_password))

    assert response.status_code == HTTP.UNAUTHORIZED
    assert response.json()["error"]
