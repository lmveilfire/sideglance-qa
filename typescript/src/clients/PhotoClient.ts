import type { PhotoApi } from '#api/PhotoApi';
import {
  PhotoDtoSchema,
  PhotoListSchema,
  LikeResultSchema,
  type PhotoDto,
  type PhotoPayload,
  type LikeResult,
} from '#utils/schemas';
import { assertStatus } from '#utils/apiHelpers';
import { HTTP } from '#utils/constants';
import { step } from '#utils/decorators';

export class PhotoClient {
  private readonly api: PhotoApi;

  constructor(api: PhotoApi) {
    this.api = api;
  }

  @step
  async list(): Promise<PhotoDto[]> {
    const response = await this.api.getAll();
    await assertStatus(response, 'PhotoClient.list', HTTP.OK);
    return PhotoListSchema.parse(await response.json());
  }

  @step
  async listByCategory(categoryId: number): Promise<PhotoDto[]> {
    const response = await this.api.getByCategory(categoryId);
    await assertStatus(response, `PhotoClient.listByCategory(${categoryId})`, HTTP.OK);
    return PhotoListSchema.parse(await response.json());
  }

  @step
  async getById(id: number): Promise<PhotoDto> {
    const response = await this.api.getById(id);
    await assertStatus(response, `PhotoClient.getById(${id})`, HTTP.OK);
    return PhotoDtoSchema.parse(await response.json());
  }

  @step
  async upload(filePath: string, payload: PhotoPayload): Promise<PhotoDto> {
    const response = await this.api.upload(filePath, payload);
    await assertStatus(response, 'PhotoClient.upload', HTTP.OK, HTTP.CREATED);
    return PhotoDtoSchema.parse(await response.json());
  }

  @step
  async like(id: number): Promise<LikeResult> {
    const response = await this.api.like(id);
    await assertStatus(response, `PhotoClient.like(${id})`, HTTP.OK);
    return LikeResultSchema.parse(await response.json());
  }

  @step
  async delete(id: number): Promise<void> {
    const response = await this.api.deletePhoto(id);
    await assertStatus(response, `PhotoClient.delete(${id})`, HTTP.NO_CONTENT, HTTP.OK);
  }

  @step
  async tryDelete(id: number): Promise<void> {
    const response = await this.api.deletePhoto(id);
    await assertStatus(
      response,
      `PhotoClient.tryDelete(${id})`,
      HTTP.NO_CONTENT,
      HTTP.OK,
      HTTP.NOT_FOUND,
    );
  }
}
