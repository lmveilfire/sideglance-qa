import { test, expect } from '#fixtures/fixtures';
import { ADMIN_PASSWORD, ADMIN_USERNAME, HTTP } from '#utils/constants';
import { AuthResponseSchema } from '#utils/schemas';

test('авторизация: Успешное обновление пары JWT-токенов', async ({ authApi }) => {
  const jwtSegmentsCount = 3;

  const loginResponse = await authApi.login({
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD,
  });

  expect(loginResponse.status()).toBe(HTTP.OK);

  const loginData = AuthResponseSchema.parse(await loginResponse.json());

  const refreshResponse = await authApi.refresh(loginData.refreshToken);
  expect(refreshResponse.status()).toBe(HTTP.OK);

  const refreshData = AuthResponseSchema.parse(await refreshResponse.json());

  expect(refreshData.accessToken).toBeDefined();
  expect(refreshData.accessToken.split('.')).toHaveLength(jwtSegmentsCount);
  expect(refreshData.username).toBe(ADMIN_USERNAME);
});
