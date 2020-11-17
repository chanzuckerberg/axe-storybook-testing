import { parseOptions } from './Options';
import * as Suite from './Suite';
import findFormat from './formats/findFormat';

/**
 * Run the accessibility tests and return a promise that is resolved or rejected based on whether
 * any violations were detected.
 */
export function run(): Promise<void> {
  return new Promise((resolve, reject) => {
    const options = parseOptions();
    const format = findFormat(options);
    const emitter = Suite.run(options);

    emitter.on('suiteFinish', (_browser, _numPass, numFail) => {
      return numFail > 0 ? reject() : resolve();
    });

    format(emitter);
  });
}
