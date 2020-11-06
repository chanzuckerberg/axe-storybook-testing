import options from './Options';
import * as Suite from './Suite';

/**
 * Run the accessibility tests and return a promise that is resolved or rejected based on whether
 * any violations were detected.
 */
export function run(): Promise<void> {
  return new Promise((resolve, reject) => {
    const emitter = Suite.run(options);

    emitter.on('suiteFinish', (_numPass, numFail) => {
      return numFail > 0 ? reject() : resolve();
    });

    emitter.on('suiteStart', (browser) => {
      console.log('suiteStart', browser);
    });

    emitter.on('componentStart', (componentName) => {
      console.log('componentStart', componentName);
    });

    emitter.on('componentSkip', (componentName) => {
      console.log('componentSkip', componentName);
    });

    emitter.on('storyStart', (storyName) => {
      console.log('storyStart', storyName);
    });

    emitter.on('storyPass', (result, elapsedTime) => {
      console.log('storyPass', result, elapsedTime);
    });

    emitter.on('storyFail', (result, elapsedTime) => {
      console.log('storyFail', result, elapsedTime);
    });

    emitter.on('storySkip', () => {
      console.log('storySkip');
    });

    emitter.on('suiteFinish', (numPass, numFail, numSkip, elapsedTime) => {
      console.log('suiteFinish', numPass, numFail, numSkip, elapsedTime);
    });
  });
}
