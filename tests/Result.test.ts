import dedent from 'ts-dedent';
import { format, isPassing, Result } from '../src/Result';

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

describe('format', () => {
  it('returns an empty string when there are no violations', () => {
    const result: Result = {
      name: 'passing',
      violations: [],
    };

    expect(format(result)).toEqual('');
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
          nodes: [],
        },
        {
          description: 'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
          help: 'Elements must have sufficient color contrast',
          helpUrl: 'https://dequeuniversity.com/rules/axe/3.5/color-contrast',
          id: 'color-contrast',
          tags: ['wcag2aa'],
          nodes: [],
        },
      ],
    };

    expect(format(result)).toEqual(dedent`
      ━━━━━━━━━━━━━━━
      Some story name

      - ruleId: button-name
        description: Buttons must have discernible text
        helpUrl: https://dequeuniversity.com/rules/axe/3.5/button-name

      - ruleId: color-contrast
        description: Elements must have sufficient color contrast
        helpUrl: https://dequeuniversity.com/rules/axe/3.5/color-contrast
    `);
  });
});
