import { test, expect } from '#fixtures/fixtures';
import { generate } from '#utils/generators';

test('категория: создание, отображение в списке и удаление', async ({ categoryClient }) => {
  const category = await categoryClient.create(generate.categoryData().name);

  const listResponse = await categoryClient.categoryList();
  expect(listResponse.some((c) => c.id === category.id)).toBe(true);

  await categoryClient.delete(category.id);

  const listAfterDelete = await categoryClient.categoryList();
  expect(listAfterDelete.some((c) => c.id === category.id)).toBe(false);
});
