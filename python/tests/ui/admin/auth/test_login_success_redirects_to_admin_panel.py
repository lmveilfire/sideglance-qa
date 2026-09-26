import allure
import pytest
from playwright.async_api import Page, expect

from src.utils.constants import ADMIN_PASSWORD, ADMIN_USERNAME


@pytest.mark.ui
@allure.title("Успешная авторизация администратора с последующим редиректом в панель управления")
async def test_login_success_redirects_to_admin_panel(
    page: Page, login_page, photo_upload_page
) -> None:

    await login_page.goto()
    await login_page.login(username=ADMIN_USERNAME, password=ADMIN_PASSWORD)

    await expect(page).to_have_url(photo_upload_page.URL_PATH)
