import type { ProcessedStory } from './ProcessedStory';

/**
 * Select the stories that are enabled for this integration.
 */
export default function selectStories(stories: ProcessedStory[]) {
  return stories.filter(isEnabled);
}

function isEnabled(story: ProcessedStory): boolean {
  return !story.parameters.axe.disabled;
}
