from __future__ import annotations

import requests


def assert_status(response: requests.Response, context: str, *expected: int) -> None:
    if response.status_code not in expected:
        raise RuntimeError(f"[{context}] failed: {response.status_code} {response.text}")
