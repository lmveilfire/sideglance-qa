from playwright.async_api import Locator, Page


class BasePage:
    def __init__(self, page: Page):
        self.page = page

    @property
    def footer(self) -> Locator:
        return self.page.get_by_test_id("footer")

    @property
    def home_btn(self) -> Locator:
        return self.page.get_by_test_id("home-btn")

    def test_id_starts_with(self, prefix: str) -> Locator:
        return self.page.locator(f"[data-testid^='{prefix}']")

    async def scroll_to_bottom(self) -> None:
        await self.page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
