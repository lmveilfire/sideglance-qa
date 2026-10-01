import { type APIRequestContext } from '@playwright/test';
import { AuthApi } from '../api/AuthApi.js';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../utils/constants.js';
import { step } from '#utils/decorators';

export class AuthHelper {
  private readonly authApi: AuthApi;

  constructor(request: APIRequestContext) {
    this.authApi = new AuthApi(request);
  }

  @step
  async getAdminToken(): Promise<string> {
    return this.authApi.getToken(ADMIN_USERNAME, ADMIN_PASSWORD);
  }

  @step
  async getAdminHeaders(): Promise<Record<string, string>> {
    return this.authApi.getAuthHeaders(ADMIN_USERNAME, ADMIN_PASSWORD);
  }
}
