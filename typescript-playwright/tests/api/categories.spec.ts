import { test, expect } from '../../src/fixtures/fixtures.ts';
import { CategoryApi } from '../../src/api/CategoryApi.ts';
import { HTTP } from '../../src/utils/constants.ts';
import { generate } from '../../src/utils/generators.ts';
import {CategoryMatcher} from '../../src/utils/matchers.ts';

test.describe('GET /categories', () => {
  test('TC-CAT-01: возвращает 200 и массив, содержащий все созданные категории', async ({
    categoryClient,
    cleanup,
  }) => {
    const created: Array<{ id: number; name: string }> = [];
    const COUNT = 10;

    for (let i = 0; i < COUNT; i++) {
      const { name } = generate.categoryData();
      const category = await categoryClient.create(name);
      created.push(category);
      cleanup.register(() => categoryClient.delete(category.id));
    }

    const listResponse = await categoryClient.list();

    const returnedIds = new Set(listResponse.map((c) => c.id));
    for (const cat of created) {
      expect(
        returnedIds.has(cat.id),
        `категория id=${cat.id} name="${cat.name}" должна быть в ответе`
      ).toBe(true);
    }
  });
});

test.describe('POST /categories', () => {
  test('TC-CAT-02: полный цикл: создание + удаление', async ({
    categoryClient,
    cleanup,
  }) => {
    const { name } = generate.categoryData();
    const category = await categoryClient.create(name);
    cleanup.register(async () => await categoryClient.delete(category.id));
    expect(category).toEqual(CategoryMatcher.base);

    const listResponse = await categoryClient.list();
    expect(listResponse.some((c) => c.id === category.id)).toBe(true);

    await categoryClient.delete(category.id);
    const emptyList = await categoryClient.list();
    console.log('emptyList', emptyList);
    expect(emptyList.length).toBe(0);
  });
});

test.describe('DELETE /categories/{id}', () => {
  test('TC-CAT-03: без токена: возвращает 403', async ({
    request,
    categoryApi,
    cleanup,
  }) => {
    const { name } = generate.categoryData();
    const createResponse = await categoryApi.create(name);
        
    cleanup.register(async () => { 
      await categoryApi.deleteCategory(id); 
    });

    expect([HTTP.OK, HTTP.CREATED]).toContain(createResponse.status());
    const { id } = await createResponse.json() as { id: number };


    const unauthApi = new CategoryApi(request);
    const response = await unauthApi.deleteCategory(id);
    expect(response.status()).toBe(HTTP.FORBIDDEN);
  });

  test('TC-CAT-04: несуществующий id: возвращает 204', async ({
    categoryApi,
  }) => {
    const categotyId = 999;
    const response = await categoryApi.deleteCategory(categotyId);
    expect(response.status()).toBe(HTTP.NO_CONTENT);
  });
 });