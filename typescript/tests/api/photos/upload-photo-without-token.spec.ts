import { test, expect } from '#fixtures/fixtures';
import { PhotoApi } from '#api/PhotoApi';
import { HTTP } from '#utils/constants';
import { generate } from '#utils/generators';
import { DEFAULT_FILE_PATH } from '#utils/constants';

test('фотографии: запрет загрузки новой фотографии на сервер без авторизационного токена', async ({
  request,
  categoryClient,
}) => {
  const category = await categoryClient.create(generate.categoryData().name);

  const unauthApi = new PhotoApi(request, {});

  const response = await unauthApi.upload(
    generate.fixturePath(DEFAULT_FILE_PATH),
    generate.photoData({ categoryId: category.id }),
  );

  expect(response.status()).toBe(HTTP.FORBIDDEN);
});
