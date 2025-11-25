/* eslint-disable vitest/no-conditional-expect */
// Disabling for this file, since exceptions are intentional
import {exec} from 'child_process';
import {it, expect} from 'vitest';
import {promisify} from 'util';

const execAsync = promisify(exec);

it('outputs accessibility violation information for the demo app', async () => {
  expect.assertions(2);

  await execAsync('cd demo && npm run storybook:axeOnly').catch((error) => {
    const normalizedStdout = normalize(error.stdout);
    expect(error.code).toEqual(1);
    expect(normalizedStdout).toMatchSnapshot();
  });
}, 120_000);

it('filters the components to run', async () => {
  expect.assertions(2);

  await execAsync(
    'cd demo && npm run storybook:axeOnly -- --pattern simple',
  ).catch((error) => {
    const normalizedStdout = normalize(error.stdout);
    expect(error.code).toEqual(1);
    expect(normalizedStdout).toMatchSnapshot();
  });
}, 120_000);

it('fails only specific impact levels if specified', async () => {
  expect.assertions(2);

  await execAsync(
    'cd demo && npm run storybook:axeOnly -- --failing-impact critical',
  ).catch((error) => {
    const normalizedStdout = normalize(error.stdout);
    expect(error.code).toEqual(1);
    expect(normalizedStdout).toMatchSnapshot();
  });
}, 120_000);

it('accepts a port to run on', async () => {
  expect.assertions(2);

  await execAsync('cd demo && npm run storybook:axeOnly -- --port 8112').catch(
    (error) => {
      const normalizedStdout = normalize(error.stdout);
      expect(error.code).toEqual(1);
      expect(normalizedStdout).toMatchSnapshot();
    },
  );
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
