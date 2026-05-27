import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/LoginPage';
import { AdminUploadPage } from '../../../src/pages/AdminUploadPage';
import {ADMIN_USERNAME, ADMIN_PASSWORD} from '../../../src/utils/constants';

test('should login successfully with valid credentials', async ({ page }) => {
  const url = '/admin-panel/upload';
  const loginPage = new LoginPage(page);
  const dashboardPage = new AdminUploadPage(page);

  await loginPage.goto();
  await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
  await expect(page).toHaveURL(url);
  await expect(dashboardPage.navUpload).toBeVisible();
});
