import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { generate } from "../../../src/utils/generators";
import { GalleryPage } from "../../../src/pages/GalleryPage";
import { AdminUploadPage } from "../../../src/pages/AdminUploadPage";

test("Администратор загружает фотографию в подкатегорию, и она появляется в галерее", async ({
  uiAuthHelper,
  page,
  subcategoryClient,
  categoryClient,
}) => {
  const categoryName = `${generate.categoryData().name}-cat`;
  const subcategoryName = `${generate.categoryData().name}-sub`;
  const galleryPage = new GalleryPage(page);
  const dashboardPage = new AdminUploadPage(page);
  const photoData = generate.photoData();
  const takenAt = photoData.takenAt!;

  const category = await categoryClient.create(categoryName);
  await subcategoryClient.create(category.id, subcategoryName);

  await uiAuthHelper.loginAsAdmin();

  await dashboardPage.attachPhoto(generate.fixturePath("1.jpg"));

  await expect(dashboardPage.previewImage).toBeVisible();

  await dashboardPage.fillTitle(photoData.title);
  await dashboardPage.fillAuthor(photoData.author);
  await dashboardPage.selectCategoryByName(categoryName);
  await dashboardPage.selectSubcategoryByName(subcategoryName);
  await dashboardPage.fillTakenAt(takenAt);
  await dashboardPage.submitForm();

  await expect(dashboardPage.successAlert).toBeVisible();

  await dashboardPage.backToHome();
  await galleryPage.selectCategoryByName(categoryName);
  await galleryPage.selectSubcategoryByName(subcategoryName);
  
  await expect(galleryPage.photoByAlt(photoData.title)).toBeVisible();
});
