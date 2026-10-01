import { test, expect } from '#fixtures/fixtures';
import { generate } from '#utils/generators';
import { createPhotoList } from '#helpers/photoHelpers';

test('фотографии: навигация между фотографиями в карусели на странице просмотра', async ({
  categoryClient,
  photoClient,
  photoPage,
}) => {
  const category = await categoryClient.create(generate.categoryData().name);

  const [photoOld, photoNew] = await createPhotoList(category.id, photoClient, 2);

  await photoPage.open(photoNew.id);
  await expect(photoPage.carouselPrevBtn).toBeDisabled();

  await photoPage.goNext();

  await expect(photoPage.photoByAlt(photoOld.title)).toBeVisible();
  await expect(photoPage.carouselNextBtn).toBeDisabled();

  await photoPage.goPrev();

  await expect(photoPage.photoByAlt(photoNew.title)).toBeVisible();
  await expect(photoPage.carouselPrevBtn).toBeDisabled();
});
