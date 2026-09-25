import allure
import pytest
import requests

from src.api.photo_api import PhotoApi
from src.utils.constants import DEFAULT_FILE_PATH, HTTP
from src.utils.generators import Generate


@pytest.mark.api
@allure.title("Запрет загрузки фотографии (403 Forbidden) при запросе без токена авторизации")
def test_api_upload_photo_without_token(api_session: requests.Session, category_client) -> None:
    category = category_client.create(Generate.category_data().name)

    unauth_api = PhotoApi(api_session, {})
    response = unauth_api.upload(
        Generate.fixture_path(DEFAULT_FILE_PATH),
        Generate.photo_data(categoryId=category.id),
    )

    assert response.status_code == HTTP.FORBIDDEN
