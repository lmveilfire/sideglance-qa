import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage.ts";
import { step } from "../utils/decorators.ts";

export class PhotoPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get photo(): Locator {
    return this.page.locator('[data-testid="photo-img-large"]');
  }
  get likeButton(): Locator {
    return this.page.locator('[data-testid="photo-like"]');
  }
  get viewsCount(): Locator {
    return this.page.locator('[data-testid="photo-views"]');
  }
  get carouselNext(): Locator {
    return this.page.locator('[data-testid="carousel-next"]');
  }
  get carouselPrev(): Locator {
    return this.page.locator('[data-testid="carousel-prev"]');
  }
  get commentsEmpty(): Locator {
    return this.page.locator('[data-testid="comments-empty"]');
  }
  get photoMeta(): Locator {
    return this.page.locator('[data-testid="photo-meta"]');
  }
  get photoTitle(): Locator {
    return this.page.locator('[data-testid="photo-title"]');
  }
  get photoPlace(): Locator {
    return this.page.locator('[data-testid="photo-place"]');
  }
  get photoDate(): Locator {
    return this.page.locator('[data-testid="photo-date"]');
  }
  get lightbox(): Locator {
    return this.page.locator('[data-testid="lightbox"]');
  }
  get closeLightboxButton(): Locator {
    return this.page.locator('[data-testid="close-btn"]');
  }

  private commentItem(commentId: number): Locator {
    return this.page.locator(`[data-testid="comment-item-${commentId}"]`);
  }

  commentByAuthor(author: string): Locator {
    return this.page
      .locator('[data-testid^="comment-author-"]')
      .filter({ hasText: author });
  }

  commentByText(text: string): Locator {
    return this.page
      .locator('[data-testid^="comment-text-"]')
      .filter({ hasText: text });
  }

  photoByAlt(altText: string): Locator {
    return this.page.getByAltText(altText);
  }

  @step("Открыть страницу фото")
  async open(photoId: number): Promise<void> {
    await this.page.goto(`/photo/${photoId}`);
  }

  @step("Перейти к следующему фото")
  async goNext(): Promise<void> {
    await this.carouselNext.click();
  }

  @step("Перейти к предыдущему фото")
  async goPrev(): Promise<void> {
    await this.carouselPrev.click();
  }

  @step("Дождаться отображения комментария")
  async waitForCommentVisible(commentId: number): Promise<void> {
    await this.commentItem(commentId).waitFor({ state: "visible" });
  }
}
