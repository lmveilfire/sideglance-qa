import type { APIRequestContext, APIResponse } from '@playwright/test';
import { DEFAULT_ANSWER_TIME_MS } from '../utils/constants.ts';
import type { CaptchaData, CommentPayload } from '../utils/types.ts';
import { API_URL } from '../utils/constants.ts'
import { mergeHeaders } from '../utils/headers.ts';

export class CommentApi {
  constructor(private readonly request: APIRequestContext) {}

  async getCaptcha(): Promise<APIResponse> {
    return this.request.get(`${API_URL}/api/comments/captcha`);
  }

  async getComments(
    photoId: number,
    page = 0,
    size = 5
  ): Promise<APIResponse> {
    return this.request.get(`${API_URL}/api/comments`, {
      params: { photoId, page, size },
    });
  }

  async create(
    payload: CommentPayload,
    captcha: CaptchaData,
    customHeaders?: Record<string, string>
  ): Promise<APIResponse> {
    const answerTimeMs = captcha.answerTimeMs ?? DEFAULT_ANSWER_TIME_MS;
 
    return this.request.post(`${API_URL}/api/comments`, {
      data: payload,
      headers: {
        ...mergeHeaders(),
        'X-Captcha-Session-Id': captcha.sessionId,
        'X-Captcha-Answer': String(captcha.answer),
        'X-Answer-Time-Ms': String(answerTimeMs),
        ...customHeaders,
      },
    });
  }
}
