import { test, expect } from '#fixtures/fixtures';
import { generate } from '#utils/generators';
import type { SubcategoryDto } from '#utils/schemas';

test('подкатегории: получение списка всех массово созданных подкатегорий внутри одной категории', async ({
  categoryClient,
  subcategoryClient,
}) => {
  const category = await categoryClient.create(generate.categoryData().name);

  const created: SubcategoryDto[] = [];
  const subcategoriesCount = 10;

  for (let i = 0; i < subcategoriesCount; i++) {
    const { name } = generate.categoryData();
    const subcategory = await subcategoryClient.create(category.id, name);
    created.push(subcategory);
  }

  const body = await subcategoryClient.listByCategoryId(category.id);
  expect(body).toHaveLength(subcategoriesCount);

  for (const sub of created) {
    expect(
      body.some((s) => s.id === sub.id),
      `подкатегория id=${sub.id} name="${sub.name}" должна быть в ответе`,
    ).toBe(true);
  }
});
