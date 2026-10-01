import * as path from 'path';
import { faker } from '@faker-js/faker';
import type { PhotoPayload, CommentPayload, CategoryPayload } from './schemas.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generate = {
  photoData: (overrides?: Partial<PhotoPayload>): PhotoPayload => ({
    title: `TEST-${faker.lorem.words({ min: 2, max: 4 })}`,
    author: faker.person.fullName(),
    place: faker.location.city(),
    takenAt: faker.date.past({ years: 2 }).toISOString().split('T')[0] ?? '',
    ...overrides,
  }),

  commentData: (photoId: number, overrides?: Partial<CommentPayload>): CommentPayload => ({
    author: `TEST-${faker.internet.username()}`,
    text: faker.lorem.paragraph({ min: 1, max: 3 }),
    photoId,
    ...overrides,
  }),

  categoryData: (overrides?: Partial<CategoryPayload>): CategoryPayload => ({
    name: `TEST-${faker.lorem.slug(2)}`,
    ...overrides,
  }),

  ip: (): string => faker.internet.ipv4(),

  fixturePath: (filename = 'test-image.jpg'): string =>
    path.resolve(__dirname, '../../src/resources/images', filename),

  getIsoDateOffset: (daysOffset = 0): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
  },
};
