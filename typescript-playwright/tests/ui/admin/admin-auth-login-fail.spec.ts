import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/LoginPage';
import {ADMIN_USERNAME} from '../../../src/utils/constants';

test('should fail login with invalid password', async ({ page }) => {
  const invalidPassword = 'invalidpassword';
  const errorMessage = 'The key doesn\'t match this lock.';

  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(ADMIN_USERNAME, invalidPassword);
  await expect(page).toHaveURL('/login');
  await expect(loginPage.errorMessage).toHaveText(errorMessage);
});
