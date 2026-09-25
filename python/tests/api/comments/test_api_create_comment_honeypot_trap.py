import allure
import pytest

from src.helpers.helpers import create_photo_with_category
from src.utils.constants import DEFAULT_START_PAGE, HTTP, MAX_COMMENT_PAGE_SIZE
from src.utils.generators import Generate


@pytest.mark.api
@allure.title(
    "Ловушка для спамеров: скрытое отклонение (200 OK без сохранения в базу) при заполнении поля honeypot"
)
def test_api_create_comment_honeypot_trap(
    photo_client, comment_api, comment_client, captcha_helper, category_client
) -> None:
    honeypot_bot_marker = "bot-value"
    expected_empty_database_count = 0
    photo, _ = create_photo_with_category(category_client, photo_client)
    captcha = captcha_helper.solve_captcha()

    payload = Generate.comment_data(photo.id).model_copy(update={"honeypot": honeypot_bot_marker})
    response = comment_api.create(payload, captcha)

    assert response.status_code == HTTP.OK

    page = comment_client.list_by_photo(photo.id, DEFAULT_START_PAGE, MAX_COMMENT_PAGE_SIZE)
    assert page.totalCount == expected_empty_database_count
