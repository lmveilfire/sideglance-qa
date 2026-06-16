import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { step } from "../utils/decorators.ts";

export class AdminCommentsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get approvedCommentsFilter(): Locator {
    return this.page.locator('[data-testid="filter-approved"]');
  }
  get rejectedCommentsFilter(): Locator {
    return this.page.locator('[data-testid="filter-rejected"]');
  }
  get pendingCommentsFilter(): Locator {
    return this.page.locator('[data-testid="filter-pending"]');
  }

  private commentApproveBtn(commentId: number): Locator {
    return this.page.locator(`[data-testid="comment-approve-${commentId}"]`);
  }

  private commentRejectBtn(commentId: number): Locator {
    return this.page.locator(`[data-testid="comment-reject-${commentId}"]`);
  }

  private commentDeleteBtn(commentId: number): Locator {
    return this.page.locator(`[data-testid="comment-delete-${commentId}"]`);
  }

  private commentItem(commentId: number): Locator {
    return this.page.locator(`[data-testid="comment-${commentId}"]`);
  }

  commentByText(text: string): Locator {
    return this.page
      .locator('[data-testid^="comment-text-"]')
      .filter({ hasText: text });
  }

  @step("Открыть страницу комментариев")
  async goto(): Promise<void> {
    await this.page.goto("/admin-panel/comments");
  }

  @step("Фильтр: одобренные комментарии")
  async filterApproved(): Promise<void> {
    await this.approvedCommentsFilter.click();
  }

  @step("Фильтр: отклонённые комментарии")
  async filterRejected(): Promise<void> {
    await this.rejectedCommentsFilter.click();
  }

  @step("Фильтр: ожидающие комментарии")
  async filterPending(): Promise<void> {
    await this.pendingCommentsFilter.click();
  }

  @step("Одобрить комментарий")
  async approveComment(commentId: number): Promise<void> {
    await this.commentApproveBtn(commentId).click();
  }

  @step("Отклонить комментарий")
  async rejectComment(commentId: number): Promise<void> {
    await this.commentRejectBtn(commentId).click();
  }

  @step("Удалить комментарий")
  async deleteComment(commentId: number): Promise<void> {
    await this.commentDeleteBtn(commentId).click();
  }

  @step("Дождаться отображения комментария")
  async waitForCommentVisible(commentId: number): Promise<void> {
    await this.commentItem(commentId).waitFor({ state: "visible" });
  }
}
