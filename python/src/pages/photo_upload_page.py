import allure
from playwright.async_api import Locator, Page

from src.pages.base_page import BasePage
from src.utils.constants import STATE_DETACHED, TIMEOUT_5S


class PhotoUploadPage(BasePage):
    URL_PATH = "/admin-panel/upload"
    CREATE_NEW_VALUE = "+new"

    def __init__(self, page: Page):
        super().__init__(page)

    @property
    def upload_tab(self) -> Locator:
        return self.page.get_by_test_id("upload-tab")

    @property
    def photo_upload_btn(self) -> Locator:
        return self.page.get_by_test_id("photo-upload-btn")

    @property
    def title_input(self) -> Locator:
        return self.page.get_by_test_id("title-input")

    @property
    def author_input(self) -> Locator:
        return self.page.get_by_test_id("author-input")

    @property
    def category_select(self) -> Locator:
        return self.page.get_by_test_id("category-select")

    @property
    def subcategory_select(self) -> Locator:
        return self.page.get_by_test_id("subcategory-select")

    @property
    def new_category_input(self) -> Locator:
        return self.page.get_by_test_id("new-category-input")

    @property
    def create_category_btn(self) -> Locator:
        return self.page.get_by_test_id("create-category-btn")

    @property
    def cancel_category_btn(self) -> Locator:
        return self.page.get_by_test_id("cancel-category-btn")

    @property
    def place_input(self) -> Locator:
        return self.page.get_by_test_id("place-input")

    @property
    def taken_at_input(self) -> Locator:
        return self.page.get_by_test_id("taken-at-input")

    @property
    def upload_form_submit(self) -> Locator:
        return self.page.get_by_test_id("upload-form-submit")

    @property
    def new_subcategory_input(self) -> Locator:
        return self.page.get_by_test_id("new-subcategory-input")

    @property
    def create_subcategory_btn(self) -> Locator:
        return self.page.get_by_test_id("create-subcategory-btn")

    @property
    def cancel_subcategory_btn(self) -> Locator:
        return self.page.get_by_test_id("cancel-subcategory-btn")

    @property
    def preview_image(self) -> Locator:
        return self.page.get_by_test_id("preview-image")

    @property
    def remove_preview_btn(self) -> Locator:
        return self.page.get_by_test_id("preview-remove-btn")

    @property
    def success_alert(self) -> Locator:
        return self.page.get_by_test_id("success-alert")

    @property
    def category_hint(self) -> Locator:
        return self.page.get_by_test_id("category-hint")

    @allure.step("Открыть страницу загрузки в админ-панели")
    async def goto(self) -> None:
        await self.page.goto(self.URL_PATH)

    @allure.step("Прикрепить фотографию: '{file_path}'")
    async def attach_photo(self, file_path: str) -> None:
        await self.photo_upload_btn.set_input_files(file_path)

    @allure.step("Заполнить заголовок: '{title}'")
    async def fill_title(self, title: str) -> None:
        await self.title_input.fill(title)

    @allure.step("Заполнить автора: '{author}'")
    async def fill_author(self, author: str) -> None:
        await self.author_input.fill(author)

    @allure.step("Заполнить дату съемки: '{date}'")
    async def fill_taken_at(self, date: str) -> None:
        await self.taken_at_input.fill(date)

    @allure.step("Создать новую категорию: '{name}'")
    async def create_new_category(self, name: str) -> None:
        await self.category_select.select_option(value=self.CREATE_NEW_VALUE)
        await self.new_category_input.fill(name)
        await self.create_category_btn.click()
        await self.new_category_input.wait_for(state=STATE_DETACHED, timeout=TIMEOUT_5S)

    @allure.step("Выбрать категорию по имени: '{name}'")
    async def select_category_by_name(self, name: str) -> None:
        await self.category_select.select_option(label=name)

    @allure.step("Отменить создание новой категории")
    async def cancel_new_category(self) -> None:
        await self.cancel_category_btn.click()
        await self.new_category_input.wait_for(state=STATE_DETACHED, timeout=TIMEOUT_5S)

    @allure.step("Создать новую подкатегорию: '{name}'")
    async def create_new_subcategory(self, name: str) -> None:
        await self.subcategory_select.select_option(value=self.CREATE_NEW_VALUE)
        await self.new_subcategory_input.fill(name)
        await self.create_subcategory_btn.click()
        await self.new_subcategory_input.wait_for(state=STATE_DETACHED, timeout=TIMEOUT_5S)

    @allure.step("Выбрать подкатегорию по имени: '{name}'")
    async def select_subcategory_by_name(self, name: str) -> None:
        await self.subcategory_select.select_option(label=name)

    @allure.step("Отменить создание новой подкатегории")
    async def cancel_new_subcategory(self) -> None:
        await self.cancel_subcategory_btn.click()
        await self.new_subcategory_input.wait_for(state=STATE_DETACHED, timeout=TIMEOUT_5S)

    @allure.step("Удалить превью фотографии")
    async def remove_photo(self) -> None:
        await self.remove_preview_btn.click()

    @allure.step("Отправить форму загрузки")
    async def submit_form(self) -> None:
        await self.upload_form_submit.click()
