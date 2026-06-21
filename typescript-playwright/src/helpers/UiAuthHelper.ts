import type { Page } from "@playwright/test";
import type { AuthHelper } from "./AuthHelper";
import { step } from "../utils/decorators";

export class UiAuthHelper {
  private readonly page: Page;
  private readonly authHelper: AuthHelper;

  constructor(
    page: Page,
    authHelper: AuthHelper,
  ) {
    this.page = page;
    this.authHelper = authHelper;
  }

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
