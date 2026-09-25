import allure
from playwright.async_api import Locator, Page

from src.pages.base_page import BasePage
from src.utils.constants import STATE_VISIBLE


class ModerateCommentsPage(BasePage):
    URL_PATH = "/admin-panel/comments"

    def __init__(self, page: Page):
        super().__init__(page)

    @property
    def approved_comments_filter_btn(self) -> Locator:
        return self.page.get_by_test_id("filter-approved")

    @property
    def rejected_comments_filter_btn(self) -> Locator:
        return self.page.get_by_test_id("filter-rejected")

    @property
    def pending_comments_filter_btn(self) -> Locator:
        return self.page.get_by_test_id("filter-pending")

    def _comment_approve_btn(self, comment_id: int) -> Locator:
        return self.page.get_by_test_id(f"comment-approve-{comment_id}")

    def _comment_reject_btn(self, comment_id: int) -> Locator:
        return self.page.get_by_test_id(f"comment-reject-{comment_id}")

    def _comment_delete_btn(self, comment_id: int) -> Locator:
        return self.page.get_by_test_id(f"comment-delete-{comment_id}")

    def comment_item(self, comment_id: int) -> Locator:
        return self.page.get_by_test_id(f"comment-{comment_id}")

    def comment_by_text(self, text: str) -> Locator:
        return self.page.locator('[data-testid^="comment-text-"]').filter(has_text=text)

    @allure.step("Открыть страницу комментариев в админ-панели")
    async def goto(self) -> None:
        await self.page.goto(self.URL_PATH)

    @allure.step("Фильтр: одобренные комментарии")
    async def filter_approved(self) -> None:
        await self.approved_comments_filter_btn.click()

    @allure.step("Фильтр: отклонённые комментарии")
    async def filter_rejected(self) -> None:
        await self.rejected_comments_filter_btn.click()

    @allure.step("Фильтр: ожидающие комментарии")
    async def filter_pending(self) -> None:
        await self.pending_comments_filter_btn.click()

    @allure.step("Одобрить комментарий ID: {comment_id}")
    async def approve_comment(self, comment_id: int) -> None:
        await self._comment_approve_btn(comment_id).click()

    @allure.step("Отклонить комментарий ID: {comment_id}")
    async def reject_comment(self, comment_id: int) -> None:
        await self._comment_reject_btn(comment_id).click()

    @allure.step("Удалить комментарий ID: {comment_id}")
    async def delete_comment(self, comment_id: int) -> None:
        await self._comment_delete_btn(comment_id).click()

    @allure.step("Дождаться отображения комментария ID: {comment_id}")
    async def wait_for_comment_is_visible(self, comment_id: int) -> None:
        await self.comment_item(comment_id).wait_for(state=STATE_VISIBLE)
