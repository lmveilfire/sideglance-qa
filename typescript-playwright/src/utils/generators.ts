import * as path from 'path';
import { fa, faker } from '@faker-js/faker';
import {LIMITS} from '../utils/constants';
import type {PhotoPayload, CommentPayload, CategoryPayload} from './types';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generate = {
    photoData: (overrides?: Partial<PhotoPayload>): PhotoPayload => ({
        title: faker.lorem.words({ min: 2, max: 4 }),
        author: faker.person.fullName(),
        place: faker.location.city(),
        takenAt: faker.date.past({ years: 2 }).toISOString(),
        ...overrides,
    }),

    commentData: (photoId: number, overrides?: Partial<CommentPayload>): CommentPayload => ({
        author: faker.internet.username(),
        text: faker.lorem.paragraph({ min: 1, max: 3 }),
        photoId,
        ...overrides,
    }),

    categoryData: (overrides?: Partial<CategoryPayload>): CategoryPayload => ({
        name: `Подкатегория ${faker.word.adjective()}`,
        ...overrides,
    }),

    invalidPhotoVariants: (): Partial<PhotoPayload>[] => [
        { title: '', author: faker.person.fullName() },
        { title: faker.lorem.word(), author: '' },
        { title: 'A'.repeat(LIMITS.photo.titleMax + 1), author: faker.person.fullName() },
        { title: faker.lorem.word(), author: 'A'.repeat(LIMITS.photo.authorMax + 1) },
    ],

    invalidCommentVariants: (photoId: number): Partial<CommentPayload>[] => [
        { author: '', text: faker.lorem.sentence(), photoId },
        { author: faker.internet.username(), text: '', photoId },
        { author: 'A'.repeat(101), text: faker.lorem.sentence(), photoId },
        { author: faker.internet.username(), text: 'T'.repeat(LIMITS.comment.textMax + 1), photoId },
    ],

    ip: (): string => faker.internet.ipv4(), 

    fixturePath: (filename = 'test-image.jpg'): string =>
    path.resolve(__dirname, '../../src/fixtures/images', filename),

};




