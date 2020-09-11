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

  const rawStories = await getRawStories(options.iframePath);
  debug('rawStories %s', JSON.stringify(rawStories));

  const processedStories = getProcessedStories(rawStories);
  debug('processedStories %o', processedStories);

  const selectedStories = selectStories(processedStories);
  debug('selectedStories %o', selectedStories);

  const results = await getResults(selectedStories, options.iframePath);
  debug('results %o', results);

  display(results);

  return isPassing(results) ? Promise.resolve() : Promise.reject();
}
