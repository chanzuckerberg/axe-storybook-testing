// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { RawStory } from './RawStory';

export type ProcessedStory = {
  name: string;
  uriParams: string;
  parameters: {
    axe: {
      disabled: boolean;
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
      },
    },
  };
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
