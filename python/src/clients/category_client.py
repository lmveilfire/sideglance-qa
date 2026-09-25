from __future__ import annotations

import allure
from pydantic import TypeAdapter

from src.api.category_api import CategoryApi
from src.utils.constants import HTTP
from src.utils.models import CategoryDto


class CategoryClient:
    def __init__(self, api: CategoryApi) -> None:
        self._api = api

    @allure.step("API: Создать новую категорию '{name}'")
    def create(self, name: str) -> CategoryDto:
        response = self._api.create(name)
        if response.status_code not in (HTTP.OK, HTTP.CREATED):
            raise RuntimeError(
                f"[CategoryClient] create failed: {response.status_code} {response.text}"
            )
        return CategoryDto.model_validate(response.json())

    @allure.step("API: Удалить категорию ID {category_id}")
    def delete(self, category_id: int) -> None:
        self._api.delete_category(category_id)

    @allure.step("API: Получить список всех категорий")
    def category_list(self) -> list[CategoryDto]:
        response = self._api.get_all()
        return TypeAdapter(list[CategoryDto]).validate_python(response.json())
