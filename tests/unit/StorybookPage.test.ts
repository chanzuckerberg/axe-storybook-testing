import playwright from 'playwright';
import { getStories } from '../../src/browser/StorybookPage';

describe('getStories', () => {
  it('returns the stories from the window', async () => {
    const browser = await playwright.chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('file://' + __dirname + '/iframe.html');
    const stories = await getStories(page);
    expect(stories).toEqual([
      { kind: "this is the story's kind", name: "this is the story's name", parameters: {} },
    ]);
    await browser.close();
  }, 60000);
});
