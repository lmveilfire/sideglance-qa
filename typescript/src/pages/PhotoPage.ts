import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { step } from '#utils/decorators';
import { STATE_VISIBLE } from '#utils/constants';

export class PhotoPage extends BasePage {
  readonly URL_PATH = '/photo';

  constructor(page: Page) {
    super(page);
  }

  get photo(): Locator {
    return this.page.getByTestId('photo-img-large');
  }
  get likeBtn(): Locator {
    return this.page.getByTestId('photo-like-btn');
  }
  get viewsCount(): Locator {
    return this.page.getByTestId('photo-views-count');
  }
  get carouselNextBtn(): Locator {
    return this.page.getByTestId('carousel-next-btn');
  }
  get carouselPrevBtn(): Locator {
    return this.page.getByTestId('carousel-prev-btn');
  }
  get commentsEmptyState(): Locator {
    return this.page.getByTestId('comments-empty-state');
  }
  get photoMeta(): Locator {
    return this.page.getByTestId('photo-meta');
  }

  get carouselCounter(): Locator {
    return this.page.getByTestId('carousel-counter');
  }
  get carouselCounterCurrent(): Locator {
    return this.page.getByTestId('carousel-counter-current');
  }
  get photoTitle(): Locator {
    return this.page.getByTestId('photo-title');
  }
  get photoPlace(): Locator {
    return this.page.getByTestId('photo-place');
  }
  get photoDate(): Locator {
    return this.page.getByTestId('photo-date');
  }
  get lightbox(): Locator {
    return this.page.getByTestId('lightbox');
  }
  get closeLightboxButton(): Locator {
    return this.page.getByTestId('close-lightbox-btn');
  }

  private commentItem(commentId: number): Locator {
    return this.page.getByTestId(`comment-item-${commentId}`);
  }

  commentByAuthor(author: string): Locator {
    return this.page.locator('[data-testid^="comment-author-"]').filter({ hasText: author });
  }

  commentByText(text: string): Locator {
    return this.page.locator('[data-testid^="comment-text-"]').filter({ hasText: text });
  }

  photoByAlt(altText: string): Locator {
    return this.page.getByAltText(altText);
  }

  @step
  async open(photoId: number): Promise<void> {
    await this.page.goto(`/photo/${photoId}`);
  }

  @step
  async goNext(): Promise<void> {
    await this.carouselNextBtn.click();
  }

  @step
  async goPrev(): Promise<void> {
    await this.carouselPrevBtn.click();
  }

  @step
  async waitForCommentVisible(commentId: number): Promise<void> {
    await this.commentItem(commentId).waitFor({ state: STATE_VISIBLE });
  }
}
