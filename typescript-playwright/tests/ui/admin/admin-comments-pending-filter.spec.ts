import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { generate } from "../../../src/utils/generators";
import { AdminCommentsPage } from "../../../src/pages/AdminCommentsPage";

test('Администратор видит только ожидающие модерацию комментарии при активном фильтре "Ожидающие"', async ({
  uiAuthHelper,
  page,
  captchaHelper,
  photoClient,
  commentClient,
  categoryClient,
}) => {
  const categoryName = `${generate.categoryData().name}-cat`;
  const adminCommentsPage = new AdminCommentsPage(page);
  const category = await categoryClient.create(categoryName);
  const photoData = generate.photoData({ categoryId: category.id });
  const photo = await photoClient.upload(
    generate.fixturePath("1.jpg"),
    photoData,
  );

  const pendingCommentCaptcha = await captchaHelper.solveCaptcha();
  const pendingCommentData = generate.commentData(photo.id);
  await commentClient.createInIsolation(
    pendingCommentData,
    pendingCommentCaptcha,
  );

  const approvedCommentCaptcha = await captchaHelper.solveCaptcha();
  const approvedCommentData = generate.commentData(photo.id);
  const approvedComment = await commentClient.createInIsolation(
    approvedCommentData,
    approvedCommentCaptcha,
  );

  await uiAuthHelper.loginAsAdmin();

  await adminCommentsPage.goto();
  await adminCommentsPage.waitForCommentVisible(approvedComment.id);
  await adminCommentsPage.approveComment(approvedComment.id);
  await adminCommentsPage.filterPending();
  
  await expect(
    adminCommentsPage.commentByText(pendingCommentData.text),
  ).toBeVisible();
  await expect(
    adminCommentsPage.commentByText(approvedCommentData.text),
  ).toBeHidden();
});
