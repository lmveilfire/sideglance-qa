import { test, expect } from '#fixtures/fixtures';
import { createPhotoWithCategory } from '#helpers/photoHelpers';
import { generate } from '#utils/generators';

test('комментарии: успешное удаление комментария администратором в панели модерации', async ({
  uiAuthHelper,
  captchaHelper,
  photoClient,
  commentClient,
  categoryClient,
  moderateCommentsPage,
}) => {
  const [photo] = await createPhotoWithCategory(categoryClient, photoClient);
  const captcha = await captchaHelper.solveCaptcha();
  const created = await commentClient.createInIsolation(generate.commentData(photo.id), captcha);

  await uiAuthHelper.loginAsAdmin();
  await moderateCommentsPage.goto();
  await moderateCommentsPage.filterPending();
  await moderateCommentsPage.waitForCommentVisible(created.id);
  await moderateCommentsPage.deleteComment(created.id);

  await expect(moderateCommentsPage.commentByText(created.text)).not.toBeVisible();
});
