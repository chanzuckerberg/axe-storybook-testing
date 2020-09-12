import yargs from 'yargs';
import getIframePath from './getIframePath';

const options = {
  build_dir: {
    alias: 'b',
    default: 'storybook-static',
    description: 'Directory to load the static storybook built by build-storybook from',
    type: 'string' as const,
  },
  debug: {
    alias: 'd',
    description: 'Debug mode',
    type: 'boolean' as const,
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
export function parse(debug: boolean) {
  const argv = yargs.options(options).argv;

  return {
    debug: argv.debug || debug,
    iframePath: getIframePath(argv.build_dir),
    nonHeadless: argv.non_headless,
  };
}
