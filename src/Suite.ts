import puppeteer from 'puppeteer';
import { Result, fromStory } from './Result';
import type { ProcessedStory } from './ProcessedStory';

type Suite = Result[];

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
