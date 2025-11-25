import type AxeCore from 'axe-core';
import {createRequire} from 'module';
import type {Page} from 'playwright';

const require = createRequire(import.meta.url);

// Functions we pass to `page.evaluate` execute in a browser environment, and can access window.
declare let window: {
  axe: typeof AxeCore;
  enqueuePromise: <T>(createPromise: () => Promise<T>) => Promise<T>;
};

export type Context =
  | AxeCore.SerialFrameSelector
  | AxeCore.SerialFrameSelector[]
  | AxeCore.SerialContextObject;

/**
 * These rules aren't useful/helpful in the context of Storybook stories, and we disable them when
 * running Axe.
 */
const defaultDisabledRules = [
  'bypass',
  'landmark-one-main',
  'page-has-heading-one',
  'region',
];

/**
 * Prepare a page for running axe on it.
 */
export async function prepare(page: Page): Promise<void> {
  await page.waitForLoadState();
  await page.addScriptTag({path: require.resolve('axe-core')});

  // Make sure `window.axe` is available before considering setup complete.
  await page.waitForFunction(() => typeof window.axe !== 'undefined', {
    timeout: 5000,
  });
}

/**
 * Run axe-core on a page and return the results.
 */
export function analyze(
  page: Page,
  disabledRules: string[] = [],
  runOptions: AxeCore.RunOptions = {},
  context?: Context,
  config?: AxeCore.Spec,
): Promise<AxeCore.AxeResults> {
  return page.evaluate(runAxe, {
    options: getRunOptions(runOptions, [
      ...defaultDisabledRules,
      ...disabledRules,
    ]),
    config,
    context,
  });
}

/**
 * (In Browser Context)
 *
 */
function runAxe({
  config,
  context,
  options,
}: {
  config?: AxeCore.Spec;
  context?: Context;
  options: AxeCore.RunOptions;
}): Promise<AxeCore.AxeResults> {
  if (!window.enqueuePromise) {
    // Add a promise queue so we can ensure only one promise runs at a time.
    //
    // Used to prevent concurrent runs of `axe.run`, which breaks (see https://github.com/dequelabs/axe-core/issues/1041).
    // This should never happen, but in the past errors during rendering at the right/wrong time has
    // caused the next test to start before the previous has stopped.
    //
    // Got the idea from https://github.com/dequelabs/agnostic-axe/pull/6.
    //
    // We create this queue on demand to resolve https://github.com/chanzuckerberg/axe-storybook-testing/issues/107.
    let queue = Promise.resolve();

    window.enqueuePromise = function <T>(createPromise: () => Promise<T>) {
      return new Promise<T>((resolve, reject) => {
        queue = queue.then(createPromise).then(resolve).catch(reject);
      });
    };
  }

  return window.enqueuePromise(() => {
    // Always reset the axe config, so if one story sets its own config it doesn't affect the
    // others.
    window.axe.reset();

    if (config) {
      window.axe.configure(config);
    }

    // API: https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axerun
    // @ts-expect-error This function executes in a browser context.
    return window.axe.run(context || document, options);
  });
}

export function getRunOptions(
  options: AxeCore.RunOptions,
  disabledRules: string[] = [],
): AxeCore.RunOptions {
  const newRules: AxeCore.RuleObject = options.rules || {};

  for (const rule of disabledRules) {
    newRules[rule] = {enabled: false};
  }

  return {
    ...options,
    rules: newRules,
  };
}
