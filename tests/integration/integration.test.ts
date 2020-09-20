import childProcess from 'child_process';
import { promisify } from 'util';

const exec = promisify(childProcess.exec);

// Before running these integration tests, the following steps must be completed:
//
// 1. yarn build
// 2. yarn demo:link
// 3. yarn demo:build

it('outputs accessibility violation information for the demo app', () => {
  expect.assertions(1);

  return exec('yarn --cwd demo storybook:axe-no-build').catch((output) => {
    expect(output.stdout).toMatchSnapshot();
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TypeScript thinks these tests are Mocha, not Jest. Until we can figure out how to
  // get nested tsconfigs working with tsc, I'm manually ignoring the error.
}, 120000);
