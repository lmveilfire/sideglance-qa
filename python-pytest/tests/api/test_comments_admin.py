from __future__ import annotations

import pytest
import requests

from src.api.admin_comment_api import AdminCommentApi
from src.clients.admin_comment_client import AdminCommentClient
from src.clients.category_client import CategoryClient
from src.clients.comment_client import CommentClient
from src.clients.photo_client import PhotoClient
from src.helpers.captcha_helper import CaptchaHelper
from src.helpers.helpers import create_photo_with_category
from src.utils.constants import HTTP
from src.utils.generators import Generate


@pytest.mark.api
class TestAdminCommentStats:
    def test_tc_com_a_01_total_equals_sum_of_statuses(
        self, admin_comment_client: AdminCommentClient
    ) -> None:
        stats = admin_comment_client.get_stats()
        assert isinstance(stats["total"], int)
        assert isinstance(stats["pending"], int)
        assert isinstance(stats["approved"], int)
        assert isinstance(stats["rejected"], int)
        assert stats["total"] == stats["pending"] + stats["approved"] + stats["rejected"]


@pytest.mark.api
class TestGetAdminComments:
    def test_tc_com_a_02_without_token_returns_403(self, api_session: requests.Session) -> None:
        unauth_api = AdminCommentApi(api_session, {})
        response = unauth_api.get_comments()
        assert response.status_code == HTTP.FORBIDDEN


@pytest.mark.api
class TestModerateComment:
    def test_tc_com_a_03_approved_full_cycle(
        self,
        photo_client: PhotoClient,
        comment_client: CommentClient,
        captcha_helper: CaptchaHelper,
        admin_comment_client: AdminCommentClient,
        category_client: CategoryClient,
    ) -> None:
        photo, _ = create_photo_with_category(category_client, photo_client)

        captcha = captcha_helper.solve_captcha()
        created = comment_client.create_in_isolation(Generate.comment_data(photo["id"]), captcha)

        moderated = admin_comment_client.moderate(created["id"], "APPROVED")
        assert moderated["status"] == "APPROVED"

        page = comment_client.list_by_photo(photo["id"], 0, 100)
        assert any(c["id"] == created["id"] for c in page["comments"]), (
            "APPROVED комментарий должен быть виден публично"
        )

        admin_comment_client.delete(created["id"])

    def test_tc_com_a_04_rejected_full_cycle(
        self,
        photo_client: PhotoClient,
        comment_client: CommentClient,
        captcha_helper: CaptchaHelper,
        admin_comment_client: AdminCommentClient,
        category_client: CategoryClient,
    ) -> None:
        photo, _ = create_photo_with_category(category_client, photo_client)

        captcha = captcha_helper.solve_captcha()
        created = comment_client.create_in_isolation(Generate.comment_data(photo["id"]), captcha)

        moderated = admin_comment_client.moderate(created["id"], "REJECTED", "Spam")
        assert moderated["status"] == "REJECTED"

        page = comment_client.list_by_photo(photo["id"], 0, 100)
        assert not any(c["id"] == created["id"] for c in page["comments"]), (
            "REJECTED комментарий не должен быть виден публично"
        )

        admin_comment_client.delete(created["id"])


@pytest.mark.api
class TestCreateCommentSuccess:
    def test_tc_com_a_05_pending_not_visible_publicly(
        self,
        photo_client: PhotoClient,
        comment_client: CommentClient,
        captcha_helper: CaptchaHelper,
        admin_comment_client: AdminCommentClient,
        category_client: CategoryClient,
    ) -> None:
        photo, _ = create_photo_with_category(category_client, photo_client)

        captcha = captcha_helper.solve_captcha()
        created = comment_client.create_in_isolation(Generate.comment_data(photo["id"]), captcha)

        page = comment_client.list_by_photo(photo["id"], 0, 100)
        assert not any(c["id"] == created["id"] for c in page["comments"]), (
            "PENDING комментарий не должен быть виден публично"
        )

        admin_comment_client.delete(created["id"])
