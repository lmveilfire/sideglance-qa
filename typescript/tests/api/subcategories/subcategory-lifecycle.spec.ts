import { test, expect } from '#fixtures/fixtures';
import { generate } from '#utils/generators';

test('подкатегории: полный жизненный цикл от создания до окончательного удаления', async ({
  categoryClient,
  subcategoryClient,
}) => {
  const category = await categoryClient.create(generate.categoryData().name);
  const subcategory = await subcategoryClient.create(category.id, generate.categoryData().name);
  const { id: subId } = subcategory;

  const subcategoryList = await subcategoryClient.listByCategoryId(category.id);
  expect(
    subcategoryList.some((s) => s.id === subId),
    `подкатегория id=${subId} должна быть в ответе`,
  ).toBe(true);

  await subcategoryClient.delete(subId);

  const body = await subcategoryClient.listByCategoryId(category.id);

  expect(
    body.some((s) => s.id === subId),
    `подкатегория id=${subId} name="${subcategory.name}" не должна быть в ответе`,
  ).toBe(false);
});
