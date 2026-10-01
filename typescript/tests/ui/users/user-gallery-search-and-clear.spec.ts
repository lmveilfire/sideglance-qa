import { test, expect } from '#fixtures/fixtures';
import { createPhotosInDifferentCategories } from '#helpers/photoHelpers';

test('фотографии: поиск фотографий по текстовому запросу и очистка результатов поиска', async ({
  galleryPage,
  categoryClient,
  photoClient,
}) => {
  const freePhotoTitle = 'never give up';
  const photoList = await createPhotosInDifferentCategories(categoryClient, photoClient, 6);

  await galleryPage.goto();

  const targetPhoto = photoList[2][0];
  await galleryPage.searchPhoto(targetPhoto.title);

  await expect(galleryPage.photoByAlt(targetPhoto.title)).toBeVisible();

  await galleryPage.clearSearch();
  await galleryPage.searchPhoto(freePhotoTitle);

  await expect(galleryPage.emptyStateMessage).toBeVisible();
});
