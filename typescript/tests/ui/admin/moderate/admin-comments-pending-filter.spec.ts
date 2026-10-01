import { test, expect } from '#fixtures/fixtures';
import { createPhotoWithCategory } from '#helpers/photoHelpers';
import { createCommentList } from '#helpers/commentHelpers';

test('комментарии: фильтр "ожидающие" отображает только немодерированные комментарии', async ({
  uiAuthHelper,
  captchaHelper,
  photoClient,
  commentClient,
  categoryClient,
  moderateCommentsPage,
}) => {
  const [photo] = await createPhotoWithCategory(categoryClient, photoClient);
  const createdComments = await createCommentList(photo.id, commentClient, captchaHelper);

  const [commentToApprove, commentToReject, commentToKeepPending] = createdComments;

  await uiAuthHelper.loginAsAdmin();
  await moderateCommentsPage.goto();

  await moderateCommentsPage.waitForCommentVisible(commentToApprove.id);
  await moderateCommentsPage.approveComment(commentToApprove.id);

  await moderateCommentsPage.waitForCommentVisible(commentToReject.id);
  await moderateCommentsPage.rejectComment(commentToReject.id);

  await moderateCommentsPage.filterPending();

  await expect(moderateCommentsPage.commentItem(commentToKeepPending.id)).toBeVisible();
  await expect(moderateCommentsPage.commentItem(commentToApprove.id)).not.toBeVisible();
  await expect(moderateCommentsPage.commentItem(commentToReject.id)).not.toBeVisible();
});
