from __future__ import annotations

import requests

from src.api.comment_api import CommentApi
from src.utils.constants import DEFAULT_ANSWER_TIME_MS
from src.utils.models import CaptchaData, CaptchaResponse

_NUMBERS: dict[str, int] = {
    "ноль": 0,
    "один": 1,
    "два": 2,
    "три": 3,
    "четыре": 4,
    "пять": 5,
    "шесть": 6,
    "семь": 7,
    "восемь": 8,
    "девять": 9,
    "десять": 10,
    "одиннадцать": 11,
    "двенадцать": 12,
    "тринадцать": 13,
    "четырнадцать": 14,
    "пятнадцать": 15,
    "шестнадцать": 16,
    "семнадцать": 17,
    "восемнадцать": 18,
    "девятнадцать": 19,
    "двадцать": 20,
}


class CaptchaHelper:
    def __init__(self, session: requests.Session) -> None:
        self._comment_api = CommentApi(session)

    def solve_captcha(self, answer_time_ms: int = DEFAULT_ANSWER_TIME_MS) -> CaptchaData:
        response = self._comment_api.get_captcha()
        captcha = CaptchaResponse.model_validate(response.json())
        answer = self._solve(captcha.question)
        return CaptchaData(sessionId=captcha.sessionId, answer=answer, answerTimeMs=answer_time_ms)

    def _solve(self, question: str) -> int:
        q = question.lower().replace("?", "").replace("сколько будет ", "").strip()
        words = q.split()

        if len(words) < 3:
            raise ValueError(f'[CaptchaHelper] неожиданный формат вопроса: "{question}"')

        a = _NUMBERS.get(words[0])
        b = _NUMBERS.get(words[-1])
        op = words[1]

        if a is None or b is None:
            raise ValueError(f'[CaptchaHelper] неизвестное число в вопросе: "{question}"')

        match op:
            case "плюс":
                return a + b
            case "минус":
                return a - b
            case "умножить":
                return a * b
            case _:
                raise ValueError(
                    f'[CaptchaHelper] неизвестный оператор: "{op}" в вопросе: "{question}"'
                )
