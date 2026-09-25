from __future__ import annotations

import allure
from pydantic import TypeAdapter

from src.api.subcategory_api import SubcategoryApi
from src.utils.constants import HTTP
from src.utils.models import SubcategoryDto


class SubcategoryClient:
    def __init__(self, api: SubcategoryApi) -> None:
        self._api = api

    @allure.step("API: Создать подкатегорию '{name}' в категории ID {category_id}")
    def create(self, category_id: int, name: str) -> SubcategoryDto:
        response = self._api.create(category_id, name)
        if response.status_code not in (HTTP.OK, HTTP.CREATED):
            raise RuntimeError(
                f"[SubcategoryClient] create failed: {response.status_code} {response.text}"
            )
        return SubcategoryDto.model_validate(response.json())

    @allure.step("API: Удалить подкатегорию ID {subcategory_id}")
    def delete(self, subcategory_id: int) -> None:
        self._api.delete_subcategory(subcategory_id)

    @allure.step("API: Получить список подкатегорий для категории ID {category_id}")
    def list_by_category_id(self, category_id: int) -> list[SubcategoryDto]:
        response = self._api.get_by_category_id(category_id)
        if response.status_code not in (HTTP.OK,):
            raise RuntimeError(
                f"[SubcategoryClient] getByCategoryId failed: {response.status_code} {response.text}"
            )
        return TypeAdapter(list[SubcategoryDto]).validate_python(response.json())
