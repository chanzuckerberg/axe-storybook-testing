import type { AxeResults, RuleObject, RunOptions } from 'axe-core';
import type { Page } from 'playwright';

/**
 * Prepare a page for running axe on it.
 */
export async function prepare(page: Page): Promise<void> {
  await page.waitForLoadState();
  await page.addScriptTag({ path: require.resolve('axe-core') });
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
  return window.axe.run(document, options);
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
