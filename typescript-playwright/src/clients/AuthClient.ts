import type { AuthApi } from "../api/AuthApi.ts";
import type { AuthResponse, LoginPayload } from "../utils/types.ts";
import { statusIn } from "../utils/statusIn.ts";
import { HTTP } from "../utils/constants.ts";
import { step } from "../utils/decorators.ts";

export class AuthClient {
  constructor(private readonly api: AuthApi) {}

  @step()
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await this.api.login(payload);
    if (!statusIn(HTTP.OK, HTTP.CREATED)(response.status())) {
      throw new Error(
        `[AuthClient] login failed: ${response.status()} ${await response.text()}`,
      );
    }
    return response.json() as Promise<AuthResponse>;
  }

  @step()
  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await this.api.refresh(refreshToken);
    if (!statusIn(HTTP.OK, HTTP.CREATED)(response.status())) {
      throw new Error(
        `[AuthClient] refresh failed: ${response.status()} ${await response.text()}`,
      );
    }
    return response.json() as Promise<AuthResponse>;
  }
}
