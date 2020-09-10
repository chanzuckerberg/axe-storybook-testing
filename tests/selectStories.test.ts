import selectStories from '../src/selectStories';

describe('selectStories', () => {
  it('returns empty array for an empty array', () => {
    expect(selectStories([])).toEqual([]);
  });

  it('excludes story that are disabled for axe', () => {
    const stories = [
      { name: 'a', uriParams: 'id=image-a', parameters: { axe: { disabled: true, disabledRules: [] } } },
      { name: 'b', uriParams: 'id=image-b', parameters: { axe: { disabled: false , disabledRules: []} } },
    ];

    const expectedSelectedStories = [
      {
        name: 'b',
        uriParams: 'id=image-b',
        parameters: {
          axe: {
            disabled: false,
            disabledRules: [],
          },
        },
      },
    ];

    expect(selectStories(stories)).toEqual(expectedSelectedStories);
  });
});
