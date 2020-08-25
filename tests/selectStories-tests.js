import selectStories from '../src/selectStories';

describe('selectStories', () => {
  it('returns empty array for an empty array', () => {
    expect(selectStories([])).toEqual([]);
  });

  it('returns expected selected stories for a stories array', () => {
    const stories = [
      { name: 'a', kind: 'ImagePost' },
      { name: 'b', kind: 'ImagePost' },
      { name: 'a', kind: 'LinkPost' },
      { name: 'b', kind: 'LinkPost' }
    ];

    const expectedSelectedStories = [
      {
        encodedParams: 'selectedKind=ImagePost&selectedStory=a',
        name: 'ImagePost: a',
        options: {}
      },
      {
        encodedParams: 'selectedKind=ImagePost&selectedStory=b',
        name: 'ImagePost: b',
        options: {}
      },
      {
        encodedParams: 'selectedKind=LinkPost&selectedStory=a',
        name: 'LinkPost: a',
        options: {}
      },
      {
        encodedParams: 'selectedKind=LinkPost&selectedStory=b',
        name: 'LinkPost: b',
        options: {}
      }
    ];

    expect(selectStories(stories)).toEqual(expectedSelectedStories);
  });

  describe('skip option', () => {
    it('excludes story when enabled', () => {
      const parameters = { axe: { skip: true } };
      const stories = [
        { name: 'a', kind: 'ImagePost', parameters: parameters },
        { name: 'b', kind: 'ImagePost' }
      ];

      const expectedSelectedStories = [
        {
          encodedParams: 'selectedKind=ImagePost&selectedStory=b',
          name: 'ImagePost: b',
          options: {}
        }
      ];

      expect(selectStories(stories)).toEqual(expectedSelectedStories);
    });

    it('rejects a non boolean value', () => {
      const parameters = { axe: { skip: 'yes please' } };
      const stories = [{ name: 'a', kind: 'ImagePost', parameters: parameters }];

      expect(() => selectStories(stories)).toThrow(
        new Error("Given skip option 'yes please' is invalid")
      );
    });
  });
});
