/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { exec } from 'child_process';

// Before running these integration tests, the following steps must be completed:
//
// 1. yarn build
// 2. yarn demo:install
// 3. yarn demo:link
// 4. yarn demo:build

it('outputs accessibility violation information for the demo app', (done) => {
  expect.assertions(2);

  exec('yarn --cwd demo storybook:axe-no-build', function (error, stdout) {
    expect(error!.code).toEqual(1);
    expect(stdout).toMatchSnapshot();
    done();
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TypeScript thinks these tests are Mocha, not Jest. Until we can figure out how to
  // get nested tsconfigs working with tsc, I'm manually ignoring the error.
}, 120000);
