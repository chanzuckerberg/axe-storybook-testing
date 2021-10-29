#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('../build/index')
  .run()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    if (error) {
      console.log(error);
    }
    process.exit(1);
  });
