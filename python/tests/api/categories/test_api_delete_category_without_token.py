import allure
import pytest
import requests

from src.api.category_api import CategoryApi
from src.utils.constants import HTTP
from src.utils.generators import Generate


@pytest.mark.api
@allure.title("Запрет удаления категории (403 Forbidden) при запросе без токена авторизации")
def test_api_delete_category_without_token(api_session: requests.Session, category_api) -> None:
    create_response = category_api.create(Generate.category_data().name)
    assert create_response.status_code in (HTTP.OK, HTTP.CREATED)
    category_id = create_response.json()["id"]

    unauth_api = CategoryApi(api_session, {})
    response = unauth_api.delete_category(category_id)

    assert response.status_code == HTTP.FORBIDDEN
