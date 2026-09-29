import allure
import pytest

from src.utils.generators import Generate
from src.utils.models import CategoryDto


@pytest.mark.api
@allure.title("Категории: Получение полного списка всех созданных категорий")
def test_api_category_list_contains_all_created(category_client) -> None:
    created: list[CategoryDto] = []
    category_сount = 5

    for _ in range(category_сount):
        category = category_client.create(Generate.category_data().name)
        created.append(category)

    list_response = category_client.category_list()
    returned_ids = {c.id for c in list_response}

    for cat in created:
        assert cat.id in returned_ids, (
            f'категория id={cat.id} name="{cat.name}" должна быть в ответе'
        )
