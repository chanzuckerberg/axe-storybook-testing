import {exec} from 'child_process';
import {it, expect} from 'vitest';

it('outputs accessibility violation information for the demo app', () => {
  expect.assertions(2);

  return new Promise<void>((done) => {
    exec('cd demo && npm run storybook:axeOnly', function (error, stdout) {
      const normalizedStdout = normalize(stdout);
      expect(error!.code).toEqual(1);
      expect(normalizedStdout).toMatchSnapshot();
      done();
    });
  });
}, 120_000);

it('filters the components to run', () => {
  expect.assertions(2);

  return new Promise<void>((done) => {
    exec(
      'cd demo && npm run storybook:axeOnly -- --pattern simple',
      function (error, stdout) {
        const normalizedStdout = normalize(stdout);
        expect(error!.code).toEqual(1);
        expect(normalizedStdout).toMatchSnapshot();
        done();
      },
    );
  });
}, 120_000);

it('fails only specific impact levels if specified', () => {
  expect.assertions(2);

  return new Promise<void>((done) => {
    exec(
      'cd demo && npm run storybook:axeOnly -- --failing-impact critical',
      function (error, stdout) {
        const normalizedStdout = normalize(stdout);
        expect(error!.code).toEqual(1);
        expect(normalizedStdout).toMatchSnapshot();
        done();
      },
    );
  });
}, 120_000);

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
