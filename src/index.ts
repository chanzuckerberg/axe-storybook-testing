import { parseOptions } from './Options';
import { getServer } from './Server';
import { format } from './formats/Spec';
import { run as runSuite } from './suite/Suite';

/**
 * Run the accessibility tests and return a promise that is resolved or rejected based on whether
 * any violations were detected.
 */
export async function run(): Promise<void> {
  const options = parseOptions();
  const server = await getServer(options);
  await server.start();

  return new Promise((resolve, reject) => {
    const emitter = runSuite(server.storybookUrl, options);

    emitter.on('suiteFinish', (_browser, _numPass, numFail) => {
      server.stop().then(() => {
        return numFail > 0 ? reject() : resolve();
      });
    });

    format(emitter);
  });
}
