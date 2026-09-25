import allure
import pytest

from src.utils.constants import HTTP


@pytest.mark.api
@allure.title("Запрос фотографии по несуществующему ID возвращает статус 404 Not Found")
def test_api_get_photo_by_id_nonexistent(photo_api) -> None:
    nonexistent_photo_id = 999_999_999
    response = photo_api.get_by_id(nonexistent_photo_id)

    assert response.status_code == HTTP.NOT_FOUND
