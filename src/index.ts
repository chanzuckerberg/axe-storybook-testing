import createDebug from 'debug';
import selectStories from './selectStories';
import { parse as parseOptions } from './Options';
import { fromRawStories as getProcessedStories } from './ProcessedStory';
import { fromIframe as getRawStories } from './RawStory';
import { fromStories as getResults } from './Result';

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
  console.log((results));
}
