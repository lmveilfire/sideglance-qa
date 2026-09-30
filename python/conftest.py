from __future__ import annotations

import json
from collections.abc import Generator
from typing import Any

import allure
import pytest
import requests
from dotenv import load_dotenv
from faker import Faker

load_dotenv()

from src.api.admin_comment_api import AdminCommentApi
from src.api.auth_api import AuthApi
from src.api.category_api import CategoryApi
from src.api.comment_api import CommentApi
from src.api.photo_api import PhotoApi
from src.api.subcategory_api import SubcategoryApi
from src.clients.admin_comment_client import AdminCommentClient
from src.clients.auth_client import AuthClient
from src.clients.category_client import CategoryClient
from src.clients.comment_client import CommentClient
from src.clients.photo_client import PhotoClient
from src.clients.subcategory_client import SubcategoryClient
from src.helpers.auth_helper import AuthHelper
from src.helpers.captcha_helper import CaptchaHelper


def _format_for_allure(data: dict[str, Any] | None) -> str:
    if not data:
        return "<Нет данных>"

    lines = []
    for key, value in data.items():
        if key == "body":
            if isinstance(value, bytes):
                try:
                    value = value.decode("utf-8")
                except UnicodeDecodeError:
                    value = "<Бинарные данные>"

            if isinstance(value, str):
                try:
                    parsed = json.loads(value)
                    value = json.dumps(parsed, indent=2, ensure_ascii=False)
                except json.JSONDecodeError:
                    pass

        lines.append(f"--- {key.upper()} ---\n{value}")

    return "\n\n".join(lines)


class AllureAPISession(requests.Session):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self._last_request: dict[str, Any] | None = None
        self._last_response: dict[str, Any] | None = None
        self.hooks["response"].append(self._record_interaction)

    def _record_interaction(
        self, response: requests.Response, *args: Any, **kwargs: Any
    ) -> requests.Response:
        request = response.request

        self._last_request = {
            "method": request.method,
            "url": request.url,
            "headers": dict(request.headers),
            "body": request.body,
        }

        content_type = response.headers.get("Content-Type", "")
        if "application/json" in content_type or "text" in content_type:
            try:
                body = response.text
            except Exception:
                body = "<Не удалось декодировать текст ответа>"
        else:
            body = f"<Бинарные данные, размер: {len(response.content)} байт>"

        self._last_response = {
            "status_code": response.status_code,
            "headers": dict(response.headers),
            "body": body,
        }

        return response

    def attach_last_exchange(self) -> None:
        allure.attach(
            _format_for_allure(self._last_request),
            name="Последний API Request",
            attachment_type=allure.attachment_type.TEXT,
        )
        allure.attach(
            _format_for_allure(self._last_response),
            name="Последний API Response",
            attachment_type=allure.attachment_type.TEXT,
        )


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(
    item: pytest.Item, call: pytest.CallInfo[Any]
) -> Generator[None, Any, None]:
    outcome = yield
    report = outcome.get_result()
    setattr(item, f"rep_{report.when}", report)


@pytest.fixture(scope="session")
def faker() -> Faker:
    return Faker()


@pytest.fixture
def api_session(request: pytest.FixtureRequest) -> Generator[AllureAPISession, None, None]:
    session = AllureAPISession()
    session.headers.update({"Accept": "application/json"})
    try:
        yield session
        rep = getattr(request.node, "rep_call", None)
        if rep is not None and rep.failed:
            session.attach_last_exchange()
    finally:
        session.close()


@pytest.fixture
def auth_helper(api_session: requests.Session) -> AuthHelper:
    return AuthHelper(api_session)


@pytest.fixture
def auth_headers(auth_helper: AuthHelper) -> dict[str, str]:
    return auth_helper.get_admin_headers()


@pytest.fixture
def auth_api(api_session: requests.Session) -> AuthApi:
    return AuthApi(api_session)


@pytest.fixture
def photo_api(api_session: requests.Session, auth_headers: dict[str, str]) -> PhotoApi:
    return PhotoApi(api_session, auth_headers)


@pytest.fixture
def category_api(api_session: requests.Session, auth_headers: dict[str, str]) -> CategoryApi:
    return CategoryApi(api_session, auth_headers)


@pytest.fixture
def comment_api(api_session: requests.Session) -> CommentApi:
    return CommentApi(api_session)


@pytest.fixture
def subcategory_api(api_session: requests.Session, auth_headers: dict[str, str]) -> SubcategoryApi:
    return SubcategoryApi(api_session, auth_headers)


@pytest.fixture
def admin_comment_api(
    api_session: requests.Session, auth_headers: dict[str, str]
) -> AdminCommentApi:
    return AdminCommentApi(api_session, auth_headers)


@pytest.fixture
def captcha_helper(api_session: requests.Session) -> CaptchaHelper:
    return CaptchaHelper(api_session)


@pytest.fixture
def category_client(category_api: CategoryApi) -> CategoryClient:
    return CategoryClient(category_api)


@pytest.fixture
def subcategory_client(subcategory_api: SubcategoryApi) -> SubcategoryClient:
    return SubcategoryClient(subcategory_api)


@pytest.fixture
def auth_client(auth_api: AuthApi) -> AuthClient:
    return AuthClient(auth_api)


@pytest.fixture
def photo_client(photo_api: PhotoApi) -> PhotoClient:
    return PhotoClient(photo_api)


@pytest.fixture
def comment_client(comment_api: CommentApi) -> CommentClient:
    return CommentClient(comment_api)


@pytest.fixture
def admin_comment_client(admin_comment_api: AdminCommentApi) -> AdminCommentClient:
    return AdminCommentClient(admin_comment_api)
