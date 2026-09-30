from __future__ import annotations

import allure
from pydantic import TypeAdapter

from src.api.subcategory_api import SubcategoryApi
from src.helpers.api_helpers import assert_status
from src.utils.constants import HTTP
from src.utils.models import SubcategoryDto


class SubcategoryClient:
    def __init__(self, api: SubcategoryApi) -> None:
        self._api = api

    @allure.step("API: Создать подкатегорию '{name}' в категории ID {category_id}")
    def create(self, category_id: int, name: str) -> SubcategoryDto:
        response = self._api.create(category_id, name)
        assert_status(
            response, f"SubcategoryClient.create(({category_id}, {name})", HTTP.OK, HTTP.CREATED
        )
        return SubcategoryDto.model_validate(response.json())

    @allure.step("API: Удалить подкатегорию ID {subcategory_id}")
    def delete(self, subcategory_id: int) -> None:
        response = self._api.delete_subcategory(subcategory_id)
        assert_status(
            response, f"SubcategoryClient.delete({subcategory_id})", HTTP.NO_CONTENT, HTTP.OK
        )

    @allure.step("API: Получить список подкатегорий для категории ID {category_id}")
    def list_by_category_id(self, category_id: int) -> list[SubcategoryDto]:
        response = self._api.get_by_category_id(category_id)
        assert_status(response, f"SubcategoryClient.listByCategoryId(({category_id})", HTTP.OK)
        return TypeAdapter(list[SubcategoryDto]).validate_python(response.json())
