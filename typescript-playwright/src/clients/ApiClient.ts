import type { APIRequestContext, APIResponse } from '@playwright/test';
import { mergeHeaders } from '../utils/headers.ts';
import { API_URL } from '../utils/constants.ts';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  private headers(custom?: Record<string, string>) {
    return mergeHeaders(custom);
  }

  async get(url: string, customHeaders?: Record<string, string>): Promise<APIResponse> {
    return this.request.get(this.fullUrl(url), { headers: this.headers(customHeaders) });
  }

  async post(url: string, data?: any, customHeaders?: Record<string, string>): Promise<APIResponse> {
    return this.request.post(this.fullUrl(url), { 
      data, 
      headers: this.headers(customHeaders) 
    });
  }

  async delete(url: string, customHeaders?: Record<string, string>): Promise<APIResponse> {
    return this.request.delete(this.fullUrl(url), { headers: this.headers(customHeaders) });
  }

  async getJson<T>(url: string, customHeaders?: Record<string, string>): Promise<T> {
    const res = await this.get(url, customHeaders);
    return res.json();
  }

  private fullUrl(url: string): string {
    return url.startsWith('http') ? url : `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }
}