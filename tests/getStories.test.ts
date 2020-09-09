import getStories from '../src/getStories';

it('raises an error when no stories loaded', async () => {
  await expect(getStories(__dirname + '/iframe-without-stories.html'))
    .rejects
    .toThrow(/Storybook object not found on window/);
}, 30000);

it('returns the stories from the window', async () => {
  const stories = await getStories(__dirname + '/iframe.html');
  expect(stories).toEqual([
    { kind: "this is the story's kind", name: "this is the story's name", parameters: {} },
  ]);
}, 30000);
