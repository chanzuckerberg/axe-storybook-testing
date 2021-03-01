import fs from 'fs';
import path from 'path';
import { URL } from 'url';
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
  'storybook-address': {
    alias: 's',
    description: 'Storybook server address to test against instead of using a static build directory. If set, build-dir will be ignored.',
    type: 'string' as const,
  },
  format: {
    alias: 'f',
    default: 'spec',
    description: 'The format to display the test run in',
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
  const argv = yargs.options(options).argv;

  return {
    browser: getBrowser(argv.browser),
    format: getFormat(argv.format),
    failingImpacts: getFailingImpacts(argv['failing-impact']),
    headless: argv.headless,
    iframePath: getIframePath(argv['build-dir'], argv['storybook-address']),
    pattern: new RegExp(argv.pattern),
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

function getIframePath(buildDir: string, storybookServer?: string) {
  if (storybookServer !== undefined) {
    return getIframePathFromStorybookServer(storybookServer);
  }
  else {
    return getIframePathFromBuildDir(buildDir);
  }
}

function getIframePathFromBuildDir(buildDir: string) {
  const storybookStaticPath = path.resolve(buildDir);
  let iframeFilePath = path.join(storybookStaticPath, 'iframe.html');

  if (!fs.existsSync(iframeFilePath)) {
    throw new Error(`Static Storybook not found at ${storybookStaticPath}. Have you called build-storybook first?`);
  }

  iframeFilePath = path.join('file://', iframeFilePath);

  return iframeFilePath;
}

function getIframePathFromStorybookServer(storybookServer: string) {
  const iframePath = new URL(storybookServer + '/iframe.html');
  return iframePath.href;
}

function getFormat(format: string) {
  switch (format) {
    case 'spec':
      return format;
    default:
      throw new Error(`Invalid format option: "${format}"`);
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