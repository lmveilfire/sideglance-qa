import os
from collections.abc import AsyncGenerator

import allure
import pytest
import pytest_asyncio
from dotenv import load_dotenv
from playwright.async_api import Page

load_dotenv()

from src.helpers.auth_helper import AuthHelper
from src.helpers.ui_auth_helper import UiAuthHelper
from src.pages.gallery_page import GalleryPage
from src.pages.login_page import LoginPage
from src.pages.moderate_comments_page import ModerateCommentsPage
from src.pages.photo_page import PhotoPage
from src.pages.photo_upload_page import PhotoUploadPage


@pytest.fixture(scope="session")
def base_url() -> str:
    return os.getenv("BASE_URL", "http://localhost")


@pytest.fixture
def browser_context_args(browser_context_args: dict) -> dict:
    return {**browser_context_args, "locale": "ru-RU", "viewport": {"width": 1440, "height": 900}}


@pytest_asyncio.fixture(autouse=True, loop_scope="session")
async def screenshot_on_failure(
    page: Page, request: pytest.FixtureRequest
) -> AsyncGenerator[None, None]:
    yield
    rep = getattr(request.node, "rep_call", None)
    if rep is not None and rep.failed:
        allure.attach(
            await page.screenshot(),
            name="Скриншот на момент падения",
            attachment_type=allure.attachment_type.PNG,
        )


@pytest.fixture
def ui_auth_helper(page: Page, auth_helper: AuthHelper) -> UiAuthHelper:
    return UiAuthHelper(page, auth_helper)


@pytest.fixture
def login_page(page: Page) -> LoginPage:
    return LoginPage(page)


@pytest.fixture
def gallery_page(page: Page) -> GalleryPage:
    return GalleryPage(page)


@pytest.fixture
def photo_page(page: Page) -> PhotoPage:
    return PhotoPage(page)


@pytest.fixture
def moderate_comments_page(page: Page) -> ModerateCommentsPage:
    return ModerateCommentsPage(page)


@pytest.fixture
def photo_upload_page(page: Page) -> PhotoUploadPage:
    return PhotoUploadPage(page)
