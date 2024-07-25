import type {
  RunOptions,
  SerialContextObject,
  SerialFrameSelector,
  Spec,
} from 'axe-core';

export declare type AxeParams = {
  /**
   * Prevents axe-storybook-testing from running Axe rules on this story. Shorthand for
   * `mode: 'off'`.
   */
  skip?: boolean;
  /**
   * Prevents axe-storybook-testing from running specific Axe rules on this story.
   * NOTE: array elements should be the names of axe-core rules found in
   * https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md.
   */
  disabledRules?: string[];
  /**
   * Set whether violations in a story should cause the test suite to fail or not. Valid options
   * are 'off', warn, and 'error'.
   */
  mode?: 'off' | 'warn' | 'error';
  /**
   * Overrides the global timeout for this specific test (in ms)
   */
  timeout?: number;
  /**
   * Run options passed to `axe.run`.
   * @see https://www.deque.com/axe/core-documentation/api-documentation/#options-parameter
   */
  runOptions?: RunOptions;
  /**
   * Context passed to `axe.run`.
   * @see https://www.deque.com/axe/core-documentation/api-documentation/#context-parameter
   */
  context?: SerialFrameSelector | SerialFrameSelector[] | SerialContextObject;
  /**
   * Config passed to `axe.configure`.
   */
  config?: Spec;
  /**
   * @deprecated
   * Legacy way of waiting for a selector before running Axe.
   */
  waitForSelector?: string;
};
