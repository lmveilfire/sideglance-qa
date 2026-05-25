import { test, expect } from '../../src/fixtures/fixtures.ts';
import { generate } from '../../src/utils/generators.ts';
import { AdminCommentApi } from '../../src/api/AdminCommentApi.ts';
import {HTTP} from '../../src/utils/constants.ts';

test.describe('GET /admin/comments/stats', () => {
  test('TC-COM-A-01: total = pending + approved + rejected', async ({
    adminCommentClient,
  }) => {
    const stats = await adminCommentClient.getStats();

    expect(typeof stats.total).toBe('number');
    expect(typeof stats.pending).toBe('number');
    expect(typeof stats.approved).toBe('number');
    expect(typeof stats.rejected).toBe('number');
    expect(stats.total).toBe(stats.pending + stats.approved + stats.rejected);
  });
});

test.describe('GET /admin/comments', () => {
  test('TC-COM-A-02: без токена: 403', async ({ request}) => {
    const unauthApi = new AdminCommentApi(request, {});
    const response = await unauthApi.getComments();
    expect(response.status()).toBe(HTTP.FORBIDDEN);
  });
});

test.describe('PUT /admin/comments/{id}/moderate', () => {
  test('TC-COM-A-03: APPROVED: создание → одобрение → виден публично → удаление', async ({
    photoClient,
    commentApi,
    commentClient,
    captchaHelper,
    adminCommentClient,
    cleanup,
  }) => {
    const photo = await photoClient.upload(
      generate.fixturePath('1.jpg'),
      generate.photoData()
    );
    cleanup.register(async () => { await photoClient.tryDelete(photo.id); });

    const captcha = await captchaHelper.solveCaptcha();

    const created = await commentClient.createInIsolation(
      generate.commentData(photo.id),
      captcha
    );

    cleanup.register(() => adminCommentClient.delete(created.id));

    const moderated = await adminCommentClient.moderate(created.id, 'APPROVED');
    expect(moderated.status).toBe('APPROVED');

    const page = await commentClient.listByPhoto(photo.id, 0, 100);
    expect(
      page.comments.some((c) => c.id === created.id),
      'APPROVED комментарий должен быть виден публично'
    ).toBe(true);

    await adminCommentClient.delete(created.id);
  });

  test('TC-COM-A-04 — REJECTED: создание → отклонение → не виден публично → удаление', async ({
    photoClient,
    commentApi,
    commentClient,
    captchaHelper,
    adminCommentClient,
    cleanup,
  }) => {
    const photo = await photoClient.upload(
      generate.fixturePath('1.jpg'),
      generate.photoData()
    );
    cleanup.register(async () => { await photoClient.tryDelete(photo.id); });

    const captcha = await captchaHelper.solveCaptcha();
    const created = await commentClient.createInIsolation(
      generate.commentData(photo.id),
      captcha
    );

    cleanup.register(() => adminCommentClient.delete(created.id));

    const moderated = await adminCommentClient.moderate(created.id, 'REJECTED', 'Spam');
    expect(moderated.status).toBe('REJECTED');

    const page = await commentClient.listByPhoto(photo.id, 0, 100);
    expect(
      page.comments.some((c) => c.id === created.id),
      'REJECTED комментарий не должен быть виден публично'
    ).toBe(false);

    await adminCommentClient.delete(created.id);
  });
});

test.describe('POST /comments — успешное создание', () => {
  test('TC-COM-A-05: создание: 201 PENDING, не виден публично, удаление через админку', async ({
    photoClient,
    commentClient,
    captchaHelper,
    adminCommentClient,
    cleanup,
  }) => {
    const photo = await photoClient.upload(
      generate.fixturePath('1.jpg'),
      generate.photoData()
    );
    cleanup.register(async () => { await photoClient.tryDelete(photo.id); });

    const captcha = await captchaHelper.solveCaptcha();

    const created = await commentClient.createInIsolation(
      generate.commentData(photo.id),
      captcha
    )

    cleanup.register(() => adminCommentClient.delete(created.id));

    const page = await commentClient.listByPhoto(photo.id, 0, 100);
    expect(
      page.comments.some((c) => c.id === created.id),
      'PENDING комментарий не должен быть виден публично'
    ).toBe(false);

    await adminCommentClient.delete(created.id);
  });
});