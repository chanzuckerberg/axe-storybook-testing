import type { Result as AxeResult, NodeResult } from 'axe-core';
import indent from 'indent-string';
import type { Page } from 'playwright';
import dedent from 'ts-dedent';
import type ProcessedStory from './ProcessedStory';
import { analyze } from './browser/AxePage';

/**
 * Violations reported by Axe for a story.
 */
export type Result = {
  violations: AxeResult[];
};

/**
 * These rules aren't useful/helpful in the context of Storybook stories, and we disable them when
 * running Axe.
 */
const defaultDisabledRules = ['bypass', 'landmark-one-main', 'page-has-heading-one', 'region'];

/**
 * Run Axe on a browser page that is displaying a story.
 */
export async function fromPage(page: Page, story: ProcessedStory): Promise<Result> {
  const storyDisabledRules = story.disabledRules;
  const disabledRules = [...defaultDisabledRules, ...storyDisabledRules];
  const result = await analyze(page, disabledRules);

  return {
    violations: result.violations,
  };
}

/**
 * Determine if a result is passing or not. A result is passing if it has no violations.
 */
export function isPassing(result: Result, failingImpacts: string[]): boolean {
  if (failingImpacts.includes('all')) {
    // Violation impact is optional, so to avoid a check below for undefined impacts,
    // just check for any violation.
    return result.violations.length === 0;
  }

  return result.violations.every(violation => {
    return !failingImpacts.includes(String(violation.impact));
  });
}

export function formatFailureResult(result: Result) {
  return dedent`
    Detected the following accessibility violations!

    ${result.violations.map(formatViolation).join('\n\n') }
  `;
}

function formatViolation(violation: AxeResult, index: number) {
  return dedent`
    ${index + 1}. ${violation.id} (${violation.help})

       For more info, visit ${violation.helpUrl}.

       Check these nodes:

       ${violation.nodes.map(formatNode).join('\n\n') }
  `;
}

function formatNode(node: NodeResult) {
  if (node.failureSummary) {
    return dedent`
      - html: ${node.html}
        summary: ${indent(node.failureSummary, 11).trimStart() }
    `;
  }
  return `- html: ${node.html}`;
}
