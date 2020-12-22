import type { Result as AxeResult } from 'axe-core';
import type { Page } from 'playwright';
import { analyze } from './AxePage';
import { getDisabledRules, ProcessedStory } from './ProcessedStory';
import { showStory } from './StorybookPage';

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
 * Run Axe on a browser page for a story.
 */
export async function fromPage(page: Page, story: ProcessedStory): Promise<Result> {
  await showStory(page, story);

  const storyDisabledRules = getDisabledRules(story);
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
  if (failingImpacts.includes('all'))
  {
    // Violation impact is optional, so to avoid a check below for undefined impacts,
    // just check for any violation.
    return result.violations.length === 0;
  }
  
  return result.violations.every(violation => {
    return !failingImpacts.includes(String(violation.impact));
  });
}
