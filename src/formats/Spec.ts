import type { Result as AxeResult, NodeResult } from 'axe-core';
import chalk from 'chalk';
import indent from 'indent-string';
import dedent from 'ts-dedent';
import { Result } from '../Result';
import { SuiteEmitter } from '../suite';
import humanizeDuration from './humanizeDuration';

type Failure = {
  componentName: string;
  result: Result | Error;
  storyName: string;
}

/**
 * Output test suite information similarly to Mocha's "spec" formatter.
 */
export function format(emitter: SuiteEmitter, print = console.log, colors = new chalk.Instance()): void {
  const failures: Failure[] = [];
  let failureIndex = 0;

  emitter.on('suiteStart', (browser) => {
    print(`[${browser}] accessibility`);
  });

  emitter.on('suiteError', (error) => {
    print(dedent`
      ${colors.red('Error! The suite failed to run')}
      An error was encountered before we started testing stories. Likely this means the browser failed to open.
    `);
    print('');
    print(String(error));
  });

  emitter.on('componentStart', (componentName) => {
    print(indent(componentName, 2));
  });

  emitter.on('componentSkip', (componentName) => {
    print(indent(`[skipped] ${componentName}`, 2));
  });

  emitter.on('storyPass', (storyName, _componentName, _result, elapsedTime) => {
    print(indent(`${colors.green('✓')} ${colors.gray(storyName)} ${colors.yellow(`(${humanizeDuration(elapsedTime)})`)}`, 4));
  });

  emitter.on('storyFail', (storyName, componentName, result, elapsedTime) => {
    failures.push({ componentName, result, storyName });
    failureIndex += 1;
    print(indent(colors.red(`${failureIndex}) ${storyName} (${humanizeDuration(elapsedTime)})`), 4));
  });

  emitter.on('storySkip', (storyName) => {
    print(indent(colors.cyan(`- ${storyName}`), 4));
  });

  emitter.on('storyError', (storyName, componentName, error) => {
    failures.push({ componentName, result: error, storyName });
    failureIndex += 1;
    print(indent(colors.red(`${failureIndex}) ${storyName}`), 4));
  });

  emitter.on('suiteFinish', (browser, numPass, numFail, numSkip, elapsedTime) => {
    print('');
    print(dedent`
      ${colors.green(numPass + ` passing (${humanizeDuration(elapsedTime)})`)}
      ${colors.red(numFail + ' failing')}
      ${colors.cyan(numSkip + ' pending')}
    `);

    failures.forEach((result, index) => {
      print('');
      print(formatFailure(result, browser, index, colors));
    });

    print('');
  });
}

function formatFailure(failure: Failure, browser: string, index: number, colors: chalk.Chalk): string {
  return dedent`
    ${index + 1}) [${browser}] accessibility
         ${failure.componentName}
           ${failure.storyName}

    ${indent(colors.red(formatFailureResult(failure)), 7)}
  `;
}

function formatFailureResult(failure: Failure) {
  if (failure.result instanceof Error) {
    return String(failure.result);
  }

  return dedent`
    Detected the following accessibility violations!

    ${formatViolations(failure.result.violations)}
  `;
}

function formatViolations(violations: AxeResult[]) {
  return violations.map(formatViolation).join('\n\n');
}

function formatViolation(violation: AxeResult, index: number) {
  return dedent`
    ${index + 1}. ${violation.id} (${violation.help})

       For more info, visit ${violation.helpUrl}.

       Check these nodes:

    ${indent(formatNodes(violation.nodes), 3)}
  `;
}

function formatNodes(nodes: NodeResult[]) {
  return nodes.map(formatNode).join('\n\n');
}

function formatNode(node: NodeResult) {
  if (node.failureSummary) {
    return dedent`
      - html: ${node.html}
        summary: ${formatSummary(node.failureSummary, 11)}
    `;
  }
  return `- html: ${node.html}`;
}

/**
 * Pretty print a node's failure summary.
 *
 * The summary is a string with newlines. We want to split the line up so the first line can be
 * placed on the same line as "summary: ", and all the others are indented far enough to be lined
 * up with the first.
 *
 * @example
 *
 * 'summary: ' + formatSummary("Foo\nBar\nBaz", 11)
 *
 * // summary: Foo
 * //          Bar
 * //          Baz
 */
function formatSummary(summary: string, indentation: number) {
  return indent(summary, indentation).trimStart();
}
