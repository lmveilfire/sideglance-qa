import allure
import pytest

from src.utils.models import CaptchaResponse


@pytest.mark.api
@allure.title("Успешное получение капчи: проверка генерации sessionId и текста вопроса")
def test_api_get_captcha(comment_client) -> None:

    body: CaptchaResponse = comment_client.get_captcha()

    assert len(body.sessionId) > 0
    assert len(body.question) > 0
