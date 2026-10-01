import { test, expect } from '#fixtures/fixtures';
import { generate } from '#utils/generators';

test('подкатегории: валидация схемы ответа и привязки к родительской категории', async ({
  categoryClient,
  subcategoryClient,
}) => {
  const category = await categoryClient.create(generate.categoryData().name);

  await subcategoryClient.create(category.id, generate.categoryData().name);

  const subcategoryList = await subcategoryClient.listByCategoryId(category.id);

  expect(subcategoryList.length).toBeGreaterThan(0);
  expect(subcategoryList[0]?.categoryId).toBe(category.id);
});
