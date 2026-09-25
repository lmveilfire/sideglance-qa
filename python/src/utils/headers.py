from __future__ import annotations

API_HEADERS: dict[str, str] = {"Content-Type": "application/json"}


def merge_headers(custom: dict[str, str] | None = None) -> dict[str, str]:
    return {**API_HEADERS, **(custom or {})}
