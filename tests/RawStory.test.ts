import { fromIframe } from '../src/RawStory';

describe('fromIframe', () => {
  it('raises an error when no stories loaded', async () => {
    await expect(fromIframe(__dirname + '/iframe-without-stories.html'))
      .rejects
      .toThrow(/Storybook object not found on window/);
  }, 30000);

  it('returns the stories from the window', async () => {
    const stories = await fromIframe(__dirname + '/iframe.html');
    expect(stories).toEqual([
      { kind: "this is the story's kind", name: "this is the story's name", parameters: {} },
    ]);
  }, 30000);
});
