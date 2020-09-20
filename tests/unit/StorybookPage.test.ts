import playwright from 'playwright';
import { getStories } from '../../src/StorybookPage';

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TypeScript thinks these tests are Mocha, not Jest. Until we can figure out how to
  // get nested tsconfigs working with tsc, I'm manually ignoring the error.
  }, 60000);
});
