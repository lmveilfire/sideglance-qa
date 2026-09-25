import allure
import pytest

from src.helpers.helpers import create_photo_with_category
from src.utils.constants import HTTP
from src.utils.generators import Generate


@pytest.mark.api
@allure.title(
    "Защита от Replay: повторное использование одного sessionId возвращает 400 Bad Request"
)
def test_api_create_comment_duplicate_session(
    photo_client, comment_api, captcha_helper, category_client
) -> None:
    error_message = "Неверный ответ на вопрос капчи"
    isolated_ip = Generate.ip()
    custom_headers = {"X-Forwarded-For": isolated_ip}
    photo, _ = create_photo_with_category(category_client, photo_client)
    captcha = captcha_helper.solve_captcha()

    first = comment_api.create(
        Generate.comment_data(photo.id), captcha, custom_headers=custom_headers
    )
    assert first.status_code == HTTP.CREATED

    second = comment_api.create(
        Generate.comment_data(photo.id), captcha, custom_headers=custom_headers
    )
    assert second.status_code == HTTP.BAD_REQUEST
    assert second.json()["error"] == error_message
