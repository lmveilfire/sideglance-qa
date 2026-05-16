import type { APIRequestContext, APIResponse } from '@playwright/test';

export class CategoryApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly authHeaders: Record<string, string>
  ) {}

  async getAll(): Promise<APIResponse> {
    return this.request.get('/categories');
  }

  async create(name: string): Promise<APIResponse> {
    return this.request.post('/categories', {
      data: { name },
      headers: this.authHeaders,
    });
  }

  async deleteCategory(categoryId: number): Promise<APIResponse> {
    return this.request.delete(`/categories/${categoryId}`, {
      headers: this.authHeaders,
    });
  }
}