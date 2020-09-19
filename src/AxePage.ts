import type { AxeResults, RuleObject, RunOptions } from 'axe-core';
import type { Page } from 'playwright';

/**
 * Prepare a page for running axe on it.
 */
export async function prepare(page: Page): Promise<void> {
  await page.waitForLoadState();
  await page.addScriptTag({ path: require.resolve('axe-core') });
  await page.evaluate(addPromiseQueue);
}

/**
 * Run axe-core on a page and return the results.
 */
export function analyze(page: Page, disabledRules: string[] = []): Promise<AxeResults> {
  return page.evaluate(runAxe, getOptions({}, disabledRules));
}

function runAxe(options: RunOptions): Promise<AxeResults> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore This function executes in a browser context.
  return window.axeQueue.add(() => window.axe.run(document, options));
}

function getOptions(options: RunOptions, disabledRules: string[] = []) {
  const newRules: RuleObject = options.rules || {};

  for (const rule of disabledRules) {
    newRules[rule] = { enabled: false };
  }

  return {
    ...options,
    rules: newRules,
  };
}

/**
 * Add a Queue implementation for promises, forcing a single promise to run at a time.
 *
 * We won't intentionally run multiple axe.run calls at the same time. But a component throwing an
 * error during its lifecycle can result in a "test" finishing and proceeding to the next one, but
 * the previous axe.run call is still "running" when the next one starts. This results in an error
 * (see https://github.com/dequelabs/axe-core/issues/1041).
 *
 * We avoid that by forcing one axe.run call to finish before the next one can start. Got the idea
 * from https://github.com/dequelabs/agnostic-axe/pull/6.
 */
function addPromiseQueue() {
  type QueuedPromise<T> = {
    promiseCreator: () => Promise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
  }

  class PromiseQueue<T> {
    pending: QueuedPromise<T>[] = [];
    working = false;

    add(promiseCreator: () => Promise<T>): Promise<T> {
      return new Promise((resolve, reject) => {
        this.pending.push({
          promiseCreator,
          resolve,
          reject,
        });
        this.dequeue();
      });
    }

    private dequeue(): void {
      if (this.working) { return; }

      const nextPromise = this.pending.shift();

      if (!nextPromise) { return; }

      this.working = true;
      nextPromise.promiseCreator()
        .then((value) => {
          this.working = false;
          nextPromise.resolve(value);
          this.dequeue();
        })
        .catch((reason) => {
          this.working = false;
          nextPromise.reject(reason);
          this.dequeue();
        });
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore This function executes in a browser context.
  window.axeQueue = new PromiseQueue<AxeResults>();
}
