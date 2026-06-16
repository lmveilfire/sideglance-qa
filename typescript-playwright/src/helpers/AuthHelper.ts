import { type APIRequestContext } from "@playwright/test";
import { AuthApi } from "../api/AuthApi.ts";
import { ADMIN_USERNAME, ADMIN_PASSWORD } from "../utils/constants.ts";

export class AuthHelper {
  private readonly authApi: AuthApi;

  constructor(request: APIRequestContext) {
    this.authApi = new AuthApi(request);
  }

  async getAdminToken(): Promise<string> {
    return this.authApi.getToken(ADMIN_USERNAME, ADMIN_PASSWORD);
  }

  async getAdminHeaders(): Promise<Record<string, string>> {
    return this.authApi.getAuthHeaders(ADMIN_USERNAME, ADMIN_PASSWORD);
  }

  async loginWithInvalidPassword(
    times: number,
    password = "wrong_password",
  ): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.authApi.login({
        username: ADMIN_USERNAME,
        password: password,
      });
    }
  }
}
