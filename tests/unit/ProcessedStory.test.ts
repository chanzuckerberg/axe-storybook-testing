import { fromStories, fromStory } from '../../src/ProcessedStory';

describe('fromStories', () => {
  it('converts an array of raw stories', () => {
    const rawStories = [
      { name: 'a', kind: 'button', id: 'button--a', parameters: {} },
      { name: 'b', kind: 'button', id: 'button--b', parameters: {} },
    ];

    expect(fromStories(rawStories)).toEqual([
      {
        componentName: 'button',
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
        componentName: 'button',
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

describe('fromStory', () => {
  describe('parameters', () => {
    it('adds fallback parameters if none are present', () => {
      const rawStory = { id: 'button--a', kind: 'button', name: 'a', parameters: {} };
      const processedStory = fromStory(rawStory);
      expect(processedStory.parameters).toEqual({
        axe: {
          disabled: false,
          disabledRules: [],
        },
      });
    });

    it('it uses axe parameters present on the story', () => {
      const rawStory = {
        id: 'button--a',
        kind: 'button',
        name: 'a',
        parameters: {
          axe: {
            disabled: true,
            disabledRules: ['label'],
          },
        },
      };

      const processedStory = fromStory(rawStory);

      expect(processedStory.parameters).toEqual({
        axe: {
          disabled: true,
          disabledRules: ['label'],
        },
      });
    });

    it('throws an error if the axe parameters are invalid', () => {
      const rawStory = {
        id: 'button--a',
        kind: 'button',
        name: 'a',
        parameters: {
          axe: {
            disabled: 'wut',
            disabledRules: [],
          },
        },
      };

      expect(() => fromStory(rawStory)).toThrow("Given disabled option 'wut' is invalid");
    });
  });
});
