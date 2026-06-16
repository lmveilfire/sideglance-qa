import type { Page } from "@playwright/test";
import type { AuthHelper } from "./AuthHelper.ts";
import { step } from "../utils/decorators.ts";

export class UiAuthHelper {
  constructor(
    private readonly page: Page,
    private readonly authHelper: AuthHelper,
  ) {}

  @step("Авторизоваться как админ")
  async loginAsAdmin(redirectUrl = "/admin-panel/upload"): Promise<void> {
    const token = await this.authHelper.getAdminToken();

    await this.page.goto("/");
    await this.page.evaluate((t) => {
      localStorage.setItem("accessToken", t);
    }, token);

    await this.page.goto(redirectUrl);
    await this.page.waitForLoadState("load");
  }
}
