import { test, expect } from '#fixtures/fixtures';
import { generate } from '#utils/generators';

test('категории: успешное удаление пустой категории администратором через интерфейс', async ({
  galleryPage,
  uiAuthHelper,
  photoUploadPage,
  categoryClient,
}) => {
  const categoryName = generate.categoryData().name;

  await categoryClient.create(categoryName);

  await uiAuthHelper.loginAsAdmin();

  await photoUploadPage.homeBtn.click();

  await expect(galleryPage.categoryItemByName(categoryName)).toBeVisible();

  await galleryPage.deleteCategory(categoryName);

  await expect(galleryPage.categoryItemByName(categoryName)).not.toBeVisible();
});
