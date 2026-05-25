import { test, expect } from '../../src/fixtures/fixtures.ts';
import { HTTP, ADMIN_USERNAME, ADMIN_PASSWORD} from '../../src/utils/constants.ts';

test.describe('Auth: Login', () => {
  test('TC-AUTH-01: Успешный вход администратора', async ({ authClient }) => {
    const response = await authClient.login({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
    });

    expect(response).toMatchObject({
     accessToken: expect.any(String),
     refreshToken: expect.any(String),
     username: ADMIN_USERNAME,
    });
  });

  test('TC-AUTH-02: Вход с неверным паролем', async ({ authApi }) => {
    const response = await authApi.login({
        username: ADMIN_USERNAME,
        password: 'wrong_password',
    });

    expect(response.status()).toBe(HTTP.UNAUTHORIZED);
    
    const body = await response.json();
    expect(body.error).toBe("The key doesn't match this lock.");
  });

  test('TC-AUTH-03: Rate limit после 5 неудачных попыток @security', async ({ authHelper, authApi }) => {
    for (let i = 0; i < 5; i++) {
      await authHelper.loginWithInvalidPassword(1);
    }

    const response = await authApi.login({
        username: ADMIN_USERNAME,
        password: 'wrong_password',
    });

    expect(response.status()).toBe(HTTP.TOO_MANY_REQUESTS);
    
    const body = await response.json();
    expect(body.error).toBe('The magic needs a moment to recharge.');
  });
  
  test('TC-AUTH-04: Refresh токена', async ({ authClient }) => {
    const loginResponse = await authClient.login({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
    });

    const refreshResponse = await authClient.refresh(loginResponse.refreshToken);

    expect(refreshResponse.accessToken).toBeDefined();
    expect(refreshResponse.accessToken.split('.')).toHaveLength(3);
    expect(refreshResponse.username).toBe(ADMIN_USERNAME);
  });

  test('TC-AUTH-05: Невалидный refreshToken', async ({ authApi }) => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjo5OTk5OTk5OTk5fQ.invalid-signature';
    const refreshResponse = await authApi.refresh(invalidToken);

    expect(refreshResponse.status()).toBe(HTTP.FORBIDDEN); 
  });
});