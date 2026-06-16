import type { Page, Locator } from "@playwright/test";

export abstract class BasePage {
  constructor(protected readonly page: Page) {}
  get footer(): Locator {
    return this.page.locator("footer");
  }

  get homeButton(): Locator {
    return this.page.locator('[data-testid="home-button"]');
  }

  protected testIdStartsWith(prefix: string): Locator {
    return this.page.locator(`[data-testid^="${prefix}"]`);
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  async backToHome(): Promise<void> {
    await this.homeButton.click();
  }
}
