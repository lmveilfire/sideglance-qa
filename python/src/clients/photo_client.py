from __future__ import annotations

import allure
from pydantic import TypeAdapter

from src.api.photo_api import PhotoApi
from src.utils.constants import HTTP
from src.utils.models import LikeResult, PhotoDto, PhotoPayload

_PHOTO_LIST_ADAPTER = TypeAdapter(list[PhotoDto])


class PhotoClient:
    def __init__(self, api: PhotoApi) -> None:
        self._api = api

    @allure.step("API: Получить список всех фотографий")
    def photo_list(self) -> list[PhotoDto]:
        response = self._api.get_all()
        if not response.ok:
            raise RuntimeError(f"[PhotoClient] list failed: {response.status_code} {response.text}")
        return _PHOTO_LIST_ADAPTER.validate_python(response.json())

    @allure.step("API: Получить фотографии из категории ID {category_id}")
    def list_by_category(self, category_id: int) -> list[PhotoDto]:
        response = self._api.get_by_category(category_id)
        if not response.ok:
            raise RuntimeError(
                f"[PhotoClient] listByCategory({category_id}) failed: {response.status_code} {response.text}"
            )
        return _PHOTO_LIST_ADAPTER.validate_python(response.json())

    @allure.step("API: Получить фотографию по ID {photo_id}")
    def get_by_id(self, photo_id: int) -> PhotoDto:
        response = self._api.get_by_id(photo_id)
        if response.status_code not in (HTTP.OK,):
            raise RuntimeError(
                f"[PhotoClient] getById({photo_id}) failed: {response.status_code} {response.text}"
            )
        return PhotoDto.model_validate(response.json())

    @allure.step("API: Загрузить файл из '{file_path}'")
    def upload(self, file_path: str, payload: PhotoPayload) -> PhotoDto:
        response = self._api.upload(file_path, payload)
        if response.status_code not in (HTTP.OK, HTTP.CREATED):
            raise RuntimeError(
                f"[PhotoClient] upload failed: {response.status_code} {response.text}"
            )
        return PhotoDto.model_validate(response.json())

    @allure.step("API: Поставить лайк фотографии ID {photo_id}")
    def like(self, photo_id: int) -> LikeResult:
        response = self._api.like(photo_id)
        if response.status_code not in (HTTP.OK,):
            raise RuntimeError(
                f"[PhotoClient] like({photo_id}) failed: {response.status_code} {response.text}"
            )
        return LikeResult.model_validate(response.json())

    @allure.step("API: Обязательное удаление фотографии ID {photo_id}")
    def delete(self, photo_id: int) -> None:
        response = self._api.delete_photo(photo_id)
        if response.status_code not in (HTTP.NO_CONTENT, HTTP.OK):
            raise RuntimeError(
                f"[PhotoClient] delete({photo_id}) failed: {response.status_code} {response.text}"
            )

    @allure.step("API: Попытка удаления фотографии ID {photo_id} (игнорируя 404)")
    def try_delete(self, photo_id: int) -> None:
        response = self._api.delete_photo(photo_id)
        if response.status_code not in (HTTP.NO_CONTENT, HTTP.OK, HTTP.NOT_FOUND):
            raise RuntimeError(
                f"[PhotoClient] tryDelete({photo_id}) failed: {response.status_code} {response.text}"
            )
