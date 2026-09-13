from __future__ import annotations

import pytest

from src.api.comment_api import CommentApi
from src.clients.category_client import CategoryClient
from src.clients.comment_client import CommentClient
from src.clients.photo_client import PhotoClient
from src.helpers.captcha_helper import CaptchaHelper
from src.helpers.helpers import create_photo_with_category
from src.utils.constants import HTTP
from src.utils.generators import Generate
from src.utils.types import CaptchaData, CommentPayload


@pytest.mark.api
class TestGetCaptcha:
    def test_tc_com_01_returns_session_id_and_question(self, comment_client: CommentClient) -> None:
        body = comment_client.get_captcha()
        assert isinstance(body["sessionId"], str)
        assert len(body["sessionId"]) > 0
        assert isinstance(body["question"], str)
        assert len(body["question"]) > 0


@pytest.mark.api
class TestGetCommentsByPhoto:
    def test_tc_com_02_returns_comments_has_more_total_count_page(
        self,
        photo_client: PhotoClient,
        comment_client: CommentClient,
        category_client: CategoryClient,
    ) -> None:
        photo, _ = create_photo_with_category(category_client, photo_client)
        page = comment_client.list_by_photo(photo["id"], 0, 5)

        assert isinstance(page["hasMore"], bool)
        assert isinstance(page["totalCount"], int)
        assert page["page"] == 0


@pytest.mark.api
class TestPostCommentsNegative:
    def test_tc_com_04_wrong_captcha_returns_400(
        self,
        photo_client: PhotoClient,
        comment_api: CommentApi,
        captcha_helper: CaptchaHelper,
        category_client: CategoryClient,
    ) -> None:
        photo, _ = create_photo_with_category(category_client, photo_client)
        captcha = captcha_helper.solve_captcha()
        wrong_captcha: CaptchaData = {**captcha, "answer": captcha["answer"] + 999}

        response = comment_api.create(Generate.comment_data(photo["id"]), wrong_captcha)
        assert response.status_code == HTTP.BAD_REQUEST
        assert response.json()["error"]

    def test_tc_com_05_too_fast_response_returns_400(
        self,
        photo_client: PhotoClient,
        comment_api: CommentApi,
        captcha_helper: CaptchaHelper,
        category_client: CategoryClient,
    ) -> None:
        photo, _ = create_photo_with_category(category_client, photo_client)
        captcha = captcha_helper.solve_captcha(100)

        response = comment_api.create(Generate.comment_data(photo["id"]), captcha)
        assert response.status_code == HTTP.BAD_REQUEST
        assert response.json()["error"]

    def test_tc_com_06_duplicate_session_id_first_201_second_429(
        self,
        photo_client: PhotoClient,
        comment_api: CommentApi,
        captcha_helper: CaptchaHelper,
        category_client: CategoryClient,
    ) -> None:
        photo, _ = create_photo_with_category(category_client, photo_client)
        captcha = captcha_helper.solve_captcha()

        first = comment_api.create(Generate.comment_data(photo["id"]), captcha)
        assert first.status_code == HTTP.CREATED

        second = comment_api.create(Generate.comment_data(photo["id"]), captcha)
        assert second.status_code == HTTP.TOO_MANY_REQUESTS

    def test_tc_com_07_honeypot_filled_silently_rejected_200(
        self,
        photo_client: PhotoClient,
        comment_api: CommentApi,
        comment_client: CommentClient,
        captcha_helper: CaptchaHelper,
        category_client: CategoryClient,
    ) -> None:
        photo, _ = create_photo_with_category(category_client, photo_client)
        captcha = captcha_helper.solve_captcha()

        payload: CommentPayload = {**Generate.comment_data(photo["id"]), "honeypot": "bot-value"}
        response = comment_api.create(payload, captcha)
        assert response.status_code == HTTP.OK

        page = comment_client.list_by_photo(photo["id"], 0, 100)
        assert all(c.get("id") is not None for c in page["comments"])
        assert page["totalCount"] == 0
