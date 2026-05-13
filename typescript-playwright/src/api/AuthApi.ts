import type { APIRequestContext , APIResponse } from '@playwright/test';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
}

export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  async login(payload: LoginPayload): Promise<APIResponse> {
    return this.request.post('/auth/login', { data: payload });
  }

  async refresh(refreshToken: string): Promise<APIResponse> {
    return this.request.post('/auth/refresh', {
      data: { refreshToken },
    });
  }

  async getToken(username: string, password: string): Promise<string> {
    const response = await this.login({ username, password });
    if (!response.ok()) {
      throw new Error(
        `[AuthApi] login failed: ${response.status()} ${await response.text()}`
      );
    }
    const body: AuthResponse = await response.json();
    return body.accessToken;
  }

  async getAuthHeaders(
    username: string,
    password: string
  ): Promise<Record<string, string>> {
    const token = await this.getToken(username, password);
    return { Authorization: `Bearer ${token}` };
  }
}