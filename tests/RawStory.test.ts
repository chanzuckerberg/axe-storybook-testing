import { fromIframe } from '../src/RawStory';

describe('fromIframe', () => {
  it('returns the stories from the window', async () => {
    const stories = await fromIframe(__dirname + '/iframe.html');
    expect(stories).toEqual([
      { kind: "this is the story's kind", name: "this is the story's name", parameters: {} },
    ]);
  });
});
