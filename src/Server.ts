import fs from 'fs';
import path from 'path';
import type { Options } from './Options';

/**
 * Get the url to Storybook, based on whether we're looking at a static build or a running
 * storybook.
 */
export function getStorybookUrl(options: Options): string {
  if (options.storybookAddress) {
    return options.storybookAddress;
  }

  const storybookStaticPath = path.resolve(options.buildDir);
  const iframeFilePath = path.join(storybookStaticPath, 'iframe.html');

  if (!fs.existsSync(iframeFilePath)) {
    throw new Error(`Static Storybook not found at ${storybookStaticPath}. Have you called build-storybook first?`);
  }

  return 'file://' + storybookStaticPath;
}
