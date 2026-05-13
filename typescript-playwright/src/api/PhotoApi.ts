import type { APIRequestContext, APIResponse } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';
import type { PhotoPayload } from '../utils/generators.ts';

export class PhotoApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly authHeaders: Record<string, string>
  ) {}

  async getAll(): Promise<APIResponse> {
    return this.request.get('/photos');
  }

  async getById(photoId: number): Promise<APIResponse> {
    return this.request.get(`/photos/${photoId}`);
  }

  async getByCategory(categoryId: number): Promise<APIResponse> {
    return this.request.get(`/photos/category/${categoryId}`);
  }

  async upload(
    filePath: string,
    payload: PhotoPayload
  ): Promise<APIResponse> {
    const fileBuffer = await fs.readFile(filePath);
    const formData: Record<string, string | { name: string; mimeType: string; buffer: Buffer }> = {
      file: { name: path.basename(filePath), mimeType: 'image/jpeg', buffer: fileBuffer },
      title: payload.title,
      author: payload.author,
    };
    if (payload.place) formData.place = payload.place;
    if (payload.takenAt) formData.takenAt = payload.takenAt;
    if (payload.categoryId !== undefined) formData.categoryId = String(payload.categoryId);
    if (payload.subcategoryId !== undefined) formData.subcategoryId = String(payload.subcategoryId);

    return this.request.post('/photos', {
      multipart: formData,
      headers: this.authHeaders,
    });
  }

  async like(photoId: number): Promise<APIResponse> {
    return this.request.put(`/photos/${photoId}/like`);
  }

  async recordView(photoId: number): Promise<APIResponse> {
    return this.request.put(`/photos/${photoId}/view`);
  }

  async deletePhoto(photoId: number): Promise<APIResponse> {
    return this.request.delete(`/photos/${photoId}`, {
      headers: this.authHeaders,
    });
  }
}