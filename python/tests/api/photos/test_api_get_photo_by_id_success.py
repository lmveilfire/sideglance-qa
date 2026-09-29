import allure
import pytest

from src.helpers.photo_helpers import create_photo_with_category


@pytest.mark.api
@allure.title("Фотографии: успешное получение данных фотографии по ее существующему идентификатору")
def test_api_get_photo_by_id_success(photo_client, category_client) -> None:
    photo, _ = create_photo_with_category(category_client, photo_client)

    body = photo_client.get_by_id(photo.id)

    assert body.id == photo.id
