import { test, expect } from '#fixtures/fixtures';
import { generate } from '#utils/generators';
import { createPhotoList } from '#helpers/photoHelpers';

test('фотографии: отображение всех загруженных фотографий на главной странице галереи', async ({
  galleryPage,
  categoryClient,
  photoClient,
}) => {
  const count = 6;

  const category = await categoryClient.create(generate.categoryData().name);
  const photoList = await createPhotoList(category.id, photoClient, count);

  await galleryPage.goto();
  await galleryPage.selectCategoryByName(category.name);

  for (const photo of photoList) {
    await expect(galleryPage.photoByAlt(photo.title)).toBeVisible();
  }
});
