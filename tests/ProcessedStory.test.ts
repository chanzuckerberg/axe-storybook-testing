import { fromRawStories, fromRawStory } from '../src/ProcessedStory';

describe('fromRawStories', () => {
  it('converts an array of raw stories', () => {
    const rawStories = [
      { name: 'a', kind: 'button' },
      { name: 'b', kind: 'button' },
    ];

    expect(fromRawStories(rawStories)).toEqual([
      {
        name: 'button: a',
        parameters: {
          axe: {
            disabled: false,
          },
        },
        uriParams: 'selectedKind=button&selectedStory=a',
      },
      {
        name: 'button: b',
        parameters: {
          axe: {
            disabled: false,
          },
        },
        uriParams: 'selectedKind=button&selectedStory=b',
      },
    ]);
  });
});

describe('fromRawStory', () => {
  it('combines the name and kind of the story', () => {
    const rawStory = { name: 'a', kind: 'button' };
    const processedStory = fromRawStory(rawStory);
    expect(processedStory.name).toEqual('button: a');
  });

  it('uses the id for the uri params if present', () => {
    const rawStory = { id: 'some-button', name: 'a', kind: 'button' };
    const processedStory = fromRawStory(rawStory);
    expect(processedStory.uriParams).toEqual('id=some-button');
  });

  it('uses the kind and name of the story for the uri params if id is NOT present', () => {
    const rawStory = { name: 'a', kind: 'button' };
    const processedStory = fromRawStory(rawStory);
    expect(processedStory.uriParams).toEqual('selectedKind=button&selectedStory=a');
  });

  describe('parameters', () => {
    it('adds fallback parameters if none are present', () => {
      const rawStory = { name: 'a', kind: 'button' };
      const processedStory = fromRawStory(rawStory);
      expect(processedStory.parameters).toEqual({
        axe: {
          disabled: false,
        },
      });
    });

    it('it uses axe parameters present on the story', () => {
      const rawStory = {
        name: 'a',
        kind: 'button',
        parameters: {
          axe: {
            disabled: true,
          },
        },
      };

      const processedStory = fromRawStory(rawStory);

      expect(processedStory.parameters).toEqual({
        axe: {
          disabled: true,
        },
      });
    });

    it('throws an error if the axe parameters are invalid', () => {
      const rawStory = {
        name: 'a',
        kind: 'button',
        parameters: {
          axe: {
            disabled: 'wut',
          },
        },
      };

      expect(() => fromRawStory(rawStory)).toThrow("Given disabled option 'wut' is invalid");
    });
  });
});
