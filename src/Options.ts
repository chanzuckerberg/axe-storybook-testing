import fs from 'fs';
import path from 'path';
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
  headless: {
    alias: 'h',
    default: true,
    description: 'Wether the browser should be ran "headfully" (non-headlessly)',
    type: 'boolean' as const,
  },
  timeout: {
    alias: 't',
    default: 2000,
    description: 'Timeout for each test (in milliseconds)',
    type: 'number' as const,
  },
};

export type Options = ReturnType<typeof parse>;

/**
 * Parse and normalize command line arguments passed to the script.
 */
export function parse() {
  const argv = yargs.options(options).argv;

  return {
    browser: getBrowser(argv.browser),
    iframePath: getIframePath(argv['build-dir']),
    headless: argv.headless,
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

function getIframePath(buildDir: string) {
  const storybookStaticPath = path.resolve(buildDir);
  const iframePath = path.join(storybookStaticPath, 'iframe.html');

  if (!fs.existsSync(iframePath)) {
    throw new Error(`Static Storybook not found at ${storybookStaticPath}. Have you called build-storybook first?`);
  }

  return iframePath;
}
