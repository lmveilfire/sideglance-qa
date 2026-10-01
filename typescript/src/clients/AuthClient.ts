import type { AuthApi } from '#api/AuthApi';
import { AuthResponseSchema, type AuthResponse, type LoginPayload } from '#utils/schemas';
import { assertStatus } from '#utils/apiHelpers';
import { HTTP } from '#utils/constants';
import { step } from '#utils/decorators';

export class AuthClient {
  private readonly api: AuthApi;

  constructor(api: AuthApi) {
    this.api = api;
  }

  @step
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await this.api.login(payload);
    await assertStatus(response, 'AuthClient.login', HTTP.OK, HTTP.CREATED);
    return AuthResponseSchema.parse(await response.json());
  }

  @step
  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await this.api.refresh(refreshToken);
    await assertStatus(response, 'AuthClient.refresh', HTTP.OK, HTTP.CREATED);
    return AuthResponseSchema.parse(await response.json());
  }
}
