import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { generate } from "../../../src/utils/generators";
import { AdminCommentsPage } from "../../../src/pages/AdminCommentsPage";

test("Администратор применяет фильтр отклонённых комментариев и видит только отклонённые комментарии", async ({
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

  const rejectedCommentCaptcha = await captchaHelper.solveCaptcha();
  const rejectedCommentData = generate.commentData(photo.id);
  const rejectedComment = await commentClient.createInIsolation(
    rejectedCommentData,
    rejectedCommentCaptcha,
  );

  const pendingCommentCaptcha = await captchaHelper.solveCaptcha();
  const pendingCommentData = generate.commentData(photo.id);
  const pendingComment = await commentClient.createInIsolation(
    pendingCommentData,
    pendingCommentCaptcha,
  );

  await uiAuthHelper.loginAsAdmin();

  await adminCommentsPage.goto();
  await adminCommentsPage.waitForCommentVisible(rejectedComment.id);
  await adminCommentsPage.rejectComment(rejectedComment.id);
  await adminCommentsPage.filterRejected();

  await expect(
    adminCommentsPage.commentByText(rejectedComment.text),
  ).toBeVisible();
  await expect(
    adminCommentsPage.commentByText(pendingComment.text),
  ).toBeHidden();
});
