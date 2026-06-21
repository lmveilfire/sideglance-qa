import { expect } from "../fixtures/fixtures";

export const PhotoMatcher = {
  base: expect.objectContaining({
    id: expect.any(Number),
    title: expect.any(String),
    author: expect.any(String),
    url: expect.any(String),
    fullUrl: expect.any(String),
    likes: expect.any(Number),
    views: expect.any(Number),
  }),
};

export const CategoryMatcher = {
  base: expect.objectContaining({
    id: expect.any(Number),
    name: expect.any(String),
  }),
};

export const SubcategoryMatcher = {
  base: expect.objectContaining({
    categoryId: expect.any(Number),
    id: expect.any(Number),
    name: expect.any(String),
  }),
};
