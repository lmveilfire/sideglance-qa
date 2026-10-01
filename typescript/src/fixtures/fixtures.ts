import { test as base, expect, type Page, type APIRequestContext } from '@playwright/test';
import { AuthHelper } from '#helpers/AuthHelper';
import { AuthApi } from '#api/AuthApi';
import { PhotoApi } from '#api/PhotoApi';
import { CategoryApi } from '#api/CategoryApi';
import { SubcategoryApi } from '#api/SubcategoryApi';
import { CommentApi } from '#api/CommentApi';
import { AdminCommentApi } from '#api/AdminCommentApi';
import { CaptchaHelper } from '#helpers/CaptchaHelper';
import { GalleryPage } from '#pages/GalleryPage';
import { PhotoPage } from '#pages/PhotoPage';
import { LoginPage } from '#pages/LoginPage';
import { PhotoUploadPage } from '#pages/PhotoUploadPage';
import { ModerateCommentsPage } from '#pages/ModerateCommentsPage';
import { CategoryClient } from '#clients/CategoryClient';
import { SubcategoryClient } from '#clients/SubcategoryClient';
import { AuthClient } from '#clients/AuthClient';
import { PhotoClient } from '#clients/PhotoClient';
import { CommentClient } from '#clients/CommentClient';
import { AdminCommentClient } from '#clients/AdminCommentClient';
import { UiAuthHelper } from '#helpers/UiAuthHelper';

type Fixtures = {
  authHelper: AuthHelper;
  authHeaders: Record<string, string>;
  captchaHelper: CaptchaHelper;
  uiAuthHelper: UiAuthHelper;

  authApi: AuthApi;
  photoApi: PhotoApi;
  categoryApi: CategoryApi;
  subcategoryApi: SubcategoryApi;
  commentApi: CommentApi;
  adminCommentApi: AdminCommentApi;

  categoryClient: CategoryClient;
  subcategoryClient: SubcategoryClient;
  authClient: AuthClient;
  photoClient: PhotoClient;
  commentClient: CommentClient;
  adminCommentClient: AdminCommentClient;

  galleryPage: GalleryPage;
  photoPage: PhotoPage;
  loginPage: LoginPage;

  adminContextPage: Page;
  photoUploadPage: PhotoUploadPage;
  moderateCommentsPage: ModerateCommentsPage;
  adminGalleryPage: GalleryPage;
};

export const test = base.extend<Fixtures>({
  authHelper: async ({ request }: { request: APIRequestContext }, use) => {
    await use(new AuthHelper(request));
  },

  authHeaders: async ({ authHelper }: Fixtures, use) => {
    const headers = await authHelper.getAdminHeaders();
    await use(headers);
  },

  authApi: async ({ request }: { request: APIRequestContext }, use) => {
    await use(new AuthApi(request));
  },

  photoApi: async ({ request, authHeaders }: { request: APIRequestContext } & Fixtures, use) => {
    await use(new PhotoApi(request, authHeaders));
  },

  categoryApi: async ({ request, authHeaders }: { request: APIRequestContext } & Fixtures, use) => {
    await use(new CategoryApi(request, authHeaders));
  },

  commentApi: async ({ request }: { request: APIRequestContext }, use) => {
    await use(new CommentApi(request));
  },

  subcategoryApi: async (
    { request, authHeaders }: { request: APIRequestContext } & Fixtures,
    use,
  ) => {
    await use(new SubcategoryApi(request, authHeaders));
  },

  adminCommentApi: async (
    { request, authHeaders }: { request: APIRequestContext } & Fixtures,
    use,
  ) => {
    await use(new AdminCommentApi(request, authHeaders));
  },

  captchaHelper: async ({ request }: { request: APIRequestContext }, use) => {
    await use(new CaptchaHelper(request));
  },

  galleryPage: async ({ page }: { page: Page }, use) => {
    await use(new GalleryPage(page));
  },

  photoPage: async ({ page }: { page: Page }, use) => {
    await use(new PhotoPage(page));
  },

  loginPage: async ({ page }: { page: Page }, use) => {
    await use(new LoginPage(page));
  },

  categoryClient: async ({ categoryApi }: Fixtures, use) => {
    await use(new CategoryClient(categoryApi));
  },

  subcategoryClient: async ({ subcategoryApi }: Fixtures, use) => {
    await use(new SubcategoryClient(subcategoryApi));
  },

  authClient: async ({ authApi }: Fixtures, use) => {
    await use(new AuthClient(authApi));
  },

  photoClient: async ({ photoApi }: Fixtures, use) => {
    await use(new PhotoClient(photoApi));
  },

  adminCommentClient: async ({ adminCommentApi }: Fixtures, use) => {
    await use(new AdminCommentClient(adminCommentApi));
  },

  commentClient: async ({ commentApi }: Fixtures, use) => {
    await use(new CommentClient(commentApi));
  },

  uiAuthHelper: async ({ page, authHelper }: { page: Page } & Fixtures, use) => {
    await use(new UiAuthHelper(page, authHelper));
  },

  photoUploadPage: async ({ page }: { page: Page }, use) => {
    await use(new PhotoUploadPage(page));
  },

  moderateCommentsPage: async ({ page }: { page: Page }, use) => {
    await use(new ModerateCommentsPage(page));
  },

  adminGalleryPage: async ({ page }: { page: Page }, use) => {
    await use(new GalleryPage(page));
  },
});

export { expect };
export type { Fixtures };
