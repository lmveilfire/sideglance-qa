import allure
from playwright.async_api import Page

from src.helpers.auth_helper import AuthHelper

ROOT_PATH: str = "/"
DEFAULT_ADMIN_REDIRECT: str = "/admin-panel/upload"


class UiAuthHelper:
    def __init__(self, page: Page, auth_helper: AuthHelper):
        self.page = page
        self.auth_helper = auth_helper

    @allure.step("Авторизоваться как админ")
    async def login_as_admin(self, redirect_url: str = DEFAULT_ADMIN_REDIRECT) -> None:
        token = self.auth_helper.get_admin_token()

        await self.page.goto(ROOT_PATH)

        await self.page.evaluate("token => localStorage.setItem('accessToken', token)", token)

        await self.page.goto(redirect_url)
        await self.page.wait_for_load_state("load")
