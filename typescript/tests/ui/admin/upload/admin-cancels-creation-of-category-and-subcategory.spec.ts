import { test, expect } from '#fixtures/fixtures';
import { generate } from '#utils/generators';

test('категории: отмена создания новой категории и подкатегории в панели управления', async ({
  uiAuthHelper,
  photoUploadPage,
}) => {
  const categoryName = generate.categoryData().name;
  const subcategoryName = generate.categoryData().name;

  await uiAuthHelper.loginAsAdmin();
  await photoUploadPage.goto();

  await photoUploadPage.categorySelect.selectOption(photoUploadPage.CREATE_NEW_VALUE);
  await photoUploadPage.newCategoryInput.fill(categoryName);

  await photoUploadPage.cancelNewCategory();

  await expect(photoUploadPage.categorySelect).not.toContainText(categoryName);

  await photoUploadPage.createNewCategory(categoryName);
  await photoUploadPage.selectCategoryByName(categoryName);

  await photoUploadPage.subcategorySelect.selectOption(photoUploadPage.CREATE_NEW_VALUE);
  await photoUploadPage.newSubcategoryInput.fill(subcategoryName);

  await photoUploadPage.cancelNewSubcategory();

  await expect(photoUploadPage.subcategorySelect).not.toContainText(subcategoryName);
});
