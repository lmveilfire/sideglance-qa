import allure
import pytest

from src.helpers.helpers import create_photo_with_category
from src.utils.constants import HTTP
from src.utils.generators import Generate


@pytest.mark.api
@allure.title(
    "Защита от ботов: ошибка 400 Bad Request при слишком быстром ответе (роботизированный ввод)"
)
def test_api_create_comment_too_fast(
    photo_client, comment_api, captcha_helper, category_client, comment_client
) -> None:
    too_fast_bot_answer_time_ms = 100
    photo, _ = create_photo_with_category(category_client, photo_client)

    captcha = captcha_helper.solve_captcha(too_fast_bot_answer_time_ms)

    response = comment_api.create(
        Generate.comment_data(photo.id),
        captcha,
        custom_headers={"X-Forwarded-For": Generate.ip()},
    )

    assert response.status_code == HTTP.BAD_REQUEST
    assert response.json()["error"]
