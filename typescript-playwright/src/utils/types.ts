export type CommentStatus = 'APPROVED' | 'REJECTED' | 'PENDING';

export interface CaptchaResponse {
  sessionId: string;
  question: string;
}

export interface CaptchaData {
  sessionId: string;
  answer: number;
  answerTimeMs?: number;
}

export interface CategoryDto {
  id: number;
  name: string;
}

export interface SubcategoryDto {
  id: number;
  name: string;
  categoryId: number;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
}

export interface PhotoDto {
  id: number;
  title: string;
  author: string;
  url: string;
  fullUrl: string;
  place?: string;
  categoryName?: string;
  subcategoryName?: string;
  likes: number;
  views: number;
  createdAt: string;
  takenAt?: string;
  categoryId?: number;
  subcategoryId?: number;
}

export interface CommentDto {
  id: number;
  author: string;
  text: string;
  createdAt: string;
  photoId: number;
}

export interface CommentsPageResponse {
  comments: CommentDto[];
  hasMore: boolean;
  totalCount: number;
  page: number;
}

export interface AdminCommentDto {
  id: number;
  author: string;
  text: string;
  createdAt: string;
  photoId: number;
  status: CommentStatus;
  rejectionReason?: string;
}

export interface AdminCommentsPageResponse {
  comments: AdminCommentDto[];
  hasMore: boolean;
  totalCount: number;
  page: number;
}

export interface CommentStatsDto {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface PhotoPayload {
    title: string;
    author: string;
    place?: string;
    takenAt?: string;
    categoryId?: number;
    subcategoryId?: number;
}

export interface CommentPayload {
    author: string;
    text: string;
    photoId: number;
    honeypot?: string;
}

export interface CategoryPayload {
    name: string;
}