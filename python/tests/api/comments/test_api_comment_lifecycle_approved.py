import allure
import pytest

from src.helpers.helpers import create_photo_with_category
from src.utils.constants import DEFAULT_START_PAGE, MAX_COMMENT_PAGE_SIZE
from src.utils.generators import Generate
from src.utils.models import CommentStatus


@pytest.mark.api
@allure.title("Полный цикл одобрения комментария: отправка, модерация APPROVED и публикация")
def test_api_comment_lifecycle_approved(
    photo_client,
    comment_client,
    captcha_helper,
    admin_comment_client,
    category_client,
) -> None:
    photo, _ = create_photo_with_category(category_client, photo_client)

    captcha = captcha_helper.solve_captcha()
    created = comment_client.create_in_isolation(Generate.comment_data(photo.id), captcha)

    moderated = admin_comment_client.moderate(created.id, CommentStatus.APPROVED)
    assert moderated.status == CommentStatus.APPROVED

    page = comment_client.list_by_photo(photo.id, DEFAULT_START_PAGE, MAX_COMMENT_PAGE_SIZE)

    assert any(c.id == created.id for c in page.comments), (
        "APPROVED комментарий должен быть виден публично"
    )

    admin_comment_client.delete(created.id)
