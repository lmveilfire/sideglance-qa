import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { generate } from "../../../src/utils/generators.ts";
import { AdminUploadPage } from "../../../src/pages/AdminUploadPage.ts";

test("Администратор удаляет прикреплённый файл фотографии из формы загрузки", async ({
  uiAuthHelper,
  page,
}) => {
  const dashboardPage = new AdminUploadPage(page);
  await uiAuthHelper.loginAsAdmin();

  await dashboardPage.attachPhoto(generate.fixturePath("1.jpg"));

  await expect(dashboardPage.previewImage).toBeVisible();

  await dashboardPage.removePhoto();
  
  await expect(dashboardPage.previewImage).toBeHidden();
});
