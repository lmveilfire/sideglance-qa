import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { step } from "../utils/decorators";

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get usernameInput(): Locator {
    return this.page.locator('[data-testid="login-username"]');
  }
  get passwordInput(): Locator {
    return this.page.locator('[data-testid="login-password"]');
  }
  get submitButton(): Locator {
    return this.page.locator('[data-testid="login-submit"]');
  }
  get errorMessage(): Locator {
    return this.page.locator('[data-testid="login-error"]');
  }

  @step("Открыть страницу логина")
  async goto(): Promise<void> {
    await this.page.goto("/login");
  }

  @step("Войти в систему")
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    if (await this.submitButton.isVisible()) {
      await this.submitButton
        .waitFor({ state: "detached", timeout: 5000 })
        .catch(() => {});
    }
  }
}
