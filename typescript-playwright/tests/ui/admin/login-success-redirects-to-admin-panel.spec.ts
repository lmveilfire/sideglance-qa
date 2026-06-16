import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { LoginPage } from "../../../src/pages/LoginPage";
import { AdminUploadPage } from "../../../src/pages/AdminUploadPage";
import { ADMIN_USERNAME, ADMIN_PASSWORD } from "../../../src/utils/constants";

test("Успешная авторизация администратора с валидными данными и перенаправление в админ-панель", async ({
  page,
}) => {
  const url = "/admin-panel/upload";
  const loginPage = new LoginPage(page);
  const dashboardPage = new AdminUploadPage(page);

  await loginPage.goto();
  await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
  
  await expect(page).toHaveURL(url);
  await expect(dashboardPage.navUpload).toBeVisible();
});
