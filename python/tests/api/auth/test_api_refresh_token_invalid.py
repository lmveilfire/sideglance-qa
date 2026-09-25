import allure
import pytest

from src.utils.constants import HTTP, INVALID_TOKEN


@pytest.mark.api
@allure.title("Ошибка обновления токенов при передаче невалидного refresh-токена")
def test_api_refresh_token_invalid(auth_api) -> None:
    refresh_response = auth_api.refresh(INVALID_TOKEN)

    assert refresh_response.status_code == HTTP.FORBIDDEN
