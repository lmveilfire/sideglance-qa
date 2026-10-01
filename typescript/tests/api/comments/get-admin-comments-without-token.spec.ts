import { test, expect } from '#fixtures/fixtures';
import { AdminCommentApi } from '#api/AdminCommentApi';
import { HTTP } from '#utils/constants';

test('комментарии: запрет получения списка комментариев админки без авторизации', async ({
  request,
}) => {
  const unauthApi = new AdminCommentApi(request, {});
  const response = await unauthApi.getComments();

  expect(response.status()).toBe(HTTP.FORBIDDEN);
});
