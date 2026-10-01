import { test, expect } from '#fixtures/fixtures';
import { HTTP } from '#utils/constants';

test('категории: удаление при запросе с несуществующим идентификатором', async ({
  categoryApi,
}) => {
  const categoryId = 999;
  const response = await categoryApi.deleteCategory(categoryId);

  expect(response.status()).toBe(HTTP.NO_CONTENT);
});
