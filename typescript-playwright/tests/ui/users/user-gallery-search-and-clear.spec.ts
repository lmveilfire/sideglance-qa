import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { generate } from "../../../src/utils/generators.ts";
import { GalleryPage } from "../../../src/pages/GalleryPage.ts";

test("Поиск фотографии по названию и проверка сброса результатов поиска", async ({
  page,
  photoClient,
  categoryClient,
}) => {
  const categoryName = `${generate.categoryData().name}-cat`;
  const galleryPage = new GalleryPage(page);
  const count = 6;
  const titles = [];
  const category = await categoryClient.create(categoryName);

  for (let i = 0; i < count; i++) {
    const photoData = generate.photoData({ categoryId: category.id });
    await photoClient.upload(generate.fixturePath(`${i}.jpg`), photoData);
    titles.push(photoData.title);
  }

  const targetTitle = titles[2]!;
  const nonTargetTitle = titles[3]!;

  await galleryPage.goto();
  await galleryPage.selectCategoryByName(categoryName);
  await galleryPage.searchPhoto(targetTitle);

  await expect(galleryPage.photoByAlt(targetTitle)).toBeVisible();
  await expect(galleryPage.photoByAlt(nonTargetTitle)).toBeHidden();

  await galleryPage.clearSearch();
  
  await expect(galleryPage.searchInput).toBeEmpty();
  await expect(galleryPage.photoByAlt(nonTargetTitle)).toBeVisible({
    timeout: 10000,
  });
});
