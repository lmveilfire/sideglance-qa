import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { generate } from "../../../src/utils/generators.ts";
import { GalleryPage } from "../../../src/pages/GalleryPage.ts";
import { PhotoPage } from "../../../src/pages/PhotoPage.ts";

test("Отображение метаданных и счетчиков на странице просмотра фотографии", async ({
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

  await expect(photoPage.photoByAlt(photoData.title)).toBeVisible();
  await expect(photoPage.photoTitle).toHaveText(photoData.title);
  await expect(photoPage.photoPlace).toHaveText(photoData.place);
  await expect(photoPage.photoDate).toBeVisible();
  await expect(photoPage.photoMeta).toBeVisible();
  await expect(photoPage.likeButton).toBeVisible();
  await expect(photoPage.viewsCount).toBeVisible();
});
