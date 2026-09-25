import allure
import pytest

from src.helpers.helpers import create_photo_with_category
from src.utils.constants import DEFAULT_START_PAGE, MAX_COMMENT_PAGE_SIZE
from src.utils.generators import Generate


@pytest.mark.api
@allure.title("Изоляция контента: комментарии в статусе PENDING скрыты из публичного API фото")
def test_api_comment_pending_isolation(
    photo_client,
    comment_client,
    captcha_helper,
    admin_comment_client,
    category_client,
) -> None:
    photo, _ = create_photo_with_category(category_client, photo_client)

    captcha = captcha_helper.solve_captcha()
    created = comment_client.create_in_isolation(Generate.comment_data(photo.id), captcha)

    page = comment_client.list_by_photo(photo.id, DEFAULT_START_PAGE, MAX_COMMENT_PAGE_SIZE)

    assert not any(c.id == created.id for c in page.comments), (
        "PENDING комментарий не должен быть виден публично"
    )

    admin_comment_client.delete(created.id)
