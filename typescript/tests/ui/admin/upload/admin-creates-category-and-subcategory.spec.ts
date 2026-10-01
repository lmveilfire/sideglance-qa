import { test, expect } from '#fixtures/fixtures';
import { generate } from '#utils/generators';

test('категории: успешное создание новой категории и подкатегории в панели управления', async ({
  photoUploadPage,
  galleryPage,
  uiAuthHelper,
}) => {
  const categoryName = generate.categoryData().name;
  const subcategoryName = generate.categoryData().name;

  await uiAuthHelper.loginAsAdmin();

  await photoUploadPage.createNewCategory(categoryName);
  await expect(photoUploadPage.categorySelect).toContainText(categoryName);

  await photoUploadPage.selectCategoryByName(categoryName);
  await photoUploadPage.createNewSubcategory(subcategoryName);
  await expect(photoUploadPage.subcategorySelect).toContainText(subcategoryName);

  await photoUploadPage.homeBtn.click();

  await expect(galleryPage.categoryItemByName(categoryName)).toBeVisible();

  await galleryPage.selectCategoryByName(categoryName);
  await expect(galleryPage.subcategoryItemByName(subcategoryName)).toBeVisible();
});
