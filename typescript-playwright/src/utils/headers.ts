import { API_URL, BASE_URL } from '../utils/constants.ts';

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Origin': process.env.CORS_ORIGIN || API_URL,
} as const;

export function mergeHeaders(
  customHeaders?: Record<string, string>
): Record<string, string> {
  return {
    ...API_HEADERS,
    ...(customHeaders || {}),
  };
}