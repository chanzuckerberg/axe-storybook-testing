import type {
  AxeResults,
  SerialContextObject,
  SerialFrameSelector,
  RuleObject,
  RunOptions,
  Spec,
} from 'axe-core';
import type {Page} from 'playwright';

// Functions we pass to `page.evaluate` execute in a browser environment, and can access window.
// eslint-disable-next-line no-var
declare var window: {
  enqueuePromise: <T>(createPromise: () => Promise<T>) => Promise<T>;
};

export type Context =
  | SerialFrameSelector
  | SerialFrameSelector[]
  | SerialContextObject;

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
  context?: Context,
  config?: Spec,
): Promise<AxeResults> {
  return page.evaluate(runAxe, {
    options: getRunOptions(runOptions, disabledRules),
    config,
    context,
  });
}

function runAxe({
  config,
  context,
  options,
}: {
  config?: Spec;
  context?: Context;
  options: RunOptions;
}): Promise<AxeResults> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore This function executes in a browser context.
  return window.enqueuePromise(() => {
    // Always reset the axe config, so if one story sets its own config it doesn't affect the
    // others.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore This function executes in a browser context.
    window.axe.reset();

    if (config) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore This function executes in a browser context.
      window.axe.configure(config);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore This function executes in a browser context.
    return window.axe.run(context || document, options);
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
  let queue = Promise.resolve();

  window.enqueuePromise = function <T>(createPromise: () => Promise<T>) {
    return new Promise<T>((resolve, reject) => {
      queue = queue.then(createPromise).then(resolve, reject);
    });
  };
}
