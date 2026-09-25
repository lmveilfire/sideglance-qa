import allure
import pytest

from src.utils.constants import HTTP


@pytest.mark.api
@allure.title("Удаление несуществующей категории возвращает статус 204 No Content")
def test_api_delete_nonexistent_category(category_api) -> None:
    category_id = 999
    response = category_api.delete_category(category_id)

    assert response.status_code == HTTP.NO_CONTENT
