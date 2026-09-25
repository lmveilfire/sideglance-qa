import allure
import pytest

from src.utils.generators import Generate


@pytest.mark.api
@allure.title("Валидация схемы ответа подкатегории через контрактный матчер")
def test_api_subcategory_contract_shape(category_client, subcategory_client) -> None:
    category = category_client.create(Generate.category_data().name)
    subcategory_client.create(category.id, Generate.category_data().name)

    subcategory_list = subcategory_client.list_by_category_id(category.id)

    sub = subcategory_list[0]
    assert sub.categoryId == category.id
