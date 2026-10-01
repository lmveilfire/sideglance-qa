import { test, expect } from '#fixtures/fixtures';
import { createPhotoWithCategory } from '#helpers/photoHelpers';
import { DEFAULT_COMMENT_PAGE_SIZE, DEFAULT_START_PAGE } from '#utils/constants';

test('комментарии: возвращение пустой страницы пагинации для фотографии без комментариев', async ({
  photoClient,
  commentClient,
  categoryClient,
}) => {
  const [photo] = await createPhotoWithCategory(categoryClient, photoClient);

  const page = await commentClient.listByPhoto(
    photo.id,
    DEFAULT_START_PAGE,
    DEFAULT_COMMENT_PAGE_SIZE,
  );

  expect(page.comments).toHaveLength(0);
  expect(page.page).toBe(DEFAULT_START_PAGE);
});
