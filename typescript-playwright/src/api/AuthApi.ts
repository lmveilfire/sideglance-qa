import type { APIRequestContext, APIResponse } from "@playwright/test";
import { mergeHeaders } from "../utils/headers.ts";
import { API_URL } from "../utils/constants.ts";
import type { LoginPayload, AuthResponse } from "@utils/types.ts";

export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  private headers(custom?: Record<string, string>) {
    return mergeHeaders(custom);
  }

  async login(payload: LoginPayload): Promise<APIResponse> {
    const headers = this.headers();
    return this.request.fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: headers,
      data: payload,
    });
  }

  async refresh(refreshToken: string): Promise<APIResponse> {
    return this.request.fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      data: refreshToken,
      headers: {
        ...this.headers(),
        "Content-Type": "text/plain",
      },
    });
  }

  async getToken(username: string, password: string): Promise<string> {
    const response = await this.login({ username, password });
    if (!response.ok()) {
      throw new Error(
        `[AuthApi] login failed: ${response.status()} ${await response.text()}`,
      );
    }
    const body = (await response.json()) as AuthResponse;
    return body.accessToken;
  }

  async getAuthHeaders(
    username: string,
    password: string,
  ): Promise<Record<string, string>> {
    const token = await this.getToken(username, password);
    return { Authorization: `Bearer ${token}` };
  }
}
