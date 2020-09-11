import dedent from 'ts-dedent';
import puppeteer from 'puppeteer';
import * as Result from './Result';
import type { ProcessedStory } from './ProcessedStory';

/**
 * Axe violations reported for a list of stories.
 */
export type Suite = Result.Result[];

/**
 * Run Axe on a browser page for a list of stories.
 */
export async function fromStories(stories: ProcessedStory[], iframePath: string): Promise<Suite> {
  const browser = await puppeteer.launch();

  try {
    const results = await Promise.all(
      stories.map((story) => Result.fromStory(story, browser, iframePath)),
    );
    return results;
  } finally {
    await browser.close();
  }
}

/**
 * Determine if a suite is passing or not. A suite is passing if none of its results have
 * any violations.
 */
export function isPassing(suite: Suite): boolean {
  return suite.every(Result.isPassing);
}

/**
 * Pretty-print the names of each story that was tested, along with their status.
 */
export function formatTestNames(suite: Suite): string {
  return suite.map((result) => {
    const status = Result.isPassing(result) ? '✅' : '❌';
    return result.name + ' ' + status;
  }).join('\n');
}

/**
 * Pretty-print information about the suite's failures.
 */
export function formatFailures(suite: Suite): string {
  return dedent`
    ${formatSummary(suite)}

    ${formatViolations(suite)}
  `;
}

function formatSummary(suite: Suite): string {
  const failingResults = suite.filter((result) => !Result.isPassing(result));
  const violations = failingResults.flatMap((result) => result.violations);
  return `Found ${violations.length} violations in ${failingResults.length} stories!`;
}

function formatViolations(suite: Suite): string {
  return suite.map(Result.formatViolations).filter(output => output).join('\n\n');
}
