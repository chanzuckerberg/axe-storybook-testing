import * as Parameters from './Parameters';
import type { StorybookStory } from './browser/StorybookPage';

type Params = {
  axe: {
    skip: boolean;
    disabledRules: string[],
    waitForSelector?: string,
  },
}

/**
 * Story with normalized and custom properties needed by this project.
 */
export default class ProcessedStory {
  static fromStories(rawStories: StorybookStory[]): ProcessedStory[] {
    return rawStories.map(ProcessedStory.fromStory);
  }

  static fromStory(rawStory: StorybookStory): ProcessedStory {
    return new ProcessedStory(
      rawStory.name,
      rawStory.kind,
      rawStory.id,
      {
        axe: {
          skip: normalizeSkip(rawStory.parameters?.axe?.skip, rawStory),
          disabledRules: normalizeDisabledRules(rawStory.parameters?.axe?.disabledRules, rawStory),
          waitForSelector: normalizeWaitForSelector(rawStory.parameters?.axe?.waitForSelector, rawStory),
        },
      },
    );
  }

  name: string;
  componentTitle: string;
  id: string;
  parameters: Params;

  constructor(name: string, componentTitle: string, id: string, parameters: Params) {
    this.name = name;
    this.componentTitle = componentTitle;
    this.id = id;
    this.parameters = parameters;
  }

  get isEnabled() {
    return !this.parameters.axe.skip;
  }

  get disabledRules() {
    return this.parameters.axe.disabledRules;
  }
}

function normalizeSkip(skip: unknown, rawStory: StorybookStory) {
  return parseWithFriendlyError(
    () => Parameters.parseSkip(skip),
    createInvalidParamErrorMessage(rawStory, 'skip'),
  );
}

function normalizeDisabledRules(disabledRules: unknown, rawStory: StorybookStory) {
  return parseWithFriendlyError(
    () => Parameters.parseDisabledRules(disabledRules),
    createInvalidParamErrorMessage(rawStory, 'disabledRules'),
  );
}

function normalizeWaitForSelector(waitForSelector: unknown, rawStory: StorybookStory) {
  return parseWithFriendlyError(
    () => Parameters.parseWaitForSelector(waitForSelector),
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
    if (message instanceof Parameters.ParamError) {
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
