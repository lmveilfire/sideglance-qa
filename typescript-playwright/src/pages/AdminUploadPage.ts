import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { step } from "../utils/decorators";
export class AdminUploadPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get navUpload(): Locator {
    return this.page.locator('[data-testid="nav-upload"]');
  }
  get photoUpload(): Locator {
    return this.page.locator('[data-testid="admin-photo-upload"]');
  }
  get titleInput(): Locator {
    return this.page.locator('[data-testid="admin-title"]');
  }
  get authorInput(): Locator {
    return this.page.locator('[data-testid="admin-author"]');
  }
  get categorySelect(): Locator {
    return this.page.locator('[data-testid="admin-category"]');
  }
  get subcategorySelect(): Locator {
    return this.page.locator('[data-testid="admin-subcategory"]');
  }
  get newCategoryInput(): Locator {
    return this.page.locator('[data-testid="new-category-input"]');
  }
  get createCategoryButton(): Locator {
    return this.page.locator('[data-testid="create-category-btn"]');
  }
  get cancelCategoryButton(): Locator {
    return this.page.locator('[data-testid="cancel-category-btn"]');
  }
  get takenAtInput(): Locator {
    return this.page.locator('[data-testid="admin-taken-at"]');
  }
  get submitButton(): Locator {
    return this.page.locator('[data-testid="admin-submit"]');
  }
  get newSubcategoryInput(): Locator {
    return this.page.locator('[data-testid="subcategory-input"]');
  }
  get createSubcategoryButton(): Locator {
    return this.page.locator('[data-testid="create-subcategory-btn"]');
  }
  get cancelSubcategoryButton(): Locator {
    return this.page.locator('[data-testid="cancel-subcategory-btn"]');
  }
  get previewImage(): Locator {
    return this.page.locator('[data-testid="preview-image"]');
  }
  get removePreviewButton(): Locator {
    return this.page.locator('[data-testid="preview-remove"]');
  }
  get successAlert(): Locator {
    return this.page.locator('[data-testid="admin-success"]');
  }
  get homeButton(): Locator {
    return this.page.locator('[data-testid="home-button"]');
  }
  get categoryHint(): Locator {
    return this.page.locator('[data-testid="category-hint"]');
  }

  categoryOptionByName(name: string): Locator {
    return this.categorySelect.getByRole("option", { name });
  }

  subcategoryOptionByName(name: string): Locator {
    return this.subcategorySelect.getByRole("option", { name });
  }

  @step("Открыть админ панель")
  async goto(): Promise<void> {
    await this.page.goto("/admin-panel/upload");
  }

  @step("Прикрепить файл фото")
  async attachPhoto(filePath: string): Promise<void> {
    await this.photoUpload.setInputFiles(filePath);
  }

  @step("Заполнить название фото")
  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  @step("Заполнить автора фото")
  async fillAuthor(author: string): Promise<void> {
    await this.authorInput.fill(author);
  }

  @step("Заполнить дату съёмки")
  async fillTakenAt(date: string): Promise<void> {
    await this.takenAtInput.fill(date);
  }

  @step("Создать новую категорию через форму")
  async createNewCategory(name: string): Promise<void> {
    await this.categorySelect.selectOption("+new");
    await this.newCategoryInput.fill(name);
    await this.createCategoryButton.click();
    await this.newCategoryInput.waitFor({ state: "detached", timeout: 5000 });
  }

  @step("Выбрать категорию по имени")
  async selectCategoryByName(name: string): Promise<void> {
    await this.categorySelect.selectOption({ label: name });
  }

  @step("Отменить создание категории")
  async cancelNewCategory(): Promise<void> {
    await this.cancelCategoryButton.click();
    await this.newCategoryInput.waitFor({ state: "detached", timeout: 5000 });
  }

  @step("Создать новую подкатегорию через форму")
  async createNewSubcategory(name: string): Promise<void> {
    await this.subcategorySelect.selectOption("+new");
    await this.newSubcategoryInput.fill(name);
    await this.createSubcategoryButton.click();
    await this.newSubcategoryInput.waitFor({
      state: "detached",
      timeout: 5000,
    });
  }

  @step("Выбрать подкатегорию по имени")
  async selectSubcategoryByName(name: string): Promise<void> {
    await this.subcategorySelect.selectOption({ label: name });
  }

  @step("Отменить создание подкатегории")
  async cancelNewSubcategory(): Promise<void> {
    await this.cancelSubcategoryButton.click();
    await this.newSubcategoryInput.waitFor({
      state: "detached",
      timeout: 5000,
    });
  }

  @step("Удалить прикреплённое фото")
  async removePhoto(): Promise<void> {
    await this.removePreviewButton.click();
  }

  @step("Отправить форму загрузки")
  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }
}
