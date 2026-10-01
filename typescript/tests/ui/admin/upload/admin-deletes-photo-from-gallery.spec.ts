import { test, expect } from '#fixtures/fixtures';
import { createPhotoWithCategory } from '#helpers/photoHelpers';

test('фотографии: успешное удаление фотографии администратором через интерфейс галереи', async ({
  galleryPage,
  uiAuthHelper,
  photoUploadPage,
  photoClient,
  categoryClient,
}) => {
  const [photo, category] = await createPhotoWithCategory(categoryClient, photoClient);

  await uiAuthHelper.loginAsAdmin();
  await photoUploadPage.homeBtn.click();

  await galleryPage.selectCategoryByName(category.name);
  await expect(galleryPage.photoImg(photo.id)).toBeVisible();

  await galleryPage.deletePhoto(photo.id);

  await expect(galleryPage.emptyStateMessage).toBeVisible();

  await galleryPage.searchPhoto(photo.title);
  await expect(galleryPage.emptyStateMessage).toBeVisible();
});
