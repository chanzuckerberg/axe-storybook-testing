import fs from 'fs';
import path from 'path';
import httpServer from 'http-server';
import portfinder from 'portfinder';
import type {Options} from './Options';

type Server = {
  storybookUrl: string;
  start: () => Promise<void>;
  stop: () => Promise<void>;
};

/**
 * Create a server to serve up the storybook build. If using a running Storybook, then just use
 * that.
 *
 * Needed to work around https://github.com/chanzuckerberg/axe-storybook-testing/issues/51 and
 * https://github.com/storybookjs/storybook/issues/16967, so Storybook can load all the stories
 * when storyStoreV7 is used.
 *
 * In particular there's a stories.json file that Storybook fetches, and it can't do that if we're
 * accessing it via file:// url.
 */
export async function runWithServer<T>(
  options: Options,
  callback: (storybookUrl: string) => Promise<T>,
): Promise<T> {
  const server = await getServer(options);
  await server.start();
  const returnValue = await callback(server.storybookUrl);
  await server.stop();
  return returnValue;
}

async function getServer(options: Options): Promise<Server> {
  // If we have a storybook address, then storybook is already running and we just need to use that
  // address. No need to start or stop a server, either.
  if (options.storybookUrl) {
    return {
      storybookUrl: options.storybookUrl,
      start: () => Promise.resolve(),
      stop: () => Promise.resolve(),
    };
  }

  // Try to prevent port conflicts when multiple test runs start at the exact same time (such as in
  // a monorepo).
  await waitRandomTime(500);

  const localPath = getStaticStorybookPath(options);
  const port = await portfinder.getPortPromise();
  const host = '127.0.0.1';
  const server = httpServer.createServer({root: localPath});
  const storybookUrl = `http://${host}:${port}`;

  function start(): Promise<void> {
    return new Promise((resolve) => {
      server.listen(port, host, () => {
        console.log('Serving up 🍕 static storybook build at:', storybookUrl);
        resolve();
      });
    });
  }

  function stop() {
    server.close();
    return Promise.resolve();
  }

  return {storybookUrl, start, stop};
}

function getStaticStorybookPath(options: Options): string {
  const storybookStaticPath = path.resolve(options.buildDir);
  const iframeFilePath = path.join(storybookStaticPath, 'iframe.html');

  if (!fs.existsSync(iframeFilePath)) {
    throw new Error(
      `Static Storybook not found at ${storybookStaticPath}. Have you called build-storybook first?`,
    );
  }

  return storybookStaticPath;
}

function waitRandomTime(maxWaitTime: number) {
  const waitTime = Math.floor(Math.random() * maxWaitTime);
  return new Promise((resolve) => setTimeout(resolve, waitTime));
}
