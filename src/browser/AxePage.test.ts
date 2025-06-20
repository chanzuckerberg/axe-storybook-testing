import {describe, it, expect} from 'vitest';
import {getRunOptions} from './AxePage.js';

describe('getRunOptions', () => {
  it('overrides any rules from runOptions with those from disabledRules', () => {
    const runOptions = {
      rules: {'color-contrast': {enabled: true}},
    };
    const disabledRules = ['color-contrast'];

    expect(getRunOptions(runOptions, disabledRules)).toEqual({
      rules: {'color-contrast': {enabled: false}},
    });
  });
});
