import allure
import pytest

from src.utils.generators import Generate
from src.utils.models import SubcategoryDto


@pytest.mark.api
@allure.title(
    "Получение списка подкатегорий: верификация всех созданных элементов в ответе бэкенда"
)
def test_api_subcategory_list_contains_all_created(category_client, subcategory_client) -> None:
    category = category_client.create(Generate.category_data().name)
    subcategories_count = 10

    created: list[SubcategoryDto] = []

    for _ in range(subcategories_count):
        subcategory = subcategory_client.create(category.id, Generate.category_data().name)
        created.append(subcategory)

    body = subcategory_client.list_by_category_id(category.id)
    assert len(body) == subcategories_count

    returned_ids = {s.id for s in body}
    for sub in created:
        assert sub.id in returned_ids, (
            f'подкатегория id={sub.id} name="{sub.name}" должна быть в ответе'
        )
