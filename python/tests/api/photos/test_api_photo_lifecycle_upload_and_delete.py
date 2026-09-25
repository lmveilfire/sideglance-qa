import allure
import pytest

from src.helpers.helpers import create_photo_with_category
from src.utils.constants import HTTP


@pytest.mark.api
@allure.title("Полный жизненный цикл фотографии: загрузка, верификация наличия и удаление")
def test_api_photo_lifecycle_upload_and_delete(photo_client, photo_api, category_client) -> None:
    photo, _ = create_photo_with_category(category_client, photo_client)

    body = photo_client.get_by_id(photo.id)
    assert body.id == photo.id

    photo_client.delete(photo.id)

    get_after_delete = photo_api.get_by_id(photo.id)
    assert get_after_delete.status_code == HTTP.NOT_FOUND
