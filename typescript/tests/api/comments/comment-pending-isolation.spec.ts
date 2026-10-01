import { test, expect } from '#fixtures/fixtures';
import { generate } from '#utils/generators';
import { createPhotoWithCategory } from '#helpers/photoHelpers';
import { CommentStatusSchema } from '#utils/schemas';
import { DEFAULT_START_PAGE, MAX_COMMENT_PAGE_SIZE } from '#utils/constants';

test('комментарии: новый комментарий создается в статусе ожидания и скрыт публично', async ({
  photoClient,
  commentClient,
  captchaHelper,
  categoryClient,
}) => {
  const [photo] = await createPhotoWithCategory(categoryClient, photoClient);
  const captcha = await captchaHelper.solveCaptcha();
  const created = await commentClient.createInIsolation(generate.commentData(photo.id), captcha);

  expect(created.status).toBe(CommentStatusSchema.enum.PENDING);

  const page = await commentClient.listByPhoto(photo.id, DEFAULT_START_PAGE, MAX_COMMENT_PAGE_SIZE);
  expect(
    page.comments.some((c) => c.id === created.id),
    'PENDING комментарий не должен быть виден публично',
  ).toBe(false);
});
