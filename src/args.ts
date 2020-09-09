export const options = {
  fail_on_empty: {
    description: 'Fail when no stories are found',
    type: 'boolean' as const,
  },
  widths: {
    alias: 'w',
    description: 'Comma seperated lists of widths',
    type: 'string' as const,
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

export const usage = 'Usage: $0 --widths=320,1280 --debug';
