import * as Parameters from './Parameters';
import type { StorybookStory } from './browser/StorybookPage';

/**
 * Story with normalized and custom properties needed by this project.
 */
export type ProcessedStory = {
  componentName: string;
  name: string;
  parameters: {
    axe: {
      skip: boolean;
      disabledRules: string[];
      waitForSelector?: string;
    },
  };
  storybookId: string;
}

/**
 * Convert a list of Storybook stories into a normalized format.
 */
export function fromStories(rawStories: StorybookStory[]): ProcessedStory[] {
  return rawStories.map(fromStory);
}

/**
 * Convert a raw Storybook story into a normalized format with no optional properties.
 */
export function fromStory(rawStory: StorybookStory): ProcessedStory {
  return {
    componentName: rawStory.kind,
    name: rawStory.name,
    parameters: {
      axe: {
        skip: normalizeSkip(rawStory.parameters?.axe?.skip, rawStory),
        disabledRules: normalizeDisabledRules(rawStory.parameters?.axe?.disabledRules, rawStory),
        waitForSelector: normalizeWaitForSelector(rawStory.parameters?.axe?.waitForSelector, rawStory),
      },
    },
    storybookId: rawStory.id,
  };
}

/**
 * Determine if a story is enabled or not.
 */
export function isEnabled(story: ProcessedStory): boolean {
  return !story.parameters.axe.skip;
}

/**
 * Get the Axe rules that a story has disabled.
 */
export function getDisabledRules(story: ProcessedStory): string[] {
  return story.parameters.axe.disabledRules;
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
