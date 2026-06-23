import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { generate } from "../../../src/utils/generators.ts";
import { GalleryPage } from "../../../src/pages/GalleryPage.ts";
import { PhotoPage } from "@pages/PhotoPage.ts";

test("Навигация по фотографиям в карусели и проверка блокировки крайних кнопок", async ({
  page,
  photoClient,
  categoryClient,
}) => {
  const categoryName = `${generate.categoryData().name}-cat`;
  const galleryPage = new GalleryPage(page);
  const photoPage = new PhotoPage(page);

  const count = 3;
  const category = await categoryClient.create(categoryName);

  for (let i = 0; i < count; i++) {
    const photoData = generate.photoData({ categoryId: category.id });
    await photoClient.upload(generate.fixturePath(`${i}.jpg`), photoData);
  }

  await galleryPage.goto();
  await galleryPage.selectCategoryByName(categoryName);
  const displayedTitles = await galleryPage.getAllPhotoTitles();
  const firstPhotoTitle = displayedTitles[0]!;
  const secondPhotoTitle = displayedTitles[1]!;
  const thirdPhotoTitle = displayedTitles[2]!;

  await expect(galleryPage.photoByAlt(firstPhotoTitle)).toBeVisible();

  await galleryPage.openPhoto(firstPhotoTitle);

  await expect(photoPage.photoByAlt(firstPhotoTitle)).toBeVisible();
  await expect(photoPage.carouselPrev).toBeDisabled();

  await photoPage.goNext();

  await expect(photoPage.photoByAlt(secondPhotoTitle)).toBeVisible();

  await photoPage.goNext();

  await expect(photoPage.photoByAlt(thirdPhotoTitle)).toBeVisible();
  await expect(photoPage.carouselNext).toBeDisabled();
  
  await photoPage.goPrev();
  
  await expect(photoPage.photoByAlt(secondPhotoTitle)).toBeVisible();
});
