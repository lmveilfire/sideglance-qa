from __future__ import annotations

from typing import cast

from src.api.subcategory_api import SubcategoryApi
from src.utils.constants import HTTP
from src.utils.decorators import step
from src.utils.types import SubcategoryDto


class SubcategoryClient:
    def __init__(self, api: SubcategoryApi) -> None:
        self._api = api

    @step()
    def create(self, category_id: int, name: str) -> SubcategoryDto:
        response = self._api.create(category_id, name)
        if response.status_code not in (HTTP.OK, HTTP.CREATED):
            raise RuntimeError(
                f"[SubcategoryClient] create failed: {response.status_code} {response.text}"
            )
        return cast(SubcategoryDto, response.json())

    @step()
    def delete(self, subcategory_id: int) -> None:
        self._api.delete_subcategory(subcategory_id)

    @step()
    def list_by_category_id(self, category_id: int) -> list[SubcategoryDto]:
        response = self._api.get_by_category_id(category_id)
        if response.status_code not in (HTTP.OK,):
            raise RuntimeError(
                f"[SubcategoryClient] getByCategoryId failed: {response.status_code} {response.text}"
            )
        return cast("list[SubcategoryDto]", response.json())
