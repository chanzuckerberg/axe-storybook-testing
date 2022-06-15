import { z as zod } from 'zod';
import type { StorybookStory } from './browser/StorybookPage';

type Params = {
  skip: boolean;
  disabledRules: string[],
  waitForSelector?: string,
}

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
      disabledRules: normalizeDisabledRules(rawStory.parameters?.axe?.disabledRules, rawStory),
      waitForSelector: normalizeWaitForSelector(rawStory.parameters?.axe?.waitForSelector, rawStory),
    };
  }

  get isEnabled() {
    return !this.parameters.skip;
  }

  get disabledRules() {
    return this.parameters.disabledRules;
  }

  get waitForSelector() {
    return this.parameters.waitForSelector;
  }
}

const skipSchema = zod.boolean();
const disabledRulesSchema = zod.array(zod.string());
const waitForSelectorSchema = zod.optional(zod.string());

function normalizeSkip(skip: unknown, rawStory: StorybookStory) {
  return parseWithFriendlyError(
    () => skipSchema.optional().parse(skip) || false,
    createInvalidParamErrorMessage(rawStory, 'skip'),
  );
}

function normalizeDisabledRules(disabledRules: unknown, rawStory: StorybookStory) {
  return parseWithFriendlyError(
    () => disabledRulesSchema.optional().parse(disabledRules) || [],
    createInvalidParamErrorMessage(rawStory, 'disabledRules'),
  );
}

function normalizeWaitForSelector(waitForSelector: unknown, rawStory: StorybookStory) {
  return parseWithFriendlyError(
    () => waitForSelectorSchema.parse(waitForSelector),
    createInvalidParamErrorMessage(rawStory, 'waitForSelector'),
  );
}

/**
 * Our Parameter parsers use Zod under the hood, which works great. Unfortunately, there's no way
 * to provide a custom error message when parsing, and its default error messages won't give users
 * enough information about what went wrong and where. Instead we'll catch errors from the parsers
 * and re-throw our own.
 */
function parseWithFriendlyError<T>(parser: () => T, errorMessage: string): T {
  try {
    return parser();
  } catch (message) {
    if (message instanceof zod.ZodError) {
      throw new TypeError(errorMessage);
    } else {
      throw message;
    }
  }
}

/**
 * Create useful error text for an invalid param. We provide info on what parameter failed, in
 * which component, and in what story. That way people can easily find their error.
 */
function createInvalidParamErrorMessage(rawStory: StorybookStory, paramName: string): string {
  return `Invalid value for parameter "${paramName}" in component "${rawStory.kind}", story "${rawStory.name}"`;
}
