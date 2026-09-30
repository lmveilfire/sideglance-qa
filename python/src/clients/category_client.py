from __future__ import annotations

import allure
from pydantic import TypeAdapter

from src.api.category_api import CategoryApi
from src.helpers.api_helpers import assert_status
from src.utils.constants import HTTP
from src.utils.models import CategoryDto


class CategoryClient:
    def __init__(self, api: CategoryApi) -> None:
        self._api = api

    @allure.step("API: Создать новую категорию '{name}'")
    def create(self, name: str) -> CategoryDto:
        response = self._api.create(name)
        assert_status(response, f"CategoryClient.create({name})", HTTP.OK, HTTP.CREATED)
        return CategoryDto.model_validate(response.json())

    @allure.step("API: Удалить категорию ID {category_id}")
    def delete(self, category_id: int) -> None:
        response = self._api.delete_category(category_id)
        assert_status(response, f"CategoryClient.delete({category_id})", HTTP.NO_CONTENT, HTTP.OK)

    @allure.step("API: Получить список всех категорий")
    def category_list(self) -> list[CategoryDto]:
        response = self._api.get_all()
        return TypeAdapter(list[CategoryDto]).validate_python(response.json())
