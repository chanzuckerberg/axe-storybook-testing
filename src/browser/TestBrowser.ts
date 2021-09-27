import playwright, { Browser, Page } from 'playwright';
import type { Options } from '../Options';
import * as ProcessedStory from '../ProcessedStory';
import * as Result from '../Result';
import * as AxePage from './AxePage';
import * as StorybookPage from './StorybookPage';

export default class TestBrowser {
  private browser: Browser;
  private page: Page;

  /**
   * Create a new test browser instance that knows how to use Storybook and Axe. Needed because
   * constructors can't be async.
   */
  static async create(options: Options): Promise<TestBrowser> {
    const browser = await playwright[options.browser].launch({
      headless: options.headless,
    });

    try {
      const context = await browser.newContext({ bypassCSP: true });

      // Create a new page at Storybook's static iframe and with axe-core setup and ready to run.
      const page = await context.newPage();

      // Turn on `prefers-reduced-motion`. This will prevent any animations that respect the media
      // query from causing flaky or failing tests due to animation.
      await page.emulateMedia({ reducedMotion: 'reduce' });

      // Visit Storybook's static iframe.
      await page.goto(options.iframePath);

      // Ensure axe-core is setup and ready to run.
      await AxePage.prepare(page);

      return new TestBrowser(browser, page);
    } catch (message) {
      // Something has gone wrong after the browser was launched. Make sure we clean up the opened
      // browser.
      await browser.close();
      // Reject this promise.
      throw message;
    }
  }

  private constructor(browser: Browser, page: Page) {
    this.browser = browser;
    this.page = page;
  }

  /**
   * Get the Storybook stories from a prepared browser page.
   */
  async getStories(): Promise<ProcessedStory.ProcessedStory[]> {
    const rawStories = await StorybookPage.getStories(this.page);
    return ProcessedStory.fromStories(rawStories);
  }

  /**
   * Run Axe for a story.
   */
  async getResultForStory(story: ProcessedStory.ProcessedStory): Promise<Result.Result> {
    const storyParams = story.parameters.axe;
    await StorybookPage.showStory(this.page, story);

    if (storyParams.waitForSelector) {
      await this.page.waitForSelector(storyParams.waitForSelector, { state: 'attached' });
    }

    return Result.fromPage(this.page, story);
  }

  /**
   * Close the browser and any open pages.
   */
  close(): Promise<void> {
    return this.browser.close();
  }
}
