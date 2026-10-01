import { test, expect } from '#fixtures/fixtures';
import { generate } from '#utils/generators';
import type { CategoryDto } from '#utils/schemas';

test('категории: Получение полного списка всех созданных категорий', async ({ categoryClient }) => {
  const created: CategoryDto[] = [];
  const categoryCount = 5;

  for (let i = 0; i < categoryCount; i++) {
    const category = await categoryClient.create(generate.categoryData().name);
    created.push(category);
  }

  const listResponse = await categoryClient.categoryList();

  const returnedIds = new Set(listResponse.map((c) => c.id));
  for (const cat of created) {
    expect(
      returnedIds.has(cat.id),
      `категория id=${cat.id} name="${cat.name}" должна быть в ответе`,
    ).toBe(true);
  }
});
