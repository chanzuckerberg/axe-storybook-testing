import type { StorybookStory } from './StorybookPage';

/**
 * Story with normalized and custom properties needed by this project.
 */
export type ProcessedStory = {
  componentTitle: string;
  name: string;
  parameters: {
    axe: {
      disabled: boolean;
      disabledRules: string[];
    },
  };
  storybookId: string;
}

export function fromStories(rawStories: StorybookStory[]): ProcessedStory[] {
  return rawStories.map(fromStory);
}

export function fromStory(rawStory: StorybookStory): ProcessedStory {
  return {
    componentTitle: rawStory.kind,
    name: rawStory.name,
    parameters: {
      axe: {
        disabled: getDisabled(rawStory.parameters?.axe?.disabled),
        disabledRules: getDisabledRules(rawStory.parameters?.axe?.disabledRules),
      },
    },
    storybookId: rawStory.id,
  };
}

export function isEnabled(story: ProcessedStory): boolean {
  return !story.parameters.axe.disabled;
}

function getDisabled(disabled?: unknown): boolean {
  if (typeof disabled === 'undefined') {
    return false;
  }
  if (typeof disabled !== 'boolean') {
    throw new Error(`Given disabled option '${disabled}' is invalid`);
  }
  return disabled;
}

function getDisabledRules(disabledRules?: unknown): string[] {
  if (typeof disabledRules === 'undefined') {
    return [];
  }
  if (!Array.isArray(disabledRules)) {
    throw new Error(`Given disabledRules option '${JSON.stringify(disabledRules)}' is invalid`);
  }
  return disabledRules.map(String);
}
