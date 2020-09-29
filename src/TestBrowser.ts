import playwright, { Browser, BrowserContext, Page } from 'playwright';
import * as AxePage from './AxePage';
import * as ProcessedStory from './ProcessedStory';
import * as StorybookPage from './StorybookPage';
import type { Options } from './Options';

type TestBrowser = {
  browser: Browser;
  context: BrowserContext;
}

/**
 * Create new Browser and BrowserContext instances in the specified browser.
 */
export async function create(options: Options): Promise<TestBrowser> {
  const browser = await playwright[options.browser].launch({
    headless: options.headless,
    args: [
      // Force the `prefers-reduced-motion` media query to be true in Chromium. This will prevent
      // animations (that respect the media query) from causing flaky or failing tests due to the
      // animation. Only works in Chromium, currently.
      '--force-prefers-reduced-motion',
    ],
  });

  const context = await browser.newContext({ bypassCSP: true });

  return { browser, context };
}

/**
 * Create a new page at Storybook's static iframe and with axe-core setup and ready to run.
 */
export async function createPage(testBrowser: TestBrowser, options: Options): Promise<Page> {
  const page = await testBrowser.context.newPage();
  await page.goto('file://' + options.iframePath);
  await AxePage.prepare(page);
  return page;
}

export function close(testBrowser: TestBrowser): Promise<void> {
  return testBrowser.browser.close();
}

/**
 * Get the Storybook stories from a prepared browser page.
 */
export async function getStories(page: Page): Promise<ProcessedStory.ProcessedStory[]> {
  const rawStories = await StorybookPage.getStories(page);
  return ProcessedStory.fromStories(rawStories);
}
