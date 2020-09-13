import yargs from 'yargs';
import getBrowserOption from './getBrowserOption';
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
    iframePath: getIframePath(argv.build_dir),
    nonHeadless: argv.non_headless,
  };
}
