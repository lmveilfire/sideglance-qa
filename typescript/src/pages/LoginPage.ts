import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { step } from '#utils/decorators';
import { STATE_DETACHED, TIMEOUT_5S } from '#utils/constants';

export class LoginPage extends BasePage {
  readonly URL_PATH = '/login';
  readonly LOGIN_ERROR_MESSAGE = "The key doesn't match this lock.";

  constructor(page: Page) {
    super(page);
  }

  get usernameInput(): Locator {
    return this.page.getByTestId('username-input');
  }
  get passwordInput(): Locator {
    return this.page.getByTestId('password-input');
  }
  get submitBtn(): Locator {
    return this.page.getByTestId('auth-form-submit-btn');
  }
  get errorMessage(): Locator {
    return this.page.getByTestId('login-error');
  }

  @step
  async goto(): Promise<void> {
    await this.page.goto(this.URL_PATH);
  }

  @step
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitBtn.click();
    if (await this.submitBtn.isVisible()) {
      await this.submitBtn.waitFor({ state: STATE_DETACHED, timeout: TIMEOUT_5S }).catch(() => {});
    }
  }
}
