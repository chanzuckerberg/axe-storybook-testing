import type { AxeResults, RuleObject, RunOptions } from 'axe-core';
import type { Page } from 'playwright';

/**
 * Wrapper around a Playwright page that has axe-core injected into it. By using a single instance
 * of this for all tests, we only have to wait to inject axe-core once.
 */
export default class AxePage {
  initialized = false;
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async initialize() {
    this.initialized = true;
    await this.page.waitForLoadState();
    await this.page.addScriptTag({ path: require.resolve('axe-core') });
  }

  analyze(disabledRules: string[] = []): Promise<AxeResults> {
    if (!this.initialized) {
      return this.initialize().then(() => this.analyze(disabledRules));
    }
    return this.page.evaluate(runAxe, getOptions({}, disabledRules));
  }

  goto(path: string) {
    return this.page.goto(path);
  }
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
