import { test, expect } from '#fixtures/fixtures';

test('комментарии: валидация суммы статусов комментариев в статистике', async ({
  adminCommentClient,
}) => {
  const stats = await adminCommentClient.getStats();

  expect(stats.total).toBe(stats.pending + stats.approved + stats.rejected);
});
