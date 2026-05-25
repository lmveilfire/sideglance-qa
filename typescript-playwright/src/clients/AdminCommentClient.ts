import type { AdminCommentApi } from '../api/AdminCommentApi.ts';
import type { 
  AdminCommentDto, 
  AdminCommentsPageResponse, 
  CommentStatsDto, 
  CommentStatus 
} from '../utils/types.ts';
import { statusIn } from '../utils/statusIn.ts';
import { HTTP } from '../utils/constants.ts';
import { step } from '../utils/decorators.ts';

export class AdminCommentClient {
  constructor(private readonly api: AdminCommentApi) {}

  @step()
  async listAll(page = 0, size = 20): Promise<AdminCommentsPageResponse> {
    const res = await this.api.getComments(page, size);
    if (!statusIn(HTTP.OK)(res.status())) {
      throw new Error(`[AdminCommentClient] listAll failed: ${res.status()} ${await res.text()}`);
    }
    return res.json() as Promise<AdminCommentsPageResponse>;
  }

  @step()
    async getStats(): Promise<CommentStatsDto> {
      const res = await this.api.getStats();
      if (!statusIn(HTTP.OK)(res.status())) {
        throw new Error(`[AdminCommentClient] getStats failed: ${res.status()} ${await res.text()}`);
      }
      return res.json() as Promise<CommentStatsDto>;
    }

  @step()
  async moderate(
    commentId: number,
    status: CommentStatus,
    rejectionReason = ''
  ): Promise<AdminCommentDto> {
    const res = await this.api.moderate(commentId, status, rejectionReason);
    if (!statusIn(HTTP.OK, HTTP.NO_CONTENT)(res.status())) {
      throw new Error(
        `[AdminCommentClient] moderate(${commentId}) failed: ${res.status()} ${await res.text()}`
      );
    }
    return res.json() as Promise<AdminCommentDto>;
  }

  @step()
  async delete(commentId: number): Promise<void> {
    const res = await this.api.deleteComment(commentId);
    if (!statusIn(HTTP.NO_CONTENT, HTTP.OK)(res.status())) {
      throw new Error(
        `[AdminCommentClient] delete(${commentId}) failed: ${res.status()} ${await res.text()}`
      );
    }
  }
}