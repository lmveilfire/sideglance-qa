from __future__ import annotations

import allure

from src.api.comment_api import CommentApi
from src.utils.constants import DEFAULT_COMMENT_PAGE_SIZE, DEFAULT_START_PAGE, HTTP
from src.utils.generators import Generate
from src.utils.models import (
    CaptchaData,
    CaptchaResponse,
    CommentDto,
    CommentPayload,
    CommentsPageResponse,
)


class CommentClient:
    def __init__(self, api: CommentApi) -> None:
        self._api = api

    @allure.step("API: Получить капчу для комментария")
    def get_captcha(self) -> CaptchaResponse:
        response = self._api.get_captcha()
        if response.status_code not in (HTTP.OK,):
            raise RuntimeError(
                f"[CommentClient] getCaptcha failed: {response.status_code} {response.text}"
            )
        return CaptchaResponse.model_validate(response.json())

    @allure.step(
        "API: Получить комментарии к фото ID {photo_id} (страница: {page}, размер: {size})"
    )
    def list_by_photo(
        self, photo_id: int, page: int = DEFAULT_START_PAGE, size: int = DEFAULT_COMMENT_PAGE_SIZE
    ) -> CommentsPageResponse:
        response = self._api.get_comments(photo_id, page, size)
        if response.status_code not in (HTTP.OK,):
            raise RuntimeError(
                f"[CommentClient] listByPhoto failed: {response.status_code} {response.text}"
            )
        return CommentsPageResponse.model_validate(response.json())

    @allure.step("API: Создать новый комментарий к фотографии")
    def create(self, payload: CommentPayload, captcha: CaptchaData) -> CommentDto:
        response = self._api.create(payload, captcha)
        if response.status_code not in (HTTP.OK, HTTP.CREATED):
            raise RuntimeError(
                f"[CommentClient] create failed: {response.status_code} {response.text}"
            )
        return CommentDto.model_validate(response.json())

    @allure.step("API: Создать комментарий в изоляции (со случайного IP)")
    def create_in_isolation(self, payload: CommentPayload, captcha: CaptchaData) -> CommentDto:
        response = self._api.create(payload, captcha, {"X-Forwarded-For": Generate.ip()})
        if response.status_code not in (HTTP.OK, HTTP.CREATED):
            raise RuntimeError(
                f"[CommentClient] createInIsolation failed: {response.status_code} {response.text}"
            )
        return CommentDto.model_validate(response.json())
