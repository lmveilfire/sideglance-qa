import { test, expect } from '#fixtures/fixtures';
import { generate } from '#utils/generators';

test('подкатегории: возвращение пустого списка при запросе для категории без подкатегорий', async ({
  categoryClient,
  subcategoryClient,
}) => {
  const category = await categoryClient.create(generate.categoryData().name);

  const body = await subcategoryClient.listByCategoryId(category.id);
  expect(body).toHaveLength(0);
});
