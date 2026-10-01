import { test, expect } from '#fixtures/fixtures';
import { createPhotoWithCategory } from '#helpers/photoHelpers';

test('фотографии: отображение метаданных и счетчиков просмотров/лайков на странице фотографии', async ({
  galleryPage,
  categoryClient,
  photoClient,
  photoPage,
}) => {
  const [photo, category] = await createPhotoWithCategory(categoryClient, photoClient);

  await galleryPage.goto();
  await galleryPage.selectCategoryByName(category.name);
  await galleryPage.openPhotoByAlt(photo.title);

  await expect(photoPage.photoByAlt(photo.title)).toBeVisible();
  await expect(photoPage.photoPlace).toBeVisible();
  await expect(photoPage.photoDate).toBeVisible();
  await expect(photoPage.photoMeta).toBeVisible();
  await expect(photoPage.likeBtn).toBeVisible();
  await expect(photoPage.viewsCount).toBeVisible();
});
