import axe, { AxeResults } from 'axe-core';
import puppeteer, { JSONObject } from 'puppeteer';

export default class AxePuppeteer {
  frame: puppeteer.Frame;
  options?: axe.RunOptions;

  constructor(page: puppeteer.Page, options?: axe.RunOptions) {
    this.frame = page.mainFrame();
    this.options = options;
  }

  async analyze(): Promise<axe.AxeResults> {
    await ensureFrameReady(this.frame);
    await injectAxeModule(this.frame);

    const results = await this.frame.evaluate(runAxe, this.options as JSONObject);
    return results;
  }

  disableRules(rules: string[]): this {
    this.options = this.options || {};

    type RuleObject = {
      [ruleId: string]: {
        enabled: boolean;
      };
    }

    const newRules: RuleObject = {};

    for (const rule of rules) {
      newRules[rule] = {
        enabled: false,
      };
    }

    this.options.rules = newRules;
    return this;
  }
}

async function ensureFrameReady(frame: puppeteer.Frame) {
  // Wait so that we know there is an execution context.
  // Assume that if we have an html node we have an execution context.
  await frame.waitForSelector('html');

  // Check if the page is loaded.
  const pageReady = await frame.evaluate(pageIsReady);

  if (!pageReady) {
    throw new Error('Page is not ready');
  }
}

function injectAxeModule(frame: puppeteer.Frame): Promise<void> {
  return frame.addScriptTag({
    path: require.resolve('axe-core'),
  });
}

function pageIsReady() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore This function executes in a browser context.
  return document.readyState === 'complete';
}

function runAxe(options?: axe.RunOptions): Promise<AxeResults> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore This function executes in a browser context.
  return window.axe.run(document, options || {});
}
