import { z } from 'zod';

const DateTimeString = z.string();

export const CommentStatusSchema = z.enum(['APPROVED', 'REJECTED', 'PENDING']);
export type CommentStatus = z.infer<typeof CommentStatusSchema>;

export const LoginPayloadSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export type LoginPayload = z.infer<typeof LoginPayloadSchema>;

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  username: z.string(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const CaptchaResponseSchema = z.object({
  sessionId: z.string(),
  question: z.string(),
});
export type CaptchaResponse = z.infer<typeof CaptchaResponseSchema>;

export const CaptchaDataSchema = z.object({
  sessionId: z.string(),
  answer: z.int(),
  answerTimeMs: z.int().optional(),
});
export type CaptchaData = z.infer<typeof CaptchaDataSchema>;

export const CategoryDtoSchema = z.object({
  id: z.int(),
  name: z.string(),
});
export type CategoryDto = z.infer<typeof CategoryDtoSchema>;
export const CategoryListSchema = z.array(CategoryDtoSchema);

export const CategoryPayloadSchema = z.object({
  name: z.string(),
});
export type CategoryPayload = z.infer<typeof CategoryPayloadSchema>;

export const SubcategoryDtoSchema = z.object({
  id: z.int(),
  name: z.string(),
  categoryId: z.int(),
});
export type SubcategoryDto = z.infer<typeof SubcategoryDtoSchema>;
export const SubcategoryListSchema = z.array(SubcategoryDtoSchema);

export const PhotoDtoSchema = z.object({
  id: z.int(),
  title: z.string(),
  author: z.string(),
  url: z.string(),
  fullUrl: z.string(),
  place: z.string().nullish(),
  categoryName: z.string().nullish(),
  subcategoryName: z.string().nullish(),
  likes: z.int(),
  views: z.int(),
  createdAt: z.string(),
  takenAt: z.string().nullish(),
  categoryId: z.int().nullish(),
  subcategoryId: z.int().nullish(),
});
export type PhotoDto = z.infer<typeof PhotoDtoSchema>;
export const PhotoListSchema = z.array(PhotoDtoSchema);

export const PhotoPayloadSchema = z.object({
  title: z.string(),
  author: z.string(),
  place: z.string(),
  takenAt: z.string().nullish(),
  categoryId: z.int().nullish(),
  subcategoryId: z.int().nullish(),
});
export type PhotoPayload = z.infer<typeof PhotoPayloadSchema>;

export const LikeResultSchema = z.object({
  totalLikes: z.int(),
  newlyLiked: z.boolean(),
  message: z.string().nullish(),
});
export type LikeResult = z.infer<typeof LikeResultSchema>;

export const CommentDtoSchema = z.object({
  id: z.int(),
  author: z.string(),
  text: z.string(),
  status: z.string().nullish(),
  createdAt: z.string(),
  photoId: z.int(),
});
export type CommentDto = z.infer<typeof CommentDtoSchema>;
export const CommentListSchema = z.array(CommentDtoSchema);

export const CommentPayloadSchema = z.object({
  author: z.string(),
  text: z.string(),
  photoId: z.int(),
  honeypot: z.string().nullish(),
});
export type CommentPayload = z.infer<typeof CommentPayloadSchema>;

export const CommentsPageResponseSchema = z.object({
  comments: z.array(CommentDtoSchema),
  hasMore: z.boolean(),
  totalCount: z.int(),
  page: z.int(),
});
export type CommentsPageResponse = z.infer<typeof CommentsPageResponseSchema>;

export const AdminCommentDtoSchema = z.object({
  id: z.int(),
  author: z.string(),
  text: z.string(),
  createdAt: DateTimeString,
  photoId: z.int(),
  status: CommentStatusSchema,
  rejectionReason: z.string().nullish(),
});
export type AdminCommentDto = z.infer<typeof AdminCommentDtoSchema>;

export const AdminCommentsPageResponseSchema = z.object({
  comments: z.array(AdminCommentDtoSchema),
  hasMore: z.boolean(),
  totalCount: z.int(),
  page: z.int(),
});
export type AdminCommentsPageResponse = z.infer<typeof AdminCommentsPageResponseSchema>;

export const CommentStatsDtoSchema = z.object({
  total: z.int(),
  pending: z.int(),
  approved: z.int(),
  rejected: z.int(),
});
export type CommentStatsDto = z.infer<typeof CommentStatsDtoSchema>;

export const ElementStateSchema = z.enum(['detached', 'visible']);
export type ElementState = z.infer<typeof ElementStateSchema>;

export const HttpSchema = z.enum({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
});
export type HttpCode = z.infer<typeof HttpSchema>;

export const LimitsSchema = z.object({
  photo: z.object({ titleMax: z.int(), authorMax: z.int() }),
  comment: z.object({ authorMax: z.int(), textMax: z.int() }),
});
export type Limits = z.infer<typeof LimitsSchema>;
