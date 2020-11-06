import type { Result as AxeResult, NodeResult } from 'axe-core';
import indent from 'indent-string';
import dedent from 'ts-dedent';
import { Result } from './Result';
import { SuiteEmitter } from './Suite';

export default function format(emitter: SuiteEmitter, print = console.log): void {
  const failingResults: Result[] = [];
  let failure = 0;
  let suiteBrowser = '';

  emitter.on('suiteStart', (browser) => {
    suiteBrowser = browser;
    print(`[${browser}] accessibility`);
  });

  emitter.on('componentStart', (componentName) => {
    print(indent(componentName, 2));
  });

  emitter.on('componentSkip', (componentName) => {
    print(indent(`[skipped] ${componentName}`, 2));
  });

  emitter.on('storyPass', (storyName, _result, elapsedTime) => {
    print(indent(`✓ ${storyName} (${elapsedTime}ms)`, 4));
  });

  emitter.on('storyFail', (storyName, result, elapsedTime) => {
    failingResults.push(result);
    failure += 1;
    print(indent(`${failure}) ${storyName} (${elapsedTime}ms)`, 4));
  });

  emitter.on('storySkip', (storyName) => {
    print(indent(`- ${storyName}`, 4));
  });

  emitter.on('suiteFinish', (numPass, numFail, numSkip) => {
    print('');
    print(dedent`
      ${numPass} passing
      ${numFail} failing
      ${numSkip} pending
    `);

    failingResults.forEach((result, index) => {
      print('');
      print(`${index + 1}) [${suiteBrowser}] accessibility`);
      print(indent(result.component, 5));
      print(indent(result.name, 7));

      print('');
      print(indent(formatViolations(result), 7));
    });

    print('');
  });
}

/**
 * Pretty-print the violations of a result.
 */
function formatViolations(result: Result): string {
  return [
    'Detected the following accessibility violations!',
    '',
    ...result.violations.map(formatViolation),
  ].join('\n');
}

function formatViolation(violation: AxeResult, index: number) {
  return [
    `${index + 1}. ${violation.id} (${violation.help})`,
    '',
    `   For more info, visit ${violation.helpUrl}.`,
    '',
    '   Check these nodes:',
    '',
    ...violation.nodes.map(formatNode),
  ].join('\n');
}

function formatNode(node: NodeResult) {
  if (node.failureSummary) {
    return [
      `   - html: ${node.html}`,
      `     ${formatSummary(node.failureSummary, 14)}`,
      '',
    ].join('\n');
  }
  return `   - html: ${node.html}\n`;
}

/**
 * Pretty print a node's failure summary.
 *
 * The summary is a string with newlines and tabs within it. We want to split the line up so the
 * first line can be placed on the same line as "summary: ", and all the other lines are on their
 * own lines, but indented far enough to be lined up with the first line.
 *
 * @example
 *
 * formatSummary("Foo\nBar\nBaz", 9)
 *
 * // summary: Foo
 * //          Bar
 * //          Baz
 */
function formatSummary(summary: string, indentation: number) {
  const [firstLine, ...trailingLines] = summary.split('\n');

  const indentedTrailingLines = trailingLines.map((line) => {
    return ' '.repeat(indentation) + line;
  });

  return [
    `summary: ${firstLine}`,
    ...indentedTrailingLines,
  ].join('\n');
}
