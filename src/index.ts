import { parseOptions } from './Options';
import findFormat from './formats/findFormat';
import { run as runSuite } from './suite/Suite';

/**
 * Run the accessibility tests and return a promise that is resolved or rejected based on whether
 * any violations were detected.
 */
export function run(): Promise<void> {
  return new Promise((resolve, reject) => {
    const options = parseOptions();
    const format = findFormat(options);
    const emitter = runSuite(options);

    emitter.on('suiteFinish', (_browser, _numPass, numFail) => {
      return numFail > 0 ? reject() : resolve();
    });

    format(emitter);
  });
}
