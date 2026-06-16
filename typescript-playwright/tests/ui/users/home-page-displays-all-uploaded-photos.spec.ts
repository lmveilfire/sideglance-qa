import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { generate } from "../../../src/utils/generators";
import { GalleryPage } from "../../../src/pages/GalleryPage";

test("Отображение всех загруженных фотографий в выбранной категории галереи", async ({
  page,
  photoClient,
  categoryClient,
}) => {
  const categoryName = `${generate.categoryData().name}-cat`;
  const galleryPage = new GalleryPage(page);
  const count = 6;
  const photoTitles = [];
  const category = await categoryClient.create(categoryName);

  for (let i = 0; i < count; i++) {
    const photoData = generate.photoData({ categoryId: category.id });
    await photoClient.upload(generate.fixturePath(`${i}.jpg`), photoData);
    photoTitles.push(photoData.title);
  }

  await galleryPage.goto();
  await galleryPage.selectCategoryByName(categoryName);
  for (const title of photoTitles) {
    await expect(galleryPage.photoByAlt(title)).toBeVisible();
  }
});
