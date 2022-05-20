import { parseOptions } from './Options';
import { getServer } from './Server';
import findFormat from './formats/findFormat';
import { run as runSuite } from './suite/Suite';

/**
 * Run the accessibility tests and return a promise that is resolved or rejected based on whether
 * any violations were detected.
 */
export async function run(): Promise<void> {
  const options = parseOptions();
  const format = findFormat(options);
  const [storybookUrl, startServer, shutdownServer] = await getServer(options);

  await startServer();

  return new Promise((resolve, reject) => {
    const emitter = runSuite(storybookUrl, options);

    emitter.on('suiteFinish', (_browser, _numPass, numFail) => {
      shutdownServer();
      return numFail > 0 ? reject() : resolve();
    });

    format(emitter);
  });
}
