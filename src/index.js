import * as args from './args';

import getIframePath from './getIframePath';
import getStories from './getStories';
import getOutputFormat from './getOutputFormat';
import getResults from './getResults';
import selectStories from './selectStories';

import createDebug from 'debug';

import yargs from 'yargs';

const debug = createDebug('axe-storybook');
const VERSION = require('../package.json').version;

export async function run(argv) {
  argv = yargs(argv)
    .usage(args.usage)
    .help()
    .alias('help', 'h')
    .options(args.options)

    .default('build_dir', 'storybook-static')
    .default('output_format', 'text')
    .default('fail_on_empty', 'false').argv;

  if (argv.help) {
    yargs.showHelp();
    return;
  }

  if (argv.version) {
    process.stdout.write(`v${VERSION}\n`);
    return;
  }

  const options = {
    // Configure debug logging if flag specified, or if it was already enabled via DEBUG env var
    debug: argv.debug || debug.enabled,
    buildDir: argv.build_dir,
    outputFormat: getOutputFormat(argv.output_format),
    failOnEmpty: argv.fail_on_empty === 'true',
  };

  // Enable debug logging based on options.
  debug.enabled = options.debug;

  if (process.env.AXE_ENABLE === '0') {
    if (options.outputFormat == 'text') {
      // eslint-disable-next-line no-console
      console.log('The AXE_ENABLE environment variable is set to 0. Exiting.');
    } else if (options.outputFormat == 'json') {
      // eslint-disable-next-line no-console
      console.log('{\'exitReason\':\'The AXE_ENABLE environment variable is set to 0.\'}');
    }
    return;
  }

  // Not skipping, so get the iframe path and verify it exists
  options.iframePath = getIframePath(options);

  const rawStories = await getStories(options);
  debug('rawStories %s', JSON.stringify(rawStories));

  const selectedStories = selectStories(rawStories);
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

  return Promise.resolve(results);
}
