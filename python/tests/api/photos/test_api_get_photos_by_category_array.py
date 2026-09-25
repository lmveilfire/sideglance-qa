import allure
import pytest

from src.helpers.helpers import create_photo_list
from src.utils.generators import Generate


@pytest.mark.api
@allure.title(
    "Получение списка фотографий по категории: валидация массива объектов через контрактный матчер"
)
def test_api_get_photos_by_category_array(photo_client, category_client) -> None:
    photos_count = 6
    category = category_client.create(Generate.category_data().name)

    create_photo_list(category.id, photo_client, photos_count)

    body = photo_client.list_by_category(category.id)

    assert isinstance(body, list)
    assert len(body) == photos_count
