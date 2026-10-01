import { test, expect } from '#fixtures/fixtures';
import { createPhotoWithCategory } from '#helpers/photoHelpers';

test('категории: невозможность удаления категории, содержащей фотографии', async ({
  photoUploadPage,
  uiAuthHelper,
  galleryPage,
  categoryClient,
  photoClient,
}) => {
  const [photo, category] = await createPhotoWithCategory(categoryClient, photoClient);

  await uiAuthHelper.loginAsAdmin();

  await photoUploadPage.homeBtn.click();

  await galleryPage.selectCategoryByName(category.name);

  await expect(galleryPage.photoByAlt(photo.title)).toBeVisible();

  await galleryPage.deleteCategory(category.name);

  await expect(galleryPage.categoryItemByName(category.name)).toBeVisible();
});
