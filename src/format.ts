import { SuiteEmitter } from './Suite';

export default function format(emitter: SuiteEmitter): void {
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
}
