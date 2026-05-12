import { test as base, expect } from '@playwright/test';
import { AuthHelper } from '../helpers/AuthHelper.ts';
import { AuthApi } from '../api/AuthApi.ts';
import { PhotoApi } from '../api/PhotoApi.ts';
import { CategoryApi } from '../api/CategoryApi.ts';
import { SubcategoryApi } from '../api/SubcategoryApi.ts';
import { CommentApi } from '../api/CommentApi.ts';
import { AdminCommentApi } from '../api/AdminCommentApi.ts';
import { CaptchaHelper } from '../helpers/CaptchaHelper.ts';
import { GalleryPage } from '../pages/GalleryPage';
import { PhotoPage } from '../pages/PhotoPage.ts';
import { LoginPage } from '../pages/LoginPage.ts';
import { CleanupRegistry } from './CleanupRegistry.ts';

type Fixtures = {
  authHelper: AuthHelper;
  authHeaders: Record<string, string>;
  authApi: AuthApi;
  photoApi: PhotoApi;
  categoryApi: CategoryApi;
  subcategoryApi: SubcategoryApi;
  commentApi: CommentApi;
  adminCommentApi: AdminCommentApi;
  captchaHelper: CaptchaHelper;
  galleryPage: GalleryPage;
  photoPage: PhotoPage;
  loginPage: LoginPage;
  cleanup: CleanupRegistry;
};

export const test = base.extend<Fixtures>({
  authHelper: async ({ request }, use) => {
    await use(new AuthHelper(request));
  },

  authHeaders: async ({ authHelper }, use) => {
    const headers = await authHelper.getAdminHeaders();
    await use(headers);
  },

  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },

  photoApi: async ({ request, authHeaders }, use) => {
    await use(new PhotoApi(request, authHeaders));
  },

  categoryApi: async ({ request, authHeaders }, use) => {
    await use(new CategoryApi(request, authHeaders));
  },

  subcategoryApi: async ({ request, authHeaders }, use) => {
    await use(new SubcategoryApi(request, authHeaders));
  },

  commentApi: async ({ request }, use) => {
    await use(new CommentApi(request));
  },

  adminCommentApi: async ({ request, authHeaders }, use) => {
    await use(new AdminCommentApi(request, authHeaders));
  },

  captchaHelper: async ({ request }, use) => {
    await use(new CaptchaHelper(request));
  },

  galleryPage: async ({ page }, use) => {
    await use(new GalleryPage(page));
  },

  photoPage: async ({ page }, use) => {
    await use(new PhotoPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  cleanup: async (_, use) => {
    const registry = new CleanupRegistry();
    await use(registry);
    await registry.execute();
  },
});

export { expect };