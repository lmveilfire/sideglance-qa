import allure
import pytest

from src.helpers.photo_helpers import create_photo_with_category
from src.utils.constants import HTTP
from src.utils.generators import Generate


@pytest.mark.api
@allure.title("Комментарии: отклонение запроса при отправке неверного математического ответа капчи")
def test_api_create_comment_wrong_captcha(
    photo_client, comment_api, captcha_helper, category_client
) -> None:
    invalid_captcha_answer = 999
    photo, _ = create_photo_with_category(category_client, photo_client)
    captcha = captcha_helper.solve_captcha()

    wrong_captcha = captcha.model_copy(update={"answer": captcha.answer + invalid_captcha_answer})

    response = comment_api.create(
        Generate.comment_data(photo.id),
        wrong_captcha,
        custom_headers={"X-Forwarded-For": Generate.ip()},
    )

    assert response.status_code == HTTP.BAD_REQUEST
