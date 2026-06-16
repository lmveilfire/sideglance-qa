import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage.ts";
import { step } from "../utils/decorators.ts";

export class GalleryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get searchInput(): Locator {
    return this.page.locator('[data-testid="search-input"]');
  }
  get searchClear(): Locator {
    return this.page.locator('[data-testid="search-clear"]');
  }
  get sidebar(): Locator {
    return this.page.locator('[data-testid="sidebar"]');
  }
  get categoryList(): Locator {
    return this.page.locator('[data-testid="category-list"]');
  }
  get burgerButton(): Locator {
    return this.page.locator('[data-testid="burger-button"]');
  }
  get emptyGallery(): Locator {
    return this.page.locator('[data-testid="empty-gallery"]');
  }
  get photoCardList(): Locator {
    return this.page.locator('[data-testid="photo-card-list"]');
  }
  get loadingSpinner(): Locator {
    return this.page.locator('[data-testid="loading-spinner"]');
  }
  get subcategoryList(): Locator {
    return this.page.locator('[data-testid="subcategory-list"]');
  }

  private categoryDeleteBtn(name: string): Locator {
    return this.categoryItemByName(name).locator(
      '[data-testid="category-delete-btn"]',
    );
  }

  private subcategoryDeleteBtn(name: string): Locator {
    return this.subcategoryItemByName(name).locator(
      '[data-testid="subcategory-delete-btn"]',
    );
  }

  private deletePhotoBtn(photoId: number): Locator {
    return this.page.locator(`[data-testid="photo-card-delete-${photoId}"]`);
  }

  photoImg(photoId: number): Locator {
    return this.page.locator(`[data-testid="photo-img-${photoId}"]`);
  }

  categoryItemByName(name: string): Locator {
    return this.testIdStartsWith("category-item").filter({ hasText: name });
  }

  subcategoryItemByName(name: string): Locator {
    return this.testIdStartsWith("subcategory-item").filter({ hasText: name });
  }

  photoByAlt(altText: string): Locator {
    return this.page.getByAltText(altText);
  }

  @step("Открыть галерею")
  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  @step("Удалить фото")
  async deletePhoto(photoId: number): Promise<void> {
    await this.deletePhotoBtn(photoId).click();
    await this.photoImg(photoId).waitFor({ state: "detached", timeout: 5000 });
  }

  @step("Поиск фото")
  async searchPhoto(searchQuery: string): Promise<void> {
    await this.searchInput.fill(searchQuery);
  }

  @step("Очистить поиск")
  async clearSearch(): Promise<void> {
    await this.searchClear.waitFor({ state: "visible", timeout: 3000 });
    await this.searchClear.click();
  }

  @step("Выбрать категорию по имени")
  async selectCategoryByName(name: string): Promise<void> {
    const category = this.categoryItemByName(name);
    const ariaExpanded = await category.getAttribute("aria-expanded");

    if (ariaExpanded === "false") {
      await category.click();
      await this.subcategoryList.waitFor({ state: "visible", timeout: 5000 });
    } else if (ariaExpanded === null) {
      await category.click();
    }
  }

  @step("Выбрать подкатегорию по имени")
  async selectSubcategoryByName(name: string): Promise<void> {
    await this.subcategoryItemByName(name).click();
  }

  @step("Удалить категорию")
  async deleteCategory(name: string): Promise<void> {
    await this.categoryDeleteBtn(name).click();
  }

  @step("Удалить подкатегорию")
  async deleteSubcategory(name: string): Promise<void> {
    await this.subcategoryDeleteBtn(name).click();
    await this.subcategoryItemByName(name).waitFor({
      state: "detached",
      timeout: 5000,
    });
  }

  @step("Открыть фото")
  async openPhoto(name: string): Promise<void> {
    await this.photoByAlt(name).click();
  }

  @step("Получить список всех заголовков фото")
  async getAllPhotoTitles(): Promise<string[]> {
    return await this.photoCardList
      .locator("img")
      .evaluateAll((imgs) => imgs.map((img) => img.getAttribute("alt") || ""));
  }
}
