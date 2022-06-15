import ProcessedStory from '../../src/ProcessedStory';

it('parses a raw Storybook story', () => {
  const rawStory = { id: 'button--a', kind: 'button', name: 'a', parameters: {} };
  const processedStory = new ProcessedStory(rawStory);

  expect(processedStory.name).toEqual('a');
  expect(processedStory.componentTitle).toEqual('button');
  expect(processedStory.id).toEqual('button--a');
});

describe('isEnabled', () => {
  it('is false when the skip parameter is true', () => {
    const parameters = { axe: { skip: true } };
    const rawStory = { id: 'button--a', kind: 'button', name: 'a', parameters };
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.isEnabled).toEqual(false);
  });

  it('is true when the skip parameter is false', () => {
    const parameters = { axe: { skip: false } };
    const rawStory = { id: 'button--a', kind: 'button', name: 'a', parameters };
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.isEnabled).toEqual(true);
  });

  it('is true when the skip parameter is missing', () => {
    const parameters = { axe: {} };
    const rawStory = { id: 'button--a', kind: 'button', name: 'a', parameters };
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.isEnabled).toEqual(true);
  });

  it('throws an error when the skip parameter is not a boolean', () => {
    const parameters = { axe: { skip: 666 } };
    const rawStory = { id: 'button--a', kind: 'button', name: 'a', parameters };

    expect(() => new ProcessedStory(rawStory)).toThrow('Invalid value for parameter "skip" in component "button", story "a"');
  });
});

describe('disabledRules', () => {
  it('is a list of strings', () => {
    const parameters = { axe: { disabledRules: ['stuff1', 'stuff2'] } };
    const rawStory = { id: 'button--a', kind: 'button', name: 'a', parameters };
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.disabledRules).toEqual(['stuff1', 'stuff2']);
  });

  it('is [] when the disabledRules parameter is missing', () => {
    const parameters = { axe: {} };
    const rawStory = { id: 'button--a', kind: 'button', name: 'a', parameters };
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.disabledRules).toEqual([]);
  });

  it('throws an error when the disabledRules parameter is not a list of strings', () => {
    const parameters = { axe: { disabledRules: [666] } };
    const rawStory = { id: 'button--a', kind: 'button', name: 'a', parameters };

    expect(() => new ProcessedStory(rawStory)).toThrow('Invalid value for parameter "disabledRules" in component "button", story "a"');
  });
});
