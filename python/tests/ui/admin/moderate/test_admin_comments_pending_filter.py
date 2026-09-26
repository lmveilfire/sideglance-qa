import allure
from playwright.async_api import expect

from src.helpers.helpers import create_photo_with_category
from src.utils.generators import Generate
from src.utils.models import CommentDto


@allure.title("Фильтр 'Ожидающие' отображает только немодерированные комментарии")
async def test_admin_comments_pending_filter(
    moderate_comments_page,
    category_client,
    photo_client,
    captcha_helper,
    comment_client,
    ui_auth_helper,
) -> None:

    photo, _ = create_photo_with_category(category_client, photo_client)

    created_comments: list[CommentDto] = []

    for _ in range(3):
        captcha = captcha_helper.solve_captcha()
        comment = comment_client.create_in_isolation(Generate.comment_data(photo.id), captcha)
        created_comments.append(comment)

    comment_to_approve = created_comments[0]
    comment_to_reject = created_comments[1]
    comment_to_keep_pending = created_comments[2]

    await ui_auth_helper.login_as_admin()
    await moderate_comments_page.goto()
    await moderate_comments_page.wait_for_comment_is_visible(comment_to_approve.id)
    await moderate_comments_page.approve_comment(comment_to_approve.id)

    await moderate_comments_page.wait_for_comment_is_visible(comment_to_reject.id)
    await moderate_comments_page.reject_comment(comment_to_reject.id)

    await moderate_comments_page.filter_pending()

    await expect(moderate_comments_page.comment_item(comment_to_keep_pending.id)).to_be_visible()
    await expect(moderate_comments_page.comment_item(comment_to_approve.id)).not_to_be_visible()
    await expect(moderate_comments_page.comment_item(comment_to_reject.id)).not_to_be_visible()
