import { test, expect } from "../../src/fixtures/fixtures.ts";
import { HTTP } from "../../src/utils/constants.ts";
import { generate } from "../../src/utils/generators.ts";

test.describe("GET /comments/captcha", () => {
  test("TC-COM-01: возвращает 200 с sessionId и question", async ({
    commentClient,
  }) => {
    const body = await commentClient.getCaptcha();

    expect(typeof body.sessionId).toBe("string");
    expect(body.sessionId.length).toBeGreaterThan(0);
    expect(typeof body.question).toBe("string");
    expect(body.question.length).toBeGreaterThan(0);
  });
});

test.describe("GET /comments?photoId={id}", () => {
  test("TC-COM-02: возвращает 200 с comments, hasMore, totalCount, page", async ({
    photoClient,
    commentClient,
    categoryClient,
  }) => {
    const categoryName = `${generate.categoryData().name}-cat`;
    const category = await categoryClient.create(categoryName);

    const photo = await photoClient.upload(
      generate.fixturePath("1.jpg"),
      generate.photoData({ categoryId: category.id }),
    );

    const page = await commentClient.listByPhoto(photo.id, 0, 5);

    expect(typeof page.hasMore).toBe("boolean");
    expect(typeof page.totalCount).toBe("number");
    expect(page.page).toBe(0);
  });
});

test.describe("POST /comments — негативные сценарии", () => {
  test("TC-COM-04: неверная капча: 400", async ({
    photoClient,
    commentApi,
    captchaHelper,
    categoryClient,
  }) => {
    const categoryName = `${generate.categoryData().name}-cat`;
    const category = await categoryClient.create(categoryName);

    const photo = await photoClient.upload(
      generate.fixturePath("1.jpg"),
      generate.photoData({ categoryId: category.id }),
    );

    const captcha = await captchaHelper.solveCaptcha();
    const wrongCaptcha = { ...captcha, answer: captcha.answer + 999 };

    const response = await commentApi.create(
      generate.commentData(photo.id),
      wrongCaptcha,
    );

    expect(response.status()).toBe(HTTP.BAD_REQUEST);
    const body = (await response.json()) as { error: unknown };
    expect(body.error).toBeTruthy();
  });

  test("TC-COM-05: ответ быстрее 2 секунд: 400", async ({
    photoClient,
    commentApi,
    captchaHelper,
    categoryClient,
  }) => {
    const categoryName = `${generate.categoryData().name}-cat`;
    const category = await categoryClient.create(categoryName);

    const photo = await photoClient.upload(
      generate.fixturePath("1.jpg"),
      generate.photoData({ categoryId: category.id }),
    );

    const captcha = await captchaHelper.solveCaptcha(100);

    const response = await commentApi.create(
      generate.commentData(photo.id),
      captcha,
    );

    expect(response.status()).toBe(HTTP.BAD_REQUEST);
    const body = (await response.json()) as { error: unknown };
    expect(body.error).toBeTruthy();
  });

  test("TC-COM-06: повторный sessionId: первый 201, второй 429", async ({
    photoClient,
    commentApi,
    captchaHelper,
    categoryClient,
  }) => {
    const categoryName = `${generate.categoryData().name}-cat`;
    const category = await categoryClient.create(categoryName);

    const photo = await photoClient.upload(
      generate.fixturePath("1.jpg"),
      generate.photoData({ categoryId: category.id }),
    );

    const captcha = await captchaHelper.solveCaptcha();

    const first = await commentApi.create(
      generate.commentData(photo.id),
      captcha,
    );
    expect(first.status()).toBe(HTTP.CREATED);
    (await first.json()) as { id: number };

    const second = await commentApi.create(
      generate.commentData(photo.id),
      captcha,
    );
    expect(second.status()).toBe(HTTP.TOO_MANY_REQUESTS);
  });

  test("TC-COM-07: honeypot заполнен: тихое отклонение 200", async ({
    photoClient,
    commentApi,
    commentClient,
    captchaHelper,
    categoryClient,
  }) => {
    const categoryName = `${generate.categoryData().name}-cat`;
    const category = await categoryClient.create(categoryName);

    const photo = await photoClient.upload(
      generate.fixturePath("1.jpg"),
      generate.photoData({ categoryId: category.id }),
    );

    const captcha = await captchaHelper.solveCaptcha();

    const response = await commentApi.create(
      { ...generate.commentData(photo.id), honeypot: "bot-value" },
      captcha,
    );

    expect(response.status()).toBe(HTTP.OK);

    const page = await commentClient.listByPhoto(photo.id, 0, 100);
    expect(page.comments.every((c) => c.id !== undefined)).toBe(true);
    expect(page.totalCount).toBe(0);
  });
});
