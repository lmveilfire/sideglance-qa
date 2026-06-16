import { test, expect } from "../../src/fixtures/fixtures.ts";
import { generate } from "../../src/utils/generators.ts";
import { SubcategoryMatcher } from "../../src/utils/matchers.ts";

test.describe("GET /subcategories?categoryId={id}", () => {
  test("TC-SUB-01: возвращает 200 и массив, содержащий все созданные подкатегории", async ({
    categoryClient,
    subcategoryClient,
  }) => {
    const { name: catName } = generate.categoryData();
    const category = await categoryClient.create(catName);

    const created: Array<{ id: number; name: string }> = [];
    const COUNT = 10;

    for (let i = 0; i < COUNT; i++) {
      const { name } = generate.categoryData();
      const subcategory = await subcategoryClient.create(category.id, name);
      created.push(subcategory);
    }

    const body = await subcategoryClient.listByCategoryId(category.id);
    expect(body).toHaveLength(COUNT);

    const returnedIds = new Set(body.map((s) => s.id));
    for (const sub of created) {
      expect(
        returnedIds.has(sub.id),
        `подкатегория id=${sub.id} name="${sub.name}" должна быть в ответе`,
      ).toBe(true);
    }
  });

  test("SUB-02 — пустая категория: возвращает 200 и пустой массив", async ({
    categoryClient,
    subcategoryClient,
  }) => {
    const { name } = generate.categoryData();
    const category = await categoryClient.create(name);

    const body = await subcategoryClient.listByCategoryId(category.id);
    expect(body).toHaveLength(0);
  });
});

test.describe("POST /subcategories", () => {
  test("TC-SUB-03 — с токеном: тело ответа содержит id, name, categoryId", async ({
    categoryClient,
    subcategoryClient,
  }) => {
    const { name: catName } = generate.categoryData();
    const category = await categoryClient.create(catName);

    const subName = generate.categoryData().name;
    await subcategoryClient.create(category.id, subName);

    const subcategoryList = await subcategoryClient.listByCategoryId(
      category.id,
    );
    const sub = subcategoryList[0];

    expect(sub).toEqual(SubcategoryMatcher.base);
  });

  test("TC-SUB-04 — полный цикл: создание + проверка в списке + удаление", async ({
    categoryClient,
    subcategoryClient,
  }) => {
    const { name: catName } = generate.categoryData();
    const category = await categoryClient.create(catName);

    const { name: subName } = generate.categoryData();
    const subcategory = await subcategoryClient.create(category.id, subName);
    const { id: subId } = subcategory;

    const subcategoryList = await subcategoryClient.listByCategoryId(
      category.id,
    );
    const afterCreate = new Set(subcategoryList.map((s) => s.id));

    expect(
      afterCreate.has(subId),
      `подкатегория id=${catName} name="${subName}" должна быть в ответе`,
    ).toBe(true);

    await subcategoryClient.delete(subId);

    const body = await subcategoryClient.listByCategoryId(category.id);
    const afterDelete = new Set(body.map((s) => s.id));

    expect(
      afterDelete.has(subId),
      `подкатегория id=${catName} name="${subName}" не должна быть в ответе`,
    ).toBe(false);
  });
});
