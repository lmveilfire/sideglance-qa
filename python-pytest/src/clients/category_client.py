from __future__ import annotations

from typing import cast

from src.api.category_api import CategoryApi
from src.utils.constants import HTTP
from src.utils.decorators import step
from src.utils.types import CategoryDto


class CategoryClient:
    def __init__(self, api: CategoryApi) -> None:
        self._api = api

    @step()
    def create(self, name: str) -> CategoryDto:
        response = self._api.create(name)
        if response.status_code not in (HTTP.OK, HTTP.CREATED):
            raise RuntimeError(
                f"[CategoryClient] create failed: {response.status_code} {response.text}"
            )
        return cast(CategoryDto, response.json())

    @step()
    def delete(self, category_id: int) -> None:
        self._api.delete_category(category_id)

    @step()
    def list(self) -> list[CategoryDto]:
        response = self._api.get_all()
        return cast("list[CategoryDto]", response.json())
