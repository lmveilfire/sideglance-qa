import allure
import pytest
from playwright.async_api import expect

from src.utils.constants import ADMIN_USERNAME


@pytest.mark.ui
@allure.title("Форма входа: отправка формы невозможна при пустых полях логина и пароля")
async def test_login_submit_disabled_with_empty_fields(login_page) -> None:
    await login_page.goto()
    await login_page.auth_form_submit_btn.click()

    await expect(login_page.username_input).to_have_js_property("validity.valid", False)

    await login_page.username_input.fill(ADMIN_USERNAME)
    await login_page.auth_form_submit_btn.click()

    await expect(login_page.password_input).to_have_js_property("validity.valid", False)
