/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { exec } from 'child_process';

// Before running these integration tests, the following steps must be completed:
//
// 1. `yarn demo:setup` - only needs to be ran when initially setting up the repo, or when changing
//                        the demo app.
// 2. `yarn build` - automatically ran by the pretest:integration step.

it('outputs accessibility violation information for the demo app', (done) => {
  expect.assertions(3);

  exec('yarn --cwd demo storybook:axe-no-build', function (error, stdout, stderr) {
    const normalizedStdout = normalize(stdout);
    const normalizedStderr = normalize(stderr);
    expect(error!.code).toEqual(1);
    expect(normalizedStdout).toMatchSnapshot();
    expect(normalizedStderr).toMatchSnapshot();
    done();
  });
}, 120000);

it('can filter the components to run', (done) => {
  expect.assertions(3);

  exec('yarn --cwd demo storybook:axe-no-build --pattern button', function (error, stdout, stderr) {
    const normalizedStdout = normalize(stdout);
    const normalizedStderr = normalize(stderr);
    expect(error!.code).toEqual(1);
    expect(normalizedStdout).toMatchSnapshot();
    expect(normalizedStderr).toMatchSnapshot();
    done();
  });
}, 120000);

it('can only fail at specific severity levels', (done) => {
  expect.assertions(3);

  exec('yarn --cwd demo storybook:axe-no-build --failing-impact critical', function (error, stdout, stderr) {
    const normalizedStdout = normalize(stdout);
    const normalizedStderr = normalize(stderr);
    expect(error!.code).toEqual(1);
    expect(normalizedStdout).toMatchSnapshot();
    expect(normalizedStderr).toMatchSnapshot();
    done();
  });
});

/**
 * Remove items from a string that are specific to a test run or environment, such as timing
 * information and file-system paths. That way, we can snapshot test effectively.
 */
function normalize(input: string) {
  /** Test times reported by Mocha. For example, `(520ms)` or `(3s)` */
  const specTimePattern = /\s*\([\d.]+m?s\)/g;
  /** File system paths. For example, `/path/to/some/file */
  const cwdPattern = new RegExp(process.cwd(), 'g');
  /** Line numbers from stack trace paths. For example, `.js:20:55` */
  const lineNumbersPattern = /\.js:\d+:\d+/g;

  return input
    .replace(specTimePattern, '')
    .replace(cwdPattern, '')
    .replace(lineNumbersPattern, '.js');
}
