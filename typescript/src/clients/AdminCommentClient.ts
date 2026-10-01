import type { AdminCommentApi } from '#api/AdminCommentApi';
import {
  AdminCommentsPageResponseSchema,
  CommentStatsDtoSchema,
  AdminCommentDtoSchema,
  type AdminCommentDto,
  type AdminCommentsPageResponse,
  type CommentStatsDto,
  type CommentStatus,
} from '#utils/schemas';
import { assertStatus } from '../utils/apiHelpers.js';
import { HTTP } from '#utils/constants';
import { step } from '#utils/decorators';

export class AdminCommentClient {
  private readonly api: AdminCommentApi;

  constructor(api: AdminCommentApi) {
    this.api = api;
  }

  @step
  async listAll(page = 0, size = 20): Promise<AdminCommentsPageResponse> {
    const response = await this.api.getComments(page, size);
    await assertStatus(response, 'AdminCommentClient.listAll', HTTP.OK);
    return AdminCommentsPageResponseSchema.parse(await response.json());
  }

  @step
  async getStats(): Promise<CommentStatsDto> {
    const response = await this.api.getStats();
    await assertStatus(response, 'AdminCommentClient.getStats', HTTP.OK);
    return CommentStatsDtoSchema.parse(await response.json());
  }

  @step
  async moderate(
    commentId: number,
    status: CommentStatus,
    rejectionReason = '',
  ): Promise<AdminCommentDto> {
    const response = await this.api.moderate(commentId, status, rejectionReason);
    await assertStatus(response, 'AdminCommentClient.moderate', HTTP.NO_CONTENT, HTTP.OK);
    return AdminCommentDtoSchema.parse(await response.json());
  }

  @step
  async delete(commentId: number): Promise<void> {
    const response = await this.api.deleteComment(commentId);
    await assertStatus(response, 'AdminCommentClient.delete', HTTP.NO_CONTENT, HTTP.OK);
  }
}
