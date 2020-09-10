import yargs from 'yargs';
import getIframePath from './getIframePath';
import getOutputFormat from './getOutputFormat';

const options = {
  fail_on_empty: {
    description: 'Fail when no stories are found',
    type: 'boolean' as const,
  },
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
  output_format: {
    default: 'text',
    description: 'Specify JSON to log the build parameters in JSON. Note: --debug outputs non-JSON',
    type: 'string' as const,
  },
};

export function parse(debug: boolean) {
  const argv = yargs.options(options).argv;

  return {
    debug: argv.debug || debug,
    buildDir: argv.build_dir,
    outputFormat: getOutputFormat(argv.output_format),
    failOnEmpty: !!argv.fail_on_empty,
    iframePath: getIframePath(argv.build_dir),
  };
}
