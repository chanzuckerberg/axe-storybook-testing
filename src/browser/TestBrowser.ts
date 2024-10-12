import playwright, {type Browser, type Page} from 'playwright';
import type {Options} from '../Options';
import ProcessedStory from '../ProcessedStory';
import Result from '../Result';
import * as AxePage from './AxePage';
import * as StorybookPage from './StorybookPage';

export default class TestBrowser {
  private browser: Browser;
  private page: Page;

  /**
   * Create a new test browser instance that knows how to use Storybook and Axe. Needed because
   * constructors can't be async.
   */
  static async create(
    storybookUrl: string,
    options: Options,
  ): Promise<TestBrowser> {
    const browser = await playwright[options.browser].launch({
      headless: options.headless,
    });

    try {
      const context = await browser.newContext({bypassCSP: true});

      // Create a new page at Storybook's static iframe and with axe-core setup and ready to run.
      const page = await context.newPage();

      // Print any console logs containing the word "error" coming from the browser, to help
      // debugging.
      page.on('console', (message) => {
        if (/error/i.test(message.text())) {
          console.log('console log from browser:', message);
        }
      });

      // Turn on `prefers-reduced-motion`. This will prevent any animations that respect the media
      // query from causing flaky or failing tests due to animation.
      await page.emulateMedia({reducedMotion: 'reduce'});

      // Visit Storybook's static iframe.
      await page.goto(storybookUrl + '/iframe.html');

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
  async getStories(): Promise<ProcessedStory[]> {
    const rawStories = await StorybookPage.getStories(this.page);
    return rawStories.map((story) => new ProcessedStory(story));
  }

  /**
   * Run Axe for a story.
   */
  async getResultForStory(story: ProcessedStory): Promise<Result> {
    await StorybookPage.showStory(this.page, story.id);

    if (story.waitForSelector) {
      await this.page.waitForSelector(story.waitForSelector, {
        state: 'attached',
      });
    }

    const axeResults = await AxePage.analyze(
      this.page,
      story.disabledRules,
      story.runOptions,
      story.context,
      story.config,
    );

    return new Result(axeResults.violations);
  }

  /**
   * Close the browser and any open pages.
   */
  close(): Promise<void> {
    return this.browser.close();
  }
}
