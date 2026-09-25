from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, ConfigDict


class CommentStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class ApiModel(BaseModel):
    model_config = ConfigDict()


class CaptchaResponse(ApiModel):
    sessionId: str
    question: str


class CaptchaData(ApiModel):
    sessionId: str
    answer: int
    answerTimeMs: int | None = None


class CategoryDto(ApiModel):
    id: int
    name: str


class SubcategoryDto(ApiModel):
    id: int
    name: str
    categoryId: int


class LoginPayload(ApiModel):
    username: str
    password: str


class AuthResponse(ApiModel):
    accessToken: str
    refreshToken: str
    username: str


class PhotoDto(ApiModel):
    id: int
    title: str
    author: str
    url: str
    fullUrl: str
    place: str | None = None
    categoryName: str | None = None
    subcategoryName: str | None = None
    likes: int
    views: int
    createdAt: str
    takenAt: str | None = None
    categoryId: int | None = None
    subcategoryId: int | None = None


class CommentDto(ApiModel):
    id: int
    author: str
    text: str
    createdAt: str
    photoId: int


class CommentsPageResponse(ApiModel):
    comments: list[CommentDto]
    hasMore: bool
    totalCount: int
    page: int


class AdminCommentDto(ApiModel):
    id: int
    author: str
    text: str
    createdAt: str
    photoId: int
    status: CommentStatus
    rejectionReason: str | None = None


class AdminCommentsPageResponse(ApiModel):
    comments: list[AdminCommentDto]
    hasMore: bool
    totalCount: int
    page: int


class CommentStatsDto(ApiModel):
    total: int
    pending: int
    approved: int
    rejected: int


class PhotoPayload(ApiModel):
    title: str
    author: str
    place: str
    takenAt: str | None = None
    categoryId: int | None = None
    subcategoryId: int | None = None


class CommentPayload(ApiModel):
    author: str
    text: str
    photoId: int
    honeypot: str | None = None


class CategoryPayload(ApiModel):
    name: str


class LikeResult(ApiModel):
    totalLikes: int
    newlyLiked: bool
    message: str | None = None
