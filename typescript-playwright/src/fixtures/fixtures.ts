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
import { CategoryClient } from '../clients/CategoryClient.ts';
import { SubcategoryClient } from '../clients/SubcategoryClient.ts';
import { AuthClient } from '../clients/AuthClient.ts';
import { PhotoClient } from '../clients/PhotoClient.ts';
import { CommentClient } from '../clients/CommentClient.ts';
import { AdminCommentClient } from '../clients/AdminCommentClient.ts';

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
  categoryClient: CategoryClient;
  subcategoryClient: SubcategoryClient;
  authClient: AuthClient;
  photoClient: PhotoClient,
  commentClient: CommentClient,
  adminCommentClient: AdminCommentClient
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

  commentApi: async ({ request }, use) => {
    await use(new CommentApi(request));
  },

  subcategoryApi: async ({ request, authHeaders }, use) => {
    await use(new SubcategoryApi(request, authHeaders));
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

  cleanup: async ({}, use) => {
    const registry = new CleanupRegistry();
    await use(registry);
    await registry.execute();
  },

  categoryClient: async ({ categoryApi }, use) => {
    await use(new CategoryClient(categoryApi));
  },
 
  subcategoryClient: async ({ subcategoryApi }, use) => {
    await use(new SubcategoryClient(subcategoryApi));
  },

  authClient: async ({ authApi }, use) => {
    await use(new AuthClient(authApi));
  },

  photoClient: async ({ photoApi }, use) => {
    await use(new PhotoClient(photoApi));
  },

  adminCommentClient: async ({ adminCommentApi }, use) => {
    await use(new AdminCommentClient(adminCommentApi));
  },
  
  commentClient: async ({ commentApi }, use) => {
    await use(new CommentClient(commentApi));
  },
});

export { expect };
export type { Fixtures };