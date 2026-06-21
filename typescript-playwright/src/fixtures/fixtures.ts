import { test as base, expect } from "@playwright/test";
import { AuthHelper } from "../helpers/AuthHelper";
import { AuthApi } from "../api/AuthApi";
import { PhotoApi } from "../api/PhotoApi";
import { CategoryApi } from "../api/CategoryApi";
import { SubcategoryApi } from "../api/SubcategoryApi";
import { CommentApi } from "../api/CommentApi";
import { AdminCommentApi } from "../api/AdminCommentApi";
import { CaptchaHelper } from "../helpers/CaptchaHelper";
import { GalleryPage } from "../pages/GalleryPage";
import { PhotoPage } from "../pages/PhotoPage";
import { LoginPage } from "../pages/LoginPage";
import { CategoryClient } from "../clients/CategoryClient";
import { SubcategoryClient } from "../clients/SubcategoryClient";
import { AuthClient } from "../clients/AuthClient";
import { PhotoClient } from "../clients/PhotoClient";
import { CommentClient } from "../clients/CommentClient";
import { AdminCommentClient } from "../clients/AdminCommentClient";
import { UiAuthHelper } from "../helpers/UiAuthHelper";

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
  categoryClient: CategoryClient;
  subcategoryClient: SubcategoryClient;
  authClient: AuthClient;
  photoClient: PhotoClient;
  commentClient: CommentClient;
  adminCommentClient: AdminCommentClient;
  uiAuthHelper: UiAuthHelper;
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

  uiAuthHelper: async ({ page, authHelper }, use) => {
    await use(new UiAuthHelper(page, authHelper));
  },
});

export { expect };
export type { Fixtures };
