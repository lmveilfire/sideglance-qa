import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { AdminUploadPage } from "../../../src/pages/AdminUploadPage";
import { generate } from "../../../src/utils/generators";

test("Администратор может отменить создание новой категории и подкатегории при загрузке фото", async ({
  uiAuthHelper,
  page,
}) => {
  const categoryName = `${generate.categoryData().name}-cat`;
  const subcategoryName = `${generate.categoryData().name}-sub`;
  const dashboardPage = new AdminUploadPage(page);

  await uiAuthHelper.loginAsAdmin();

  await dashboardPage.categorySelect.selectOption("+new");
  await dashboardPage.newCategoryInput.fill(categoryName);
  await dashboardPage.cancelNewCategory();
  
  await expect(dashboardPage.categorySelect).not.toContainText(categoryName);

  await dashboardPage.createNewCategory(categoryName);
  await dashboardPage.selectCategoryByName(categoryName);
  await dashboardPage.subcategorySelect.selectOption("+new");
  await dashboardPage.newSubcategoryInput.fill(subcategoryName);
  await dashboardPage.cancelNewSubcategory();

  await expect(dashboardPage.subcategorySelect).not.toContainText(
    subcategoryName,
  );
});
