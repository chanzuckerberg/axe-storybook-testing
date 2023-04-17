import yargs from 'yargs';

type Browsers = 'chromium' | 'webkit' | 'firefox';
type FailingImpacts = 'minor' | 'moderate' | 'serious' | 'critical' | 'all';
type Reporters =
  | 'spec'
  | 'dot'
  | 'nyan'
  | 'tap'
  | 'landing'
  | 'list'
  | 'progress'
  | 'json'
  | 'json-stream'
  | 'min'
  | 'doc'
  | 'markdown'
  | 'xunit';

const options = {
  browser: {
    alias: 'B',
    default: 'chromium' as Browsers,
    description: 'Which browser to run in',
    choices: ['chromium', 'webkit', 'firefox'] as const,
  },
  'build-dir': {
    alias: 'b',
    default: 'storybook-static',
    description:
      'Directory to load the static storybook built by build-storybook from',
    type: 'string' as const,
  },
  'failing-impact': {
    alias: 'i',
    default: 'all' as FailingImpacts,
    description: 'Lowest impact level to consider a failure',
    choices: ['minor', 'moderate', 'serious', 'critical', 'all'] as const,
  },
  headless: {
    alias: 'h',
    default: true,
    description:
      'Whether the browser should be ran "headfully" (non-headlessly)',
    type: 'boolean' as const,
  },
  pattern: {
    alias: 'p',
    default: '.*',
    description: 'Filter by a component name regex pattern',
    type: 'string' as const,
  },
  reporter: {
    alias: 'r',
    default: 'spec' as Reporters,
    description:
      'How to display test results. Can be any built-in Mocha reporter - https://mochajs.org/#reporters',
    choices: [
      'spec',
      'dot',
      'nyan',
      'tap',
      'landing',
      'list',
      'progress',
      'json',
      'json-stream',
      'min',
      'doc',
      'markdown',
      'xunit',
    ],
  },
  'reporter-options': {
    alias: 'R',
    description:
      'Options to pass to the Mocha reporter (especially the xunit reporter) - https://mochajs.org/#reporters',
    type: 'string' as const,
  },
  'storybook-address': {
    alias: 's',
    description:
      '** Deprecated! Use --storybook-url instead ** Storybook server address to test against instead of using a static build directory. If set, build-dir will be ignored.',
    type: 'string' as const,
  },
  'storybook-url': {
    alias: 'u',
    description:
      'Url to a running Storybook to test against. Alternative to --build-dir, which will be ignored if this is set.',
    type: 'string' as const,
  },
  timeout: {
    alias: 't',
    default: 2000,
    description:
      '** Deprecated! Use the "timeout" story parameter instead ** Timeout for each test (in milliseconds)',
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
    browser: argv.browser,
    buildDir: argv.buildDir,
    headless: argv.headless,
    failingImpacts: getFailingImpacts(argv['failing-impact']),
    pattern: new RegExp(argv.pattern),
    reporter: argv.reporter,
    reporterOptions: getReporterOptions(argv['reporter-options']),
    storybookUrl: argv.storybookAddress || argv.storybookUrl,
    timeout: argv.timeout,
  };
}

function getFailingImpacts(failingImpact: FailingImpacts): string[] {
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
  }
}

function getReporterOptions(reporterOptionsParams?: string) {
  return Object.fromEntries(new URLSearchParams(reporterOptionsParams));
}
