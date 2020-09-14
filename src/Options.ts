import yargs from 'yargs';
import getBrowserOption from './getBrowserOption';
import getConcurrencyOption from './getConcurrencyOption';
import getIframePath from './getIframePath';

const options = {
  browser: {
    alias: 'B',
    default: 'chromium',
    description: 'Which browser to run in. Should be one of: chromium, webkit, firefox',
    type: 'string' as const,
  },
  build_dir: {
    alias: 'b',
    default: 'storybook-static',
    description: 'Directory to load the static storybook built by build-storybook from',
    type: 'string' as const,
  },
  concurrency: {
    default: 10,
    description: 'How many browser pages to open at a time',
    type: 'number' as const,
  },
  non_headless: {
    alias: 'H',
    default: false,
    description: 'Wether the browser should be ran "headfully" (non-headlessly)',
    type: 'boolean' as const,
  },
};

export type Options = ReturnType<typeof parse>;

/**
 * Parse and normalize command line arguments passed to the script.
 */
export function parse() {
  const argv = yargs.options(options).argv;

  return {
    browser: getBrowserOption(argv.browser),
    concurrency: getConcurrency(argv.concurrency),
    iframePath: getIframePath(argv.build_dir),
    nonHeadless: argv.non_headless,
  };
}

function getConcurrency(concurrency: number) {
  if (concurrency <= 0) {
    throw new Error(`Invalid concurrency option: "${concurrency}"`);
  }
  return concurrency;
}
