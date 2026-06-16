import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { generate } from "../../../src/utils/generators";
import { GalleryPage } from "../../../src/pages/GalleryPage";
import { AdminCommentsPage } from "../../../src/pages/AdminCommentsPage";
import { PhotoPage } from "../../../src/pages/PhotoPage";

test("Администратор отклоняет комментарий, и он остается скрытым для пользователей", async ({
  uiAuthHelper,
  page,
  captchaHelper,
  photoClient,
  commentClient,
  categoryClient,
}) => {
  const galleryPage = new GalleryPage(page);
  const categoryName = `${generate.categoryData().name}-cat`;
  const adminCommentsPage = new AdminCommentsPage(page);
  const photoPage = new PhotoPage(page);
  const category = await categoryClient.create(categoryName);
  const photoData = generate.photoData({ categoryId: category.id });
  const photo = await photoClient.upload(
    generate.fixturePath("1.jpg"),
    photoData,
  );

  const captcha = await captchaHelper.solveCaptcha();
  const commentData = generate.commentData(photo.id);
  const comment = await commentClient.createInIsolation(commentData, captcha);

  await uiAuthHelper.loginAsAdmin();

  await adminCommentsPage.goto();
  await adminCommentsPage.rejectComment(comment.id);

  await galleryPage.goto();
  await galleryPage.selectCategoryByName(categoryName);
  await galleryPage.openPhoto(photoData.title);
  await photoPage.scrollToBottom();
  
  await expect(photoPage.commentsEmpty).toBeVisible();
});
