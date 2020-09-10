import yargs from 'yargs';
import getIframePath from './getIframePath';

const options = {
  debug: {
    alias: 'd',
    description: 'Debug mode',
    type: 'boolean' as const,
  },
  build_dir: {
    alias: 'b',
    default: 'storybook-static',
    description: 'Directory to load the static storybook built by build-storybook from',
    type: 'string' as const,
  },
};

/**
 * Parse and normalize command line arguments passed to the script.
 */
export function parse(debug: boolean) {
  const argv = yargs.options(options).argv;

  return {
    debug: argv.debug || debug,
    buildDir: argv.build_dir,
    iframePath: getIframePath(argv.build_dir),
  };
}
