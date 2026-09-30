import allure
import pytest

from src.helpers.comment_helper import create_comment_list
from src.helpers.photo_helpers import create_photo_with_category
from src.utils.models import CommentsPageResponse


@pytest.mark.api
@allure.title("Комментарии: пагинация корректно разбивает список комментариев на страницы")
def test_api_get_comments_pagination(
    photo_client, comment_client, captcha_helper, category_client, admin_comment_client
) -> None:
    page_size = 5
    comments_total = 7

    photo, _ = create_photo_with_category(category_client, photo_client)

    create_comment_list(
        photo.id, comment_client, captcha_helper, admin_comment_client, count=comments_total
    )

    first_page: CommentsPageResponse = comment_client.list_by_photo(
        photo.id, page=0, size=page_size
    )
    assert len(first_page.comments) == page_size
    assert first_page.totalCount == comments_total
    assert first_page.hasMore is True

    second_page: CommentsPageResponse = comment_client.list_by_photo(
        photo.id, page=1, size=page_size
    )
    assert len(second_page.comments) == comments_total - page_size
    assert second_page.hasMore is False

    ids_first = {c.id for c in first_page.comments}
    ids_second = {c.id for c in second_page.comments}
    intersecting = ids_first & ids_second

    with allure.step("Проверить, что страницы пагинации не пересекаются"):
        assert len(intersecting) == 0, (
            f"Обнаружено {len(intersecting)} общих ID: {sorted(intersecting)}"
        )
