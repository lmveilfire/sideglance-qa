import { test, expect } from '#fixtures/fixtures';
import { HTTP } from '#utils/constants';
import { generate } from '#utils/generators';
import { createPhotoWithCategory } from '#helpers/photoHelpers';

test('комментарии: отклонение запроса при отправке неверного математического ответа капчи', async ({
  photoClient,
  commentApi,
  captchaHelper,
  categoryClient,
}) => {
  const invalidCaptchaAnswer = 999;
  const [photo] = await createPhotoWithCategory(categoryClient, photoClient);
  const captcha = await captchaHelper.solveCaptcha();
  const wrongCaptcha = { ...captcha, answer: captcha.answer + invalidCaptchaAnswer };

  const response = await commentApi.create(generate.commentData(photo.id), wrongCaptcha);

  expect(response.status()).toBe(HTTP.BAD_REQUEST);
});
