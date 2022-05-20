import fs from 'fs';
import path from 'path';
import type { Options } from './Options';

/**
 * Start up a server for the storybook build. If using a running Storybook, then just use that.
 *
 * Needed to work around https://github.com/chanzuckerberg/axe-storybook-testing/issues/51 and
 * https://github.com/storybookjs/storybook/issues/16967, so Storybook can load all the stories
 * when storyStoreV7 is used.
 *
 * In particular there's a stories.json file that Storybook fetches, and it can't do that if we're
 * accessing it via file:// url.
 */
export async function getServer(options: Options): Promise<[storybookUrl: string, start: () => Promise<void>, shutdown: () => void]> {
  // If we have a storybook address, then storybook is already running and we just need to use that
  // address. No need to start or stop a server, either.
  if (options.storybookAddress) {
    return [
      options.storybookAddress,
      () => Promise.resolve(),
      () => {},
    ];
  }

  return [
    getStaticStorybookUrl(options),
    () => Promise.resolve(),
    () => {},
  ];
}

/**
 * Get the url we'll use to access a static storybook build.
 */
function getStaticStorybookUrl(options: Options): string {
  const storybookStaticPath = path.resolve(options.buildDir);
  const iframeFilePath = path.join(storybookStaticPath, 'iframe.html');

  if (!fs.existsSync(iframeFilePath)) {
    throw new Error(`Static Storybook not found at ${storybookStaticPath}. Have you called build-storybook first?`);
  }

  return 'file://' + storybookStaticPath;
}
