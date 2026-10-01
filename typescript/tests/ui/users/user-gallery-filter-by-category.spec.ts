import { test, expect } from '#fixtures/fixtures';
import { createPhotoWithCategory } from '#helpers/photoHelpers';

test('фотографии: фильтрация фотографий по категориям в публичной галерее', async ({
  galleryPage,
  categoryClient,
  photoClient,
}) => {
  const [photoFirst, categoryFirst] = await createPhotoWithCategory(categoryClient, photoClient);
  const [photoSecond, categorySecond] = await createPhotoWithCategory(categoryClient, photoClient);

  await galleryPage.goto();

  await galleryPage.selectCategoryByName(categoryFirst.name);
  await expect(galleryPage.photoByAlt(photoFirst.title)).toBeVisible();
  await expect(galleryPage.photoByAlt(photoSecond.title)).not.toBeVisible();

  await galleryPage.selectCategoryByName(categorySecond.name);
  await expect(galleryPage.photoByAlt(photoSecond.title)).toBeVisible();
  await expect(galleryPage.photoByAlt(photoFirst.title)).not.toBeVisible();
});
