import type { APIRequestContext, APIResponse } from '@playwright/test';

export class SubcategoryApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly authHeaders: Record<string, string>
  ) {}

  async getByCategoryId(categoryId: number): Promise<APIResponse> {
    return this.request.get('/subcategories', {
      params: { categoryId },
    });
  }

  async create(categoryId: number, name: string): Promise<APIResponse> {
    return this.request.post('/subcategories', {
      data: { categoryId, name },
      headers: this.authHeaders,
    });
  }

  async deleteSubcategory(subcategoryId: number): Promise<APIResponse> {
    return this.request.delete(`/subcategories/${subcategoryId}`, {
      headers: this.authHeaders,
    });
  }
}