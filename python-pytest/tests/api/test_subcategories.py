from __future__ import annotations

import pytest

from src.clients.category_client import CategoryClient
from src.clients.subcategory_client import SubcategoryClient
from src.utils.generators import Generate
from src.utils.matchers import SubcategoryMatcher


@pytest.mark.api
class TestGetSubcategories:
    def test_tc_sub_01_list_contains_all_created_subcategories(
        self, category_client: CategoryClient, subcategory_client: SubcategoryClient
    ) -> None:
        category = category_client.create(Generate.category_data()["name"])

        created = []
        count = 10
        for _ in range(count):
            subcategory = subcategory_client.create(
                category["id"], Generate.category_data()["name"]
            )
            created.append(subcategory)

        body = subcategory_client.list_by_category_id(category["id"])
        assert len(body) == count

        returned_ids = {s["id"] for s in body}
        for sub in created:
            assert sub["id"] in returned_ids, (
                f'подкатегория id={sub["id"]} name="{sub["name"]}" должна быть в ответе'
            )

    def test_sub_02_empty_category_returns_empty_array(
        self, category_client: CategoryClient, subcategory_client: SubcategoryClient
    ) -> None:
        category = category_client.create(Generate.category_data()["name"])

        body = subcategory_client.list_by_category_id(category["id"])
        assert len(body) == 0


@pytest.mark.api
class TestPostSubcategories:
    def test_tc_sub_03_response_body_shape(
        self, category_client: CategoryClient, subcategory_client: SubcategoryClient
    ) -> None:
        category = category_client.create(Generate.category_data()["name"])
        subcategory_client.create(category["id"], Generate.category_data()["name"])

        subcategory_list = subcategory_client.list_by_category_id(category["id"])
        sub = subcategory_list[0]
        assert sub == SubcategoryMatcher["base"]

    def test_tc_sub_04_full_cycle_create_check_delete(
        self, category_client: CategoryClient, subcategory_client: SubcategoryClient
    ) -> None:
        cat_name = Generate.category_data()["name"]
        category = category_client.create(cat_name)

        sub_name = Generate.category_data()["name"]
        subcategory = subcategory_client.create(category["id"], sub_name)
        sub_id = subcategory["id"]

        subcategory_list = subcategory_client.list_by_category_id(category["id"])
        after_create = {s["id"] for s in subcategory_list}
        assert sub_id in after_create, (
            f'подкатегория id={cat_name} name="{sub_name}" должна быть в ответе'
        )

        subcategory_client.delete(sub_id)

        body = subcategory_client.list_by_category_id(category["id"])
        after_delete = {s["id"] for s in body}
        assert sub_id not in after_delete, (
            f'подкатегория id={cat_name} name="{sub_name}" не должна быть в ответе'
        )
