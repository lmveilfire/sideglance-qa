import allure
import pytest

from src.utils.generators import Generate


@pytest.mark.api
@allure.title("Полный жизненный цикл подкатегории: создание, верификация наличия и удаление")
def test_api_subcategory_lifecycle(category_client, subcategory_client) -> None:
    category = category_client.create(Generate.category_data().name)
    subcategory = subcategory_client.create(category.id, Generate.category_data().name)
    sub_id = subcategory.id

    subcategory_list = subcategory_client.list_by_category_id(category.id)
    after_create = {s.id for s in subcategory_list}
    assert sub_id in after_create, (
        f'подкатегория id={category.id} name="{subcategory.name}" должна быть в ответе'
    )

    subcategory_client.delete(sub_id)

    body = subcategory_client.list_by_category_id(category.id)
    after_delete = {s.id for s in body}
    assert sub_id not in after_delete, (
        f'подкатегория id={category.id} name="{subcategory.name}" не должна быть в ответе'
    )
