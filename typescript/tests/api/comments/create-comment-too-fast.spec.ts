import { test, expect } from '#fixtures/fixtures';
import { HTTP } from '#utils/constants';
import { generate } from '#utils/generators';
import { createPhotoWithCategory } from '#helpers/photoHelpers';

test('комментарии: отклонение запроса при слишком быстром разгадывании капчи', async ({
  photoClient,
  commentApi,
  captchaHelper,
  categoryClient,
}) => {
  const [photo] = await createPhotoWithCategory(categoryClient, photoClient);

  const captcha = await captchaHelper.solveCaptcha(100);
  const fakeIp = generate.ip();
  const headers = { 'X-Forwarded-For': fakeIp };

  const response = await commentApi.create(generate.commentData(photo.id), captcha, headers);

  expect(response.status()).toBe(HTTP.BAD_REQUEST);
});
