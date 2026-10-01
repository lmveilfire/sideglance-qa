import { test, expect } from '#fixtures/fixtures';
import { HTTP } from '#utils/constants';
import { generate } from '#utils/generators';
import { createPhotoWithCategory } from '#helpers/photoHelpers';
import { DEFAULT_START_PAGE, MAX_COMMENT_PAGE_SIZE } from '#utils/constants';

test('комментарии: скрытое игнорирование создания комментария при заполнении скрытого поля спам-бота', async ({
  photoClient,
  commentApi,
  commentClient,
  captchaHelper,
  categoryClient,
}) => {
  const honeypotBotMarker = 'bot-value';
  const expectedEmptyDatabaseCount = 0;
  const [photo] = await createPhotoWithCategory(categoryClient, photoClient);

  const captcha = await captchaHelper.solveCaptcha();

  const response = await commentApi.create(
    { ...generate.commentData(photo.id), honeypot: honeypotBotMarker },
    captcha,
  );

  expect(response.status()).toBe(HTTP.OK);

  const page = await commentClient.listByPhoto(photo.id, DEFAULT_START_PAGE, MAX_COMMENT_PAGE_SIZE);
  expect(page.totalCount).toBe(expectedEmptyDatabaseCount);
});
