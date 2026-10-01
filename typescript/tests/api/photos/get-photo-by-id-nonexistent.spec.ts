import { test, expect } from '#fixtures/fixtures';
import { HTTP } from '#utils/constants';

test('фотографии: отклонение запроса с кодом 404 при поиске несуществующего идентификатора', async ({
  photoApi,
}) => {
  const nonexistentPhotoId = 999_999_999;
  const response = await photoApi.getById(nonexistentPhotoId);

  expect(response.status()).toBe(HTTP.NOT_FOUND);
});
