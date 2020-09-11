import createDebug from 'debug';
import selectStories from './selectStories';
import { parse as parseOptions } from './Options';
import { fromRawStories as getProcessedStories } from './ProcessedStory';
import { fromIframe as getRawStories } from './RawStory';
import { display, fromStories as getResults, isPassing  } from './Suite';

const debug = createDebug('axe-storybook');

export async function run() {
  const options = parseOptions(debug.enabled);
  debug.enabled = options.debug;

  // Get Storybook's representation of stories from its static iframe.
  const rawStories = await getRawStories(options.iframePath);
  debug('rawStories %s', JSON.stringify(rawStories));

  // Process each story into a format that's more useful for us.
  const processedStories = getProcessedStories(rawStories);
  debug('processedStories %o', processedStories);

  // Filter out stories that have disabled our integration.
  const selectedStories = selectStories(processedStories);
  debug('selectedStories %o', selectedStories);

  // Visit each selected story and run Axe on them.
  const results = await getResults(selectedStories, options.iframePath);
  debug('results %o', results);

  // Print the results in a human-readable way.
  display(results);

  return isPassing(results) ? Promise.resolve() : Promise.reject();
}
