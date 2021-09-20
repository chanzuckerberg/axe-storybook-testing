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
            skip: false,
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
            skip: false,
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
          skip: false,
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
            skip: true,
            disabledRules: ['label'],
            waitForSelector: '.foo',
          },
        },
      };

      const processedStory = fromStory(rawStory);

      expect(processedStory.parameters).toEqual({
        axe: {
          skip: true,
          disabledRules: ['label'],
          waitForSelector: '.foo',
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
            skip: 'wut',
            disabledRules: [],
          },
        },
      };

      expect(() => fromStory(rawStory)).toThrow("Value of 'skip' option 'wut' is invalid");
    });
  });
});
