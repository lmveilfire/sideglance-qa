import type { APIRequestContext, APIResponse } from '@playwright/test';
import { mergeHeaders } from '#utils/headers';
import { API_URL } from '#utils/constants';
import { assertStatus } from '#utils/apiHelpers';
import { HTTP } from '#utils/constants';
import { AuthResponseSchema, type LoginPayload } from '#utils/schemas';

export class AuthApi {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  private headers(custom?: Record<string, string>) {
    return mergeHeaders(custom);
  }

  async login(payload: LoginPayload): Promise<APIResponse> {
    const headers = this.headers();
    return this.request.fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: headers,
      data: payload,
    });
  }

  async refresh(refreshToken: string): Promise<APIResponse> {
    return this.request.fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      data: refreshToken,
      headers: {
        ...this.headers(),
        'Content-Type': 'text/plain',
      },
    });
  }

  async getToken(username: string, password: string): Promise<string> {
    const response = await this.login({ username, password });
    await assertStatus(response, 'AuthApi.getToken', HTTP.OK);
    const body = AuthResponseSchema.parse(await response.json());
    return body.accessToken;
  }

  async getAuthHeaders(username: string, password: string): Promise<Record<string, string>> {
    const token = await this.getToken(username, password);
    return { Authorization: `Bearer ${token}` };
  }
}
