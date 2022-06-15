import assert from 'assert';
import indent from 'indent-string';
import each from 'lodash/each';
import groupBy from 'lodash/groupBy';
import Mocha from 'mocha';
import type { Options } from './Options';
import Browser from './browser';

/**
 * Find Storybook stories and generate a test for each one.
 */
export async function runSuite(storybookUrl: string, options: Options): Promise<number> {
  const suiteTitle = `[${options.browser}] accessibility`;
  const browser = await Browser.create(storybookUrl, options);
  const stories = await browser.getStories();
  const storiesByComponent = groupBy(stories, 'componentTitle');

  const mocha = new Mocha({
    reporter: options.reporter,
    reporterOptions: getReporterOptions(suiteTitle, options),
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
      const test = new Mocha.Test(story.name, async () => {
        const result = await browser.getResultForStory(story);

        if (result.isPassing(options.failingImpacts)) {
          assert.ok(true);
        } else {
          assert.fail(
            // Fail with an error instead of a string, to prevent some unnecessary stuff being
            // printed to the console.
            new Error(
              // Indent each line of the failure message so it lines up with how Mocha prints
              // the test names.
              indent(result.toString(), 5).trimStart(),
            ),
          );
        }
      });

      // Skip this test if the story is disabled. Equivalent to writing `it.skip(...)`.
      if (!story.isEnabled) {
       test.pending = true;
      }

      componentSuite.addTest(test);
    });
  });

  return new Promise((resolve) => {
    mocha.run(resolve);
  });
}

/**
 * Create an options object for a Mocha reporter from the `--reporter-otions` CLI option. Mostly
 * useful for the xunit reporter to specify where to output the XML file.
 */
function getReporterOptions(suiteTitle: string, options: Options) {
  return {
    suiteName: suiteTitle,
    ...Object.fromEntries(new URLSearchParams(options.reporterOptions)),
  };
}
