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
        skip: normalizeSkip(rawStory.parameters?.axe?.skip),
        disabledRules: normalizeDisabledRules(rawStory.parameters?.axe?.disabledRules),
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

function normalizeSkip(skipped?: unknown): boolean {
  if (typeof skipped === 'undefined') {
    return false;
  }
  if (typeof skipped !== 'boolean') {
    throw new Error(`Value of 'skip' option '${skipped}' is invalid`);
  }
  return skipped;
}

function normalizeDisabledRules(disabledRules?: unknown): string[] {
  if (typeof disabledRules === 'undefined') {
    return [];
  }
  if (!Array.isArray(disabledRules)) {
    throw new Error(`Given disabledRules option '${JSON.stringify(disabledRules)}' is invalid`);
  }
  return disabledRules.map(String);
}
