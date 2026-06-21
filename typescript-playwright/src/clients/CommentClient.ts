import type { CommentApi } from "../api/CommentApi";
import type {
  CommentDto,
  CaptchaData,
  CaptchaResponse,
  CommentsPageResponse,
  CommentPayload,
} from "../utils/types";
import { statusIn } from "../utils/statusIn";
import { HTTP } from "../utils/constants";
import { step } from "../utils/decorators";
import { generate } from "../utils/generators";

export class CommentClient {
  private readonly api: CommentApi;

  constructor(api: CommentApi) {
    this.api = api;
  }

  @step()
  async getCaptcha(): Promise<CaptchaResponse> {
    const response = await this.api.getCaptcha();
    if (!statusIn(HTTP.OK)(response.status())) {
      throw new Error(
        `[CommentClient] getCaptcha failed: ${response.status()} ${await response.text()}`,
      );
    }
    return response.json() as Promise<CaptchaResponse>;
  }

  @step()
  async listByPhoto(
    photoId: number,
    page = 0,
    size = 5,
  ): Promise<CommentsPageResponse> {
    const response = await this.api.getComments(photoId, page, size);
    if (!statusIn(HTTP.OK)(response.status())) {
      throw new Error(
        `[CommentClient] listByPhoto failed: ${response.status()} ${await response.text()}`,
      );
    }
    return response.json() as Promise<CommentsPageResponse>;
  }

  @step()
  async create(
    payload: CommentPayload,
    captcha: CaptchaData,
  ): Promise<CommentDto> {
    const response = await this.api.create(payload, captcha);
    if (!statusIn(HTTP.OK, HTTP.CREATED)(response.status())) {
      throw new Error(
        `[CommentClient] create failed: ${response.status()} ${await response.text()}`,
      );
    }
    return response.json() as Promise<CommentDto>;
  }

  @step()
  async createInIsolation(
    payload: CommentPayload,
    captcha: CaptchaData,
  ): Promise<CommentDto> {
    const response = await this.api.create(payload, captcha, {
      "X-Forwarded-For": generate.ip(),
    });
    if (!statusIn(HTTP.OK, HTTP.CREATED)(response.status())) {
      throw new Error(
        `[CommentClient] createInIsolation failed: ${response.status()} ${await response.text()}`,
      );
    }
    return response.json() as Promise<CommentDto>;
  }
}
