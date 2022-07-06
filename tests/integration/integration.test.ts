/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { exec } from 'child_process';

// Before running these integration tests, the following steps must be completed:
//
// 1. `yarn demo:setup` - only needs to be ran when initially setting up the repo, or when changing
//                        the demo app.
// 2. `yarn build` - automatically ran by the pretest:integration step.

it('outputs accessibility violation information for the demo app', (done) => {
  expect.assertions(2);

  exec('yarn --cwd demo storybook:axeOnly', function (error, stdout) {
    const normalizedStdout = normalize(stdout);
    expect(error!.code).toEqual(1);
    expect(normalizedStdout).toMatchSnapshot();
    done();
  });
  // @ts-expect-error Getting Mocha instead of Jest types...
}, 120000);

it('filters the components to run', (done) => {
  expect.assertions(2);

  exec('yarn --cwd demo storybook:axeOnly --pattern simple', function (error, stdout) {
    const normalizedStdout = normalize(stdout);
    expect(error!.code).toEqual(1);
    expect(normalizedStdout).toMatchSnapshot();
    done();
  });
  // @ts-expect-error Getting Mocha instead of Jest types...
}, 120000);

it('fails only specific impact levels if specified', (done) => {
  expect.assertions(2);

  exec('yarn --cwd demo storybook:axeOnly --failing-impact critical', function (error, stdout) {
    const normalizedStdout = normalize(stdout);
    expect(error!.code).toEqual(1);
    expect(normalizedStdout).toMatchSnapshot();
    done();
  });
  // @ts-expect-error Getting Mocha instead of Jest types...
}, 120000);

/**
 * Remove items from a string that are specific to a test run or environment, such as timing
 * information and file-system paths. That way, we can snapshot test effectively.
 */
function normalize(input: string) {
  /** Test times reported by Mocha. For example, `(520ms)` or `(3s)` */
  const specTimePattern = /\s*\([\d.]+m?s\)/g;
  /** File system paths. For example, `/path/to/some/file */
  const cwdPattern = new RegExp(process.cwd(), 'g');
  /** Line numbers from stack trace paths. For example, `timers:20:55` */
  const lineNumbersPattern = /:\d+:\d+/g;
  /** storybook-start outputs an info dialog at the beginning this removes those lines */
  const storybookStartedFrame = /(│.*│\n|[─╭╮╰╯]+?)/g;
  /** webpack outputs a hash and build time */
  const webpackBuilt = /webpack built [\w\s]*\w\n/g;
  /** webpack outputs can vary from build to build */
  const webpackBuildTimeVariations =
    /info => Using cached manager|Opening `[\w/]+?` failed \(\d\): Device not configured\n/g;
  /** node show `process.` on some platforms and not others */
  const nodeProcessInternalsVariation = /process\.(.*?\(node:internal)/g;

  return input
    .replace(specTimePattern, '')
    .replace(cwdPattern, '')
    .replace(lineNumbersPattern, '')
    .replace(storybookStartedFrame, '')
    .replace(webpackBuilt, 'webpack built')
    .replace(webpackBuildTimeVariations, '')
    .replace(nodeProcessInternalsVariation, '$1');
}
