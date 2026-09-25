import allure
import pytest

from src.helpers.helpers import create_photo_with_category
from src.utils.constants import DEFAULT_COMMENT_PAGE_SIZE, DEFAULT_START_PAGE
from src.utils.models import CommentsPageResponse


@pytest.mark.api
@allure.title("Получение списка комментариев к фото: проверка структуры пагинации бэкенда")
def test_api_get_comments_pagination(photo_client, comment_client, category_client) -> None:
    photo, _ = create_photo_with_category(category_client, photo_client)
    page: CommentsPageResponse = comment_client.list_by_photo(
        photo.id, page=DEFAULT_START_PAGE, size=DEFAULT_COMMENT_PAGE_SIZE
    )

    assert len(page.comments) == 0
    assert page.page == 0
