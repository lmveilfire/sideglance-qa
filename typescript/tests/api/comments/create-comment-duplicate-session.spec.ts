import { test, expect } from '#fixtures/fixtures';
import { HTTP } from '#utils/constants';
import { generate } from '#utils/generators';
import { createPhotoWithCategory } from '#helpers/photoHelpers';

test('комментарии: отклонение повторного запроса с использованным идентификатором сессии капчи', async ({
  photoClient,
  commentApi,
  captchaHelper,
  categoryClient,
}) => {
  const [photo] = await createPhotoWithCategory(categoryClient, photoClient);
  const captcha = await captchaHelper.solveCaptcha();

  const fakeIp = generate.ip();
  const headers = { 'X-Forwarded-For': fakeIp };

  const first = await commentApi.create(generate.commentData(photo.id), captcha, headers);
  expect(first.status()).toBe(HTTP.CREATED);

  const second = await commentApi.create(generate.commentData(photo.id), captcha, headers);
  expect(second.status()).toBe(HTTP.BAD_REQUEST);
});
