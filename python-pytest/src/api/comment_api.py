from __future__ import annotations

import requests

from src.utils.constants import API_URL, DEFAULT_ANSWER_TIME_MS
from src.utils.headers import merge_headers
from src.utils.types import CaptchaData, CommentPayload


class CommentApi:
    def __init__(self, session: requests.Session) -> None:
        self._session = session

    def get_captcha(self) -> requests.Response:
        return self._session.get(f"{API_URL}/api/comments/captcha", timeout=10)

    def get_comments(self, photo_id: int, page: int = 0, size: int = 5) -> requests.Response:
        return self._session.get(
            f"{API_URL}/api/comments",
            params={"photoId": photo_id, "page": page, "size": size},
            timeout=10,
        )

    def create(
        self,
        payload: CommentPayload,
        captcha: CaptchaData,
        custom_headers: dict[str, str] | None = None,
    ) -> requests.Response:
        answer_time_ms = captcha.get("answerTimeMs", DEFAULT_ANSWER_TIME_MS)
        headers = merge_headers(
            {
                "X-Captcha-Session-Id": captcha["sessionId"],
                "X-Captcha-Answer": str(captcha["answer"]),
                "X-Answer-Time-Ms": str(answer_time_ms),
                **(custom_headers or {}),
            }
        )
        return self._session.post(
            f"{API_URL}/api/comments",
            json=dict(payload),
            headers=headers,
            timeout=10,
        )
