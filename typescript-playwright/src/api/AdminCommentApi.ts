import type { APIRequestContext, APIResponse } from '@playwright/test';

export type CommentStatus = 'APPROVED' | 'REJECTED' | 'PENDING';

export class AdminCommentApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly authHeaders: Record<string, string>
  ) {}

  async getAll(page = 0, size = 20): Promise<APIResponse> {
    return this.request.get('/admin/comments', {
      params: { page, size },
      headers: this.authHeaders,
    });
  }

  async getPending(page = 0, size = 20): Promise<APIResponse> {
    return this.request.get('/admin/comments/pending', {
      params: { page, size },
      headers: this.authHeaders,
    });
  }

  async getStats(): Promise<APIResponse> {
    return this.request.get('/admin/comments/stats', {
      headers: this.authHeaders,
    });
  }

  async moderate(
    commentId: number,
    status: CommentStatus,
    rejectionReason = ''
  ): Promise<APIResponse> {
    return this.request.put(`/admin/comments/${commentId}/moderate`, {
      data: { status, rejectionReason },
      headers: this.authHeaders,
    });
  }

  async deleteComment(commentId: number): Promise<APIResponse> {
    return this.request.delete(`/admin/comments/${commentId}`, {
      headers: this.authHeaders,
    });
  }
}