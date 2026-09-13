from __future__ import annotations

import pytest
import requests

from src.api.category_api import CategoryApi
from src.clients.category_client import CategoryClient
from src.utils.constants import HTTP
from src.utils.generators import Generate
from src.utils.matchers import CategoryMatcher


@pytest.mark.api
class TestGetCategories:
    def test_tc_cat_01_list_contains_all_created_categories(
        self, category_client: CategoryClient
    ) -> None:
        created = []
        count = 5
        for _ in range(count):
            name = Generate.category_data()["name"]
            category = category_client.create(name)
            created.append(category)

        list_response = category_client.list()
        returned_ids = {c["id"] for c in list_response}
        for cat in created:
            assert cat["id"] in returned_ids, (
                f'категория id={cat["id"]} name="{cat["name"]}" должна быть в ответе'
            )


@pytest.mark.api
class TestPostCategories:
    def test_tc_cat_02_full_cycle_create_and_delete(self, category_client: CategoryClient) -> None:
        name = Generate.category_data()["name"]
        category = category_client.create(name)
        assert category == CategoryMatcher["base"]

        list_response = category_client.list()
        assert any(c["id"] == category["id"] for c in list_response)

        category_client.delete(category["id"])
        list_after_delete = category_client.list()
        assert not any(c["id"] == category["id"] for c in list_after_delete)


@pytest.mark.api
class TestDeleteCategory:
    def test_tc_cat_03_without_token_returns_403(
        self, api_session: requests.Session, category_api: CategoryApi
    ) -> None:
        name = Generate.category_data()["name"]
        create_response = category_api.create(name)
        assert create_response.status_code in (HTTP.OK, HTTP.CREATED)
        category_id = create_response.json()["id"]

        unauth_api = CategoryApi(api_session, {})
        response = unauth_api.delete_category(category_id)
        assert response.status_code == HTTP.FORBIDDEN

    def test_tc_cat_04_nonexistent_id_returns_204(self, category_api: CategoryApi) -> None:
        category_id = 999
        response = category_api.delete_category(category_id)
        assert response.status_code == HTTP.NO_CONTENT
