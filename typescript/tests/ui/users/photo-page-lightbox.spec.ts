import { test, expect } from '#fixtures/fixtures';
import { createPhotoWithCategory } from '#helpers/photoHelpers';

test('фотографии: просмотр фотографии во весь экран в режиме лайтбокса', async ({
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

  await photoPage.photoByAlt(photo.title).click();
  await expect(photoPage.lightbox).toBeVisible();

  await photoPage.closeLightboxButton.click();
  await expect(photoPage.lightbox).toBeHidden();
});
