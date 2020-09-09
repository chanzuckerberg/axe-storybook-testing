#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('../build/index')
  .run(process.argv.slice(2))
  .then(() => {
    process.on('exit', () => process.exit(0));
  })
  .catch(err => {
    console.log('Error: ', err); // eslint-disable-line no-console
    process.on('exit', () => process.exit(1));
  });
