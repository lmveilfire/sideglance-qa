import type { APIRequestContext, APIResponse } from '@playwright/test';
import { API_URL } from '../utils/constants.ts';

export class CategoryApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly authHeaders: Record<string, string> = {}
  ) {}

  async getAll(): Promise<APIResponse> {
    return this.request.get(`${API_URL}/api/categories`);
  }

  async create(name: string): Promise<APIResponse> {
    return this.request.post(`${API_URL}/api/categories`, {
      data: { name },
      headers: this.authHeaders,
    });
  }

  async deleteCategory(
    categoryId: number,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    return this.request.delete(`${API_URL}/api/categories/${categoryId}`, {
      headers: headers ?? this.authHeaders,
    });
  }
}