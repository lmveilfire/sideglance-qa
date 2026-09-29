import allure
import pytest

from src.helpers.photo_helpers import create_photo_with_category


@pytest.mark.api
@allure.title("Фотографии: успешное увеличение счетчика лайков при оценке фотографии пользователем")
def test_api_like_photo_counters(photo_client, category_client) -> None:
    photo, _ = create_photo_with_category(category_client, photo_client)
    body = photo_client.like(photo.id)

    assert body.totalLikes == 1
