import puppeteer from 'puppeteer';
import { AxePuppeteer } from 'axe-puppeteer';
import type { AxeResults } from 'axe-core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { SelectedStory } from './selectStories';

type Result = {
  name: string;
  result: AxeResults;
};

export default async function getResults(stories: SelectedStory[], iframePath: string): Promise<Result[]> {
  const browser = await puppeteer.launch();
  const results: Result[] = [];

  await Promise.all(
    stories.map(async (story) => {
      const page = await browser.newPage();
      await page.setBypassCSP(true);

      await page.goto(`file://${iframePath}?${story.encodedParams}`);
      const axeBuilder = new AxePuppeteer(page).disableRules(['landmark-one-main', 'page-has-heading-one', 'region']);
      const result = await axeBuilder.analyze();

      results.push({
        name: story.name,
        result,
      });

      await page.close();
    }),
  );

  await browser.close();
  return results;
}
