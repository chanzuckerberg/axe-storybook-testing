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
  config?: Spec;
  context?: Context;
  options: RunOptions;
}): Promise<AxeResults> {
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

    // API: https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axerun
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
