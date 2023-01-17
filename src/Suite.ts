import assert from 'assert';
import indent from 'indent-string';
import each from 'lodash/each';
import groupBy from 'lodash/groupBy';
import Mocha from 'mocha';
import type {Options} from './Options';
import Browser from './browser';

/**
 * Find Storybook stories and generate a test for each one.
 */
export async function runSuite(
  storybookUrl: string,
  options: Options,
): Promise<number> {
  const suiteTitle = `[${options.browser}] accessibility`;
  const browser = await Browser.create(storybookUrl, options);
  const stories = await browser.getStories();
  const storiesByComponent = groupBy(stories, 'componentTitle');

  const mocha = new Mocha({
    reporter: options.reporter,
    reporterOptions: {suiteName: suiteTitle, ...options.reporterOptions},
    timeout: options.timeout,
  });

  mocha.suite.title = suiteTitle;

  // Make sure the test browser closes after everything has finished.
  mocha.suite.afterAll(async () => {
    await browser.close();
  });

  each(storiesByComponent, (stories, componentTitle) => {
    // Create another suite (AKA `describe`) to group this component's stories together.
    const componentSuite = Mocha.Suite.create(mocha.suite, componentTitle);

    // Skip all stories for this component if its title doesn't match the `pattern` option.
    // Equivalent to writing `describe.skip(...)`.
    if (!options.pattern.test(componentTitle)) {
      componentSuite.pending = true;
    }

    stories.forEach((story) => {
      // Create a test for this story.
      const test = new Mocha.Test(story.name, async function () {
        if (story.timeout) {
          // @ts-expect-error -- Mocha's TS definitions don't properly type `this`
          this.timeout(story.timeout);
        }
        const result = await browser.getResultForStory(story);

        if (result.isPassing(options.failingImpacts)) {
          assert.ok(true);
        } else {
          // Fail with an error instead of a string, to prevent some unnecessary stuff being
          // printed to the console.
          const error = new Error(
            // Indent each line of the failure message so it lines up with how Mocha prints
            // the test names.
            indent(result.toString(), 5).trimStart(),
          );

          // Clear out the `stack` property. Otherwise the xunit reporter prints the error message
          // twice. It seems that the stack trace includes the error message, for some reason.
          error.stack = '';

          // Fail the test suite if the story is supposed to be able to do that. Either way the
          // error message is displayed.
          if (story.canFail) {
            assert.fail(error);
          } else {
            assert.ok(true, error);
          }
        }
      });

      // Skip this test if the story is disabled. Equivalent to writing `it.skip(...)`.
      if (!story.shouldSkip) {
        test.pending = true;
      }

      componentSuite.addTest(test);
    });
  });

  return new Promise((resolve) => {
    mocha.run(resolve);
  });
}
