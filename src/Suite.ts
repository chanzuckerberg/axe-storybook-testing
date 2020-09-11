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
 * Display a suite in a human-readable format.
 */
export function display(suite: Suite): void {
  console.log('Test results\n');

  // List each story that we got a result for.
  console.log(formatTestNames(suite));

  if (isPassing(suite)) {
    console.log('\nNo accessibility violations detected! ❤️\n');
  } else {
    const failingResults = suite.filter((result) => !Result.isPassing(result));
    console.log('\n' + formatSummary(suite) + '\n');
    console.log(formatViolations(failingResults), '\n');
  }
}

/**
 * Pretty-print a summary of the test run.
 */
export function formatSummary(suite: Suite): string {
  const failingResults = suite.filter((result) => !Result.isPassing(result));
  const violations = failingResults.flatMap((result) => result.violations);
  return `Found ${violations.length} violations in ${failingResults.length} stories!`;
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
 * Pretty-print the violations of a suite.
 */
export function formatViolations(suite: Suite): string {
  return suite.map(Result.formatViolations).filter(output => output).join('\n\n');
}
