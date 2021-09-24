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
        skip: Parameters.parseSkip(rawStory.parameters?.axe?.skip) || false,
        disabledRules: Parameters.parseDisabledRules(rawStory.parameters?.axe?.disabledRules) || [],
        waitForSelector: Parameters.parseWaitForSelector(rawStory.parameters?.axe?.waitForSelector),
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
