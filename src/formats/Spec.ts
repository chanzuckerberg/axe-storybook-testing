import type { Result as AxeResult, NodeResult } from 'axe-core';
import chalk from 'chalk';
import indent from 'indent-string';
import dedent from 'ts-dedent';
import { Result } from '../Result';
import { SuiteEmitter } from '../Suite';

type Failure = {
  componentName: string;
  result: Result;
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

  emitter.on('componentStart', (componentName) => {
    print(indent(componentName, 2));
  });

  emitter.on('componentSkip', (componentName) => {
    print(indent(`[skipped] ${componentName}`, 2));
  });

  emitter.on('storyPass', (storyName, _componentName, _result, elapsedTime) => {
    print(indent(`${colors.green('✓')} ${colors.gray(storyName)} ${colors.yellow(`(${elapsedTime}ms)`)}`, 4));
  });

  emitter.on('storyFail', (storyName, componentName, result, elapsedTime) => {
    failures.push({ componentName, result, storyName });
    failureIndex += 1;
    print(indent(colors.red(`${failureIndex}) ${storyName} (${elapsedTime}ms)`), 4));
  });

  emitter.on('storySkip', (storyName) => {
    print(indent(colors.cyan(`- ${storyName}`), 4));
  });

  emitter.on('suiteFinish', (browser, numPass, numFail, numSkip, elapsedTime) => {
    print('');
    print(dedent`
      ${colors.green(numPass + ` passing (${elapsedTime}ms)`)}
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

           ${colors.red('Detected the following accessibility violations!')}

    ${indent(colors.red(formatViolations(failure.result.violations)), 7)}
  `;
}

function formatViolations(violations: AxeResult[]) {
  return violations.map(formatViolation).join('\n');
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
  return nodes.map(formatNode).join('\n');
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
