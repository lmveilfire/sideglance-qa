import { HttpSchema, type ElementState } from '#utils/schemas';

export const API_URL = process.env.API_URL || 'http://localhost:8080';
export const BASE_URL = process.env.BASE_URL || 'http://localhost';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Required env variable "${name}" is not set`);
  }
  return value;
}

export const ADMIN_USERNAME = getEnvVar('TEST_ADMIN_USERNAME');
export const ADMIN_PASSWORD = getEnvVar('TEST_ADMIN_PASSWORD');

export const HTTP = HttpSchema.enum;

export const LIMITS = {
  photo: { titleMax: 255, authorMax: 255 },
  comment: { authorMax: 100, textMax: 1000 },
};

export const INVALID_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjo5OTk5OTk5OTk5fQ.invalid-signature';

export const DEFAULT_ANSWER_TIME_MS = 3000;
export const DEFAULT_FILE_PATH = '1.jpg';

export const DEFAULT_START_PAGE = 0;
export const DEFAULT_COMMENT_PAGE_SIZE = 5;
export const MAX_COMMENT_PAGE_SIZE = 100;

export const STATE_DETACHED: ElementState = 'detached';
export const STATE_VISIBLE: ElementState = 'visible';
export const TIMEOUT_3S: number = 3000;
export const TIMEOUT_5S: number = 5000;
export const ADMIN_STORAGE_STATE_PATH = 'playwright/.auth/admin.json';
