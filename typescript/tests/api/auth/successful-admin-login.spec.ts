import { test, expect } from '#fixtures/fixtures';
import { ADMIN_PASSWORD, ADMIN_USERNAME, HTTP } from '#utils/constants';
import { AuthResponseSchema } from '#utils/schemas';

test('авторизация: Успешный вход администратора по паролю', async ({ authApi }) => {
  const response = await authApi.login({
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD,
  });

  expect(response.status()).toBe(HTTP.OK);

  const data = AuthResponseSchema.parse(await response.json());

  expect(data.username).toBe(ADMIN_USERNAME);
});
