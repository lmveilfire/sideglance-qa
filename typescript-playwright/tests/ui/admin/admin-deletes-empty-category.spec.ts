import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { generate } from "../../../src/utils/generators.ts";
import { GalleryPage } from "../../../src/pages/GalleryPage.ts";
import { AdminUploadPage } from "../../../src/pages/AdminUploadPage.ts";

test("Администратор удаляет пустую категорию и проверяет её исчезновение из интерфейса", async ({
  uiAuthHelper,
  page,
  categoryClient,
}) => {
  const categoryName = `${generate.categoryData().name}-cat`;
  const dashboardPage = new AdminUploadPage(page);
  const galleryPage = new GalleryPage(page);

  await categoryClient.create(categoryName);

  await uiAuthHelper.loginAsAdmin();

  await galleryPage.goto();

  await expect(galleryPage.categoryItemByName(categoryName)).toBeVisible();

  await galleryPage.deleteCategory(categoryName);

  await expect(galleryPage.categoryItemByName(categoryName)).toBeHidden();

  await dashboardPage.goto();
  await dashboardPage.categorySelect.click();

  await expect(dashboardPage.categorySelect).not.toHaveText(categoryName);
});
