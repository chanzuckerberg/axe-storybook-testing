/* eslint-env node, mocha */
import defer from 'lodash/defer';
import groupBy from 'lodash/groupBy';
import { createEmitter, Emitter } from './Emitter';
import { Options } from './Options';
import * as ProcessedStory from './ProcessedStory';
import * as Result from './Result';
import * as TestBrowser from './TestBrowser';

export type SuiteEvents = {
  suiteStart: (browser: string) => void;
  componentStart: (componentName: string) => void;
  componentSkip: (componentName: string) => void;
  storyStart: (storyName: string) => void;
  storyPass: (storyName: string, result: Result.Result, elapsedTime: number) => void;
  storyFail: (storyName: string, result: Result.Result, elapsedTime: number) => void;
  storySkip: (storyName: string) => void;
  suiteFinish: (numPass: number, numFail: number, numSkip: number, elapsedTime: number) => void;
}

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

    const testBrowser = await TestBrowser.create(options);
    const page = await TestBrowser.createPage(testBrowser, options);
    const stories = await TestBrowser.getStories(page);
    const storiesByComponent = groupBy(stories, 'componentTitle');
    const storiesAndComponents = Object.entries(storiesByComponent);

    try {
      for (const [componentTitle, stories] of storiesAndComponents) {
        const nameMatches = options.pattern.test(componentTitle);

        if (!nameMatches) {
          emitter.emit('componentSkip', componentTitle);
          continue;
        }

        emitter.emit('componentStart', componentTitle);

        for (const story of stories) {
          const storyStartTime = Date.now();

          if (!ProcessedStory.isEnabled(story)) {
            numSkip += 1;
            emitter.emit('storySkip', story.name);
            continue;
          }

          emitter.emit('storyStart', story.name);

          const result = await Result.fromPage(page, story);
          const storyEndTime = Date.now();
          const storyElapsedTime = storyEndTime - storyStartTime;

          if (Result.isPassing(result)) {
            numPass += 1;
            emitter.emit('storyPass', story.name, result, storyElapsedTime);
          } else {
            numFail += 1;
            emitter.emit('storyFail', story.name, result, storyElapsedTime);
          }
        }
      }
    } finally {
      const suiteEndTime = Date.now();
      const suiteElapsedTime = suiteEndTime - suiteStartTime;
      emitter.emit('suiteFinish', numPass, numFail, numSkip, suiteElapsedTime);
      await TestBrowser.close(testBrowser);
    }
  });

  return emitter;
}
