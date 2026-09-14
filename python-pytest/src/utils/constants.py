from __future__ import annotations

import os


def _get_env_var(name: str) -> str:
    value = os.environ.get(name)
    if value is None:
        raise RuntimeError(f'Required env variable "{name}" is not set')
    return value


API_URL: str = os.getenv("API_URL", "http://localhost:8080")

ADMIN_USERNAME: str = _get_env_var("TEST_ADMIN_USERNAME")
ADMIN_PASSWORD: str = _get_env_var("TEST_ADMIN_PASSWORD")


class HTTP:
    OK = 200
    CREATED = 201
    NO_CONTENT = 204
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    FORBIDDEN = 403
    NOT_FOUND = 404
    TOO_MANY_REQUESTS = 429
    INTERNAL_ERROR = 500


INVALID_TOKEN: str = (
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjo5OTk5OTk5OTk5fQ.invalid-signature"
)

DEFAULT_ANSWER_TIME_MS: int = 3000
