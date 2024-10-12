import type {Result as AxeResult, NodeResult} from 'axe-core';
import indent from 'indent-string';
import type {Page} from 'playwright';
import dedent from 'ts-dedent';
import type ProcessedStory from './ProcessedStory';
import {analyze} from './browser/AxePage';

/**
 * Violations reported by Axe for a story.
 */
export default class Result {
  /**
   * Run Axe on a browser page that is displaying a story.
   */
  static async fromPage(page: Page, story: ProcessedStory) {
    const axeResults = await analyze(
      page,
      story.disabledRules,
      story.runOptions,
      story.context,
      story.config,
    );
    return new Result(axeResults.violations);
  }

  violations: AxeResult[];

  constructor(violations: AxeResult[]) {
    this.violations = violations;
  }

  /**
   * Determine if a result is passing or not. A result is passing if it has no violations.
   */
  isPassing(failingImpacts: string[]): boolean {
    if (failingImpacts.includes('all')) {
      // Violation impact is optional, so to avoid a check below for undefined impacts,
      // just check for any violation.
      return this.violations.length === 0;
    }

    return this.violations.every((violation) => {
      return !failingImpacts.includes(String(violation.impact));
    });
  }

  toString(): string {
    return dedent`
    Detected the following accessibility violations!

    ${this.violations.map(formatViolation).join('\n\n')}
  `;
  }
}

function formatViolation(violation: AxeResult, index: number) {
  return dedent`
    ${index + 1}. ${violation.id} (${violation.help})

       For more info, visit ${violation.helpUrl}.

       Check these nodes:

       ${violation.nodes.map(formatNode).join('\n\n')}
  `;
}

function formatNode(node: NodeResult) {
  if (node.failureSummary) {
    return dedent`
      - html: ${node.html}
        summary: ${indent(node.failureSummary, 11).trimStart()}
    `;
  }
  return `- html: ${node.html}`;
}
