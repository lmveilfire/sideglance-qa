import { test } from '@playwright/test';

export function step<This, Args extends unknown[], Return>(
  target: (this: This, ...args: Args) => Promise<Return>,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>,
): (this: This, ...args: Args) => Promise<Return> {
  return function replacementMethod(this: This, ...args: Args): Promise<Return> {
    const className = (this as { constructor: { name: string } }).constructor.name;
    const stepName = `${className}.${String(context.name)}`;
    return test.step(stepName, () => target.call(this, ...args), { box: true });
  };
}
