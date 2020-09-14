import selectStories from './selectStories';
import * as Options from './Options';
import * as ProcessedStory from './ProcessedStory';
import * as RawStory from './RawStory';
import * as Suite from './Suite';

export async function run() {
  const options = Options.parse();

  // Get Storybook's representation of stories from its static iframe.
  const rawStories = await RawStory.fromIframe(options.iframePath);

  // Process each story into a format that's more useful for us.
  const processedStories = ProcessedStory.fromRawStories(rawStories);

  // Filter out stories that have disabled our integration.
  const selectedStories = selectStories(processedStories);

  // Visit each selected story and run Axe on them.
  const suite = await Suite.fromStories(selectedStories, options);

  console.log('Test results\n');
  console.log(Suite.formatTestNames(suite));

  if (Suite.isPassing(suite)) {
    console.log('\nNo accessibility violations detected! ❤️\n');
    return Promise.resolve();
  } else {
    console.log('\n' + Suite.formatFailures(suite) + '\n');
    return Promise.reject();
  }
}
