from __future__ import annotations

import random
from datetime import date
from pathlib import Path
from typing import Any, cast

from faker import Faker

from src.utils.types import CategoryPayload, CommentPayload, PhotoPayload

_fake = Faker()

_FIXTURES_IMAGES_DIR = Path(__file__).resolve().parents[2] / "src" / "fixtures" / "images"


class Generate:
    @staticmethod
    def photo_data(**overrides: Any) -> PhotoPayload:
        base: PhotoPayload = {
            "title": f"TEST-{' '.join(_fake.words(nb=random.randint(2, 4)))}",
            "author": _fake.name(),
            "place": _fake.city(),
            "takenAt": cast(
                date, _fake.date_between(start_date="-2y", end_date="today")
            ).isoformat(),
        }
        return cast(PhotoPayload, {**base, **overrides})

    @staticmethod
    def comment_data(photo_id: int, **overrides: Any) -> CommentPayload:
        base: CommentPayload = {
            "author": f"TEST-{_fake.user_name()}",
            "text": _fake.paragraph(nb_sentences=random.randint(1, 3)),
            "photoId": photo_id,
        }
        return cast(CommentPayload, {**base, **overrides})

    @staticmethod
    def category_data(**overrides: Any) -> CategoryPayload:
        base: CategoryPayload = {"name": f"TEST-{'-'.join(_fake.words(nb=2)).lower()}"}
        return cast(CategoryPayload, {**base, **overrides})

    @staticmethod
    def ip() -> str:
        return _fake.ipv4()

    @staticmethod
    def fixture_path(filename: str = "test-image.jpg") -> str:
        return str(_FIXTURES_IMAGES_DIR / filename)
