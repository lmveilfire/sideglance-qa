import * as path from 'path';
import {LIMITS, ALPHABET} from './constants';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface PhotoPayload {
    title: string;
    author: string;
    place?: string;
    takenAt?: string;
    categoryId?: number;
    subcategoryId?: number;
}

export interface CommentPayload {
    author: string;
    text: string;
    photoId: number;
    honeypot?: string;
}

export interface CategoryPayload {
    name: string;
}

const randomString = (length = 8): string =>
  Array.from({ length }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');

const randomDate = (direction: 'past' | 'future' = 'past'): string => {
  const date = new Date();
  const offset = Math.floor(Math.random() * 365);
  date.setDate(date.getDate() + (direction === 'future' ? offset : -offset));
  return date.toISOString().split('T')[0] ?? '';
};

export const generate = {
    photoData: (overrides?: Partial<PhotoPayload>): PhotoPayload => ({
        title: `${randomString(6)}`,
        author: `${randomString(4)}`,
        place: `${randomString(5)}`,
        takenAt: randomDate(),
        ...overrides,
    }),

    commentData: (photoId: number, overrides?: Partial<CommentPayload>): CommentPayload => ({
        author: `${randomString(5)}`,
        text: `${randomString(20)}`,
        photoId,
        ...overrides,
    }),

    categoryData: (overrides?: Partial<CategoryPayload>): CategoryPayload => ({
        name: `Категория ${randomString(6)}`,
        ...overrides,
    }),

    invalidPhotoVariants: (): Partial<PhotoPayload>[] => [
        { title: '', author: 'Автор' },
        { title: 'Название', author: '' },
        { title: 'A'.repeat(256), author: 'Автор' },
        { title: 'Название', author: 'A'.repeat(LIMITS.photo.authorMax + 1) },
    ],

    invalidCommentVariants: (photoId: number): Partial<CommentPayload>[] => [
        { author: '', text: 'Текст', photoId },
        { author: 'Автор', text: '', photoId },
        { author: 'A'.repeat(101), text: 'Текст', photoId },
        { author: 'Автор', text: 'T'.repeat(LIMITS.comment.textMax + 1), photoId },
    ],

    fixturePath: (filename = 'test-image.jpg'): string =>
    path.resolve(__dirname, '../../fixtures', filename),
};




