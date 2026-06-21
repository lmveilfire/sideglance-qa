import type { APIRequestContext, APIResponse } from "@playwright/test";
import { DEFAULT_ANSWER_TIME_MS } from "../utils/constants";
import type { CaptchaData, CommentPayload } from "../utils/types";
import { API_URL } from "../utils/constants";
import { mergeHeaders } from "../utils/headers";

export class CommentApi {
  private readonly request: APIRequestContext

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getCaptcha(): Promise<APIResponse> {
    return this.request.get(`${API_URL}/api/comments/captcha`);
  }

  async getComments(photoId: number, page = 0, size = 5): Promise<APIResponse> {
    return this.request.get(`${API_URL}/api/comments`, {
      params: { photoId, page, size },
    });
  }

  async create(
    payload: CommentPayload,
    captcha: CaptchaData,
    customHeaders?: Record<string, string>,
  ): Promise<APIResponse> {
    const answerTimeMs = captcha.answerTimeMs ?? DEFAULT_ANSWER_TIME_MS;

    return this.request.post(`${API_URL}/api/comments`, {
      data: payload,
      headers: {
        ...mergeHeaders(),
        "X-Captcha-Session-Id": captcha.sessionId,
        "X-Captcha-Answer": String(captcha.answer),
        "X-Answer-Time-Ms": String(answerTimeMs),
        ...customHeaders,
      },
    });
  }
}
