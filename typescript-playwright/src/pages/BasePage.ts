import type { Page, Locator} from '@playwright/test';
import { step } from '../utils/decorators.ts';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  protected testId(id: string): Locator {
    return this.page.locator(`[data-testid="${id}"]`);
  }

  protected testIdStartsWith(prefix: string): Locator {
    return this.page.locator(`[data-testid^="${prefix}"]`);
  }

  @step('Ожидать загрузки страницы')
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('load');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }
}