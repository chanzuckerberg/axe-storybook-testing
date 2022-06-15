import yargs from 'yargs';

const options = {
  browser: {
    alias: 'B',
    default: 'chromium',
    description: 'Which browser to run in. Should be one of: chromium, webkit, firefox',
    type: 'string' as const,
  },
  'build-dir': {
    alias: 'b',
    default: 'storybook-static',
    description: 'Directory to load the static storybook built by build-storybook from',
    type: 'string' as const,
  },
  'failing-impact': {
    alias: 'i',
    default: 'all',
    description: 'Lowest impact level to consider a failure. Should be one of minor, moderate, serious, critical, or all',
    type: 'string' as const,
  },
  headless: {
    alias: 'h',
    default: true,
    description: 'Whether the browser should be ran "headfully" (non-headlessly)',
    type: 'boolean' as const,
  },
  pattern: {
    alias: 'p',
    default: '.*',
    description: 'Filter by a component name regex pattern',
    type: 'string' as const,
  },
  'storybook-address': {
    alias: 's',
    description: 'Storybook server address to test against instead of using a static build directory. If set, build-dir will be ignored.',
    type: 'string' as const,
  },
  timeout: {
    alias: 't',
    default: 2000,
    description: 'Timeout for each test (in milliseconds)',
    type: 'number' as const,
  },
};

export type Options = ReturnType<typeof parseOptions>;

/**
 * Parse and normalize command line arguments passed to the script.
 */
export function parseOptions() {
  const argv = yargs.options(options).parseSync();

  return {
    browser: getBrowser(argv.browser),
    buildDir: argv.buildDir,
    headless: argv.headless,
    failingImpacts: getFailingImpacts(argv['failing-impact']),
    pattern: new RegExp(argv.pattern),
    storybookAddress: argv.storybookAddress,
    timeout: argv.timeout,
  };
}

function getBrowser(browser: string) {
  switch (browser) {
    case 'chromium':
    case 'firefox':
    case 'webkit':
      return browser;
    default:
      throw new Error(`Invalid browser option: "${browser}"`);
  }
}

function getFailingImpacts(failingImpact: string): string[] {
  switch (failingImpact) {
    case 'critical':
      return ['critical'];
    case 'serious':
      return ['critical', 'serious'];
    case 'moderate':
      return ['critical', 'serious', 'moderate'];
    case 'minor':
      return ['critical', 'serious', 'moderate', 'minor'];
    case 'all':
      return ['critical', 'serious', 'moderate', 'minor', 'all'];
    default:
      throw new Error(`Invalid failing impact option: "${failingImpact}"`);
  }
}
