/* eslint-env node, mocha */
import assert from 'assert';
import playwright from 'playwright';
import * as Options from './Options';
import * as ProcessedStory from './ProcessedStory';
import * as RawStory from './RawStory';
import * as Result from './Result';

const options = Options.parse();

async function writeTests() {
  const browser = await playwright[options.browser].launch({ headless: options.headless });
  const context = await browser.newContext({ bypassCSP: true });
  const page = await context.newPage();
  const rawStories = await RawStory.fromIframe(options.iframePath, page);
  const processedStories = ProcessedStory.fromRawStories(rawStories);

  describe(`[${options.browser}] accessibility`, function () {
    after(async function () {
      await browser.close();
    });

    processedStories.forEach((story) => {
      const testFn = ProcessedStory.isEnabled(story) ? it : it.skip;

      testFn(story.name, async function () {
        const result = await Result.fromStory(story, page, options.iframePath);

        if (result.violations.length === 0) {
          assert.ok('Nice');
        } else {
          assert.fail('\n' + Result.formatViolations(result));
        }
      });
    });
  });

  // Magic function injected by Mocha, signalling that the tests have been defined and are ready to
  // be ran. Only works because `delay: true` is passed to the Mocha constructor in index.ts.
  run();
}

writeTests();
