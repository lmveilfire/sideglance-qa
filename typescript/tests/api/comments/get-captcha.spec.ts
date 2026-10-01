import { test } from '#fixtures/fixtures';

test('комментарии: успешная генерация капчи и проверка структуры ответа по контракту', async ({
  commentClient,
}) => {
  await commentClient.getCaptcha();
});
