import type {RunOptions} from 'axe-core';
import {z as zod} from 'zod';
import type {StorybookStory} from './browser/StorybookPage';

type Params = {
  disabledRules: string[];
  runOptions?: RunOptions;
  skip: boolean;
  timeout: number;
  /** @deprecated */
  waitForSelector?: string;
};

/**
 * Story with normalized and custom properties needed by this project.
 */
export default class ProcessedStory {
  name: string;
  componentTitle: string;
  id: string;
  private parameters: Params;

  constructor(rawStory: StorybookStory) {
    this.name = rawStory.name;
    this.componentTitle = rawStory.kind;
    this.id = rawStory.id;
    this.parameters = {
      skip: normalizeSkip(rawStory.parameters?.axe?.skip, rawStory),
      disabledRules: normalizeDisabledRules(
        rawStory.parameters?.axe?.disabledRules,
        rawStory,
      ),
      waitForSelector: normalizeWaitForSelector(
        rawStory.parameters?.axe?.waitForSelector,
        rawStory,
      ),
      timeout: normalizeTimeout(rawStory.parameters?.axe?.timeout, rawStory),
      runOptions: normalizeRunOptions(
        rawStory.parameters?.axe?.runOptions,
        rawStory,
      ),
    };
  }

  /**
   * Determines if the test should be skipped in runSuite()
   */
  get isEnabled() {
    return !this.parameters.skip;
  }

  /**
   * Run option for rules to disable in a given story
   */
  get disabledRules() {
    return this.parameters.disabledRules;
  }

  /**
   * All optional run options used for a given story
   * @see https://www.deque.com/axe/core-documentation/api-documentation/#options-parameter
   */
  get runOptions() {
    return this.parameters.runOptions;
  }

  /**
   * Timeout override for a test triggered in runSuite()
   */
  get timeout() {
    return this.parameters.timeout;
  }

  /** @deprecated */
  get waitForSelector() {
    return this.parameters.waitForSelector;
  }
}

const skipSchema = zod.boolean();
const disabledRulesSchema = zod.array(zod.string());
const waitForSelectorSchema = zod.optional(zod.string());
const timeoutSchema = zod.number().gte(0);
const runOptionsSchema = zod.object({
  runOnly: zod.optional(
    zod.object({
      type: zod.enum(['rule', 'rules', 'tag', 'tags']),
      values: zod.array(zod.string()),
    }),
  ),
  rules: zod.optional(
    zod.object({}).catchall(
      zod.object({
        enabled: zod.boolean(),
      }),
    ),
  ),
  reporter: zod.optional(zod.enum(['v1', 'v2', 'raw', 'raw-env', 'no-passes'])),
  resultTypes: zod.optional(
    zod.array(zod.enum(['inapplicable', 'passes', 'incomplete', 'violations'])),
  ),
  selector: zod.optional(zod.boolean()),
  ancestry: zod.optional(zod.boolean()),
  xpath: zod.optional(zod.boolean()),
  absolutePaths: zod.optional(zod.boolean()),
  iframes: zod.optional(zod.boolean()),
  elementRef: zod.optional(zod.boolean()),
  frameWaitTime: zod.optional(zod.number().gte(0)),
  preload: zod.optional(zod.boolean()),
  performanceTimer: zod.optional(zod.boolean()),
  pingWaitTime: zod.optional(zod.number().gte(0)),
});

function normalizeSkip(skip: unknown, rawStory: StorybookStory) {
  return parseWithFriendlyError(
    () => skipSchema.optional().parse(skip) || false,
    rawStory,
    'skip',
  );
}

function normalizeDisabledRules(
  disabledRules: unknown,
  rawStory: StorybookStory,
) {
  return parseWithFriendlyError(
    () => disabledRulesSchema.optional().parse(disabledRules) || [],
    rawStory,
    'disabledRules',
  );
}

function normalizeTimeout(timeout: unknown, rawStory: StorybookStory) {
  return parseWithFriendlyError(
    () => timeoutSchema.optional().parse(timeout) || 0,
    rawStory,
    'timeout',
  );
}

function normalizeRunOptions(runOptions: unknown, rawStory: StorybookStory) {
  return parseWithFriendlyError(
    () => runOptionsSchema.optional().parse(runOptions) || {},
    rawStory,
    'runOptions',
  );
}

function normalizeWaitForSelector(
  waitForSelector: unknown,
  rawStory: StorybookStory,
) {
  return parseWithFriendlyError(
    () => waitForSelectorSchema.parse(waitForSelector),
    rawStory,
    'waitForSelector',
  );
}

/**
 * Our Parameter parsers use Zod under the hood, which works great. Unfortunately, there's no way
 * to provide a custom error message when parsing, and its default error messages won't give users
 * enough information about what went wrong and where. Instead we'll catch errors from the parsers
 * and re-throw our own.
 */
function parseWithFriendlyError<T>(
  parser: () => T,
  rawStory: StorybookStory,
  paramName: string,
): T {
  try {
    return parser();
  } catch (message) {
    if (message instanceof zod.ZodError) {
      throw new TypeError(
        `Invalid value for parameter "${paramName}" in component "${rawStory.kind}", story "${rawStory.name}"`,
      );
    } else {
      throw message;
    }
  }
}
