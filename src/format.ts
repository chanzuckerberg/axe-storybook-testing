import type { Result as AxeResult, NodeResult } from 'axe-core';
import indent from 'indent-string';
import { Result } from './Result';
import { SuiteEmitter } from './Suite';

export default function format(emitter: SuiteEmitter): void {
  const failingResults: Result[] = [];
  let failure = 0;
  let suiteBrowser = '';

  emitter.on('suiteStart', (browser) => {
    suiteBrowser = browser;
    console.log(`[${browser}] accessibility`);
  });

  emitter.on('componentStart', (componentName) => {
    console.log(indent(componentName, 2));
  });

  emitter.on('componentSkip', (componentName) => {
    console.log(indent(`[skipped] ${componentName}`, 2));
  });

  emitter.on('storyPass', (storyName, _result, elapsedTime) => {
    console.log(indent(`✓ ${storyName} (${elapsedTime}ms)`, 4));
  });

  emitter.on('storyFail', (storyName, result, elapsedTime) => {
    failingResults.push(result);
    failure += 1;
    console.log(indent(`${failure}) ${storyName} (${elapsedTime}ms)`, 4));
  });

  emitter.on('storySkip', (storyName) => {
    console.log(indent(`- ${storyName}`, 4));
  });

  emitter.on('suiteFinish', (numPass, numFail, numSkip) => {
    console.log('');
    console.log(`${numPass} passing`);
    console.log(`${numFail} failing`);
    console.log(`${numSkip} pending`);

    failingResults.forEach((result, index) => {
      console.log('');
      console.log(`${index + 1}) [${suiteBrowser}] accessibility`);
      console.log(indent(result.component, 5));
      console.log(indent(result.name, 7));

      console.log('');
      console.log(indent(formatViolations(result), 7));
    });

    console.log('');
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
