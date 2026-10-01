import { test, expect } from '#fixtures/fixtures';
import { createPhotoWithCategory } from '#helpers/photoHelpers';

test('фотографии: успешное получение данных фотографии по ее существующему идентификатору', async ({
  photoClient,
  categoryClient,
}) => {
  const [photo] = await createPhotoWithCategory(categoryClient, photoClient);

  const body = await photoClient.getById(photo.id);

  expect(body.id).toBe(photo.id);
});
