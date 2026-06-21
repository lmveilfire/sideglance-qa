import type { APIRequestContext, APIResponse } from "@playwright/test";
import type { CommentStatus } from "../utils/types";
import { API_URL } from "../utils/constants";
import { mergeHeaders } from "../utils/headers";

export class AdminCommentApi {
  private readonly request: APIRequestContext;
  private readonly authHeaders: Record<string, string>;

  constructor(
    request: APIRequestContext,
    authHeaders: Record<string, string>,
  ) {
    this.request = request;
    this.authHeaders = authHeaders;
  }

  private get headers(): Record<string, string> {
    return mergeHeaders(this.authHeaders);
  }

  async getComments(page = 0, size = 20): Promise<APIResponse> {
    return this.request.get(`${API_URL}/api/admin/comments`, {
      params: { page, size },
      headers: this.headers,
    });
  }

  async getStats(): Promise<APIResponse> {
    return this.request.get(`${API_URL}/api/admin/comments/stats`, {
      headers: this.headers,
    });
  }

  async moderate(
    commentId: number,
    status: CommentStatus,
    rejectionReason?: string,
  ): Promise<APIResponse> {
    return this.request.put(
      `${API_URL}/api/admin/comments/${commentId}/moderate`,
      {
        data: { status, ...(rejectionReason ? { rejectionReason } : {}) },
        headers: this.headers,
      },
    );
  }

  async deleteComment(commentId: number): Promise<APIResponse> {
    return this.request.delete(`${API_URL}/api/admin/comments/${commentId}`, {
      headers: this.headers,
    });
  }
}
