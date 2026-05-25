import { test, expect } from '../../src/fixtures/fixtures.ts';
import { PhotoApi } from '../../src/api/PhotoApi.ts';
import { HTTP } from '../../src/utils/constants.ts';
import { generate } from '../../src/utils/generators.ts';
import { PhotoMatcher } from '../../src/utils/matchers.ts';

test.describe('GET /photos', () => {
  test('TC-PHO-01: возвращает 200 и массив объектов', async ({
    photoClient,
    cleanup,
  }) => {
    const count = 6;
    for (let i = 0; i < count; i++) {
      const payload = generate.photoData();
      const filePath = generate.fixturePath(`${i}.jpg`);
      const photo = await photoClient.upload(filePath, payload);
      cleanup.register(async () => photoClient.delete(photo.id));
    }

    const body = await photoClient.list();

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    for (const item of body) {
      expect(item).toEqual(PhotoMatcher.base);
    }
  });
});

test.describe('GET /photos/{id}', () => {
  test('TC-PHO-02: существующий id: 200, id + title + author + url + fullUrl + likes + views', async ({
    photoClient,
    cleanup,
  }) => {
    const image = '1.jpg';
    const payload = generate.photoData();
    const filePath = generate.fixturePath(image);
    const photo = await photoClient.upload(filePath, payload);
    cleanup.register(async () => photoClient.delete(photo.id));

    const body = await photoClient.getById(photo.id);

    expect(body).toEqual(PhotoMatcher.base);
  });

  test('PHO-03 — несуществующий id: 404', async ({ photoApi }) => {
    const response = await photoApi.getById(999_999_999);

    expect(response.status()).toBe(HTTP.NOT_FOUND);
  });
});

test.describe('PUT /photos/{id}/like', () => {
  test('TC-PHO-04: возвращает 200 с totalLikes и newlyLiked', async ({
    photoClient,
    cleanup,
  }) => {
    const image = '1.jpg';
    const payload = generate.photoData();
    const filePath = generate.fixturePath(image);
    const photo = await photoClient.upload(filePath, payload);
    cleanup.register(async () => photoClient.delete(photo.id));

    const body = await photoClient.like(photo.id);

    expect(body.totalLikes).toBe(1);
    expect(typeof body.newlyLiked).toBe('boolean');
  });
});

test.describe('POST /photos', () => {
  test('TC-PHO-05: без токена: 401', async ({ request }) => {
    const unauthApi = new PhotoApi(request, {});
    const image = '1.jpg';
    const payload = generate.photoData();
    const filePath = generate.fixturePath(image);

    const response = await unauthApi.upload(filePath, payload);

    expect(response.status()).toBe(HTTP.FORBIDDEN);
  });

  test('TC-PHO-06: полный цикл: загрузка + проверка + удаление + проверка 404', async ({
    photoClient,
    photoApi,
    cleanup,
  }) => {
    const image = '1.jpg';
    const payload = generate.photoData();
    const filePath = generate.fixturePath(image);
    const photo = await photoClient.upload(filePath, payload);
    cleanup.register(async () => photoClient.tryDelete(photo.id));

    const body = await photoClient.getById(photo.id);
    expect(body.id).toBe(photo.id);

    await photoClient.delete(photo.id);

    const getAfterDelete = await photoApi.getById(photo.id);
    expect(getAfterDelete.status()).toBe(HTTP.NOT_FOUND);
  });
});