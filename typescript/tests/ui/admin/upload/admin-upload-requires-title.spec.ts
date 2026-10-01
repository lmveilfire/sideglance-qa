import { test, expect } from '#fixtures/fixtures';
import { generate } from '#utils/generators';
import { DEFAULT_FILE_PATH } from '#utils/constants';

test('фотографии: отправка формы без заголовка блокируется валидацией', async ({
  photoUploadPage,
  uiAuthHelper,
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

  await photoUploadPage.fillAuthor(photoPayload.author);

  await photoUploadPage.attachPhoto(filePath);
  await photoUploadPage.submitForm();

  await expect(photoUploadPage.errorAlert).toBeVisible();
});
