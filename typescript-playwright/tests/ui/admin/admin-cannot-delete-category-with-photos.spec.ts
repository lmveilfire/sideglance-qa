import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { generate } from "../../../src/utils/generators.ts";
import { GalleryPage } from "../../../src/pages/GalleryPage.ts";
import { AdminUploadPage } from "../../../src/pages/AdminUploadPage.ts";

test("Администратор не может удалить категорию, которая содержит фотографии", async ({
  uiAuthHelper,
  page,
  categoryClient,
  photoClient,
}) => {
  const categoryName = `${generate.categoryData().name}-cat`;
  const dashboardPage = new AdminUploadPage(page);
  const galleryPage = new GalleryPage(page);
  const category = await categoryClient.create(categoryName);
  const photoData = generate.photoData({ categoryId: category.id });

  await photoClient.upload(generate.fixturePath(`1.jpg`), photoData);

  await uiAuthHelper.loginAsAdmin();

  await galleryPage.goto();
  await expect(galleryPage.categoryItemByName(categoryName)).toBeVisible();

  await galleryPage.selectCategoryByName(categoryName);
  await expect(galleryPage.photoByAlt(photoData.title)).toBeVisible();

  await galleryPage.deleteCategory(categoryName);

  await expect(galleryPage.categoryItemByName(categoryName)).toBeVisible();
  await expect(galleryPage.photoByAlt(photoData.title)).toBeVisible();

  await dashboardPage.goto();
  await dashboardPage.selectCategoryByName(categoryName);
  
  await expect(dashboardPage.categorySelect).toContainText(categoryName);
});
