import puppeteer from 'puppeteer';
import { AxePuppeteer } from 'axe-puppeteer';
import type { AxeResults } from 'axe-core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ProcessedStory } from './ProcessedStory';

type Result = {
  name: string;
  result: AxeResults;
};

/**
 * These rules aren't useful/helpful in the context of Storybook stories, and we disable them when
 * running Axe.
 */
const defaultDisabledRules = ['landmark-one-main', 'page-has-heading-one', 'region'];

/**
 * Run Axe on a browser page for each story.
 */
export async function fromStories(stories: ProcessedStory[], iframePath: string): Promise<Result[]> {
  const browser = await puppeteer.launch();

  try {
    const results = await Promise.all(
      stories.map(async (story) => {
        const page = await browser.newPage();

        try {
          await page.setBypassCSP(true);
          await page.goto(`file://${iframePath}?${story.uriParams}`);

          const disabledRules = defaultDisabledRules.concat(story.parameters.axe.disabledRules);
          const axeBuilder = new AxePuppeteer(page).disableRules(disabledRules);
          const result = await axeBuilder.analyze();

          return {
            name: story.name,
            result,
          };
        } finally {
          await page.close();
        }
      }),
    );

    return results;
  } finally {
    await browser.close();
  }
}
