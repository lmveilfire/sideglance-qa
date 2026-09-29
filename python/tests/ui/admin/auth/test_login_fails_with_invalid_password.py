import allure
import pytest
from playwright.async_api import Page, expect

from src.utils.constants import ADMIN_USERNAME


@pytest.mark.ui
@allure.title("Администратор не может войти с неверным паролем и остается на странице авторизации")
async def test_login_fails_with_invalid_password(page: Page, login_page) -> None:
    invalid_password = "wrong_password"
    login_error_message = "The key doesn't match this lock."

    await login_page.goto()
    await login_page.login(ADMIN_USERNAME, invalid_password)

    await expect(page).to_have_url(login_page.URL_PATH)
    await expect(login_page.error_message).to_contain_text(login_error_message)
