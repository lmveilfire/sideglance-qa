import { test, expect } from '#fixtures/fixtures';
import { ADMIN_USERNAME } from '#utils/constants';

test('Администратор не может войти с неверным паролем и остается на странице авторизации', async ({
  page,
  loginPage,
}) => {
  const invalidPassword = 'wrong_password';
  const errorMessage = "The key doesn't match this lock.";

  await loginPage.goto();
  await loginPage.login(ADMIN_USERNAME, invalidPassword);

  await expect(page).toHaveURL(loginPage.URL_PATH);
  await expect(loginPage.errorMessage).toContainText(errorMessage);
});
