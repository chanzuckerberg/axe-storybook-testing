import createDebug from 'debug';
import getResults from './getResults';
import selectStories from './selectStories';
import { parse as parseOptions } from './Options';
import { fromRawStories as getProcessedStories } from './ProcessedStory';
import { fromIframe as getRawStories } from './RawStory';

const debug = createDebug('axe-storybook');

export async function run() {
  const options = parseOptions(debug.enabled);

  // Enable debug logging based on options.
  debug.enabled = options.debug;

  const rawStories = await getRawStories(options.iframePath);
  debug('rawStories %s', JSON.stringify(rawStories));

  const processedStories = getProcessedStories(rawStories);
  debug('processedStories %o', processedStories);

  const selectedStories = selectStories(processedStories);
  debug('selectedStories %o', selectedStories);

  if (selectedStories.length === 0) {
    const message = 'axe-storybook found no stories in the static storybook.';
    if (options.failOnEmpty) {
      throw new Error(message);
    }
    if (options.outputFormat == 'text') {
      // eslint-disable-next-line no-console
      console.log(message);
    } else if (options.outputFormat == 'json') {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify({ exitReason: message }));
    }
    return;
  }

  const results = await getResults(selectedStories, options.iframePath);
  console.log(results);
}
