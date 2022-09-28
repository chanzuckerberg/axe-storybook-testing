import { RunOptions } from 'axe-core';

export declare type AxeParams = {
  /**
   * Prevents axe-storybook-testing from running Axe rules on this story.
   */
  skip?: boolean;
  /**
   * Prevents axe-storybook-testing from running specific Axe rules on this story.
   * NOTE: array elements should be the names of axe-core rules found in
   * https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md.
   */
  disabledRules?: string[];
  /**
   * Overrides the global timeout for this specific test (in ms)
   */
  timeout?: number;
  /**
   * Allows use of optional axe.run options for a given story
   * @see https://www.deque.com/axe/core-documentation/api-documentation/#options-parameter
   */
  runOptions?: RunOptions;
  /**
   * @deprecated
   * Legacy way of waiting for a selector before running Axe.
   */
  waitForSelector?: string;
};
