import { test, expect } from '#fixtures/fixtures';
import { createPhotoWithCategory } from '#helpers/photoHelpers';
import { createCommentList } from '#helpers/commentHelpers';

test('комментарии: фильтр "одобренные" отображает только одобренные комментарии, которые затем видны в галерее', async ({
  uiAuthHelper,
  captchaHelper,
  photoClient,
  commentClient,
  categoryClient,
  moderateCommentsPage,
  photoPage,
}) => {
  const [photo] = await createPhotoWithCategory(categoryClient, photoClient);
  const createdComments = await createCommentList(photo.id, commentClient, captchaHelper);
  const [commentToApprove, commentToReject, commentToKeepPending] = createdComments;

  await uiAuthHelper.loginAsAdmin();
  await moderateCommentsPage.goto();
  await moderateCommentsPage.filterPending();

  await moderateCommentsPage.waitForCommentVisible(commentToApprove.id);
  await moderateCommentsPage.approveComment(commentToApprove.id);

  await moderateCommentsPage.waitForCommentVisible(commentToReject.id);
  await moderateCommentsPage.rejectComment(commentToReject.id);

  await moderateCommentsPage.filterApproved();

  await expect(moderateCommentsPage.commentItem(commentToApprove.id)).toBeVisible();
  await expect(moderateCommentsPage.commentItem(commentToReject.id)).not.toBeVisible();
  await expect(moderateCommentsPage.commentItem(commentToKeepPending.id)).not.toBeVisible();

  await photoPage.open(photo.id);
  await photoPage.scrollToBottom();

  await photoPage.waitForCommentVisible(commentToApprove.id);

  await expect(photoPage.commentByText(commentToApprove.text)).toBeVisible();
  await expect(photoPage.commentByText(commentToReject.text)).not.toBeVisible();
  await expect(photoPage.commentByText(commentToKeepPending.text)).not.toBeVisible();
});
