import  { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.ts';
import { step } from '../utils/decorators.ts';

export class PhotoPage extends BasePage {
  readonly photo: Locator;
  readonly likeButton: Locator;
  readonly viewsCount: Locator;
  readonly carouselNext: Locator;
  readonly carouselPrev: Locator;
  readonly carouselCounter: Locator;
  readonly commentsSection: Locator;
  readonly commentsList: Locator;
  readonly commentsEmpty: Locator;
  readonly photoMeta: Locator;
  readonly photoTitle: Locator;
  readonly photoPlace: Locator;
  readonly photoDate: Locator;

  constructor(page: Page) {
    super(page);
    this.photo = this.testId('photo-img-large');
    this.likeButton = this.testId('photo-like');
    this.viewsCount = this.testId('photo-views');
    this.carouselNext = this.testId('carousel-next');
    this.carouselPrev = this.testId('carousel-prev');
    this.carouselCounter = this.testId('carousel-counter');
    this.commentsSection = this.testId('comments-section');
    this.commentsList = this.testId('comments-list');
    this.commentsEmpty = this.testId('comments-empty');
    this.photoMeta = this.testId('photo-meta');
    this.photoTitle = this.testId('photo-title');
    this.photoPlace = this.testId('photo-place');
    this.photoDate = this.testId('photo-date');
  }

  private commentItems(): Locator {
    return this.testIdStartsWith('comment-');
  }

  @step('Открыть страницу фото')
  async open(photoId: number): Promise<void> {
    await this.page.goto(`/photo/${photoId}`);
    await this.waitForLoad();
  }

  getCurrentPhotoId(): number {
    const url = this.page.url();
    return parseInt(url.split('/').pop() || '0', 10);
  }

  @step('Поставить лайк')
  async like(): Promise<void> {
    await this.likeButton.click();
  }

  @step('Перейти к следующему фото')
  async goNext(): Promise<void> {
    await this.carouselNext.click();
    await this.waitForLoad();
  }

  @step('Перейти к предыдущему фото')
  async goPrev(): Promise<void> {
    await this.carouselPrev.click();
    await this.waitForLoad();
  }

  async isPhotoDisplayed(title: string): Promise<boolean> {
    return this.page.getByAltText(title).isVisible();
  }

  async isNextDisabled(): Promise<void> {
    await expect(this.carouselNext).toBeDisabled();
  }

  async isPrevDisabled(): Promise<void> {
    await expect(this.carouselPrev).toBeDisabled();
  }

  async getCarouselPosition(): Promise<{ current: number; total: number }> {
    const text = await this.carouselCounter.textContent() || '1 / 1';

    const parts = text.split('/').map(s => parseInt(s.trim(), 10));
    const current = parts[0] ?? 1;
    const total = parts[1] ?? 1;
    return { current, total };
  }

  async getViewsCount(): Promise<number> {
    const text = await this.viewsCount.textContent() || '0';
    return parseInt(text.replace(/\D/g, ''), 10);
  }

  async getCommentsCount(): Promise<number> {
    return this.commentItems().count();
  }
}