import allure
import pytest

from src.utils.generators import Generate


@pytest.mark.api
@allure.title("Полный жизненный цикл категории: создание, валидация матчером и удаление")
def test_api_category_create_and_delete_lifecycle(category_client) -> None:
    category = category_client.create(Generate.category_data().name)

    list_response = category_client.category_list()
    assert any(c.id == category.id for c in list_response)

    category_client.delete(category.id)
    list_after_delete = category_client.category_list()
    assert not any(c.id == category.id for c in list_after_delete)
