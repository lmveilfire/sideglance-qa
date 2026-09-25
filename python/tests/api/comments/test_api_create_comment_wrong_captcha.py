import allure
import pytest

from src.helpers.helpers import create_photo_with_category
from src.utils.constants import HTTP
from src.utils.generators import Generate


@pytest.mark.api
@allure.title("Защита от ботов: ошибка 400 Bad Request при отправке неверного ответа на капчу")
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
    assert response.json()["error"]
