export const API_HEADERS = {
  'Content-Type': 'application/json',
} as const;

export function mergeHeaders(
  customHeaders?: Record<string, string>
): Record<string, string> {
  return {
    ...API_HEADERS,
    ...(customHeaders || {}),
  };
}