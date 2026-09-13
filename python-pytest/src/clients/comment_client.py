from __future__ import annotations

from typing import cast

from src.api.comment_api import CommentApi
from src.utils.constants import HTTP
from src.utils.decorators import step
from src.utils.types import (
    CaptchaData,
    CaptchaResponse,
    CommentDto,
    CommentPayload,
    CommentsPageResponse,
)


class CommentClient:
    def __init__(self, api: CommentApi) -> None:
        self._api = api

    @step()
    def get_captcha(self) -> CaptchaResponse:
        response = self._api.get_captcha()
        if response.status_code not in (HTTP.OK,):
            raise RuntimeError(
                f"[CommentClient] getCaptcha failed: {response.status_code} {response.text}"
            )
        return cast(CaptchaResponse, response.json())

    @step()
    def list_by_photo(self, photo_id: int, page: int = 0, size: int = 5) -> CommentsPageResponse:
        response = self._api.get_comments(photo_id, page, size)
        if response.status_code not in (HTTP.OK,):
            raise RuntimeError(
                f"[CommentClient] listByPhoto failed: {response.status_code} {response.text}"
            )
        return cast(CommentsPageResponse, response.json())

    @step()
    def create(self, payload: CommentPayload, captcha: CaptchaData) -> CommentDto:
        response = self._api.create(payload, captcha)
        if response.status_code not in (HTTP.OK, HTTP.CREATED):
            raise RuntimeError(
                f"[CommentClient] create failed: {response.status_code} {response.text}"
            )
        return cast(CommentDto, response.json())

    @step()
    def create_in_isolation(self, payload: CommentPayload, captcha: CaptchaData) -> CommentDto:
        from src.utils.generators import Generate

        response = self._api.create(payload, captcha, {"X-Forwarded-For": Generate.ip()})
        if response.status_code not in (HTTP.OK, HTTP.CREATED):
            raise RuntimeError(
                f"[CommentClient] createInIsolation failed: {response.status_code} {response.text}"
            )
        return cast(CommentDto, response.json())
