import { test, expect } from '#fixtures/fixtures';
import { createPhotoWithCategory } from '#helpers/photoHelpers';

test('фотографии: успешное увеличение счетчика лайков при оценке фотографии пользователем', async ({
  photoClient,
  categoryClient,
}) => {
  const [photo] = await createPhotoWithCategory(categoryClient, photoClient);

  const body = await photoClient.like(photo.id);

  expect(body.totalLikes).toBe(1);
});
