import type { Page, Locator } from '@playwright/test';
import { BasePage } from '#pages/BasePage';
import { step } from '#utils/decorators';
import { STATE_VISIBLE } from '#utils/constants';

export class ModerateCommentsPage extends BasePage {
  readonly URL_PATH = '/admin-panel/comments';

  constructor(page: Page) {
    super(page);
  }

  get approvedCommentsFilterBtn(): Locator {
    return this.page.getByTestId('filter-approved');
  }
  get rejectedCommentsFilterBtn(): Locator {
    return this.page.getByTestId('filter-rejected');
  }
  get pendingCommentsFilterBtn(): Locator {
    return this.page.getByTestId('filter-pending');
  }

  private commentApproveBtn(commentId: number): Locator {
    return this.page.getByTestId(`comment-approve-${commentId}`);
  }

  private commentRejectBtn(commentId: number): Locator {
    return this.page.getByTestId(`comment-reject-${commentId}`);
  }

  private commentDeleteBtn(commentId: number): Locator {
    return this.page.getByTestId(`comment-delete-${commentId}`);
  }

  commentItem(commentId: number): Locator {
    return this.page.getByTestId(`comment-${commentId}`);
  }

  commentByText(text: string): Locator {
    return this.page.locator('[data-testid^="comment-text-"]').filter({ hasText: text });
  }

  @step
  async goto(): Promise<void> {
    await this.page.goto(this.URL_PATH);
  }

  @step
  async filterApproved(): Promise<void> {
    await this.approvedCommentsFilterBtn.click();
  }

  @step
  async filterRejected(): Promise<void> {
    await this.rejectedCommentsFilterBtn.click();
  }

  @step
  async filterPending(): Promise<void> {
    await this.pendingCommentsFilterBtn.click();
  }

  @step
  async approveComment(commentId: number): Promise<void> {
    await this.commentApproveBtn(commentId).click();
  }

  @step
  async rejectComment(commentId: number): Promise<void> {
    await this.commentRejectBtn(commentId).click();
  }

  @step
  async deleteComment(commentId: number): Promise<void> {
    await this.commentDeleteBtn(commentId).click();
  }

  @step
  async waitForCommentVisible(commentId: number): Promise<void> {
    await this.commentItem(commentId).waitFor({ state: STATE_VISIBLE });
  }
}
