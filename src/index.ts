import { parseOptions } from './Options';
import { getServer } from './Server';
import { runSuite } from './Suite';

/**
 * Run the accessibility tests and return a promise that is resolved or rejected based on whether
 * any violations were detected.
 */
export async function run(): Promise<void> {
  const options = parseOptions();
  const server = await getServer(options);

  await server.start();
  const numFailed = await runSuite(server.storybookUrl, options);
  await server.stop();

  return new Promise((resolve, reject) => {
    return numFailed > 0 ? reject() : resolve();
  });
}
