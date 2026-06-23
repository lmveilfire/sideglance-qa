import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { generate } from "../../../src/utils/generators.ts";
import { GalleryPage } from "../../../src/pages/GalleryPage.ts";

test("Администратор удаляет фотографию, и она исчезает из галереи", async ({
  uiAuthHelper,
  page,
  photoClient,
  categoryClient,
}) => {
  const categoryName = `${generate.categoryData().name}-cat`;
  const galleryPage = new GalleryPage(page);
  const category = await categoryClient.create(categoryName);
  const photoData = generate.photoData({ categoryId: category.id });
  const photo = await photoClient.upload(
    generate.fixturePath(`1.jpg`),
    photoData,
  );

  await uiAuthHelper.loginAsAdmin();

  await galleryPage.goto();
  
  await expect(galleryPage.categoryItemByName(categoryName)).toBeVisible();

  await galleryPage.selectCategoryByName(categoryName);

  await expect(galleryPage.photoImg(photo.id)).toBeVisible();

  await galleryPage.deletePhoto(photo.id);

  await expect(galleryPage.emptyGallery).toBeVisible();
});
