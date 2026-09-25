import allure
import pytest

from src.utils.constants import ADMIN_PASSWORD, ADMIN_USERNAME
from src.utils.models import LoginPayload


@pytest.mark.api
@allure.title("Успешный API-логин администратора с получением токенов")
def test_successful_admin_login(auth_client) -> None:
    response = auth_client.login(LoginPayload(username=ADMIN_USERNAME, password=ADMIN_PASSWORD))

    assert response.username == ADMIN_USERNAME
