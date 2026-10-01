import { test, expect } from '#fixtures/fixtures';
import { CategoryApi } from '#api/CategoryApi';
import { HTTP } from '#utils/constants';
import { generate } from '#utils/generators';
import { CategoryDtoSchema } from '#utils/schemas';

test('категории: Запрет удаления категории без авторизационного токена', async ({
  request,
  categoryApi,
}) => {
  const createResponse = await categoryApi.create(generate.categoryData().name);

  expect([HTTP.OK, HTTP.CREATED]).toContain(createResponse.status());
  const { id } = CategoryDtoSchema.parse(await createResponse.json());

  const unauthApi = new CategoryApi(request, {});
  const response = await unauthApi.deleteCategory(id);

  expect(response.status()).toBe(HTTP.FORBIDDEN);
});
