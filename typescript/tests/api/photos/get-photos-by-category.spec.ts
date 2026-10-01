import { test, expect } from '#fixtures/fixtures';
import { generate } from '#utils/generators';
import { createPhotoList } from '#helpers/photoHelpers';

test('фотографии: получение полного списка всех загруженных фотографий внутри конкретной категории', async ({
  photoClient,
  categoryClient,
}) => {
  const category = await categoryClient.create(generate.categoryData().name);
  const photosCount = 6;
  await createPhotoList(category.id, photoClient, photosCount);

  const body = await photoClient.listByCategory(category.id);

  expect(body.length).toBeGreaterThan(0);
});
