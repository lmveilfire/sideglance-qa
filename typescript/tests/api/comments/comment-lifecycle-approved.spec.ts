import { test, expect } from '#fixtures/fixtures';
import { generate } from '#utils/generators';
import { createPhotoWithCategory } from '#helpers/photoHelpers';
import { CommentStatusSchema } from '#utils/schemas';
import { DEFAULT_START_PAGE, MAX_COMMENT_PAGE_SIZE } from '#utils/constants';

test('комментарии: одобрение комментария делает его видимым публично', async ({
  photoClient,
  commentClient,
  captchaHelper,
  adminCommentClient,
  categoryClient,
}) => {
  const [photo] = await createPhotoWithCategory(categoryClient, photoClient);
  const captcha = await captchaHelper.solveCaptcha();
  const created = await commentClient.createInIsolation(generate.commentData(photo.id), captcha);

  const moderated = await adminCommentClient.moderate(
    created.id,
    CommentStatusSchema.enum.APPROVED,
  );

  expect(moderated.status).toBe(CommentStatusSchema.enum.APPROVED);

  const page = await commentClient.listByPhoto(photo.id, DEFAULT_START_PAGE, MAX_COMMENT_PAGE_SIZE);
  expect(
    page.comments.some((c) => c.id === created.id),
    'APPROVED комментарий должен быть виден публично',
  ).toBe(true);
});
