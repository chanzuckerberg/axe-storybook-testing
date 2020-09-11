import puppeteer from 'puppeteer';
import { Result, format as formatResult, fromStory, isPassing as resultIsPassing } from './Result';
import type { ProcessedStory } from './ProcessedStory';

/**
 * Axe violations reported for a list of stories.
 */
export type Suite = Result[];

/**
 * Run Axe on a browser page for a list of stories.
 */
export async function fromStories(stories: ProcessedStory[], iframePath: string): Promise<Suite> {
  const browser = await puppeteer.launch();

  try {
    const results = await Promise.all(
      stories.map((story) => fromStory(story, browser, iframePath)),
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
  return suite.every(resultIsPassing);
}

/**
 * Display a suite in a human-readable format.
 */
export function display(suite: Suite): void {
  console.log('Test results\n');

  // List each story that we got a result for.
  suite.forEach((result) => {
    console.log(result.name, resultIsPassing(result) ? '✅' : '❌');
  });

  if (isPassing(suite)) {
    console.log('\nNo accessibility violations detected! ❤️\n');
  } else {
    const failingResults = suite.filter((result) => !resultIsPassing(result));
    const violations = failingResults.flatMap((result) => result.violations);
    console.log('\nFound', violations.length, 'violations in', failingResults.length, 'stories!\n');
    console.log(format(failingResults), '\n');
  }
}

/**
 * Pretty-print the violations of a suite.
 */
export function format(suite: Suite): string {
  return suite.map(formatResult).filter(output => output).join('\n\n');
}
