import dedent from 'ts-dedent';
import AxePlaywright from './AxePlaywright';
import type { Result as AxeResult } from 'axe-core';
import type { Page } from 'playwright';
import type { ProcessedStory } from './ProcessedStory';

/**
 * Violations reported by Axe for a story.
 */
export type Result = {
  name: string;
  violations: AxeResult[];
};

/**
 * These rules aren't useful/helpful in the context of Storybook stories, and we disable them when
 * running Axe.
 */
const defaultDisabledRules = ['landmark-one-main', 'page-has-heading-one', 'region'];

/**
 * Run Axe on a browser page for a story.
 */
export async function fromStory(story: ProcessedStory, page: Page, iframePath: string): Promise<Result> {
  await page.goto(`file://${iframePath}?${story.uriParams}`);

  const disabledRules = defaultDisabledRules.concat(story.parameters.axe.disabledRules);
  const axeBuilder = new AxePlaywright(page).disableRules(disabledRules);
  const result = await axeBuilder.analyze();

  return {
    name: story.name,
    violations: result.violations,
  };
}

/**
 * Determine if a result is passing or not. A result is passing if it has no violations.
 */
export function isPassing(result: Result): boolean {
  return result.violations.length === 0;
}

/**
 * Pretty-print the violations of a result.
 */
export function formatViolations(result: Result): string {
  if (isPassing(result)) { return ''; }

  const border = '━'.repeat(result.name.length).substring(0, 80);

  return dedent`
    ${border}
    ${result.name}

    ${result.violations.map(formatViolation).join('\n\n')}
  `;
}

function formatViolation(violation: AxeResult) {
  return dedent`
    - ruleId: ${violation.id}
      description: ${violation.help}
      helpUrl: ${violation.helpUrl}
  `;
}
