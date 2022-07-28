import { z as zod } from 'zod';
import type { StorybookStory } from './browser/StorybookPage';
import type { AxeParams } from './index';

type Params = AxeParams & {
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
    };
  }

  get isEnabled() {
    return !this.parameters.skip;
  }

  get disabledRules() {
    return this.parameters.disabledRules;
  }

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
