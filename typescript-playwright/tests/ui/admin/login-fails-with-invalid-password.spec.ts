import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { LoginPage } from "../../../src/pages/LoginPage";
import { ADMIN_USERNAME } from "../../../src/utils/constants";

test("Администратор не может войти с неверным паролем и остается на странице авторизации", async ({
  page,
}) => {
  const invalidPassword = "invalidpassword";
  const errorMessage = "The key doesn't match this lock.";
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(ADMIN_USERNAME, invalidPassword);
  
  await expect(page).toHaveURL("/login");
  await expect(loginPage.errorMessage).toContainText(errorMessage);
});
