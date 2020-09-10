// False positive for no-unused-vars. StoryInfo is used as a type.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { RawStory } from './RawStory';

export type SelectedStory = {
  name: string;
  encodedParams: string;
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

/**
 * Select the stories that are enabled for this integration.
 */
export default function selectStories(rawStories: RawStory[]) {
  const selectedStories: SelectedStory[] = [];

  Object.values(rawStories).forEach(story => {
    const disabled = getDisabled(story.parameters?.axe?.disabled);

    if (!disabled) {
      const name = `${story.kind}: ${story.name}`;
      const encodedParams = story.id
        ? `id=${encodeURIComponent(story.id)}`
        : `selectedKind=${encodeURIComponent(story.kind)}` +
          `&selectedStory=${encodeURIComponent(story.name)}`;

      selectedStories.push({ name, encodedParams });
    }
  });

  return selectedStories;
}
