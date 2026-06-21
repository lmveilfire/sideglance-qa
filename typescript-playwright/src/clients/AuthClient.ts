import type { AuthApi } from "../api/AuthApi";
import type { AuthResponse, LoginPayload } from "../utils/types";
import { statusIn } from "../utils/statusIn";
import { HTTP } from "../utils/constants";
import { step } from "../utils/decorators";

export class AuthClient {
  private readonly api: AuthApi;
 
  constructor(api: AuthApi) {
    this.api = api;
  }

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
