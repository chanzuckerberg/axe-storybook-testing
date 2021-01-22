/* eslint-env node, mocha */
import defer from 'lodash/defer';
import groupBy from 'lodash/groupBy';
import pTimeout from 'p-timeout';
import type { Options } from '../Options';
import { isEnabled } from '../ProcessedStory';
import { Result, isPassing } from '../Result';
import Browser from '../browser';
import { createEmitter, Emitter } from './Emitter';

/**
 * Mapping of event names to handlers for the test suite.
 */
export type SuiteEvents = {
  suiteStart: (browser: string) => void;
  suiteError: (error: Error) => void;
  componentStart: (componentName: string) => void;
  componentSkip: (componentName: string) => void;
  storyStart: (storyName: string, componentName: string) => void;
  storyPass: (storyName: string, componentName: string, result: Result, elapsedTime: number) => void;
  storyFail: (storyName: string, componentName: string, result: Result, elapsedTime: number) => void;
  storySkip: (storyName: string, componentName: string) => void;
  storyError: (storyName: string, componentName: string, error: Error) => void;
  suiteFinish: (browser: string, numPass: number, numFail: number, numSkip: number, elapsedTime: number) => void;
}

/**
 * Event emitter representing a run of the test suite.
 */
export type SuiteEmitter = Emitter<SuiteEvents>;

/**
 * Find Storybook stories and run Axe on each one. Returns an event emitter that emits events when
 * components and stories are processed.
 */
export function run(options: Options): SuiteEmitter {
  const emitter = createEmitter<SuiteEvents>();

  defer(async () => {
    const suiteStartTime = Date.now();
    let numPass = 0;
    let numFail = 0;
    let numSkip = 0;

    emitter.emit('suiteStart', options.browser);

    // Get the Storybook stories.
    try {
      const browser = await Browser.create(options);
      const stories = await browser.getStories();
      const storiesByComponent = groupBy(stories, 'componentName');
      const storiesAndComponents = Object.entries(storiesByComponent);

      try {
        // Iterate each component.
        for (const [componentName, stories] of storiesAndComponents) {
          const shouldComponentRun = options.pattern.test(componentName);

          if (shouldComponentRun) {
            emitter.emit('componentStart', componentName);
          } else {
            emitter.emit('componentSkip', componentName);
          }

          // Iterate each story in this component.
          for (const story of stories) {
            const storyStartTime = Date.now();

            if (!shouldComponentRun || !isEnabled(story)) {
              numSkip += 1;
              emitter.emit('storySkip', story.name, componentName);
              continue;
            }

            emitter.emit('storyStart', story.name, componentName);

            try {
              // Detect any Axe violations for this story.
              const result = await pTimeout(browser.getResultForStory(story), options.timeout);
              const storyEndTime = Date.now();
              const storyElapsedTime = storyEndTime - storyStartTime;

              if (isPassing(result, options.failingImpacts)) {
                numPass += 1;
                emitter.emit('storyPass', story.name, componentName, result, storyElapsedTime);
              } else {
                numFail += 1;
                emitter.emit('storyFail', story.name, componentName, result, storyElapsedTime);
              }
            } catch (message) {
              numFail += 1;
              const error = message instanceof Error ? message : new Error(message);
              emitter.emit('storyError', story.name, componentName, error);
            }
          }
        }

        const suiteEndTime = Date.now();
        const suiteElapsedTime = suiteEndTime - suiteStartTime;
        emitter.emit('suiteFinish', options.browser, numPass, numFail, numSkip, suiteElapsedTime);
      } finally {
        await browser.close();
      }
    } catch (message) {
      // The test suite failed to run. Likely the browser failed to open, or something else went
      // wrong before we started iterating components.
      const error = message instanceof Error ? message : new Error(message);
      emitter.emit('suiteError', error);
      // Signal that the test suite is done. Pass a failed count of 1 to indicate that the test run
      // was unsuccessful.
      emitter.emit('suiteFinish', options.browser, 0, 1, 0, 0);
    }
  });

  return emitter;
}
