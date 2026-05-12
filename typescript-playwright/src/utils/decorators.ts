import { test } from '@playwright/test';

export function step<T extends object, A extends unknown[], R>(
  stepName?: string
) {
  return function (
    value: (this: T, ...args: A) => Promise<R>,
    context: ClassMethodDecoratorContext<T, (this: T, ...args: A) => Promise<R>>
  ) {
    return async function (this: T, ...args: A): Promise<R> {
      const name = stepName || `${this.constructor.name}.${String(context.name)}`;
      return test.step(name, async () => value.call(this, ...args));
    };
  };
}

export function retry<T extends object, A extends unknown[], R>(
  times = 3,
  delayMs = 500,
  retryOn: (error: unknown) => boolean = () => true
) {
  return function (
    value: (this: T, ...args: A) => Promise<R>,
    context: ClassMethodDecoratorContext<T, (this: T, ...args: A) => Promise<R>>
  ) {
    return async function (this: T, ...args: A): Promise<R> {
      let lastError: unknown;
      const methodName = String(context.name);

      for (let i = 0; i < times; i++) {
        try {
          return await value.call(this, ...args);
        } catch (e) {
          if (!retryOn(e)) throw e;

          lastError = e;
          const attempt = i + 1;

          if (attempt < times) {
            console.warn(
              `[retry] ${methodName} failed (attempt ${attempt}/${times}), retrying in ${delayMs}ms`,
              e
            );
            await new Promise(r => setTimeout(r, delayMs));
          }
        }
      }
      throw lastError;
    };
  };
}

export function logCall<T extends object, A extends unknown[], R>(
  value: (this: T, ...args: A) => Promise<R>,
  context: ClassMethodDecoratorContext<T, (this: T, ...args: A) => Promise<R>>
) {
  return async function (this: T, ...args: A): Promise<R> {
    const methodName = String(context.name);
    try {
      console.log(`${methodName}(${safeStringify(args)})`);
      const start = performance.now();
      const result = await value.call(this, ...args);
      const ms = (performance.now() - start).toFixed(0);
      console.log(`${methodName} done in ${ms}ms`);
      return result;
    } catch (error) {
      console.error(`${methodName} failed:`, error);
      throw error;
    }
  };
}

function isPlaywrightObject(val: unknown): val is object {
  if (typeof val !== 'object' || val === null) return false;
  const v = val as Record<string, unknown>;
  if ('waitFor' in v && 'click' in v && 'fill' in v) return true;
  if ('goto' in v && 'locator' in v && 'waitForSelector' in v) return true;
  return false;
}

function getPlaywrightLabel(val: object): string {
  const v = val as Record<string, unknown>;
  if ('goto' in v) return 'Page';
  if ('waitFor' in v) return 'Locator';
  return 'PlaywrightObject';
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value, (_key, val) => {
      if (isPlaywrightObject(val)) {
        return `[${getPlaywrightLabel(val)}]`;
      }
      return val;
    });
  } catch {
    return '[Circular]';
  }
}