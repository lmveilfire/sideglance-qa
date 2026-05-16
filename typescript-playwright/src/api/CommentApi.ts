import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { CommentPayload } from '../utils/generators';
import { MIN_ANSWER_TIME_MS, DEFAULT_ANSWER_TIME_MS } from '../utils/constants.ts';
import type { CaptchaData } from '../utils/interfaces.ts';

export class CommentApi {
  constructor(private readonly request: APIRequestContext) {}

  async getCaptcha(): Promise<APIResponse> {
    return this.request.get('/comments/captcha');
  }

  async getComments(
    photoId: number,
    page = 0,
    size = 5
  ): Promise<APIResponse> {
    return this.request.get('/comments', {
      params: { photoId, page, size },
    });
  }

  async create(
    payload: CommentPayload,
    captcha: CaptchaData
  ): Promise<APIResponse> {
    const answerTimeMs = captcha.answerTimeMs ?? DEFAULT_ANSWER_TIME_MS;

    if (answerTimeMs < MIN_ANSWER_TIME_MS) {
      throw new Error(
        `[CommentApi] answerTimeMs must be >= ${MIN_ANSWER_TIME_MS}, got ${answerTimeMs}`
      );
    }

    return this.request.post('/comments', {
      data: payload,
      headers: {
        'X-Captcha-Session-Id': captcha.sessionId,
        'X-Captcha-Answer': String(captcha.answer),
        'X-Answer-Time-Ms': String(answerTimeMs),
      },
    });
  }
}
