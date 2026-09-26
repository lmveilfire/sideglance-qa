import contextlib

import allure
from playwright.async_api import Locator, Page, TimeoutError

from src.pages.base_page import BasePage
from src.utils.constants import STATE_DETACHED, TIMEOUT_5S


class LoginPage(BasePage):
    URL_PATH = "/login"
    LOGIN_ERROR_MESSAGE = "The key doesn't match this lock."

    def __init__(self, page: Page):
        super().__init__(page)

    @property
    def username_input(self) -> Locator:
        return self.page.get_by_test_id("username-input")

    @property
    def password_input(self) -> Locator:
        return self.page.get_by_test_id("password-input")

    @property
    def auth_form_submit_btn(self) -> Locator:
        return self.page.get_by_test_id("auth-form-submit-btn")

    @property
    def error_message(self) -> Locator:
        return self.page.get_by_test_id("login-error")

    @allure.step("Открыть страницу авторизации")
    async def goto(self) -> None:
        await self.page.goto(self.URL_PATH)

    @allure.step("Ввести логин, пароль, нажать кнопку отправки формы")
    async def login(self, username: str, password: str) -> None:
        await self.username_input.fill(username)
        await self.password_input.fill(password)
        await self.auth_form_submit_btn.click()
        if await self.auth_form_submit_btn.is_visible():
            # try:
            #     await self.submit_btn.wait_for(state=STATE_DETACHED, timeout=TIMEOUT_5S)
            # except TimeoutError:
            #     pass
            with contextlib.suppress(TimeoutError):
                await self.auth_form_submit_btn.wait_for(state=STATE_DETACHED, timeout=TIMEOUT_5S)
