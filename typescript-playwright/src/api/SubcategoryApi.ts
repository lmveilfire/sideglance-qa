import type { APIRequestContext, APIResponse } from '@playwright/test';
import { API_URL } from '../utils/constants.ts';
import { mergeHeaders } from '../utils/headers.ts';
 
export class SubcategoryApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly authHeaders: Record<string, string> = {}
  ) {}
 
  private get headers(): Record<string, string> {
    return mergeHeaders(this.authHeaders);
  }
 
  async getByCategoryId(categoryId: number): Promise<APIResponse> {
    return this.request.get(`${API_URL}/api/subcategories`, {
      params: { categoryId },
    });
  }
 
  async create(categoryId: number, name: string): Promise<APIResponse> {
    return this.request.post(`${API_URL}/api/subcategories`, {
      data: { categoryId, name },
      headers: this.headers,
    });
  }
 
  async deleteSubcategory(
    subcategoryId: number,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    return this.request.delete(`${API_URL}/api/subcategories/${subcategoryId}`, {
      headers: headers ?? this.headers,
    });
  }
}
 