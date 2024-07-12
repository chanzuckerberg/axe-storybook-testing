import dedent from 'ts-dedent';
import {describe, it, expect} from 'vitest';
import Result from './Result';

describe('isPassing', () => {
  it('returns true when there are no violations', () => {
    const result = new Result([]);
    expect(result.isPassing(['all'])).toEqual(true);
  });

  it('returns false when there are violations and all severities are failing', () => {
    const result = new Result([
      {
        description: 'Ensures buttons have discernible text',
        help: 'Buttons must have discernible text',
        helpUrl: 'https://dequeuniversity.com/rules/axe/3.5/button-name',
        id: 'button-name',
        tags: ['wcag2a', 'section508'],
        nodes: [],
      },
    ]);

    expect(result.isPassing(['all'])).toEqual(false);
  });

  it('returns true when there are violations that are not a severe enough level', () => {
    const result = new Result([
      {
        description: '<html> element must have a lang attribute',
        help: 'The HTML document element must contain a valid lang attribute',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.1/html-has-lang',
        id: 'html-has-lang',
        tags: ['wcag2a', 'section508'],
        nodes: [],
        impact: 'serious',
      },
    ]);

    expect(result.isPassing(['critical'])).toEqual(true);
  });

  it('returns false when there are violations that are severe enough', () => {
    const result = new Result([
      {
        description: '<html> element must have a lang attribute',
        help: 'The HTML document element must contain a valid lang attribute',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.1/html-has-lang',
        id: 'html-has-lang',
        tags: ['wcag2a', 'section508'],
        nodes: [],
        impact: 'serious',
      },
    ]);

    expect(result.isPassing(['critical', 'serious'])).toEqual(false);
  });
});

describe('toString', () => {
  it('pretty prints the failures', () => {
    const violations = [
      {
        description: 'Ensures buttons have discernible text',
        help: 'Buttons must have discernible text',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.0/button-name',
        id: 'button-name',
        tags: [],
        nodes: [
          {
            html: '<button></button>',
            target: [],
            any: [],
            all: [],
            none: [],
            failureSummary: "Nope, that is not right, because\nIt's not",
          },
        ],
      },
    ];

    const result = new Result(violations);

    expect(result.toString()).toEqual(dedent`
      Detected the following accessibility violations!

      1. button-name (Buttons must have discernible text)

         For more info, visit https://dequeuniversity.com/rules/axe/4.0/button-name.

         Check these nodes:

         - html: <button></button>
           summary: Nope, that is not right, because
                    It's not
    `);
  });
});
