import Mocha from 'mocha';

export function run() {
  const mocha = new Mocha({
    delay: true,
    reporter: 'spec',
  });

  mocha.addFile(require.resolve('./Suite'));

  return new Promise((resolve, reject) => {
    mocha.run((failures) => {
      return failures === 0 ? resolve() : reject();
    });
  });
}
