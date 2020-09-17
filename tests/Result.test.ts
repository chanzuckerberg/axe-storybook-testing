import dedent from 'ts-dedent';
import { formatViolations, isPassing, Result } from '../src/Result';

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

describe('formatViolations', () => {
  it('returns an empty string when there are no violations', () => {
    const result: Result = {
      name: 'passing',
      violations: [],
    };

    expect(formatViolations(result)).toEqual('');
  });

  it('pretty prints violations', () => {
    const result: Result = {
      name: 'Some story name',
      violations: [
        {
          description: 'Ensures buttons have discernible text',
          help: 'Buttons must have discernible text',
          helpUrl: 'https://dequeuniversity.com/rules/axe/3.5/button-name',
          id: 'button-name',
          tags: ['wcag2a', 'section508'],
          nodes: [
            {
              html: '<button></button>',
              target: [],
              any: [],
              all: [],
              none: [],
            },
          ],
        },
        {
          description: 'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
          help: 'Elements must have sufficient color contrast',
          helpUrl: 'https://dequeuniversity.com/rules/axe/3.5/color-contrast',
          id: 'color-contrast',
          tags: ['wcag2aa'],
          nodes: [
            {
              html: '<p>hello</p>',
              target: [],
              any: [],
              all: [],
              none: [],
              failureSummary: 'You done messed up',
            },
            {
              html: '<p>goodbye</p>',
              target: [],
              any: [],
              all: [],
              none: [],
              failureSummary: 'Nope, still wrong\n\tAnd this has multiple lines!',
            },
          ],
        },
      ],
    };

    expect(formatViolations(result).trimEnd()).toEqual(dedent`
      Detected the following accessibility violations!

      1. button-name (Buttons must have discernible text)

         For more info, visit https://dequeuniversity.com/rules/axe/3.5/button-name.

         Check these nodes:

         - html: <button></button>

      2. color-contrast (Elements must have sufficient color contrast)

         For more info, visit https://dequeuniversity.com/rules/axe/3.5/color-contrast.

         Check these nodes:

         - html: <p>hello</p>
           summary: You done messed up

         - html: <p>goodbye</p>
           summary: Nope, still wrong
                    ${'\t'}And this has multiple lines!
    `);
  });
});
