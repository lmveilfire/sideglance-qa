import type { APIRequestContext, APIResponse } from "@playwright/test";
import * as fs from "fs/promises";
import * as path from "path";
import type { PhotoPayload } from "../utils/types.ts";
import { API_URL } from "../utils/constants.ts";
import { mergeHeaders } from "../utils/headers.ts";

export class PhotoApi {
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

  async getAll(): Promise<APIResponse> {
    return this.request.get(`${API_URL}/api/photos`);
  }

  async getById(photoId: number): Promise<APIResponse> {
    return this.request.get(`${API_URL}/api/photos/${photoId}`);
  }

  async getByCategory(categoryId: number): Promise<APIResponse> {
    return this.request.get(`${API_URL}/api/photos/category/${categoryId}`);
  }

  async upload(filePath: string, payload: PhotoPayload): Promise<APIResponse> {
    const fileBuffer = await fs.readFile(filePath);
    const formData: Record<
      string,
      string | { name: string; mimeType: string; buffer: Buffer }
    > = {
      file: {
        name: path.basename(filePath),
        mimeType: "image/jpeg",
        buffer: fileBuffer,
      },
      title: payload.title,
      author: payload.author,
    };
    if (payload.place) formData.place = payload.place;
    if (payload.takenAt) formData.takenAt = payload.takenAt;
    if (payload.categoryId !== undefined)
      formData.categoryId = String(payload.categoryId);
    if (payload.subcategoryId !== undefined)
      formData.subcategoryId = String(payload.subcategoryId);

    return this.request.post(`${API_URL}/api/photos`, {
      multipart: formData,
      headers: this.authHeaders,
    });
  }

  async like(photoId: number): Promise<APIResponse> {
    return this.request.put(`${API_URL}/api/photos/${photoId}/like`, {
      headers: this.headers,
    });
  }

  async recordView(photoId: number): Promise<APIResponse> {
    return this.request.put(`${API_URL}/api/photos/${photoId}/view`);
  }

  async deletePhoto(photoId: number): Promise<APIResponse> {
    return this.request.delete(`${API_URL}/api/photos/${photoId}`, {
      headers: this.authHeaders,
    });
  }
}
