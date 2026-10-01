import { test, expect } from '#fixtures/fixtures';
import { generate } from '#utils/generators';
import { DEFAULT_FILE_PATH } from '#utils/constants';

test('фотографии: загрузка новой фотографии в подкатегорию с верификацией отображения в галерее', async ({
  photoUploadPage,
  uiAuthHelper,
  galleryPage,
}) => {
  const photoPayload = generate.photoData();
  const filePath = generate.fixturePath(DEFAULT_FILE_PATH);
  const categoryName = generate.categoryData().name;
  const subcategoryName = generate.categoryData().name;

  await uiAuthHelper.loginAsAdmin();

  await photoUploadPage.createNewCategory(categoryName);
  await photoUploadPage.selectCategoryByName(categoryName);

  await photoUploadPage.createNewSubcategory(subcategoryName);
  await photoUploadPage.selectSubcategoryByName(subcategoryName);

  await photoUploadPage.fillTitle(photoPayload.title);
  await photoUploadPage.fillAuthor(photoPayload.author);

  await photoUploadPage.attachPhoto(filePath);
  await photoUploadPage.submitForm();

  await expect(photoUploadPage.successAlert).toBeVisible();

  await photoUploadPage.homeBtn.click();

  await galleryPage.selectCategoryByName(categoryName);
  await galleryPage.selectSubcategoryByName(subcategoryName);

  await expect(galleryPage.photoByAlt(photoPayload.title)).toBeVisible();
});
