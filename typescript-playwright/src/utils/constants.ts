export const API_URL = process.env.API_URL || "http://localhost:8080";
export const BASE_URL = process.env.BASE_URL || "http://localhost";

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Required env variable "${name}" is not set`);
  }
  return value;
}

export const ADMIN_USERNAME = getEnvVar("TEST_ADMIN_USERNAME");
export const ADMIN_PASSWORD = getEnvVar("TEST_ADMIN_PASSWORD");

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
  photo: { titleMax: 255, authorMax: 255 },
  comment: { authorMax: 100, textMax: 1000 },
} as const;

export const IVALID_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjo5OTk5OTk5OTk5fQ.invalid-signature";
export const DEFAULT_ANSWER_TIME_MS = 3000;
