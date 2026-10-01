import { test, expect } from '#fixtures/fixtures';
import { ADMIN_USERNAME, HTTP } from '#utils/constants';

test('авторизация: Вход с неверным паролем', async ({ authApi }) => {
  const wrongPassword = 'XCBjmxdo3r0';

  const response = await authApi.login({
    username: ADMIN_USERNAME,
    password: wrongPassword,
  });

  expect(response.status()).toBe(HTTP.UNAUTHORIZED);
});
