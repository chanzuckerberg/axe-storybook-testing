import type { Result as AxeResult, NodeResult } from 'axe-core';
import chalk from 'chalk';
import indent from 'indent-string';
import dedent from 'ts-dedent';
import { Result } from './Result';
import { SuiteEmitter } from './Suite';

export default function format(emitter: SuiteEmitter, print = console.log, colors = new chalk.Instance()): void {
  const failingResults: Result[] = [];
  let failure = 0;
  let suiteBrowser = 'unknown';

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
    print(indent(`${colors.green('✓')} ${colors.gray(storyName)} ${colors.yellow(`(${elapsedTime}ms)`)}`, 4));
  });

  emitter.on('storyFail', (storyName, result, elapsedTime) => {
    failingResults.push(result);
    failure += 1;
    print(indent(colors.red(`${failure}) ${storyName} (${elapsedTime}ms)`), 4));
  });

  emitter.on('storySkip', (storyName) => {
    print(indent(colors.cyan(`- ${storyName}`), 4));
  });

  emitter.on('suiteFinish', (numPass, numFail, numSkip) => {
    print('');
    print(dedent`
      ${colors.green(numPass + ' passing')}
      ${colors.red(numFail + ' failing')}
      ${colors.cyan(numSkip + ' pending')}
    `);

    failingResults.forEach((result, index) => {
      print('');
      print(formatResult(result, suiteBrowser, index, colors));
    });

    print('');
  });
}

function formatResult(result: Result, browser: string, index: number, colors: chalk.Chalk): string {
  return dedent`
    ${index + 1}) [${browser}] accessibility
         ${result.component}
           ${result.name}

           ${colors.red('Detected the following accessibility violations!')}

    ${indent(colors.red(formatViolations(result.violations)), 7)}
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
 * placed on the same line as "summary: ", and all the other lines are on their own lines, but
 * indented far enough to be lined up with the first line.
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
