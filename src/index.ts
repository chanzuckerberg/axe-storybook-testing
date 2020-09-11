import createDebug from 'debug';
import selectStories from './selectStories';
import * as Options from './Options';
import * as ProcessedStory from './ProcessedStory';
import * as RawStory from './RawStory';
import * as Suite from './Suite';

const debug = createDebug('axe-storybook');

export async function run() {
  const options = Options.parse(debug.enabled);
  debug.enabled = options.debug;

  // Get Storybook's representation of stories from its static iframe.
  const rawStories = await RawStory.fromIframe(options.iframePath);
  debug('rawStories %s', JSON.stringify(rawStories));

  // Process each story into a format that's more useful for us.
  const processedStories = ProcessedStory.fromRawStories(rawStories);
  debug('processedStories %o', processedStories);

  // Filter out stories that have disabled our integration.
  const selectedStories = selectStories(processedStories);
  debug('selectedStories %o', selectedStories);

  // Visit each selected story and run Axe on them.
  const results = await Suite.fromStories(selectedStories, options.iframePath);
  debug('results %o', JSON.stringify(results));

  // Print the results in a human-readable way.
  Suite.display(results);

  return Suite.isPassing(results) ? Promise.resolve() : Promise.reject();
}
