from __future__ import annotations

from typing import Literal, TypedDict

from typing_extensions import NotRequired

CommentStatus = Literal["APPROVED", "REJECTED", "PENDING"]


class CaptchaResponse(TypedDict):
    sessionId: str
    question: str


class CaptchaData(TypedDict):
    sessionId: str
    answer: int
    answerTimeMs: NotRequired[int]


class CategoryDto(TypedDict):
    id: int
    name: str


class SubcategoryDto(TypedDict):
    id: int
    name: str
    categoryId: int


class LoginPayload(TypedDict):
    username: str
    password: str


class AuthResponse(TypedDict):
    accessToken: str
    refreshToken: str
    username: str


class PhotoDto(TypedDict):
    id: int
    title: str
    author: str
    url: str
    fullUrl: str
    place: NotRequired[str]
    categoryName: NotRequired[str]
    subcategoryName: NotRequired[str]
    likes: int
    views: int
    createdAt: str
    takenAt: NotRequired[str]
    categoryId: NotRequired[int]
    subcategoryId: NotRequired[int]


class CommentDto(TypedDict):
    id: int
    author: str
    text: str
    createdAt: str
    photoId: int


class CommentsPageResponse(TypedDict):
    comments: list[CommentDto]
    hasMore: bool
    totalCount: int
    page: int


class AdminCommentDto(TypedDict):
    id: int
    author: str
    text: str
    createdAt: str
    photoId: int
    status: CommentStatus
    rejectionReason: NotRequired[str]


class AdminCommentsPageResponse(TypedDict):
    comments: list[AdminCommentDto]
    hasMore: bool
    totalCount: int
    page: int


class CommentStatsDto(TypedDict):
    total: int
    pending: int
    approved: int
    rejected: int


class PhotoPayload(TypedDict):
    title: str
    author: str
    place: str
    takenAt: NotRequired[str]
    categoryId: NotRequired[int]
    subcategoryId: NotRequired[int]


class CommentPayload(TypedDict):
    author: str
    text: str
    photoId: int
    honeypot: NotRequired[str]


class CategoryPayload(TypedDict):
    name: str
