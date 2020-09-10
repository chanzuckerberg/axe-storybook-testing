// False positive for no-unused-vars. StoryInfo is used as a type.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AxeParameters, StoryInfo } from './getStories';

export type SelectedStory = {
  name: string;
  encodedParams: string;
  options: AxeParameters;
}

function assertSkip(skip?: unknown): asserts skip is boolean {
  if (typeof skip === 'undefined') {
    return;
  }
  if (typeof skip !== 'boolean') {
    throw new Error(`Given skip option '${skip}' is invalid`);
  }
}

/**
 * Select the stories that are enabled for this integration.
 */
export default function selectStories(rawStories: StoryInfo[]) {
  const selectedStories: SelectedStory[] = [];

  Object.values(rawStories).forEach(story => {
    let options: AxeParameters = {};

    if (story.parameters && story.parameters.axe) {
      options = story.parameters.axe;
      assertSkip(options.skip);
    }

    if (!options.skip) {
      const name = `${story.kind}: ${story.name}`;
      const encodedParams = story.id
        ? `id=${encodeURIComponent(story.id)}`
        : `selectedKind=${encodeURIComponent(story.kind)}` +
          `&selectedStory=${encodeURIComponent(story.name)}`;

      selectedStories.push({
        name,
        encodedParams,
        options,
      });
    }
  });

  return selectedStories;
}
