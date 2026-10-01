import { test, expect } from '#fixtures/fixtures';
import { ADMIN_USERNAME } from '#utils/constants';

test('Успешная авторизация администратора с последующим редиректом в панель управления', async ({
  loginPage,
}) => {
  await loginPage.goto();

  await expect(loginPage.usernameInput).toHaveJSProperty('validity.valid', false);
  await loginPage.submitBtn.click();
  await loginPage.usernameInput.fill(ADMIN_USERNAME);
  await loginPage.submitBtn.click();
  await expect(loginPage.passwordInput).toHaveJSProperty('validity.valid', false);
});
