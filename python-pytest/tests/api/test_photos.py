from __future__ import annotations

import pytest
import requests

from src.api.photo_api import PhotoApi
from src.clients.category_client import CategoryClient
from src.clients.photo_client import PhotoClient
from src.helpers.helpers import create_photo_with_category
from src.utils.constants import HTTP
from src.utils.generators import Generate
from src.utils.matchers import PhotoMatcher


@pytest.mark.api
class TestGetPhotos:
    def test_tc_pho_01_returns_array_of_objects(
        self, photo_client: PhotoClient, category_client: CategoryClient
    ) -> None:
        category = category_client.create(f"{Generate.category_data()['name']}-cat")
        count = 6
        for _ in range(count):
            photo_client.upload(
                Generate.fixture_path("1.jpg"),
                Generate.photo_data(categoryId=category["id"]),
            )

        body = photo_client.list_by_category(category["id"])
        assert isinstance(body, list)
        assert len(body) > 0
        for item in body:
            assert item == PhotoMatcher["base"]


@pytest.mark.api
class TestGetPhotoById:
    def test_tc_pho_02_existing_id_returns_full_shape(
        self, photo_client: PhotoClient, category_client: CategoryClient
    ) -> None:
        photo, _ = create_photo_with_category(category_client, photo_client)
        body = photo_client.get_by_id(photo["id"])
        assert body == PhotoMatcher["base"]

    def test_pho_03_nonexistent_id_returns_404(self, photo_api: PhotoApi) -> None:
        response = photo_api.get_by_id(999_999_999)
        assert response.status_code == HTTP.NOT_FOUND


@pytest.mark.api
class TestLikePhoto:
    def test_tc_pho_04_returns_total_likes_and_newly_liked(
        self, photo_client: PhotoClient, category_client: CategoryClient
    ) -> None:
        photo, _ = create_photo_with_category(category_client, photo_client)
        body = photo_client.like(photo["id"])
        assert body["totalLikes"] == 1
        assert isinstance(body["newlyLiked"], bool)


@pytest.mark.api
class TestPostPhotos:
    def test_tc_pho_05_without_token_returns_403(
        self, api_session: requests.Session, category_client: CategoryClient
    ) -> None:
        category_name = f"{Generate.category_data()['name']}-cat"
        category = category_client.create(category_name)

        unauth_api = PhotoApi(api_session, {})
        response = unauth_api.upload(
            Generate.fixture_path("1.jpg"),
            Generate.photo_data(categoryId=category["id"]),
        )
        assert response.status_code == HTTP.FORBIDDEN

    def test_tc_pho_06_full_cycle_upload_check_delete_404(
        self, photo_client: PhotoClient, photo_api: PhotoApi, category_client: CategoryClient
    ) -> None:
        photo, _ = create_photo_with_category(category_client, photo_client)

        body = photo_client.get_by_id(photo["id"])
        assert body["id"] == photo["id"]

        photo_client.delete(photo["id"])

        get_after_delete = photo_api.get_by_id(photo["id"])
        assert get_after_delete.status_code == HTTP.NOT_FOUND
