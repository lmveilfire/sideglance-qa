from __future__ import annotations

import functools
from collections.abc import Callable
from typing import ParamSpec, TypeVar

import allure

P = ParamSpec("P")
R = TypeVar("R")


def step(title: str | None = None) -> Callable[[Callable[P, R]], Callable[P, R]]:
    def decorator(func: Callable[P, R]) -> Callable[P, R]:
        step_name = title or func.__qualname__

        @functools.wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
            with allure.step(step_name):
                return func(*args, **kwargs)

        return wrapper

    return decorator
