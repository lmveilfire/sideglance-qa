import { test, expect } from '../../src/fixtures/fixtures.ts';
import { HTTP, ADMIN_USERNAME, ADMIN_PASSWORD  } from '../../src/utils/constants.ts';

test.describe('Auth: Login', () => {
  test('AUTH-01: Успешный вход администратора', async ({ authApi }) => {
    const response = await authApi.login({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
    });

    expect(response.status()).toBe(HTTP.OK);

    const body = await response.json();
    expect(body).toMatchObject({
     accessToken: expect.any(String),
     refreshToken: expect.any(String),
     username: ADMIN_USERNAME,
    });
  });

  test('AUTH-02: Вход с неверным паролем', async ({ authApi }) => {
    const response = await authApi.login({
        username: ADMIN_USERNAME,
        password: 'wrong_password',
    });

    expect(response.status()).toBe(HTTP.UNAUTHORIZED);
    
    const body = await response.json();
    expect(body.error).toBe("The key doesn't match this lock.");
  });

  test('AUTH-03: Rate limit после 5 неудачных попыток @security', async ({ authHelper, authApi }) => {
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
  
  test('AUTH-04: Refresh токена', async ({ authApi }) => {
    const loginResponse = await authApi.login({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
    });
    const { refreshToken, accessToken: oldAccessToken } = await loginResponse.json();
    const refreshResponse = await authApi.refresh(refreshToken);
    expect(refreshResponse.status()).toBe(HTTP.OK);
    
    const body = await refreshResponse.json();
    expect(body.accessToken).toBeDefined();
    expect(body.accessToken.split('.')).toHaveLength(3);
    expect(body.username).toBe(ADMIN_USERNAME);
  });

  test('AUTH-05: Невалидный refreshToken', async ({ authApi }) => {
    const invalidToken = 'invalid_token_string_for_testing';
    const refreshResponse = await authApi.refresh(invalidToken);
     
    expect(refreshResponse.status()).toBe(HTTP.FORBIDDEN); 
  });
});