from __future__ import annotations

import allure

from src.api.admin_comment_api import AdminCommentApi
from src.helpers.api_helpers import assert_status
from src.utils.constants import HTTP
from src.utils.models import (
    AdminCommentDto,
    AdminCommentsPageResponse,
    CommentStatsDto,
    CommentStatus,
)


class AdminCommentClient:
    def __init__(self, api: AdminCommentApi) -> None:
        self._api = api

    @allure.step("API: Получить список всех комментариев (страница: {page}, размер: {size})")
    def list_all(self, page: int = 0, size: int = 20) -> AdminCommentsPageResponse:
        response = self._api.get_comments(page, size)
        assert_status(response, "AdminCommentClient.list_all", HTTP.OK)
        return AdminCommentsPageResponse.model_validate(response.json())

    @allure.step("API: Получить статистику")
    def get_stats(self) -> CommentStatsDto:
        response = self._api.get_stats()
        assert_status(response, "AdminCommentClient.get_stats", HTTP.OK)
        return CommentStatsDto.model_validate(response.json())

    @allure.step("API: Модерация комментария ID {comment_id} -> статус: {status}")
    def moderate(
        self, comment_id: int, status: CommentStatus, rejection_reason: str = ""
    ) -> AdminCommentDto:
        response = self._api.moderate(comment_id, status, rejection_reason)
        assert_status(
            response, f"AdminCommentClient.moderate({comment_id})", HTTP.OK, HTTP.NO_CONTENT
        )
        return AdminCommentDto.model_validate(response.json())

    @allure.step("API: Удалить комментарий ID {comment_id}")
    def delete(self, comment_id: int) -> None:
        response = self._api.delete_comment(comment_id)
        assert_status(
            response, f"AdminCommentClient.delete({comment_id})", HTTP.OK, HTTP.NO_CONTENT
        )
