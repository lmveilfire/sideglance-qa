from __future__ import annotations

import requests

from src.api.auth_api import AuthApi
from src.utils.constants import ADMIN_PASSWORD, ADMIN_USERNAME


class AuthHelper:
    def __init__(self, session: requests.Session) -> None:
        self._auth_api = AuthApi(session)

    def get_admin_token(self) -> str:
        return self._auth_api.get_token(ADMIN_USERNAME, ADMIN_PASSWORD)

    def get_admin_headers(self) -> dict[str, str]:
        return self._auth_api.get_auth_headers(ADMIN_USERNAME, ADMIN_PASSWORD)
