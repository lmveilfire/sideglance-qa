import allure
import pytest
import requests

from src.api.admin_comment_api import AdminCommentApi
from src.utils.constants import HTTP


@pytest.mark.api
@allure.title("Запрет получения списка комментариев в админке без токена авторизации")
def test_api_get_admin_comments_without_token(api_session: requests.Session) -> None:
    unauth_api = AdminCommentApi(api_session, {})
    response = unauth_api.get_comments()

    assert response.status_code == HTTP.FORBIDDEN
