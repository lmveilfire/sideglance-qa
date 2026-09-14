from __future__ import annotations

from typing import cast

from src.api.admin_comment_api import AdminCommentApi
from src.utils.constants import HTTP
from src.utils.decorators import step
from src.utils.types import (
    AdminCommentDto,
    AdminCommentsPageResponse,
    CommentStatsDto,
    CommentStatus,
)


class AdminCommentClient:
    def __init__(self, api: AdminCommentApi) -> None:
        self._api = api

    @step()
    def list_all(self, page: int = 0, size: int = 20) -> AdminCommentsPageResponse:
        response = self._api.get_comments(page, size)
        if response.status_code not in (HTTP.OK,):
            raise RuntimeError(
                f"[AdminCommentClient] listAll failed: {response.status_code} {response.text}"
            )
        return cast(AdminCommentsPageResponse, response.json())

    @step()
    def get_stats(self) -> CommentStatsDto:
        response = self._api.get_stats()
        if response.status_code not in (HTTP.OK,):
            raise RuntimeError(
                f"[AdminCommentClient] getStats failed: {response.status_code} {response.text}"
            )
        return cast(CommentStatsDto, response.json())

    @step()
    def moderate(
        self, comment_id: int, status: CommentStatus, rejection_reason: str = ""
    ) -> AdminCommentDto:
        response = self._api.moderate(comment_id, status, rejection_reason)
        if response.status_code not in (HTTP.OK, HTTP.NO_CONTENT):
            raise RuntimeError(
                f"[AdminCommentClient] moderate({comment_id}) failed: {response.status_code} {response.text}"
            )
        return cast(AdminCommentDto, response.json())

    @step()
    def delete(self, comment_id: int) -> None:
        response = self._api.delete_comment(comment_id)
        if response.status_code not in (HTTP.NO_CONTENT, HTTP.OK):
            raise RuntimeError(
                f"[AdminCommentClient] delete({comment_id}) failed: {response.status_code} {response.text}"
            )
