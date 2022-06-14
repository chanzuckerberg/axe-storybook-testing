import ProcessedStory from '../../src/ProcessedStory';

describe('fromStories', () => {
  it('converts an array of raw stories', () => {
    const rawStories = [
      { name: 'a', kind: 'button', id: 'button--a', parameters: {} },
      { name: 'b', kind: 'button', id: 'button--b', parameters: {} },
    ];

    expect(ProcessedStory.fromStories(rawStories)).toMatchObject([
      {
        componentTitle: 'button',
        name: 'a',
        parameters: {
          axe: {
            skip: false,
            disabledRules: [],
          },
        },
        id: 'button--a',
      },
      {
        componentTitle: 'button',
        name: 'b',
        parameters: {
          axe: {
            skip: false,
            disabledRules: [],
          },
        },
        id: 'button--b',
      },
    ]);
  });
});

describe('fromStory', () => {
  describe('parameters', () => {
    it('adds fallback parameters if none are present', () => {
      const rawStory = { id: 'button--a', kind: 'button', name: 'a', parameters: {} };
      const processedStory = ProcessedStory.fromStory(rawStory);
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

      const processedStory = ProcessedStory.fromStory(rawStory);

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

      expect(() => ProcessedStory.fromStory(rawStory)).toThrow('Invalid value for parameter "skip" in component "button", story "a"');
    });
  });
});
