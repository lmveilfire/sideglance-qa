import type { Page, Locator } from '@playwright/test';
import { BasePage } from '#pages/BasePage';
import { step } from '#utils/decorators';
import { STATE_DETACHED, TIMEOUT_5S } from '#utils/constants';

export class PhotoUploadPage extends BasePage {
  readonly URL_PATH = '/admin-panel/upload';
  readonly CREATE_NEW_VALUE = '+new';

  constructor(page: Page) {
    super(page);
  }

  get uploadTab(): Locator {
    return this.page.getByTestId('upload-tab');
  }
  get photoUploadBtn(): Locator {
    return this.page.getByTestId('photo-upload-btn');
  }
  get titleInput(): Locator {
    return this.page.getByTestId('title-input');
  }
  get authorInput(): Locator {
    return this.page.getByTestId('author-input');
  }
  get categorySelect(): Locator {
    return this.page.getByTestId('category-select');
  }
  get subcategorySelect(): Locator {
    return this.page.getByTestId('subcategory-select');
  }
  get newCategoryInput(): Locator {
    return this.page.getByTestId('new-category-input');
  }
  get createCategoryBtn(): Locator {
    return this.page.getByTestId('create-category-btn');
  }
  get cancelCategoryBtn(): Locator {
    return this.page.getByTestId('cancel-category-btn');
  }
  get placeInput(): Locator {
    return this.page.getByTestId('place-input');
  }
  get takenAtInput(): Locator {
    return this.page.getByTestId('taken-at-input');
  }
  get uploadFormSubmit(): Locator {
    return this.page.getByTestId('upload-form-submit');
  }
  get newSubcategoryInput(): Locator {
    return this.page.getByTestId('new-subcategory-input');
  }
  get createSubcategoryBtn(): Locator {
    return this.page.getByTestId('create-subcategory-btn');
  }
  get cancelSubcategoryBtn(): Locator {
    return this.page.getByTestId('cancel-subcategory-btn');
  }
  get previewImage(): Locator {
    return this.page.getByTestId('preview-image');
  }
  get removePreviewBtn(): Locator {
    return this.page.getByTestId('preview-remove-btn');
  }
  get successAlert(): Locator {
    return this.page.getByTestId('success-alert');
  }
  get errorAlert(): Locator {
    return this.page.getByTestId('error-alert');
  }
  get categoryHint(): Locator {
    return this.page.getByTestId('category-hint');
  }

  @step
  async goto(): Promise<void> {
    await this.page.goto(this.URL_PATH);
  }

  @step
  async attachPhoto(filePath: string): Promise<void> {
    await this.photoUploadBtn.setInputFiles(filePath);
  }

  @step
  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  @step
  async fillAuthor(author: string): Promise<void> {
    await this.authorInput.fill(author);
  }

  @step
  async fillTakenAt(date: string): Promise<void> {
    await this.takenAtInput.fill(date);
  }

  @step
  async createNewCategory(name: string): Promise<void> {
    await this.categorySelect.selectOption(this.CREATE_NEW_VALUE);
    await this.newCategoryInput.fill(name);
    await this.createCategoryBtn.click();
    await this.newCategoryInput.waitFor({ state: STATE_DETACHED, timeout: TIMEOUT_5S });
  }

  @step
  async selectCategoryByName(name: string): Promise<void> {
    await this.categorySelect.selectOption({ label: name });
  }

  @step
  async cancelNewCategory(): Promise<void> {
    await this.cancelCategoryBtn.click();
    await this.newCategoryInput.waitFor({ state: STATE_DETACHED, timeout: TIMEOUT_5S });
  }

  @step
  async createNewSubcategory(name: string): Promise<void> {
    await this.subcategorySelect.selectOption(this.CREATE_NEW_VALUE);
    await this.newSubcategoryInput.fill(name);
    await this.createSubcategoryBtn.click();
    await this.newSubcategoryInput.waitFor({
      state: STATE_DETACHED,
      timeout: TIMEOUT_5S,
    });
  }

  @step
  async selectSubcategoryByName(name: string): Promise<void> {
    await this.subcategorySelect.selectOption({ label: name });
  }

  @step
  async cancelNewSubcategory(): Promise<void> {
    await this.cancelSubcategoryBtn.click();
    await this.newSubcategoryInput.waitFor({
      state: STATE_DETACHED,
      timeout: TIMEOUT_5S,
    });
  }

  @step
  async removePhoto(): Promise<void> {
    await this.removePreviewBtn.click();
  }

  @step
  async submitForm(): Promise<void> {
    await this.uploadFormSubmit.click();
  }
}
