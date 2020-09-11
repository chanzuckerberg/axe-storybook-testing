import { AxePuppeteer } from 'axe-puppeteer';
import type { Result as AxeResult } from 'axe-core';
import type { Browser } from 'puppeteer';
import type { ProcessedStory } from './ProcessedStory';

export type Result = {
  name: string;
  violations: AxeResult[];
};

/**
 * These rules aren't useful/helpful in the context of Storybook stories, and we disable them when
 * running Axe.
 */
const defaultDisabledRules = ['landmark-one-main', 'page-has-heading-one', 'region'];

/**
 * Run Axe on a browser page for a story.
 */
export async function fromStory(story: ProcessedStory, browser: Browser, iframePath: string): Promise<Result> {
  const page = await browser.newPage();

  try {
    await page.setBypassCSP(true);
    await page.goto(`file://${iframePath}?${story.uriParams}`);

    const disabledRules = defaultDisabledRules.concat(story.parameters.axe.disabledRules);
    const axeBuilder = new AxePuppeteer(page).disableRules(disabledRules);
    const result = await axeBuilder.analyze();

    return {
      name: story.name,
      violations: result.violations,
    };
  } finally {
    await page.close();
  }
}
