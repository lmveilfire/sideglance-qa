from __future__ import annotations

import allure

from src.api.admin_comment_api import AdminCommentApi
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
        if response.status_code not in (HTTP.OK,):
            raise RuntimeError(
                f"[AdminCommentClient] listAll failed: {response.status_code} {response.text}"
            )
        return AdminCommentsPageResponse.model_validate(response.json())

    @allure.step("API: Получить статистику")
    def get_stats(self) -> CommentStatsDto:
        response = self._api.get_stats()
        if response.status_code not in (HTTP.OK,):
            raise RuntimeError(
                f"[AdminCommentClient] getStats failed: {response.status_code} {response.text}"
            )
        return CommentStatsDto.model_validate(response.json())

    @allure.step("API: Модерация комментария ID {comment_id} -> статус: {status}")
    def moderate(
        self, comment_id: int, status: CommentStatus, rejection_reason: str = ""
    ) -> AdminCommentDto:
        response = self._api.moderate(comment_id, status, rejection_reason)
        if response.status_code not in (HTTP.OK, HTTP.NO_CONTENT):
            raise RuntimeError(
                f"[AdminCommentClient] moderate({comment_id}) failed: {response.status_code} {response.text}"
            )
        return AdminCommentDto.model_validate(response.json())

    @allure.step("API: Удалить комментарий ID {comment_id}")
    def delete(self, comment_id: int) -> None:
        response = self._api.delete_comment(comment_id)
        if response.status_code not in (HTTP.NO_CONTENT, HTTP.OK):
            raise RuntimeError(
                f"[AdminCommentClient] delete({comment_id}) failed: {response.status_code} {response.text}"
            )
