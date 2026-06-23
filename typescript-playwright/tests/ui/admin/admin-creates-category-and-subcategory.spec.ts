import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { AdminUploadPage } from "../../../src/pages/AdminUploadPage.ts";
import { GalleryPage } from "../../../src/pages/GalleryPage.ts";
import { generate } from "../../../src/utils/generators.ts";

test("Администратор создает категорию и подкатегорию и видит их в боковой панели", async ({
  uiAuthHelper,
  page,
}) => {
  const categoryName = `${generate.categoryData().name}-cat`;
  const subcategoryName = `${generate.categoryData().name}-sub`;
  const dashboardPage = new AdminUploadPage(page);
  const galleryPage = new GalleryPage(page);

  await uiAuthHelper.loginAsAdmin();

  await dashboardPage.createNewCategory(categoryName);
  await dashboardPage.selectCategoryByName(categoryName);
  await dashboardPage.createNewSubcategory(subcategoryName);

  await dashboardPage.backToHome();

  await expect(galleryPage.categoryItemByName(categoryName)).toBeVisible();

  await galleryPage.selectCategoryByName(categoryName);
  
  await expect(
    galleryPage.subcategoryItemByName(subcategoryName),
  ).toBeVisible();
});
