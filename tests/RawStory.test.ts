import playwright from 'playwright';
import { fromIframe } from '../src/RawStory';

describe('fromIframe', () => {
  it('returns the stories from the window', async () => {
    const browser = await playwright.chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const stories = await fromIframe(__dirname + '/iframe.html', page);
    expect(stories).toEqual([
      { kind: "this is the story's kind", name: "this is the story's name", parameters: {} },
    ]);
    await browser.close();
  });
});
