import fs from 'fs';
import path from 'path';

/**
 * Get the path of the iframe.html file that buld-storybook creates, and confirm it exists
 */
export default function getIframePath(buildDir: string) {
  const storybookStaticPath = path.resolve(buildDir);
  const iframePath = path.join(storybookStaticPath, 'iframe.html');

  if (!fs.existsSync(iframePath)) {
    throw new Error(`Static Storybook not found at ${storybookStaticPath}. Have you called build-storybook first?`);
  }

  return iframePath;
}
