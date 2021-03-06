#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('../build/index')
  .run()
  .then(() => {
    process.on('exit', () => process.exit(0));
  })
  .catch((error) => {
    if (error) {
      console.log(error);
    }
    process.on('exit', () => process.exit(1));
  });
