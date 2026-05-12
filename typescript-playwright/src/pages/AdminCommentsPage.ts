import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '../utils/decorators.ts';

export class AdminCommentsPage extends BasePage {
    readonly commentList: Locator;
    readonly approvedCommentsFilter: Locator;
    readonly rejectedCommentsFilter: Locator;
    readonly pendingCommentsFilter: Locator;
    readonly commentStats: Locator;
    readonly statTotal: Locator;
    readonly statPending: Locator;
    readonly statApproved: Locator;
    readonly statRejected: Locator;

    constructor(page: Page) {
      super(page);
      this.commentList = this.testId('comments-list');
      this.approvedCommentsFilter = this.testId('filter-approved');
      this.rejectedCommentsFilter = this.testId('filter-rejected');
      this.pendingCommentsFilter = this.testId('filter-pending');
      this.commentStats = this.testId('comment-stats');  
      this.statTotal = this.testId('stat-total');
      this.statPending = this.testId('stat-pending');
      this.statApproved = this.testId('stat-approved');
      this.statRejected = this.testId('stat-rejected');
    }

    private commentApproveBtn(commentId: number): Locator {
        return this.testId(`comment-approve-${commentId}`);
    }

    private commentRejectBtn(commentId: number): Locator {
        return this.testId(`comment-reject-${commentId}`);
    }

    private commentDeleteBtn(commentId: number): Locator {
        return this.testId(`comment-delete-${commentId}`);
    }

    private commentItem(commentId: number): Locator {
        return this.testId(`comment-${commentId}`);
    }

    @step('Открыть страницу комментариев')
    async goto(): Promise<void> {
        await this.page.goto('/admin-panel/comments');
        await this.waitForLoad();
    }

    @step('Фильтр: одобренные комментарии')
    async filterApproved(): Promise<void> {
        await this.approvedCommentsFilter.click();
        await this.waitForLoad();
    }

    @step('Фильтр: отклонённые комментарии')
    async filterRejected(): Promise<void> {
        await this.rejectedCommentsFilter.click();
        await this.waitForLoad();
    }

    @step('Фильтр: ожидающие комментарии')
    async filterPending(): Promise<void> {
        await this.pendingCommentsFilter.click();
        await this.waitForLoad();
    }

    @step('Одобрить комментарий')
    async approveComment(commentId: number): Promise<void> {
        await this.commentApproveBtn(commentId).click();
        await this.waitForLoad();
    }

    @step('Отклонить комментарий')
    async rejectComment(commentId: number): Promise<void> {
        await this.commentRejectBtn(commentId).click();
        await this.waitForLoad();
    }

    @step('Удалить комментарий')
    async deleteComment(commentId: number): Promise<void> {
        await this.commentDeleteBtn(commentId).click();
        await this.waitForLoad();
    }
    
    async isCommentVisible(commentId: number): Promise<boolean> {
        return this.commentItem(commentId).isVisible();
    }

    async isCommentWithTextVisible(text: string): Promise<boolean> {
        return this.commentList.locator(`text=${text}`).isVisible();
    }
}