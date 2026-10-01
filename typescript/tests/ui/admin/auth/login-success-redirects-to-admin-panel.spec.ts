import { test, expect } from '#fixtures/fixtures';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '#utils/constants';

test('Успешная авторизация администратора с последующим редиректом в панель управления', async ({
  page,
  loginPage,
  photoUploadPage,
}) => {
  await loginPage.goto();
  await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);

  await expect(page).toHaveURL(photoUploadPage.URL_PATH);
});
