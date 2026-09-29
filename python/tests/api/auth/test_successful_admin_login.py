import allure
import pytest

from src.utils.constants import ADMIN_PASSWORD, ADMIN_USERNAME, HTTP
from src.utils.models import AuthResponse, LoginPayload


@pytest.mark.api
@allure.title("Авторизация: Успешный вход администратора по паролю")
def test_successful_admin_login(auth_api) -> None:
    response = auth_api.login(LoginPayload(username=ADMIN_USERNAME, password=ADMIN_PASSWORD))

    assert response.status_code == HTTP.OK

    data = AuthResponse.model_validate(response.json())

    assert data.username == ADMIN_USERNAME
