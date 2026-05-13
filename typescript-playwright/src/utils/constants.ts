export const API_URL = process.env.API_URL || 'http://localhost:8080/api';
export const BASE_URL = process.env.BASE_URL || 'http://localhost';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Required env variable "${name}" is not set`);
  }
  return value;
}

export const ADMIN_USERNAME = getEnvVar('ADMIN_USERNAME');
export const ADMIN_PASSWORD = getEnvVar('ADMIN_PASSWORD');

export const TIMEOUTS = {
  SHORT: 3_000,
  MEDIUM: 10_000,
  LONG: 30_000,
} as const;

export const HTTP = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
} as const;

export const LIMITS = {
  photo:   { titleMax: 255, authorMax: 255 },
  comment: { authorMax: 100, textMax: 1000 },
} as const;

export const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const MIN_ANSWER_TIME_MS = 2000;
export const DEFAULT_ANSWER_TIME_MS = 3000;