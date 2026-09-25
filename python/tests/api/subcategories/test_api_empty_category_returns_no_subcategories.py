import allure
import pytest

from src.utils.generators import Generate


@pytest.mark.api
@allure.title("Запрос подкатегорий для пустой категории: бэкенд должен вернуть пустой список")
def test_api_empty_category_returns_no_subcategories(category_client, subcategory_client) -> None:
    category = category_client.create(Generate.category_data().name)

    body = subcategory_client.list_by_category_id(category.id)

    assert len(body) == 0
