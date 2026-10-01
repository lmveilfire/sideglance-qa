import { test, expect } from '#fixtures/fixtures';
import { createPhotoWithCategory } from '#helpers/photoHelpers';
import { createCommentList } from '#helpers/commentHelpers';
import { DEFAULT_START_PAGE } from '#utils/constants';

test('комментарии: пагинация корректно разбивает список комментариев на страницы', async ({
  photoClient,
  commentClient,
  captchaHelper,
  categoryClient,
  adminCommentClient,
}) => {
  const nextPage = 1;
  const pageSize = 5;
  const commentsTotal = 7;

  const [photo] = await createPhotoWithCategory(categoryClient, photoClient);

  await createCommentList(
    photo.id,
    commentClient,
    captchaHelper,
    commentsTotal,
    adminCommentClient,
  );

  const firstPage = await commentClient.listByPhoto(photo.id, DEFAULT_START_PAGE, pageSize);
  expect(firstPage.comments.length).toBe(pageSize);
  expect(firstPage.totalCount).toBe(commentsTotal);
  expect(firstPage.hasMore).toBe(true);

  const secondPage = await commentClient.listByPhoto(photo.id, nextPage, pageSize);
  expect(secondPage.comments.length).toBe(commentsTotal - pageSize);
  expect(secondPage.hasMore).toBe(false);

  const idsFirst = firstPage.comments.map((c) => c.id);
  const idsSecond = secondPage.comments.map((c) => c.id);

  const intersectingIds = idsSecond.filter((id) => idsFirst.includes(id));

  expect(intersectingIds).toEqual([]);
});
