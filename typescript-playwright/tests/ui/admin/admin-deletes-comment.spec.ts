import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { generate } from "../../../src/utils/generators";
import { AdminCommentsPage } from "../../../src/pages/AdminCommentsPage";

test("Администратор удаляет комментарий, и он полностью исчезает из системы", async ({
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

  const captcha = await captchaHelper.solveCaptcha();
  const comment = await commentClient.createInIsolation(
    generate.commentData(photo.id),
    captcha,
  );

  await uiAuthHelper.loginAsAdmin();

  await adminCommentsPage.goto();
  await adminCommentsPage.filterPending();
  await adminCommentsPage.deleteComment(comment.id);
  
  await expect(
    adminCommentsPage.commentByText(comment.text),
  ).not.toBeAttached();
});
