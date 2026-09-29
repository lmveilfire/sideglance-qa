import allure
import pytest
from playwright.async_api import expect

from src.helpers.comment_helper import create_comment_list
from src.helpers.photo_helpers import create_photo_with_category


@pytest.mark.ui
@allure.title("Фильтр 'Отклонённые' отображает только отклонённые комментарии")
async def test_admin_filters_rejected_comments(
    moderate_comments_page,
    category_client,
    photo_client,
    captcha_helper,
    comment_client,
    ui_auth_helper,
) -> None:

    photo, _ = create_photo_with_category(category_client, photo_client)

    comment_to_approve, comment_to_reject, comment_to_keep_pending = create_comment_list(
        photo.id, comment_client, captcha_helper
    )

    await ui_auth_helper.login_as_admin()
    await moderate_comments_page.goto()
    await moderate_comments_page.filter_pending()

    await moderate_comments_page.wait_for_comment_is_visible(comment_to_approve.id)
    await moderate_comments_page.approve_comment(comment_to_approve.id)

    await moderate_comments_page.wait_for_comment_is_visible(comment_to_reject.id)
    await moderate_comments_page.reject_comment(comment_to_reject.id)

    await moderate_comments_page.filter_rejected()

    await expect(moderate_comments_page.comment_item(comment_to_approve.id)).not_to_be_visible()
    await expect(
        moderate_comments_page.comment_item(comment_to_keep_pending.id)
    ).not_to_be_visible()
    await expect(moderate_comments_page.comment_item(comment_to_reject.id)).to_be_visible()
