import dedent from 'ts-dedent';
import { formatViolations, isPassing, Suite } from '../src/Suite';

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

describe('formatViolations', () => {
  it('pretty prints violations', () => {
    const suite: Suite = [
      {
        name: 'Some story name',
        violations: [
          {
            description: 'Ensure form elements have labels',
            help: 'Form elements must have labels',
            helpUrl: 'https://dequeuniversity.com/rules/axe/3.5/label',
            id: 'label',
            tags: ['wcag2a', 'section508'],
            nodes: [],
          },
        ],
      },
      {
        name: 'A story name that is even longer',
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
      },
    ];

    expect(formatViolations(suite)).toEqual(dedent`
      ━━━━━━━━━━━━━━━
      Some story name

      - ruleId: label
        description: Form elements must have labels
        helpUrl: https://dequeuniversity.com/rules/axe/3.5/label

      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      A story name that is even longer

      - ruleId: button-name
        description: Buttons must have discernible text
        helpUrl: https://dequeuniversity.com/rules/axe/3.5/button-name

      - ruleId: color-contrast
        description: Elements must have sufficient color contrast
        helpUrl: https://dequeuniversity.com/rules/axe/3.5/color-contrast
    `);
  });
});
