import type {AxeResults, RuleObject, RunOptions, Spec} from 'axe-core';
import type {Page} from 'playwright';

/**
 * Prepare a page for running axe on it.
 */
export async function prepare(page: Page): Promise<void> {
  await page.waitForLoadState();
  await page.addScriptTag({path: require.resolve('axe-core')});
  await page.evaluate(addPromiseQueue);
}

/**
 * Run axe-core on a page and return the results.
 */
export function analyze(
  page: Page,
  disabledRules: string[] = [],
  runOptions: RunOptions = {},
  config?: Spec,
): Promise<AxeResults> {
  return page.evaluate(runAxe, {
    options: getRunOptions(runOptions, disabledRules),
    config,
  });
}

function runAxe({
  options,
  config,
}: {
  options: RunOptions;
  config?: Spec;
}): Promise<AxeResults> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore This function executes in a browser context.
  return window.axeQueue.add(() => {
    if (config) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore This function executes in a browser context.
      window.axe.configure(config);
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore This function executes in a browser context.
      window.axe.reset();
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore This function executes in a browser context.
    return window.axe.run(document, options);
  });
}

export function getRunOptions(
  options: RunOptions,
  disabledRules: string[] = [],
): RunOptions {
  const newRules: RuleObject = options.rules || {};

  for (const rule of disabledRules) {
    newRules[rule] = {enabled: false};
  }

  return {
    ...options,
    rules: newRules,
  };
}

/**
 * Add a Queue implementation for promises, forcing a single promise to run at a time.
 *
 * This will be used to ensure that we only run one `axe.run` call at a time. We will never
 * intentionally run multiple at a time. However, a component throwing an error during its
 * lifecycle can result in a test finishing and proceeding to the next one, but the previous
 * `axe.run` call still "running" when the next one starts. This results in an error (see
 * https://github.com/dequelabs/axe-core/issues/1041).
 *
 * We avoid that by forcing one `axe.run` call to finish before the next one can start. Got the
 * idea from https://github.com/dequelabs/agnostic-axe/pull/6.
 */
function addPromiseQueue() {
  type QueuedPromise<T> = {
    promiseCreator: () => Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
  };

  /**
   * Queue of promises, which forces any promises added to it to run one at a time.
   *
   * This was originally implemented as an ES6 class. But I ran into a lot of issues with how the
   * class's properties were compiled not working in different environments and browsers, and even
   * breaking when Babel was updated.
   *
   * To avoid that, I've instead implemented this as a function that maintains some state within a
   * closure. Since there are no class properties (which can be compiled by Babel in different ways),
   * there are no more problems.
   */
  function PromiseQueue<T>() {
    const pending: QueuedPromise<T>[] = [];
    let working = false;

    /**
     * Add a promise to the queue. Returns a promise that is resolved or rejected when the added
     * promise eventually resolves or rejects.
     */
    function add(promiseCreator: () => Promise<T>): Promise<T> {
      return new Promise((resolve, reject) => {
        pending.push({promiseCreator, resolve, reject});
        dequeue();
      });
    }

    /**
     * Run the next promise in the queue.
     */
    function dequeue() {
      // If we're already working on a promise, do nothing.
      if (working) {
        return;
      }

      const nextPromise = pending.shift();

      // If there are no promises to work on, do nothing.
      if (!nextPromise) {
        return;
      }

      working = true;

      // Execute the promise. When it's done, start working on the next.
      nextPromise
        .promiseCreator()
        .then(nextPromise.resolve, nextPromise.reject)
        .finally(() => {
          working = false;
          dequeue();
        });
    }

    return {add};
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore This function executes in a browser context.
  window.axeQueue = PromiseQueue<AxeResults>();
}
