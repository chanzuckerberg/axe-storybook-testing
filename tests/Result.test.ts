import { isPassing, Result } from '../src/Result';

describe('isPassing', () => {
  it('returns true when there are no violations', () => {
    const result: Result = {
      name: 'x',
      violations: [],
    };

    expect(isPassing(result)).toEqual(true);
  });

  it('returns false when there are violations', () => {
    const result: Result = {
      name: 'x',
      violations: [
        {
          description: 'Ensures buttons have discernible text',
          help: 'Buttons must have discernible text',
          helpUrl: 'https://dequeuniversity.com/rules/axe/3.5/button-name',
          id: 'button-name',
          tags: ['wcag2a', 'section508'],
          nodes: [],
        },
      ],
    };

    expect(isPassing(result)).toEqual(false);
  });
});
