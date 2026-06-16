import { test } from "@playwright/test";

export function step<T extends object, A extends unknown[], R>(
  stepName?: string,
) {
  return function (
    value: (this: T, ...args: A) => Promise<R>,
    context: ClassMethodDecoratorContext<
      T,
      (this: T, ...args: A) => Promise<R>
    >,
  ) {
    return async function (this: T, ...args: A): Promise<R> {
      const name =
        stepName || `${this.constructor.name}.${String(context.name)}`;
      return test.step(name, async () => value.call(this, ...args));
    };
  };
}
