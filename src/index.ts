import Mocha from 'mocha';
import options from './Options';

/**
 * Run the accessibility tests and return a promise that is resolved or rejected based on whether
 * any violations were detected.
 */
export function run(): Promise<void> {
  const mocha = new Mocha({
    delay: true,
    reporter: 'spec',
    timeout: options.timeout,
  });

  mocha.addFile(require.resolve('./Suite'));

  return new Promise((resolve, reject) => {
    mocha.run((failures) => {
      return failures === 0 ? resolve() : reject();
    });
  });
}
