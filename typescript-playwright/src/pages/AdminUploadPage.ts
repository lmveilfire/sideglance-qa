import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '../utils/decorators.ts';

export class AdminUploadPage extends BasePage {
    readonly navUpload: Locator;
    readonly photoUpload: Locator;
    readonly navComments: Locator;
    readonly titleInput: Locator;
    readonly authorInput: Locator;
    readonly categorySelect: Locator;
    readonly subcategorySelect: Locator;
    readonly newCategoryInput: Locator;
    readonly createCategoryButton: Locator;
    readonly cancelCategoryButton: Locator;
    readonly takenAtInput: Locator;
    readonly submitButton: Locator;
    readonly newSubcategoryInput: Locator;
    readonly createSubcategoryButton: Locator;
    readonly cancelSubcategoryButton: Locator;
    readonly previewImage: Locator;
    readonly removePreviewButton: Locator;
    readonly successAlert: Locator;
    readonly errorAlert: Locator;


    constructor(page: Page) {
    super(page);
    this.navUpload = this.testId('nav-upload');
    this.photoUpload = this.testId('admin-photo-upload');
    this.navComments = this.testId('admin-comments');
    this.titleInput = this.testId('admin-title');
    this.authorInput = this.testId('admin-author');
    this.categorySelect = this.testId('admin-category');
    this.subcategorySelect = this.testId('admin-subcategory')
    this.newCategoryInput = this.testId('new-category-input');
    this.createCategoryButton = this.testId('create-category-btn');
    this.cancelCategoryButton = this.testId('cancel-category-btn');
    this.takenAtInput = this.testId('admin-taken-at');
    this.submitButton = this.testId('admin-submit');
    this.newSubcategoryInput = this.testId('subcategory-input');
    this.createSubcategoryButton = this.testId('create-subcategory-btn');
    this.cancelSubcategoryButton = this.testId('cancel-subcategory-btn');
    this.previewImage = this.testId('preview-image');
    this.removePreviewButton = this.testId('preview-remove');
    this.successAlert = this.testId('admin-success');
    this.errorAlert = this.testId('admin-error');
  }
  
  @step('Открыть админ панель')
  async goto(): Promise<void> {
    await this.page.goto('/admin-panel/upload');
    await this.waitForLoad();
  }

  @step('Перейти на вкладку загрузки фото')
  async goToUpload(): Promise<void> {
    await this.navUpload.click();
    await this.waitForLoad();
  }

  @step('Перейти на вкладку комментариев')
  async goToComments(): Promise<void> {
    await this.navComments.click();
    await this.waitForLoad();
  }

  @step('Прикрепить файл фото')
  async attachPhoto(filePath: string): Promise<void> {
    await this.photoUpload.setInputFiles(filePath);
  }

  @step('Заполнить название фото')
  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  @step('Заполнить автора фото')
  async fillAuthor(author: string): Promise<void> {
    await this.authorInput.fill(author);
  }

  @step('Заполнить дату съёмки')
  async fillTakenAt(date: string): Promise<void> {
    await this.takenAtInput.fill(date);
  }

  @step('Выбрать существующую категорию')
  async selectCategory(categoryId: number): Promise<void> {
    await this.categorySelect.selectOption(String(categoryId));
  }

  @step('Создать новую категорию')
  async createNewCategory(name: string): Promise<void> {
    await this.categorySelect.selectOption('+new');
    await this.newCategoryInput.fill(name);
    await this.createCategoryButton.click();
    await this.waitForLoad();
  }

  @step('Отменить создание категории')
  async cancelNewCategory(): Promise<void> {
    await this.cancelCategoryButton.click();
  }

  @step('Создать новую подкатегорию')
  async createNewSubcategory(name: string): Promise<void> {
    await this.subcategorySelect.selectOption('+new');
    await this.newSubcategoryInput.fill(name);
    await this.createSubcategoryButton.click();
    await this.waitForLoad();
  }

  @step('Выбрать существующую подкатегорию')
  async selectSubcategory(subcategoryId: number): Promise<void> {
    await this.subcategorySelect.selectOption(String(subcategoryId));
  }

  @step('Отменить создание подкатегории')
  async cancelNewSubcategory(): Promise<void> {
    await this.cancelSubcategoryButton.click();
  }

  @step('Удалить прикреплённое фото')
  async removePhoto(): Promise<void> {
    await this.removePreviewButton.click();
  }

  @step('Отправить форму загрузки')
  async submitForm(): Promise<void> {
    await this.submitButton.click();
    await this.waitForLoad();
  }

  @step('Заполнить форму и загрузить фото')
  async uploadPhoto(params: {
    filePath: string;
    title: string;
    author: string;
    categoryId?: number;
    newCategoryName?: string;
    newSubcategoryName?: string;
    takenAt?: string;
  }): Promise<void> {
    await this.attachPhoto(params.filePath);
    await this.fillTitle(params.title);
    await this.fillAuthor(params.author);

    if (params.newCategoryName) {
      await this.createNewCategory(params.newCategoryName);
    } else if (params.categoryId) {
      await this.selectCategory(params.categoryId);
    }

    if (params.newSubcategoryName) {
      await this.createNewSubcategory(params.newSubcategoryName);
    }

    if (params.takenAt) {
      await this.fillTakenAt(params.takenAt);
    }

    await this.submitForm();
  }

  async isPreviewVisible(): Promise<boolean> {
    return this.previewImage.isVisible();
  }

    async getSuccessMessage(): Promise<string> {
    return (await this.successAlert.textContent()) ?? '';
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorAlert.textContent()) ?? '';
  }
}