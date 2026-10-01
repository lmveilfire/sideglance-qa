import type { APIResponse } from '@playwright/test';

export async function assertStatus(
  response: APIResponse,
  context: string,
  ...expected: number[]
): Promise<void> {
  if (!expected.includes(response.status())) {
    throw new Error(`[${context}] failed: ${response.status()} ${await response.text()}`);
  }
}
