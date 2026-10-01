import { test, expect } from '#fixtures/fixtures';
import { HTTP, INVALID_TOKEN } from '#utils/constants';

test('авторизация: Отклонение сессии при невалидном токене обновления', async ({ authApi }) => {
  const response = await authApi.refresh(INVALID_TOKEN);

  expect(response.status()).toBe(HTTP.FORBIDDEN);
});
