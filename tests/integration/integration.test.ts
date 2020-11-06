/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { exec } from 'child_process';
import * as fs from 'fs';
import path from 'path';

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TypeScript thinks these tests are Mocha, not Jest. Until we can figure out how to
  // deconflict the global Mocha and Jest types, we'll manually ignore the error.
}, 120000);

it('outputs accessibility violation information and sarif files for the demo app', (done) => {
  expect.assertions(12);

  exec('yarn --cwd demo storybook:axe-no-build:sarif', function (error, stdout, stderr) {
    const normalizedStdout = normalize(stdout);
    const normalizedStderr = normalize(stderr);
    expect(error!.code).toEqual(1);
    expect(normalizedStdout).toMatchSnapshot();
    expect(normalizedStderr).toMatchSnapshot();
    compareSarifFilesToSnapshot();

    done();
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TypeScript thinks these tests are Mocha, not Jest. Until we can figure out how to
  // deconflict the global Mocha and Jest types, we'll manually ignore the error.
}, 120000);

/**
 * Remove items from a string that are specific to a test run or environment, such as timing
 * information and file-system paths. That way, we can snapshot test effectively.
 */
function normalize(input: string) {
  /** Test times reported by Mocha. For example, `(520ms)` or `(3s)` */
  const specTimePattern = /\(\d+m?s\)/g;
  /** File system paths. For example, `/path/to/some/file */
  const cwdPattern = new RegExp(process.cwd(), 'g');
  /** Line numbers from stack trace paths. For example, `.js:20:55` */
  const lineNumbersPattern = /\.js:\d+:\d+/g;
  /** build/Suite.js is a path that is contained in the snapshot. Windows uses an absolute path. */
  const stackFilePathPattern = /(at Context\.<anonymous> \()([a-zA-Z0-9/\\\-.:]*?)([/\\]{1,4}build[/\\]{1,4}Suite.js\))/g;
  /** Stripping environment specific filepath */
  // const environmentFilePath = /: "file:\/\/\/.*?(\/axe-storybook-testing\/)/g;
  /** ISO DateTime. For example, `1970-01-01T00:00:00.0Z` */
  const isoDateTimePattern =/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/g;
  /** Ticks differ betwen Windows and other platforms */
  const tickPattern = /√/g;

  return input
    .replace(specTimePattern, '')
    .replace(cwdPattern, '')
    .replace(lineNumbersPattern, '.js')
    .replace(stackFilePathPattern, 'at Context.<anonymous> (/build/Suite.js)')
    // .replace(environmentFilePath, ': "file:///..$1')
    .replace(tickPattern, '✓')
    .replace(isoDateTimePattern, '1970-01-01T00:00:00.0Z');
}

/**
 * Compare outputted Sarif files to pre-determined snapshots.
 */
function compareSarifFilesToSnapshot() {
  const fileNames : string[] = [
    'button--button-1.sarif',
    'button--button-2.sarif',
    'button--button-3.sarif',
    'button--button-4.sarif',
    'button--button-6.sarif',
    'input--input-1.sarif',
    'input--input-2.sarif',
    'input--input-4.sarif',
    'input--input-5.sarif',
  ];
  
  fileNames.forEach(fileName => {
    let sarifFileContents : string = fs.readFileSync(
      path.join('./demo/sarif-test-results/', fileName),
      'utf8',
    );
    sarifFileContents = normalize(sarifFileContents);

    let sarifSnapshotFileContents : string = fs.readFileSync(
      path.join('./tests/integration/sarif-test-results-snapshots/', fileName),
      'utf8',
    );
    sarifSnapshotFileContents = normalize(sarifSnapshotFileContents);

    expect(sarifFileContents).toEqual(sarifSnapshotFileContents);
  });
}