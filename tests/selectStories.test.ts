import selectStories from '../src/selectStories';

describe('selectStories', () => {
  it('returns empty array for an empty array', () => {
    expect(selectStories([])).toEqual([]);
  });

  it('excludes story that are disabled for axe', () => {
    const stories = [
      { name: 'a', uriParams: 'id=image-a', parameters: { axe: { disabled: true } } },
      { name: 'b', uriParams: 'id=image-b', parameters: { axe: { disabled: false } } },
    ];

    const expectedSelectedStories = [
      {
        name: 'b',
        uriParams: 'id=image-b',
        parameters: { axe: { disabled: false } },
      },
    ];

    expect(selectStories(stories)).toEqual(expectedSelectedStories);
  });
});
