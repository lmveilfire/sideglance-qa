import type { CommentApi } from '#api/CommentApi';
import {
  CommentDtoSchema,
  CaptchaResponseSchema,
  CommentsPageResponseSchema,
  type CaptchaData,
  type CommentPayload,
  type CommentDto,
  type CaptchaResponse,
  type CommentsPageResponse,
} from '#utils/schemas';
import { assertStatus } from '#utils/apiHelpers';
import { HTTP } from '#utils/constants';
import { generate } from '#utils/generators';
import { step } from '#utils/decorators';

export class CommentClient {
  private readonly api: CommentApi;

  constructor(api: CommentApi) {
    this.api = api;
  }

  @step
  async getCaptcha(): Promise<CaptchaResponse> {
    const response = await this.api.getCaptcha();
    await assertStatus(response, 'CommentClient.getCaptcha', HTTP.OK);
    return CaptchaResponseSchema.parse(await response.json());
  }

  @step
  async listByPhoto(photoId: number, page = 0, size = 5): Promise<CommentsPageResponse> {
    const response = await this.api.getComments(photoId, page, size);
    await assertStatus(response, 'CommentClient.listByPhoto', HTTP.OK);
    return CommentsPageResponseSchema.parse(await response.json());
  }

  @step
  async create(payload: CommentPayload, captcha: CaptchaData): Promise<CommentDto> {
    const response = await this.api.create(payload, captcha);
    await assertStatus(response, 'CommentClient.create', HTTP.OK, HTTP.CREATED);
    return CommentDtoSchema.parse(await response.json());
  }

  @step
  async createInIsolation(payload: CommentPayload, captcha: CaptchaData): Promise<CommentDto> {
    const response = await this.api.create(payload, captcha, {
      'X-Forwarded-For': generate.ip(),
    });
    await assertStatus(response, 'CommentClient.createInIsolation', HTTP.OK, HTTP.CREATED);
    return CommentDtoSchema.parse(await response.json());
  }
}
