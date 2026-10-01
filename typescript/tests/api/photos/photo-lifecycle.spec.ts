import { test, expect } from '#fixtures/fixtures';
import { HTTP } from '#utils/constants';
import { createPhotoWithCategory } from '#helpers/photoHelpers';

test('фотографии: полный жизненный цикл фотографии от загрузки до окончательного удаления', async ({
  photoClient,
  photoApi,
  categoryClient,
}) => {
  const [photo] = await createPhotoWithCategory(categoryClient, photoClient);

  const body = await photoClient.getById(photo.id);
  expect(body.id).toBe(photo.id);

  await photoClient.delete(photo.id);

  const getAfterDelete = await photoApi.getById(photo.id);
  expect(getAfterDelete.status()).toBe(HTTP.NOT_FOUND);
});
