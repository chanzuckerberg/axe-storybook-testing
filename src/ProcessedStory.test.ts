import ProcessedStory from './ProcessedStory';

it('parses a raw Storybook story', () => {
  const rawStory = {
    id: 'button--a',
    title: 'button',
    name: 'a',
    parameters: {},
  };
  const processedStory = new ProcessedStory(rawStory);

  expect(processedStory.name).toEqual('a');
  expect(processedStory.componentTitle).toEqual('button');
  expect(processedStory.id).toEqual('button--a');
});

describe('shouldFailTestSuiteIfViolations', () => {
  it('is true when mode is "error"', () => {
    const parameters = {axe: {mode: 'error'}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.shouldFailTestSuiteIfViolations).toEqual(true);
  });

  it('is false when mode is "off"', () => {
    const parameters = {axe: {mode: 'off'}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.shouldFailTestSuiteIfViolations).toEqual(false);
  });

  it('is false when mode is "warn"', () => {
    const parameters = {axe: {mode: 'warn'}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.shouldFailTestSuiteIfViolations).toEqual(false);
  });

  it('is true when mode is missing', () => {
    const parameters = {axe: {}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.shouldFailTestSuiteIfViolations).toEqual(true);
  });
});

describe('shouldNotEvenRunTest', () => {
  it('is true when the skip parameter is true', () => {
    const parameters = {axe: {skip: true}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.shouldNotEvenRunTest).toEqual(true);
  });

  it('is false when the skip parameter is false', () => {
    const parameters = {axe: {skip: false}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.shouldNotEvenRunTest).toEqual(false);
  });

  it('is false when the skip parameter is missing', () => {
    const parameters = {axe: {}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.shouldNotEvenRunTest).toEqual(false);
  });

  it('throws an error when the skip parameter is not a boolean', () => {
    const parameters = {axe: {skip: 666}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};

    expect(() => new ProcessedStory(rawStory)).toThrow(
      'Invalid value for parameter "skip" in component "button", story "a"',
    );
  });

  it('is true when the mode parameter is "off"', () => {
    const parameters = {axe: {mode: 'off'}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.shouldNotEvenRunTest).toEqual(true);
  });

  it('is false when the mode parameter is "warn"', () => {
    const parameters = {axe: {mode: 'warn'}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.shouldNotEvenRunTest).toEqual(false);
  });

  it('is false when the mode parameter is "error"', () => {
    const parameters = {axe: {mode: 'error'}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.shouldNotEvenRunTest).toEqual(false);
  });

  it('is false when the mode parameter is missing', () => {
    const parameters = {axe: {}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.shouldNotEvenRunTest).toEqual(false);
  });

  it('throws an error when the mode parameter is not a string', () => {
    const parameters = {axe: {mode: true}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};

    expect(() => new ProcessedStory(rawStory)).toThrow(
      'Invalid value for parameter "mode" in component "button", story "a"',
    );
  });

  it('defers to "skip" when both "mode" and "skip" are present', () => {
    const parameters = {axe: {skip: true, mode: 'error'}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.shouldNotEvenRunTest).toEqual(true);
  });
});

describe('disabledRules', () => {
  it('is a list of strings', () => {
    const parameters = {axe: {disabledRules: ['stuff1', 'stuff2']}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.disabledRules).toEqual(['stuff1', 'stuff2']);
  });

  it('is [] when the disabledRules parameter is missing', () => {
    const parameters = {axe: {}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.disabledRules).toEqual([]);
  });

  it('throws an error when the disabledRules parameter is not a list of strings', () => {
    const parameters = {axe: {disabledRules: [666]}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};

    expect(() => new ProcessedStory(rawStory)).toThrow(
      'Invalid value for parameter "disabledRules" in component "button", story "a"',
    );
  });
});

describe('runOptions', () => {
  it('is an empty object when runOptions parameter is missing', () => {
    const parameters = {axe: {}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.runOptions).toEqual({});
  });

  it('can parse fully formatted rule entries in runOptions', () => {
    const parameters = {
      axe: {runOptions: {rules: {'color-contrast': {enabled: true}}}},
    };
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.runOptions).toEqual({
      rules: {'color-contrast': {enabled: true}},
    });
  });

  it('preserves both disabledRules and any rules in runOptions.rules', () => {
    const parameters = {
      axe: {
        disabledRules: ['color-contrast'],
        runOptions: {rules: {'color-contrast': {enabled: true}}},
      },
    };
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};
    const processedStory = new ProcessedStory(rawStory);

    expect(processedStory.runOptions).toEqual({
      rules: {'color-contrast': {enabled: true}},
    });
    expect(processedStory.disabledRules).toEqual(['color-contrast']);
  });

  it('throws an error if a key does not conform to the documented options shape', () => {
    // @see https://www.deque.com/axe/core-documentation/api-documentation/#options-parameter
    const parameters = {axe: {runOptions: {selector: 'invalid'}}};
    const rawStory = {id: 'button--a', title: 'button', name: 'a', parameters};

    expect(() => new ProcessedStory(rawStory)).toThrow(
      'Invalid value for parameter "runOptions" in component "button", story "a"',
    );
  });
});
