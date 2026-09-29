import allure
import pytest


@pytest.mark.api
@allure.title("Комментарии: успешная генерация капчи и проверка структуры ответа по контракту")
def test_api_get_captcha(comment_client) -> None:
    comment_client.get_captcha()
