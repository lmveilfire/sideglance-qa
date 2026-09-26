import allure
from playwright.async_api import Locator, Page

from src.pages.base_page import BasePage
from src.utils.constants import STATE_DETACHED, STATE_VISIBLE, TIMEOUT_3S, TIMEOUT_5S


class GalleryPage(BasePage):
    URL_PATH = "/"

    def __init__(self, page: Page):
        super().__init__(page)

    @property
    def search_input(self) -> Locator:
        return self.page.get_by_test_id("search-input")

    @property
    def search_clear_btn(self) -> Locator:
        return self.page.get_by_test_id("search-clear")

    @property
    def sidebar(self) -> Locator:
        return self.page.get_by_test_id("sidebar")

    @property
    def category_list(self) -> Locator:
        return self.page.get_by_test_id("category-list")

    @property
    def burger_btn(self) -> Locator:
        return self.page.get_by_test_id("burger-btn")

    @property
    def empty_state_message(self) -> Locator:
        return self.page.get_by_test_id("empty-state-message")

    @property
    def photo_card_list(self) -> Locator:
        return self.page.get_by_test_id("photo-card-list")

    @property
    def loading_spinner(self) -> Locator:
        return self.page.get_by_test_id("loading-spinner")

    @property
    def subcategory_list(self) -> Locator:
        return self.page.get_by_test_id("subcategory-list")

    def category_item_by_name(self, name: str) -> Locator:
        return self.page.locator('[data-testid^="category-item-"]').filter(has_text=name)

    def subcategory_item_by_name(self, name: str) -> Locator:
        return self.page.locator('[data-testid^="subcategory-item-"]').filter(has_text=name)

    def _category_delete_btn(self, name: str) -> Locator:
        parent = self.category_item_by_name(name)
        return parent.get_by_test_id("category-delete-btn")

    def _subcategory_delete_btn(self, name: str) -> Locator:
        parent = self.subcategory_item_by_name(name)
        return parent.get_by_test_id("subcategory-delete-btn")

    def _delete_photo_btn(self, photo_id: int) -> Locator:
        return self.page.get_by_test_id(f"photo-card-delete-{photo_id}")

    def photo_img(self, photo_id: int) -> Locator:
        return self.page.get_by_test_id(f"photo-img-{photo_id}")

    def photo_by_alt(self, alt_text: str) -> Locator:
        return self.page.get_by_alt_text(alt_text)

    @allure.step("Открыть галерею")
    async def goto(self) -> None:
        await self.page.goto(self.URL_PATH)

    @allure.step("Удалить фото")
    async def delete_photo(self, photo_id: int) -> None:
        await self._delete_photo_btn(photo_id).click()
        await self.photo_img(photo_id).wait_for(state=STATE_DETACHED, timeout=TIMEOUT_5S)

    @allure.step("Поиск фото по тексту: {search_query}")
    async def search_photo(self, search_query: str) -> None:
        await self.search_input.fill(search_query)

    @allure.step("Очистить поиск")
    async def clear_search(self) -> None:
        await self.search_clear_btn.wait_for(state=STATE_VISIBLE, timeout=TIMEOUT_3S)
        await self.search_clear_btn.click()

    @allure.step("Выбрать категорию по имени: {name}")
    async def select_category_by_name(self, name: str) -> None:
        category = self.category_item_by_name(name)
        aria_expanded = await category.get_attribute("aria-expanded")

        if aria_expanded == "false":
            await category.click()
            await self.subcategory_list.wait_for(state=STATE_VISIBLE, timeout=TIMEOUT_5S)
        elif not aria_expanded:
            await category.click()

    @allure.step("Выбрать подкатегорию по имени: {name}")
    async def select_subcategory_by_name(self, name: str) -> None:
        await self.subcategory_item_by_name(name).click()

    @allure.step("Удалить категорию: {name}")
    async def delete_category(self, name: str) -> None:
        await self._category_delete_btn(name).click()

    @allure.step("Удалить подкатегорию: {name}")
    async def delete_subcategory(self, name: str) -> None:
        await self._subcategory_delete_btn(name).click()

    @allure.step("Открыть фото: {alt_text}")
    async def open_photo_by_alt(self, alt_text: str) -> None:
        await self.page.get_by_alt_text(alt_text).click()
