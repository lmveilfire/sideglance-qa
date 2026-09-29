import allure
import pytest

from src.utils.generators import Generate
from src.utils.models import SubcategoryDto


@pytest.mark.api
@allure.title(
    "Подкатегории: получение списка всех массово созданных подкатегорий внутри одной категории"
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

    for sub in created:
        assert any(s.id == sub.id for s in body), (
            f'подкатегория id={sub.id} name="{sub.name}" должна быть в ответе'
        )
