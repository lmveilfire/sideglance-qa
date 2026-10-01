import type { Page, Locator } from '@playwright/test';
import { BasePage } from '#pages/BasePage';
import { STATE_DETACHED, STATE_VISIBLE, TIMEOUT_3S, TIMEOUT_5S } from '#utils/constants';
import { step } from '#utils/decorators';

export class GalleryPage extends BasePage {
  readonly URL_PATH = '/';

  constructor(page: Page) {
    super(page);
  }

  get searchInput(): Locator {
    return this.page.getByTestId('search-input');
  }
  get searchClearBtn(): Locator {
    return this.page.getByTestId('search-clear');
  }
  get sidebar(): Locator {
    return this.page.getByTestId('sidebar');
  }
  get categoryList(): Locator {
    return this.page.getByTestId('category-list');
  }
  get burgerBtn(): Locator {
    return this.page.getByTestId('burger-btn');
  }
  get emptyStateMessage(): Locator {
    return this.page.getByTestId('empty-state-message');
  }
  get photoCardList(): Locator {
    return this.page.getByTestId('photo-card-list');
  }
  get loadingSpinner(): Locator {
    return this.page.getByTestId('loading-spinner');
  }
  get subcategoryList(): Locator {
    return this.page.getByTestId('subcategory-list');
  }

  private categoryDeleteBtn(name: string): Locator {
    return this.categoryItemByName(name).getByTestId('category-delete-btn');
  }

  private subcategoryDeleteBtn(name: string): Locator {
    return this.subcategoryItemByName(name).getByTestId('subcategory-delete-btn');
  }

  private deletePhotoBtn(photoId: number): Locator {
    return this.page.getByTestId(`photo-card-delete-${photoId}`);
  }

  photoImg(photoId: number): Locator {
    return this.page.getByTestId(`photo-img-${photoId}`);
  }

  categoryItemByName(name: string): Locator {
    return this.page.locator('[data-testid^="category-item-"]').filter({ hasText: name });
  }

  subcategoryItemByName(name: string): Locator {
    return this.page.locator('[data-testid^="subcategory-item-"]').filter({ hasText: name });
  }

  photoByAlt(altText: string): Locator {
    return this.page.getByAltText(altText);
  }

  @step
  async goto(): Promise<void> {
    await this.page.goto(this.URL_PATH);
  }

  @step
  async deletePhoto(photoId: number): Promise<void> {
    await this.deletePhotoBtn(photoId).click();
    await this.photoImg(photoId).waitFor({ state: STATE_DETACHED, timeout: TIMEOUT_5S });
  }

  @step
  async searchPhoto(searchQuery: string): Promise<void> {
    await this.searchInput.fill(searchQuery);
  }

  @step
  async clearSearch(): Promise<void> {
    await this.searchClearBtn.waitFor({ state: STATE_VISIBLE, timeout: TIMEOUT_3S });
    await this.searchClearBtn.click();
  }

  @step
  async selectCategoryByName(name: string): Promise<void> {
    const category = this.categoryItemByName(name);
    const ariaExpanded = await category.getAttribute('aria-expanded');

    if (ariaExpanded === 'false') {
      await category.click();
      await this.subcategoryList.waitFor({ state: STATE_VISIBLE, timeout: TIMEOUT_5S });
    } else if (ariaExpanded === null) {
      await category.click();
    }
  }

  @step
  async selectSubcategoryByName(name: string): Promise<void> {
    await this.subcategoryItemByName(name).click();
  }

  @step
  async deleteCategory(name: string): Promise<void> {
    await this.categoryDeleteBtn(name).click();
  }

  @step
  async deleteSubcategory(name: string): Promise<void> {
    await this.subcategoryDeleteBtn(name).click();
  }

  @step
  async openPhotoByAlt(name: string): Promise<void> {
    await this.photoByAlt(name).click();
  }
}
