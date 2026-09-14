from __future__ import annotations

import requests

from src.api.comment_api import CommentApi
from src.utils.constants import DEFAULT_ANSWER_TIME_MS
from src.utils.types import CaptchaData, CaptchaResponse

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
        captcha: CaptchaResponse = response.json()
        answer = self._solve(captcha["question"])
        return {"sessionId": captcha["sessionId"], "answer": answer, "answerTimeMs": answer_time_ms}

    def _solve(self, question: str) -> int:
        q = question.lower().replace("?", "").replace("сколько будет ", "")
        words = q.split(" ")
        a = _NUMBERS.get(words[0] if words else "", 0)
        op = words[1] if len(words) > 1 else None
        b = _NUMBERS.get(words[-1] if words else "", 0)

        if op == "плюс":
            return a + b
        if op == "минус":
            return a - b
        if op == "умножить":
            return a * b

        raise ValueError(f'[CaptchaHelper] неизвестный оператор: "{op}" в вопросе: "{question}"')
