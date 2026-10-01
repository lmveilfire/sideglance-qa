import type { Page, Locator } from '@playwright/test';
import { step } from '#utils/decorators';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get footer(): Locator {
    return this.page.getByTestId('footer');
  }

  get homeBtn(): Locator {
    return this.page.getByTestId('home-btn');
  }

  protected testIdStartsWith(prefix: string): Locator {
    return this.page.locator(`[data-testid^="${prefix}"]`);
  }

  @step
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }
}
