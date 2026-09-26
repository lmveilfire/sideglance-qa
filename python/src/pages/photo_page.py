import allure
from playwright.async_api import Locator, Page

from src.pages.base_page import BasePage
from src.utils.constants import STATE_VISIBLE


class PhotoPage(BasePage):
    URL_PATH = "/photo"

    def __init__(self, page: Page):
        super().__init__(page)

    @property
    def photo(self) -> Locator:
        return self.page.get_by_test_id("photo-img-large")

    @property
    def like_btn(self) -> Locator:
        return self.page.get_by_test_id("photo-like-btn")

    @property
    def views_count(self) -> Locator:
        return self.page.get_by_test_id("photo-views-count")

    @property
    def carousel_next_btn(self) -> Locator:
        return self.page.get_by_test_id("carousel-next-btn")

    @property
    def carousel_prev_btn(self) -> Locator:
        return self.page.get_by_test_id("carousel-prev-btn")

    @property
    def comments_empty_state(self) -> Locator:
        return self.page.get_by_test_id("comments-empty-state")

    @property
    def photo_meta(self) -> Locator:
        return self.page.get_by_test_id("photo-meta")

    @property
    def carousel_counter(self) -> Locator:
        return self.page.get_by_test_id("carousel-counter")

    @property
    def carousel_counter_current(self) -> Locator:
        return self.page.get_by_test_id("carousel-counter-current")

    @property
    def photo_title(self) -> Locator:
        return self.page.get_by_test_id("photo-title")

    @property
    def photo_place(self) -> Locator:
        return self.page.get_by_test_id("photo-place")

    @property
    def photo_date(self) -> Locator:
        return self.page.get_by_test_id("photo-date")

    @property
    def lightbox(self) -> Locator:
        return self.page.get_by_test_id("lightbox")

    @property
    def close_lightbox_btn(self) -> Locator:
        return self.page.get_by_test_id("close-lightbox-btn")

    def comment_item(self, comment_id: int) -> Locator:
        return self.page.get_by_test_id(f"comment-item-{comment_id}")

    def comment_by_author(self, author: str) -> Locator:
        return self.page.locator('[data-testid^="comment-author-"]').filter(has_text=author)

    def comment_by_text(self, text: str) -> Locator:
        return self.page.locator('[data-testid^="comment-text-"]').filter(has_text=text)

    def photo_by_alt(self, alt: str) -> Locator:
        return self.page.get_by_alt_text(alt)

    @allure.step("Открыть страницу фото с ID: {photo_id}")
    async def open(self, photo_id: int) -> None:
        await self.page.goto(f"{self.URL_PATH}/{photo_id}")

    @allure.step("Перейти к следующему фото")
    async def go_next(self) -> None:
        await self.carousel_next_btn.click()

    @allure.step("Перейти к предыдущему фото")
    async def go_prev(self) -> None:
        await self.carousel_prev_btn.click()

    @allure.step("Дождаться отображения комментария: {comment_id}")
    async def wait_for_comment_is_visible(self, comment_id: int) -> None:
        await self.comment_item(comment_id).wait_for(state=STATE_VISIBLE)
