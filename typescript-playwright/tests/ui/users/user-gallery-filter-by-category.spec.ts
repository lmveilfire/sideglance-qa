import { test, expect } from "../../../src/fixtures/fixtures.ts";
import { generate } from "../../../src/utils/generators";
import { GalleryPage } from "../../../src/pages/GalleryPage";

test("Пользователь фильтрует фотографии в галерее по выбранной категории", async ({
  page,
  photoClient,
  categoryClient,
}) => {
  const galleryPage = new GalleryPage(page);
  const photosPerCategory = 2;
  const categoriesData = [];

  for (let i = 0; i < 3; i++) {
    const name = `${generate.categoryData().name}-${i}-cat`;
    const category = await categoryClient.create(name);
    const titles = [];

    for (let j = 0; j < photosPerCategory; j++) {
      const photoData = generate.photoData({ categoryId: category.id });
      await photoClient.upload(generate.fixturePath(`${j}.jpg`), photoData);
      titles.push(photoData.title);
    }
    categoriesData.push({ name, titles });
  }

  await galleryPage.goto();
  const allTitles = categoriesData.flatMap((category) => category.titles);

  for (const { name, titles } of categoriesData) {
    await galleryPage.selectCategoryByName(name);

    for (const title of titles) {
      await expect(galleryPage.photoByAlt(title)).toBeVisible();
    }

    const otherTitles = allTitles.filter((title) => !titles.includes(title));
    for (const title of otherTitles) {
      await expect(galleryPage.photoByAlt(title)).toBeHidden();
    }
  }
});
