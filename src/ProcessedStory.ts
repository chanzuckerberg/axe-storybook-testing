import type { RawStory } from './RawStory';

/**
 * Story with normalized and custom properties needed by axe-storybook.
 */
export type ProcessedStory = {
  name: string;
  uriParams: string;
  parameters: {
    axe: {
      disabled: boolean;
      disabledRules: string[];
    },
  };
}

export function fromRawStories(rawStories: RawStory[]): ProcessedStory[] {
  return rawStories.map(fromRawStory);
}

export function fromRawStory(rawStory: RawStory): ProcessedStory {
  const name = `${rawStory.kind}: ${rawStory.name}`;

  const uriParams = rawStory.id
    ? `id=${encodeURIComponent(rawStory.id)}`
    : `selectedKind=${encodeURIComponent(rawStory.kind)}` +
      `&selectedStory=${encodeURIComponent(rawStory.name)}`;

  return {
    name,
    uriParams,
    parameters: {
      axe: {
        disabled: getDisabled(rawStory.parameters?.axe?.disabled),
        disabledRules: getDisabledRules(rawStory.parameters?.axe?.disabledRules),
      },
    },
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
