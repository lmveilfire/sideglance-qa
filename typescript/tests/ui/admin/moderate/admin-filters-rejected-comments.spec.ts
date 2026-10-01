import { test, expect } from '#fixtures/fixtures';
import { createPhotoWithCategory } from '#helpers/photoHelpers';
import { createCommentList } from '#helpers/commentHelpers';

test('комментарии: фильтр "отклоненные" отображает только отклоненные комментарии', async ({
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
  await moderateCommentsPage.filterPending();

  await moderateCommentsPage.waitForCommentVisible(commentToApprove.id);
  await moderateCommentsPage.approveComment(commentToApprove.id);

  await moderateCommentsPage.waitForCommentVisible(commentToReject.id);
  await moderateCommentsPage.rejectComment(commentToReject.id);

  await moderateCommentsPage.filterRejected();

  await expect(moderateCommentsPage.commentItem(commentToApprove.id)).not.toBeVisible();
  await expect(moderateCommentsPage.commentItem(commentToKeepPending.id)).not.toBeVisible();

  await expect(moderateCommentsPage.commentItem(commentToReject.id)).toBeVisible();
});
