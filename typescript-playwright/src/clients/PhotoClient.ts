import type { PhotoApi } from "../api/PhotoApi";
import type { PhotoDto, PhotoPayload } from "../utils/types";
import { statusIn } from "../utils/statusIn";
import { HTTP } from "../utils/constants";
import { step } from "../utils/decorators";
export class PhotoClient {
  private readonly api: PhotoApi;

  constructor(api: PhotoApi) {
    this.api = api;
  }

  @step()
  async list(): Promise<PhotoDto[]> {
    const response = await this.api.getAll();
    if (!response.ok()) {
      throw new Error(
        `[PhotoClient] list failed: ${response.status()} ${await response.text()}`,
      );
    }
    return response.json() as Promise<PhotoDto[]>;
  }

  @step()
  async listByCategory(categoryId: number): Promise<PhotoDto[]> {
    const response = await this.api.getByCategory(categoryId);
    if (!response.ok()) {
      throw new Error(
        `[PhotoClient] listByCategory(${categoryId}) failed: ${response.status()} ${await response.text()}`,
      );
    }
    return response.json() as Promise<PhotoDto[]>;
  }

  @step()
  async getById(id: number): Promise<PhotoDto> {
    const response = await this.api.getById(id);
    if (!statusIn(HTTP.OK)(response.status())) {
      throw new Error(
        `[PhotoClient] getById(${id}) failed: ${response.status()} ${await response.text()}`,
      );
    }
    return response.json() as Promise<PhotoDto>;
  }

  @step()
  async upload(filePath: string, payload: PhotoPayload): Promise<PhotoDto> {
    const response = await this.api.upload(filePath, payload);
    if (!statusIn(HTTP.OK, HTTP.CREATED)(response.status())) {
      throw new Error(
        `[PhotoClient] upload failed: ${response.status()} ${await response.text()}`,
      );
    }
    return response.json() as Promise<PhotoDto>;
  }

  @step()
  async like(
    id: number,
  ): Promise<{ totalLikes: number; newlyLiked: boolean; message?: string }> {
    const response = await this.api.like(id);
    if (!statusIn(HTTP.OK)(response.status())) {
      throw new Error(
        `[PhotoClient] like(${id}) failed: ${response.status()} ${await response.text()}`,
      );
    }
    return response.json() as Promise<{
      totalLikes: number;
      newlyLiked: boolean;
      message?: string;
    }>;
  }

  @step()
  async delete(id: number): Promise<void> {
    const response = await this.api.deletePhoto(id);
    if (!statusIn(HTTP.NO_CONTENT, HTTP.OK)(response.status())) {
      throw new Error(
        `[PhotoClient] delete(${id}) failed: ${response.status()} ${await response.text()}`,
      );
    }
  }

  @step()
  async tryDelete(id: number): Promise<void> {
    const response = await this.api.deletePhoto(id);
    if (
      !statusIn(HTTP.NO_CONTENT, HTTP.OK, HTTP.NOT_FOUND)(response.status())
    ) {
      throw new Error(
        `[PhotoClient] tryDelete(${id}) failed: ${response.status()} ${await response.text()}`,
      );
    }
  }
}
