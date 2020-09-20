import { fromRawStories, fromRawStory } from '../../src/ProcessedStory';

describe('fromRawStories', () => {
  it('converts an array of raw stories', () => {
    const rawStories = [
      { name: 'a', kind: 'button', id: 'button--a' },
      { name: 'b', kind: 'button', id: 'button--b' },
    ];

    expect(fromRawStories(rawStories)).toEqual([
      {
        componentTitle: 'button',
        name: 'a',
        parameters: {
          axe: {
            disabled: false,
            disabledRules: [],
          },
        },
        storybookId: 'button--a',
      },
      {
        componentTitle: 'button',
        name: 'b',
        parameters: {
          axe: {
            disabled: false,
            disabledRules: [],
          },
        },
        storybookId: 'button--b',
      },
    ]);
  });
});

describe('fromRawStory', () => {
  describe('storybookId', () => {
    it('uses the existing id if present', () => {
      const rawStory = { name: 'a', kind: 'button', id: '666' };
      const processedStory = fromRawStory(rawStory);
      expect(processedStory.storybookId).toEqual('666');
    });

    it('constructs an id if not present', () => {
      const rawStory = { name: 'a', kind: 'button' };
      const processedStory = fromRawStory(rawStory);
      expect(processedStory.storybookId).toEqual('button--a');
    });
  });

  describe('parameters', () => {
    it('adds fallback parameters if none are present', () => {
      const rawStory = { name: 'a', kind: 'button' };
      const processedStory = fromRawStory(rawStory);
      expect(processedStory.parameters).toEqual({
        axe: {
          disabled: false,
          disabledRules: [],
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
            disabledRules: ['label'],
          },
        },
      };

      const processedStory = fromRawStory(rawStory);

      expect(processedStory.parameters).toEqual({
        axe: {
          disabled: true,
          disabledRules: ['label'],
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
            disabledRules: [],
          },
        },
      };

      expect(() => fromRawStory(rawStory)).toThrow("Given disabled option 'wut' is invalid");
    });
  });
});
