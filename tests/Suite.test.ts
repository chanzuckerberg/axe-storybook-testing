import { isPassing, Suite } from '../src/Suite';

describe('isPassing', () => {
  it('returns true when there are no results', () => {
    const suite: Suite = [];
    expect(isPassing(suite)).toEqual(true);
  });

  it('returns true when there are no violations', () => {
    const suite: Suite = [
      { name: 'a', violations: [] },
      { name: 'b', violations: [] },
      { name: 'c', violations: [] },
    ];

    expect(isPassing(suite)).toEqual(true);
  });

  it('returns false when there are violations', () => {
    const suite: Suite = [
      { name: 'a', violations: [] },
      {
        name: 'b',
        violations: [
          {
            description: 'Ensures buttons have discernible text',
            help: 'Buttons must have discernible text',
            helpUrl: 'https://dequeuniversity.com/rules/axe/3.5/button-name',
            id: 'button-name',
            tags: ['wcag2a', 'section508'],
            nodes: [],
          },
        ] ,
      },
      { name: 'c', violations: [] },
    ];

    expect(isPassing(suite)).toEqual(false);
  });
});
