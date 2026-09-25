import allure
import pytest

from src.utils.constants import ADMIN_PASSWORD, ADMIN_USERNAME, HTTP
from src.utils.models import AuthResponse, LoginPayload


@pytest.mark.api
@allure.title("Успешное обновление пары JWT-токенов через API")
def test_api_refresh_token_success(auth_api) -> None:
    jwt_segments_count = 3
    login_response = auth_api.login(LoginPayload(username=ADMIN_USERNAME, password=ADMIN_PASSWORD))

    assert login_response.status_code == HTTP.OK

    login_data = AuthResponse.model_validate(login_response.json())

    refresh_response = auth_api.refresh(login_data.refreshToken)

    assert refresh_response.status_code == HTTP.OK

    refresh_data = AuthResponse.model_validate(refresh_response.json())

    assert refresh_data.accessToken
    assert len(refresh_data.accessToken.split(".")) == jwt_segments_count
    assert refresh_data.username == ADMIN_USERNAME
