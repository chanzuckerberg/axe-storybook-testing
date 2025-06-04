import {parseOptions} from './Options.js';
import {runWithServer} from './Server.js';
import {runSuite} from './Suite.js';

/**
 * Run the accessibility tests and return a promise that is resolved or rejected based on whether
 * any violations were detected.
 */
export async function run(): Promise<void> {
  const options = parseOptions();

  const numFailed = await runWithServer(options, (storybookUrl) => {
    return runSuite(storybookUrl, options);
  });

  return new Promise((resolve, reject) => {
    return numFailed > 0 ? reject() : resolve();
  });
}
