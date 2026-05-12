import  { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.ts';
import { step } from '../utils/decorators.ts';

export class GalleryPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchClear: Locator;
  readonly sidebar: Locator;
  readonly categoryList: Locator;
  readonly burgerButton: Locator;
  readonly categoryDeleteButton: Locator;
  readonly subcategoryDeleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = this.testId('search-input');
    this.searchClear = this.testId('search-clear');
    this.sidebar = this.testId('sidebar');
    this.categoryList = this.testId('category-list');
    this.burgerButton = this.testId('burger-button');
    this.categoryDeleteButton = this.testId('category-delete-btn');
    this.subcategoryDeleteButton = this.testId('subcategory-delete-btn');
  }

  private categoryItem(categoryId: number): Locator {
    return this.testId(`category-${categoryId}`);
  }

  private subcategoryItem(categoryId: number, subcategoryId: number): Locator {
    return this.testId(`subcategory-${categoryId}-${subcategoryId}`);
  }

  private categoryDeleteBtn(categoryId: number): Locator {
    return this.categoryItem(categoryId).locator(this.categoryDeleteButton);
  }

  private subcategoryDeleteBtn(categoryId: number, subcategoryId: number): Locator {
    return this.subcategoryItem(categoryId, subcategoryId).locator(this.subcategoryDeleteButton);
  }

  private photoImg(photoId: number): Locator {
    return this.testId(`photo-img-${photoId}`);
  }

  @step('Открыть галерею')
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.waitForLoad();
  }

  @step('Поиск фото')
  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await expect(this.page.getByAltText(query)).toBeVisible();
  }

  async hasNoResults(): Promise<void> {
    await expect(this.testId('empty-title')).toBeVisible();
  }

  @step('Очистить поиск')
  async clearSearch(): Promise<void> {
    await this.searchClear.click();
  }

  @step('Выбрать категорию')
  async selectCategory(categoryId: number): Promise<void> {
    await this.categoryItem(categoryId).click();
    await this.waitForLoad();
  }

  @step('Выбрать подкатегорию')
  async selectSubcategory(categoryId: number, subcategoryId: number): Promise<void> {
    await this.subcategoryItem(categoryId, subcategoryId).click();
    await this.waitForLoad();
  }

  @step('Удалить категорию')
  async deleteCategory(categoryId: number): Promise<void> {
    await this.categoryDeleteBtn(categoryId).click();
    await this.waitForLoad();
  }

  @step('Удалить подкатегорию')
  async deleteSubcategory(categoryId: number, subcategoryId: number): Promise<void> {
    await this.subcategoryDeleteBtn(categoryId, subcategoryId).click();
    await this.waitForLoad();
  }

  @step('Открыть фото')
  async openPhoto(photoId: number): Promise<void> {
    await this.photoImg(photoId).click();
  }

  async isPhotoVisible(photoId: number): Promise<boolean> {
    return this.photoImg(photoId).isVisible();
  }

  async isSidebarVisible(): Promise<boolean> {
    return this.sidebar.isVisible();
  }

  async isCategoryVisible(categoryId: number): Promise<boolean> {
    return this.categoryItem(categoryId).isVisible();
  }

  async isSubcategoryVisible(categoryId: number, subcategoryId: number): Promise<boolean> {
    return this.subcategoryItem(categoryId, subcategoryId).isVisible();
  }
}