import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.ts';
import { step } from '../utils/decorators.ts';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.testId('login-username');
    this.passwordInput = this.testId('login-password');
    this.submitButton = this.testId('login-submit');
    this.errorMessage = this.testId('login-error');
  }

  @step('Открыть страницу логина')
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  @step('Войти в систему')
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.waitForLoad();
  }
}
