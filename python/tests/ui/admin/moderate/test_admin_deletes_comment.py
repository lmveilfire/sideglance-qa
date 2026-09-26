import allure
import pytest
from playwright.async_api import expect

from src.helpers.helpers import create_photo_with_category
from src.utils.generators import Generate


@pytest.mark.ui
@allure.title("Удаление комментария администратором в панели модерации")
async def test_admin_deletes_comment(
    moderate_comments_page,
    category_client,
    photo_client,
    captcha_helper,
    comment_client,
    ui_auth_helper,
) -> None:

    photo, _ = create_photo_with_category(category_client, photo_client)
    captcha = captcha_helper.solve_captcha()
    created = comment_client.create_in_isolation(Generate.comment_data(photo.id), captcha)

    await ui_auth_helper.login_as_admin()
    await moderate_comments_page.goto()
    await moderate_comments_page.filter_pending()
    await moderate_comments_page.wait_for_comment_is_visible(created.id)
    await moderate_comments_page.delete_comment(created.id)

    await expect(moderate_comments_page.comment_by_text(created.id)).not_to_be_visible()
