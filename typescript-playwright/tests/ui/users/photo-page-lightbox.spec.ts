import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { generate } from "../../../src/utils/generators";
import { GalleryPage } from "../../../src/pages/GalleryPage";
import { PhotoPage } from "../../../src/pages/PhotoPage";

test("Пользователь успешно открывает и закрывает полноэкранный просмотр (лайтбокс) на странице фотографии", async ({
  page,
  photoClient,
  categoryClient,
}) => {
  const categoryName = `${generate.categoryData().name}-cat`;
  const galleryPage = new GalleryPage(page);
  const photoPage = new PhotoPage(page);
  const category = await categoryClient.create(categoryName);
  const photoData = generate.photoData({ categoryId: category.id });
  await photoClient.upload(generate.fixturePath(`1.jpg`), photoData);

  await galleryPage.goto();
  await galleryPage.selectCategoryByName(categoryName);

  await expect(galleryPage.photoByAlt(photoData.title)).toBeVisible();
  
  await galleryPage.openPhoto(photoData.title);

  await expect(galleryPage.photoByAlt(photoData.title)).toBeVisible();

  await photoPage.photo.click();

  await expect(photoPage.lightbox).toBeVisible();

  await photoPage.closeLightboxButton.click();

  await expect(photoPage.lightbox).toBeHidden();
});
