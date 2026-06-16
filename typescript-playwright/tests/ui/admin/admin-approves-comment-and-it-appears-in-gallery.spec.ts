import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { generate } from "../../../src/utils/generators";
import { GalleryPage } from "../../../src/pages/GalleryPage";
import { AdminCommentsPage } from "../../../src/pages/AdminCommentsPage";
import { PhotoPage } from "../../../src/pages/PhotoPage";

test("Администратор одобряет комментарий, и он появляется на странице фотографии", async ({
  uiAuthHelper,
  page,
  captchaHelper,
  photoClient,
  commentClient,
  categoryClient,
}) => {
  const categoryName = `${generate.categoryData().name}-cat`;
  const galleryPage = new GalleryPage(page);
  const adminCommentsPage = new AdminCommentsPage(page);
  const photoPage = new PhotoPage(page);
  const category = await categoryClient.create(categoryName);
  const photoData = generate.photoData({ categoryId: category.id });
  const photo = await photoClient.upload(
    generate.fixturePath(`1.jpg`),
    photoData,
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
  await adminCommentsPage.backToHome();

  await expect(galleryPage.categoryItemByName(categoryName)).toBeVisible();

  await galleryPage.selectCategoryByName(categoryName);
  await galleryPage.openPhoto(photoData.title);
  await photoPage.scrollToBottom();
  await photoPage.waitForCommentVisible(approvedComment.id);
  
  await expect(photoPage.commentByText(approvedComment.text)).toBeVisible();
});
